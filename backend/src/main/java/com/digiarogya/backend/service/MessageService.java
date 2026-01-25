package com.digiarogya.backend.service;

import com.digiarogya.backend.dto.ConversationResponse;
import com.digiarogya.backend.dto.MessageResponse;
import com.digiarogya.backend.entity.Message;
import com.digiarogya.backend.entity.Role;
import com.digiarogya.backend.entity.User;
import com.digiarogya.backend.exception.AccessDeniedException;
import com.digiarogya.backend.exception.ValidationException;
import com.digiarogya.backend.repository.AccessRepository;
import com.digiarogya.backend.repository.MessageRepository;
import com.digiarogya.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final AccessRepository accessRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository, AccessRepository accessRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.accessRepository = accessRepository;
    }

    /**
     * Check if two users can message each other (patient-doctor with active access)
     */
    private boolean canMessage(Long userId1, Long userId2) {
        User user1 = userRepository.findById(userId1).orElse(null);
        User user2 = userRepository.findById(userId2).orElse(null);

        if (user1 == null || user2 == null) {
            return false;
        }

        // One must be patient, one must be doctor
        Long patientId = null;
        Long doctorId = null;

        if (user1.getRole() == Role.PATIENT && user2.getRole() == Role.DOCTOR) {
            patientId = userId1;
            doctorId = userId2;
        } else if (user1.getRole() == Role.DOCTOR && user2.getRole() == Role.PATIENT) {
            patientId = userId2;
            doctorId = userId1;
        } else {
            return false; // Can only message between patient and doctor
        }

        // Check if there's active access
        return accessRepository.existsByPatientIdAndDoctorIdAndExpiresAtAfter(patientId, doctorId, Instant.now());
    }

    /**
     * Send a message
     */
    @Transactional
    public MessageResponse sendMessage(Long senderId, Long receiverId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new ValidationException("Message content cannot be empty");
        }

        if (!canMessage(senderId, receiverId)) {
            throw new AccessDeniedException("You can only message users with active access permission");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ValidationException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ValidationException("Receiver not found"));

        Message message = new Message(senderId, receiverId, content.trim());
        message = messageRepository.save(message);

        return toMessageResponse(message, sender, receiver);
    }

    /**
     * Get conversation between current user and another user
     */
    @Transactional
    public List<MessageResponse> getConversation(Long currentUserId, Long otherUserId) {
        if (!canMessage(currentUserId, otherUserId)) {
            throw new AccessDeniedException("You don't have access to message this user");
        }

        // Mark messages from other user as read
        messageRepository.markMessagesAsRead(otherUserId, currentUserId);

        List<Message> messages = messageRepository.findConversation(currentUserId, otherUserId);

        // Pre-fetch users for efficiency
        User currentUser = userRepository.findById(currentUserId).orElse(null);
        User otherUser = userRepository.findById(otherUserId).orElse(null);

        return messages.stream()
                .map(msg -> {
                    User sender = msg.getSenderId().equals(currentUserId) ? currentUser : otherUser;
                    User receiver = msg.getReceiverId().equals(currentUserId) ? currentUser : otherUser;
                    return toMessageResponse(msg, sender, receiver);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get all conversations for a user
     */
    public List<ConversationResponse> getConversations(Long userId) {
        List<Message> latestMessages = messageRepository.findLatestMessagesForUser(userId);
        List<ConversationResponse> conversations = new ArrayList<>();

        for (Message msg : latestMessages) {
            Long otherUserId = msg.getSenderId().equals(userId) ? msg.getReceiverId() : msg.getSenderId();
            
            // Check if there's still active access
            if (!canMessage(userId, otherUserId)) {
                continue; // Skip conversations without active access
            }

            User otherUser = userRepository.findById(otherUserId).orElse(null);
            if (otherUser == null) continue;

            long unreadCount = messageRepository.countUnreadInConversation(otherUserId, userId);

            String lastMessagePreview = msg.getContent();
            if (lastMessagePreview.length() > 50) {
                lastMessagePreview = lastMessagePreview.substring(0, 50) + "...";
            }

            ConversationResponse conv = new ConversationResponse(
                    otherUserId,
                    otherUser.getName(),
                    otherUser.getRole().name(),
                    lastMessagePreview,
                    msg.getSentAt(),
                    unreadCount
            );
            conversations.add(conv);
        }

        return conversations;
    }

    /**
     * Get total unread message count for a user
     */
    public long getUnreadCount(Long userId) {
        return messageRepository.countUnreadMessages(userId);
    }

    /**
     * Get users the current user can message (those with active access)
     */
    public List<ConversationResponse> getMessageableUsers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ValidationException("User not found"));

        List<ConversationResponse> result = new ArrayList<>();

        if (user.getRole() == Role.PATIENT) {
            // Get all doctors with active access to this patient
            var accesses = accessRepository.findByPatientIdAndExpiresAtAfter(userId, Instant.now());
            for (var access : accesses) {
                User doctor = userRepository.findById(access.getDoctorId()).orElse(null);
                if (doctor != null) {
                    long unreadCount = messageRepository.countUnreadInConversation(doctor.getId(), userId);
                    result.add(new ConversationResponse(
                            doctor.getId(),
                            doctor.getName(),
                            doctor.getRole().name(),
                            null,
                            null,
                            unreadCount
                    ));
                }
            }
        } else if (user.getRole() == Role.DOCTOR) {
            // Get all patients who have granted access to this doctor
            var accesses = accessRepository.findByDoctorIdOrderByExpiresAtDesc(userId, null);
            for (var access : accesses.getContent()) {
                if (access.isExpired()) continue;
                
                User patient = userRepository.findById(access.getPatientId()).orElse(null);
                if (patient != null) {
                    long unreadCount = messageRepository.countUnreadInConversation(patient.getId(), userId);
                    result.add(new ConversationResponse(
                            patient.getId(),
                            patient.getName(),
                            patient.getRole().name(),
                            null,
                            null,
                            unreadCount
                    ));
                }
            }
        }

        return result;
    }

    private MessageResponse toMessageResponse(Message message, User sender, User receiver) {
        return new MessageResponse(
                message.getId(),
                message.getSenderId(),
                sender != null ? sender.getName() : "Unknown",
                message.getReceiverId(),
                receiver != null ? receiver.getName() : "Unknown",
                message.getContent(),
                message.getSentAt(),
                message.isRead()
        );
    }
}
