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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_doctor_id")
    private User createdByDoctor;

    @Enumerated(EnumType.STRING)
    private RecordType type;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String diagnosis;

    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public Long getPatientId() { return patientId; }
    public User getCreatedByDoctor() { return createdByDoctor; }
    public Long getCreatedByDoctorId() { return createdByDoctor != null ? createdByDoctor.getId() : null; }
    public String getCreatedByDoctorName() { return createdByDoctor != null ? createdByDoctor.getName() : null; }
    public RecordType getType() { return type; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getDiagnosis() { return diagnosis; }
    public Instant getCreatedAt() { return createdAt; }

    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public void setCreatedByDoctor(User createdByDoctor) { this.createdByDoctor = createdByDoctor; }
    public void setType(RecordType type) { this.type = type; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }
}
