package com.digiarogya.backend.repository;

import com.digiarogya.backend.entity.Access;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface AccessRepository extends JpaRepository<Access, Long> {

    Optional<Access> findByPatientIdAndDoctorIdAndStatus(
            Long patientId,
            Long doctorId,
            Access.Status status
    );

    default boolean hasActiveAccess(Long patientId, Long doctorId) {
        return findByPatientIdAndDoctorIdAndStatus(
                patientId,
                doctorId,
                Access.Status.ACTIVE
        ).filter(a ->
                a.getExpiresAt() == null || a.getExpiresAt().isAfter(Instant.now())
        ).isPresent();
    }
}
