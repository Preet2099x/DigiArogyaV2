package com.digiarogya.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "patient_records")
public class PatientRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;

    private Long createdByDoctorId;

    @Enumerated(EnumType.STRING)
    private RecordType type;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public Long getPatientId() { return patientId; }
    public Long getCreatedByDoctorId() { return createdByDoctorId; }
    public RecordType getType() { return type; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public Instant getCreatedAt() { return createdAt; }

    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public void setCreatedByDoctorId(Long createdByDoctorId) { this.createdByDoctorId = createdByDoctorId; }
    public void setType(RecordType type) { this.type = type; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
}
