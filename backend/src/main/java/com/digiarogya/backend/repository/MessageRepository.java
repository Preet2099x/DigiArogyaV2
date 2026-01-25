package com.digiarogya.backend.repository;

import com.digiarogya.backend.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // Get conversation between two users (ordered by sentAt)
    @Query("SELECT m FROM Message m WHERE (m.senderId = :userId1 AND m.receiverId = :userId2) OR (m.senderId = :userId2 AND m.receiverId = :userId1) ORDER BY m.sentAt ASC")
    List<Message> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    // Get conversation between two users with pagination (newest first for loading)
    @Query("SELECT m FROM Message m WHERE (m.senderId = :userId1 AND m.receiverId = :userId2) OR (m.senderId = :userId2 AND m.receiverId = :userId1) ORDER BY m.sentAt DESC")
    Page<Message> findConversationPaged(@Param("userId1") Long userId1, @Param("userId2") Long userId2, Pageable pageable);

    // Get all conversations for a user (latest message from each conversation)
    @Query("SELECT m FROM Message m WHERE m.id IN (SELECT MAX(m2.id) FROM Message m2 WHERE m2.senderId = :userId OR m2.receiverId = :userId GROUP BY CASE WHEN m2.senderId = :userId THEN m2.receiverId ELSE m2.senderId END) ORDER BY m.sentAt DESC")
    List<Message> findLatestMessagesForUser(@Param("userId") Long userId);

    // Count unread messages for a user
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiverId = :userId AND m.isRead = false")
    long countUnreadMessages(@Param("userId") Long userId);

    // Count unread messages in a conversation
    @Query("SELECT COUNT(m) FROM Message m WHERE m.senderId = :senderId AND m.receiverId = :receiverId AND m.isRead = false")
    long countUnreadInConversation(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    // Mark messages as read
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.senderId = :senderId AND m.receiverId = :receiverId AND m.isRead = false")
    int markMessagesAsRead(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);
}
