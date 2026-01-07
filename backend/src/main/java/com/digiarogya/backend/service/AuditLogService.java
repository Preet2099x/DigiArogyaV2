package com.digiarogya.backend.service;

import com.digiarogya.backend.dto.AuditLogResponse;
import com.digiarogya.backend.dto.PaginatedAuditLogResponse;
import com.digiarogya.backend.entity.AuditLog;
import com.digiarogya.backend.exception.AccessDeniedException;
import com.digiarogya.backend.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // Log an audit event
    public void logAudit(Long patientId, String patientName, Long actorId, String actorName, String actorRole, 
                        String action, Long recordId, String recordTitle, String details) {
        AuditLog log = new AuditLog();
        log.setPatientId(patientId);
        log.setPatientName(patientName);
        log.setActorId(actorId);
        log.setActorName(actorName);
        log.setActorRole(actorRole);
        log.setAction(action);
        log.setRecordId(recordId);
        log.setRecordTitle(recordTitle);
        log.setDetails(details);
        
        auditLogRepository.save(log);
    }

    // Get audit logs for a patient or doctor
    public PaginatedAuditLogResponse getAuditLogs(Long userId, String role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> logPage;

        if ("PATIENT".equals(role)) {
            // Patients see logs related to their records (by patientId)
            logPage = auditLogRepository.findByPatientIdOrderByCreatedAtDesc(userId, pageable);
        } else if ("DOCTOR".equals(role)) {
            // Doctors see logs of their own actions (by actorId)
            logPage = auditLogRepository.findByActorIdOrderByCreatedAtDesc(userId, pageable);
        } else {
            throw new AccessDeniedException("Invalid role for viewing audit logs");
        }

        List<AuditLogResponse> logs = logPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PaginatedAuditLogResponse(
                logs,
                logPage.getNumber(),
                logPage.getTotalPages(),
                logPage.getTotalElements(),
                logPage.getSize(),
                logPage.hasNext(),
                logPage.hasPrevious()
        );
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getPatientId(),
                log.getPatientName(),
                log.getActorId(),
                log.getActorName(),
                log.getActorRole(),
                log.getAction(),
                log.getRecordId(),
                log.getRecordTitle(),
                log.getDetails(),
                log.getCreatedAt()
        );
    }
}
