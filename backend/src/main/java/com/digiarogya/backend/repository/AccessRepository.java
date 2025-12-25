package com.digiarogya.backend.repository;

import com.digiarogya.backend.entity.Access;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessRepository extends JpaRepository<Access, Long> {

    boolean existsByPatientIdAndDoctorId(Long patientId, Long doctorId);
}
