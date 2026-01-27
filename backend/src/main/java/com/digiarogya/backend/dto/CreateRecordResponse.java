package com.digiarogya.backend.dto;

public class CreateRecordResponse {
    private Long recordId;
    private String message;

    public CreateRecordResponse() {}

    public CreateRecordResponse(Long recordId, String message) {
        this.recordId = recordId;
        this.message = message;
    }

    public Long getRecordId() { return recordId; }
    public void setRecordId(Long recordId) { this.recordId = recordId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
