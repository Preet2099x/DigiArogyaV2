package com.digiarogya.backend.repository;

import com.digiarogya.backend.entity.PatientRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRecordRepository
        extends JpaRepository<PatientRecord, Long> {

    // fetch all records belonging to a patient
    List<PatientRecord> findByPatientId(Long patientId);

    // fetch paginated records belonging to a patient (sorting handled via Pageable)
    Page<PatientRecord> findByPatientId(Long patientId, Pageable pageable);
}
