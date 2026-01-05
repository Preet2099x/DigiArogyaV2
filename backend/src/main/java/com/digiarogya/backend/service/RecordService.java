package com.digiarogya.backend.service;

import com.digiarogya.backend.dto.PaginatedPatientResponse;
import com.digiarogya.backend.dto.PaginatedRecordResponse;
import com.digiarogya.backend.dto.PatientAccessResponse;
import com.digiarogya.backend.dto.PatientRecordResponse;
import com.digiarogya.backend.entity.Access;
import com.digiarogya.backend.entity.PatientRecord;
import com.digiarogya.backend.entity.User;
import com.digiarogya.backend.exception.AccessDeniedException;
import com.digiarogya.backend.exception.AccessRequiredException;
import com.digiarogya.backend.repository.AccessRepository;
import com.digiarogya.backend.repository.PatientRecordRepository;
import com.digiarogya.backend.repository.UserRepository;
import com.digiarogya.backend.dto.ActiveAccessResponse;
import com.digiarogya.backend.dto.CreateRecordRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecordService {

    private final PatientRecordRepository patientRecordRepository;
    private final AccessRepository accessRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public RecordService(
            PatientRecordRepository patientRecordRepository,
            AccessRepository accessRepository,
            UserRepository userRepository,
            AuditLogService auditLogService
    ) {
        this.patientRecordRepository = patientRecordRepository;
        this.accessRepository = accessRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    // =========================
    // PATIENT: VIEW OWN RECORDS
    // =========================
    public PaginatedRecordResponse getMyRecords(Long patientId, String role, int page, int size) {

        if (!"PATIENT".equals(role)) {
            throw new AccessDeniedException("Only patients can view their records");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PatientRecord> recordPage = patientRecordRepository.findByPatientId(patientId, pageable);

        List<PatientRecordResponse> records = recordPage.getContent().stream()
                .map(PatientRecordResponse::from)
                .collect(Collectors.toList());

        return new PaginatedRecordResponse(
                records,
                recordPage.getNumber(),
                recordPage.getTotalPages(),
                recordPage.getTotalElements(),
                recordPage.getSize(),
                recordPage.hasNext(),
                recordPage.hasPrevious()
        );
    }

    // =========================
    // DOCTOR: VIEW PATIENT RECORDS
    // =========================
    public PaginatedRecordResponse getPatientRecordsForDoctor(
            Long doctorId,
            Long patientId,
            String role,
            int page,
            int size
    ) {

        if (!"DOCTOR".equals(role)) {
            throw new AccessDeniedException("Only doctors can access patient records");
        }

        boolean hasValidAccess =
                accessRepository.existsByPatientIdAndDoctorIdAndExpiresAtAfter(patientId, doctorId, Instant.now());

        if (!hasValidAccess) {
            throw new AccessRequiredException("Active access required from patient");
        }

        // Log access to patient records
        User doctor = userRepository.findById(doctorId).orElse(null);
        if (doctor != null && page == 0) { // Only log on first page view to avoid duplicate logs
            auditLogService.logAudit(
                patientId,
                doctorId,
                doctor.getName(),
                "DOCTOR",
                "RECORD_VIEWED",
                null,
                null,
                "Doctor viewed patient records"
            );
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PatientRecord> recordPage = patientRecordRepository.findByPatientId(patientId, pageable);

        List<PatientRecordResponse> records = recordPage.getContent().stream()
                .map(PatientRecordResponse::from)
                .collect(Collectors.toList());

        return new PaginatedRecordResponse(
                records,
                recordPage.getNumber(),
                recordPage.getTotalPages(),
                recordPage.getTotalElements(),
                recordPage.getSize(),
                recordPage.hasNext(),
                recordPage.hasPrevious()
        );
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

        Instant expiresAt = Instant.now().plus(30, ChronoUnit.DAYS);

        Optional<Access> existingAccess =
                accessRepository.findByPatientIdAndDoctorId(patientId, doctor.getId());

        if (existingAccess.isPresent()) {
            // Refresh expiry if access already exists
            Access access = existingAccess.get();
            access.setExpiresAt(expiresAt);
            accessRepository.save(access);
            return;
        }

        Access access = new Access();
        access.setPatientId(patientId);
        access.setDoctorId(doctor.getId());
        access.setExpiresAt(expiresAt);

        accessRepository.save(access);

        // Log access grant
        User patient = userRepository.findById(patientId).orElse(null);
        auditLogService.logAudit(
            patientId,
            patientId,
            patient != null ? patient.getName() : "Patient",
            "PATIENT",
            "ACCESS_GRANTED",
            null,
            null,
            "Granted access to Dr. " + doctor.getName()
        );
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

        boolean hasValidAccess =
                accessRepository.existsByPatientIdAndDoctorIdAndExpiresAtAfter(patientId, doctorId, Instant.now());

        if (!hasValidAccess) {
            throw new AccessRequiredException("Access required to add record");
        }

        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new AccessDeniedException("Doctor not found"));

        PatientRecord record = new PatientRecord();
        record.setPatientId(patientId);
        record.setCreatedByDoctor(doctor);
        record.setType(request.getType());
        record.setTitle(request.getTitle());
        record.setContent(request.getContent());
        record.setDiagnosis(request.getDiagnosis());

        PatientRecord savedRecord = patientRecordRepository.save(record);

        // Log record addition
        auditLogService.logAudit(
            patientId,
            doctorId,
            doctor.getName(),
            "DOCTOR",
            "RECORD_ADDED",
            savedRecord.getId(),
            savedRecord.getTitle(),
            "Added new " + savedRecord.getType() + " record"
        );
    }

    // =========================
    // DOCTOR: GET MY PATIENTS
    // =========================
    public PaginatedPatientResponse getMyPatients(Long doctorId, String role, int page, int size) {
        if (!"DOCTOR".equals(role)) {
            throw new AccessDeniedException("Only doctors can access this resource");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Access> accessPage = accessRepository.findByDoctorIdOrderByExpiresAtDesc(doctorId, pageable);

        List<PatientAccessResponse> patients = accessPage.getContent().stream()
                .map(access -> {
                    User patient = userRepository.findById(access.getPatientId()).orElse(null);
                    if (patient == null) return null;
                    return new PatientAccessResponse(
                            patient.getId(),
                            patient.getName(),
                            patient.getEmail(),
                            access.getExpiresAt()
                    );
                })
                .filter(p -> p != null)
                .collect(Collectors.toList());

        return new PaginatedPatientResponse(
                patients,
                accessPage.getNumber(),
                accessPage.getTotalPages(),
                accessPage.getTotalElements(),
                accessPage.getSize(),
                accessPage.hasNext(),
                accessPage.hasPrevious()
        );
    }

    // =========================
    // PATIENT: MANAGE ACCESS
    // =========================
    public List<ActiveAccessResponse> getActiveAccesses(Long patientId) {
        List<Access> accesses = accessRepository.findByPatientIdAndExpiresAtAfter(patientId, Instant.now());

        return accesses.stream().map(access -> {
            User doctor = userRepository.findById(access.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            return new ActiveAccessResponse(
                    access.getId(),
                    doctor.getName(),
                    doctor.getEmail(),
                    access.getExpiresAt()
            );
        }).collect(Collectors.toList());
    }

    public void revokeAccess(Long accessId, Long patientId) {
        Access access = accessRepository.findById(accessId)
                .orElseThrow(() -> new RuntimeException("Access not found"));

        if (!access.getPatientId().equals(patientId)) {
            throw new AccessDeniedException("You can only revoke access to your own records");
        }

        // Get doctor details before deleting access
        User doctor = userRepository.findById(access.getDoctorId()).orElse(null);
        User patient = userRepository.findById(patientId).orElse(null);

        accessRepository.delete(access);

        // Log access revocation
        if (doctor != null && patient != null) {
            auditLogService.logAudit(
                patientId,
                patientId,
                patient.getName(),
                "PATIENT",
                "ACCESS_REVOKED",
                null,
                null,
                "Revoked access from Dr. " + doctor.getName()
            );
        }
    }

}
