package com.digiarogya.backend.controller;

import com.digiarogya.backend.dto.ConversationResponse;
import com.digiarogya.backend.dto.MessageResponse;
import com.digiarogya.backend.dto.SendMessageRequest;
import com.digiarogya.backend.service.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * Send a message to another user
     */
    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            HttpServletRequest request,
            @RequestBody SendMessageRequest messageRequest) {
        Long senderId = Long.valueOf((String) request.getAttribute("userId"));
        MessageResponse response = messageService.sendMessage(
                senderId,
                messageRequest.getReceiverId(),
                messageRequest.getContent()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Get all conversations for the current user
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations(HttpServletRequest request) {
        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        List<ConversationResponse> conversations = messageService.getConversations(userId);
        return ResponseEntity.ok(conversations);
    }

    /**
     * Get messages in a conversation with another user
     */
    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<List<MessageResponse>> getConversation(
            HttpServletRequest request,
            @PathVariable Long otherUserId) {
        Long currentUserId = Long.valueOf((String) request.getAttribute("userId"));
        List<MessageResponse> messages = messageService.getConversation(currentUserId, otherUserId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Get list of users the current user can message (those with active access)
     */
    @GetMapping("/contacts")
    public ResponseEntity<List<ConversationResponse>> getMessageableUsers(HttpServletRequest request) {
        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        List<ConversationResponse> users = messageService.getMessageableUsers(userId);
        return ResponseEntity.ok(users);
    }

    /**
     * Get unread message count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(HttpServletRequest request) {
        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        long count = messageService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }
}
