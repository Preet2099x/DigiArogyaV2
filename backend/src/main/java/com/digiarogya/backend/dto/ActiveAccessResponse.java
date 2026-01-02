package com.digiarogya.backend.dto;

import java.time.Instant;

public class ActiveAccessResponse {
    private Long id;
    private String granteeName;
    private String granteeEmail;
    private Instant expiresAt;

    public ActiveAccessResponse(Long id, String granteeName, String granteeEmail, Instant expiresAt) {
        this.id = id;
        this.granteeName = granteeName;
        this.granteeEmail = granteeEmail;
        this.expiresAt = expiresAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGranteeName() {
        return granteeName;
    }

    public void setGranteeName(String granteeName) {
        this.granteeName = granteeName;
    }

    public String getGranteeEmail() {
        return granteeEmail;
    }

    public void setGranteeEmail(String granteeEmail) {
        this.granteeEmail = granteeEmail;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}
