package com.digiarogya.backend.service;

import com.digiarogya.backend.dto.PatientRecordResponse;
import com.digiarogya.backend.entity.Access;
import com.digiarogya.backend.entity.PatientRecord;
import com.digiarogya.backend.entity.User;
import com.digiarogya.backend.exception.AccessDeniedException;
import com.digiarogya.backend.exception.AccessRequiredException;
import com.digiarogya.backend.repository.AccessRepository;
import com.digiarogya.backend.repository.PatientRecordRepository;
import com.digiarogya.backend.repository.UserRepository;
import com.digiarogya.backend.dto.CreateRecordRequest;


import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecordService {

    private final PatientRecordRepository patientRecordRepository;
    private final AccessRepository accessRepository;
    private final UserRepository userRepository;

    public RecordService(
            PatientRecordRepository patientRecordRepository,
            AccessRepository accessRepository,
            UserRepository userRepository
    ) {
        this.patientRecordRepository = patientRecordRepository;
        this.accessRepository = accessRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // PATIENT: VIEW OWN RECORDS
    // =========================
    public List<PatientRecordResponse> getMyRecords(Long patientId, String role) {

        if (!"PATIENT".equals(role)) {
            throw new AccessDeniedException("Only patients can view their records");
        }

        List<PatientRecord> records =
                patientRecordRepository.findByPatientId(patientId);

        return records.stream()
                .map(PatientRecordResponse::from)
                .collect(Collectors.toList());
    }

    // =========================
    // DOCTOR: VIEW PATIENT RECORDS
    // =========================
    public List<PatientRecordResponse> getPatientRecordsForDoctor(
            Long doctorId,
            Long patientId,
            String role
    ) {

        if (!"DOCTOR".equals(role)) {
            throw new AccessDeniedException("Only doctors can access patient records");
        }

        boolean hasAccess =
                accessRepository.existsByPatientIdAndDoctorId(patientId, doctorId);

        if (!hasAccess) {
            throw new AccessRequiredException("Active access required from patient");
        }

        List<PatientRecord> records =
                patientRecordRepository.findByPatientId(patientId);

        return records.stream()
                .map(PatientRecordResponse::from)
                .collect(Collectors.toList());
    }

    // =========================
    // PATIENT: GRANT ACCESS
    // =========================
    public void grantAccess(Long patientId, String role, String doctorEmail) {

        if (!"PATIENT".equals(role)) {
            throw new AccessDeniedException("Only patients can grant access");
        }

        User doctor = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() ->
                        new AccessDeniedException("Doctor not found"));

        if (!"DOCTOR".equals(doctor.getRole().name())) {
            throw new AccessDeniedException("User is not a doctor");
        }

        boolean alreadyExists =
                accessRepository.existsByPatientIdAndDoctorId(patientId, doctor.getId());

        if (alreadyExists) {
            return; // idempotent
        }

        Access access = new Access();
        access.setPatientId(patientId);
        access.setDoctorId(doctor.getId());

        accessRepository.save(access);
    }

    public void addRecord(
            Long doctorId,
            Long patientId,
            String role,
            CreateRecordRequest request
    ) {
        if (!"DOCTOR".equals(role)) {
            throw new AccessDeniedException("Only doctors can add records");
        }

        boolean hasAccess =
                accessRepository.existsByPatientIdAndDoctorId(patientId, doctorId);

        if (!hasAccess) {
            throw new AccessRequiredException("Access required to add record");
        }

        PatientRecord record = new PatientRecord();
        record.setPatientId(patientId);
        record.setCreatedByDoctorId(doctorId);
        record.setType(request.getType());
        record.setTitle(request.getTitle());
        record.setContent(request.getContent());
        record.setDiagnosis(request.getDiagnosis());

        patientRecordRepository.save(record);
    }

}
