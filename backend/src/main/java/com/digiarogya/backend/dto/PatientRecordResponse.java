package com.digiarogya.backend.dto;

import com.digiarogya.backend.entity.PatientRecord;

public class PatientRecordResponse {

    private Long id;
    private Long patientId;

    public PatientRecordResponse(Long id, Long patientId) {
        this.id = id;
        this.patientId = patientId;
    }

    public Long getId() {
        return id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public static PatientRecordResponse from(PatientRecord record) {
        return new PatientRecordResponse(
                record.getId(),
                record.getPatientId()
        );
    }
}
