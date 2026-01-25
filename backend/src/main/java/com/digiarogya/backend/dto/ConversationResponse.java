package com.digiarogya.backend.dto;

import java.time.Instant;

public class ConversationResponse {
    private Long otherUserId;
    private String otherUserName;
    private String otherUserRole;
    private String lastMessage;
    private Instant lastMessageAt;
    private long unreadCount;

    public ConversationResponse() {}

    public ConversationResponse(Long otherUserId, String otherUserName, String otherUserRole, String lastMessage, Instant lastMessageAt, long unreadCount) {
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
        this.otherUserRole = otherUserRole;
        this.lastMessage = lastMessage;
        this.lastMessageAt = lastMessageAt;
        this.unreadCount = unreadCount;
    }

    public Long getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUserName() {
        return otherUserName;
    }

    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }

    public String getOtherUserRole() {
        return otherUserRole;
    }

    public void setOtherUserRole(String otherUserRole) {
        this.otherUserRole = otherUserRole;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public Instant getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(Instant lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(long unreadCount) {
        this.unreadCount = unreadCount;
    }
}
