package com.digiarogya.backend.service;

import com.digiarogya.backend.dto.PatientRecordResponse;
import com.digiarogya.backend.entity.PatientRecord;
import com.digiarogya.backend.exception.AccessDeniedException;
import com.digiarogya.backend.exception.AccessRequiredException;
import com.digiarogya.backend.repository.AccessRepository;
import com.digiarogya.backend.repository.PatientRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecordService {

    private final PatientRecordRepository recordRepository;
    private final AccessRepository accessRepository;

    public RecordService(
            PatientRecordRepository recordRepository,
            AccessRepository accessRepository
    ) {
        this.recordRepository = recordRepository;
        this.accessRepository = accessRepository;
    }

    // PATIENT → own records
    public List<PatientRecordResponse> getRecordsForPatient(Long patientId, String role) {

        if (!"PATIENT".equals(role)) {
            throw new AccessDeniedException("Only patients can access this endpoint");
        }

        return recordRepository.findByPatientId(patientId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // DOCTOR → patient records (ACCESS-GATED)
    public List<PatientRecordResponse> getRecordsForDoctor(
            Long doctorId,
            Long patientId,
            String role
    ) {

        if (!"DOCTOR".equals(role)) {
            throw new AccessDeniedException("Only doctors can access patient records");
        }

        if (!accessRepository.hasActiveAccess(patientId, doctorId)) {
            throw new AccessRequiredException("Active access required from patient");
        }

        return recordRepository.findByPatientId(patientId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PatientRecordResponse toResponse(PatientRecord record) {
        return new PatientRecordResponse(
                record.getId(),
                record.getDiagnosis()
        );
    }
}
