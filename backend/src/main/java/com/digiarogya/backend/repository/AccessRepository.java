package com.digiarogya.backend.repository;

import com.digiarogya.backend.entity.Access;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface AccessRepository extends JpaRepository<Access, Long> {

    boolean existsByPatientIdAndDoctorId(Long patientId, Long doctorId);

    boolean existsByPatientIdAndDoctorIdAndExpiresAtAfter(Long patientId, Long doctorId, Instant now);

    Optional<Access> findByPatientIdAndDoctorId(Long patientId, Long doctorId);

    List<Access> findByPatientIdAndExpiresAtAfter(Long patientId, Instant now);

    Page<Access> findByDoctorIdOrderByExpiresAtDesc(Long doctorId, Pageable pageable);
}
