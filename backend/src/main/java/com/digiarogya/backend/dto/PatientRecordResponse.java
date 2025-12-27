package com.digiarogya.backend.dto;

import com.digiarogya.backend.entity.PatientRecord;
import com.digiarogya.backend.entity.RecordType;

import java.time.Instant;

public class PatientRecordResponse {

    private Long id;
    private RecordType type;
    private String title;
    private String content;
    private String diagnosis;
    private Instant createdAt;
    private Long createdByDoctorId;

    public static PatientRecordResponse from(PatientRecord record) {
        PatientRecordResponse dto = new PatientRecordResponse();
        dto.id = record.getId();
        dto.type = record.getType();
        dto.title = record.getTitle();
        dto.content = record.getContent();
        dto.diagnosis = record.getDiagnosis();
        dto.createdAt = record.getCreatedAt();
        dto.createdByDoctorId = record.getCreatedByDoctorId();
        return dto;
    }

    public Long getId() { return id; }
    public RecordType getType() { return type; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getDiagnosis() {
        return diagnosis;
    }
    public Instant getCreatedAt() { return createdAt; }
    public Long getCreatedByDoctorId() { return createdByDoctorId; }
}
