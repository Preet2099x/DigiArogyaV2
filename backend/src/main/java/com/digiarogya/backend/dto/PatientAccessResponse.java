package com.digiarogya.backend.dto;

import java.time.Instant;

public class PatientAccessResponse {

    private Long patientId;
    private String patientName;
    private String patientEmail;
    private Instant expiresAt;

    public PatientAccessResponse(Long patientId, String patientName, String patientEmail, Instant expiresAt) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientEmail = patientEmail;
        this.expiresAt = expiresAt;
    }

    public Long getPatientId() { return patientId; }
    public String getPatientName() { return patientName; }
    public String getPatientEmail() { return patientEmail; }
    public Instant getExpiresAt() { return expiresAt; }
}
