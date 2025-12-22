package com.digiarogya.backend.dto;

public class PatientRecordResponse {

    private Long id;
    private String diagnosis;

    public PatientRecordResponse(Long id, String diagnosis) {
        this.id = id;
        this.diagnosis = diagnosis;
    }

    public Long getId() {
        return id;
    }

    public String getDiagnosis() {
        return diagnosis;
    }
}
