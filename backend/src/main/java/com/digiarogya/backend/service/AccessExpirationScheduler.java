package com.digiarogya.backend.service;

import com.digiarogya.backend.entity.Access;
import com.digiarogya.backend.entity.User;
import com.digiarogya.backend.repository.AccessRepository;
import com.digiarogya.backend.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AccessExpirationScheduler {

    private final AccessRepository accessRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public AccessExpirationScheduler(
            AccessRepository accessRepository,
            UserRepository userRepository,
            AuditLogService auditLogService
    ) {
        this.accessRepository = accessRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    // Run every hour to check for expired access
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void checkExpiredAccess() {
        Instant now = Instant.now();
        List<Access> allAccess = accessRepository.findAll();

        for (Access access : allAccess) {
            if (access.getExpiresAt().isBefore(now)) {
                // Log the expiration
                User patient = userRepository.findById(access.getPatientId()).orElse(null);
                User doctor = userRepository.findById(access.getDoctorId()).orElse(null);

                if (patient != null && doctor != null) {
                    auditLogService.logAudit(
                        access.getPatientId(),
                        patient.getName(),
                        access.getPatientId(),
                        patient.getName(),
                        "SYSTEM",
                        "ACCESS_EXPIRED",
                        null,
                        null,
                        "Access to Dr. " + doctor.getName() + " expired automatically"
                    );

                    // Also log for doctor
                    auditLogService.logAudit(
                        access.getPatientId(),
                        patient.getName(),
                        access.getDoctorId(),
                        doctor.getName(),
                        "SYSTEM",
                        "ACCESS_EXPIRED",
                        null,
                        null,
                        "Access to " + patient.getName() + "'s records expired automatically"
                    );
                }

                // Delete the expired access
                accessRepository.delete(access);
            }
        }
    }
}
