package com.digiarogya.backend.service;

import com.digiarogya.backend.dto.PatientRecordResponse;
import com.digiarogya.backend.entity.PatientRecord;
import com.digiarogya.backend.exception.AccessDeniedException;
import com.digiarogya.backend.repository.PatientRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecordService {

    private final PatientRecordRepository recordRepository;

    public RecordService(PatientRecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    public List<PatientRecordResponse> getRecordsForPatient(Long patientId, String role) {

        if (!"PATIENT".equals(role)) {
            throw new AccessDeniedException("Only patients can access their records");
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
