package com.digiarogya.backend.dto;

import java.time.Instant;

public class AuditLogResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long actorId;
    private String actorName;
    private String actorRole;
    private String action;
    private Long recordId;
    private String recordTitle;
    private String details;
    private Instant createdAt;

    // Constructors
    public AuditLogResponse() {}

    public AuditLogResponse(Long id, Long patientId, String patientName, Long actorId, 
                           String actorName, String actorRole, String action, 
                           Long recordId, String recordTitle, String details, 
                           Instant createdAt) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.actorId = actorId;
        this.actorName = actorName;
        this.actorRole = actorRole;
        this.action = action;
        this.recordId = recordId;
        this.recordTitle = recordTitle;
        this.details = details;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Long getActorId() {
        return actorId;
    }

    public void setActorId(Long actorId) {
        this.actorId = actorId;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public String getActorRole() {
        return actorRole;
    }

    public void setActorRole(String actorRole) {
        this.actorRole = actorRole;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public String getRecordTitle() {
        return recordTitle;
    }

    public void setRecordTitle(String recordTitle) {
        this.recordTitle = recordTitle;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
