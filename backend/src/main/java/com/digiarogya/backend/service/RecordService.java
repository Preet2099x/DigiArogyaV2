package com.digiarogya.backend.service;

import com.digiarogya.backend.entity.PatientRecord;
import com.digiarogya.backend.repository.PatientRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecordService {

    private final PatientRecordRepository recordRepository;

    public RecordService(PatientRecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    // fetch records owned by a patient
    public List<PatientRecord> getRecordsForPatient(Long patientId) {
        return recordRepository.findByPatientId(patientId);
    }
}
