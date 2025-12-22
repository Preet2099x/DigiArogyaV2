package com.digiarogya.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "patient_records")
public class PatientRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // owner of the record (PATIENT userId)
    @Column(nullable = false)
    private Long patientId;

    // simple medical data for now
    @Column(nullable = false)
    private String diagnosis;

    // who created it (doctor/hospital later)
    @Column(nullable = false)
    private Long createdBy;

    // ---- getters only (no setters yet) ----

    public Long getId() {
        return id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public Long getCreatedBy() {
        return createdBy;
    }
}
