package com.digiarogya.backend.controller;

import com.digiarogya.backend.dto.GrantAccessRequest;
import com.digiarogya.backend.dto.PatientRecordResponse;
import com.digiarogya.backend.service.RecordService;
import com.digiarogya.backend.dto.CreateRecordRequest;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
public class RecordController {

    private final RecordService recordService;

    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }

    // =========================
    // PATIENT: VIEW OWN RECORDS
    // =========================
    @GetMapping("/me")
    public List<PatientRecordResponse> getMyRecords(HttpServletRequest request) {

        Long patientId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        return recordService.getMyRecords(patientId, role);
    }

    // =========================
    // DOCTOR: VIEW PATIENT RECORDS
    // =========================
    @GetMapping("/{patientId}")
    public List<PatientRecordResponse> getPatientRecords(
            HttpServletRequest request,
            @PathVariable Long patientId
    ) {
        Long doctorId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        return recordService.getPatientRecordsForDoctor(
                doctorId,
                patientId,
                role
        );
    }

    // =========================
    // PATIENT: GRANT ACCESS
    // =========================
    @PostMapping("/access")
    public void grantAccess(
            HttpServletRequest request,
            @RequestBody GrantAccessRequest body
    ) {
        Long patientId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        recordService.grantAccess(patientId, role, body.getDoctorEmail());
    }

    @PostMapping("/{patientId}")
    public void addRecord(
            HttpServletRequest request,
            @PathVariable Long patientId,
            @RequestBody CreateRecordRequest body
    ) {
        Long doctorId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        recordService.addRecord(
                doctorId,
                patientId,
                role,
                body
        );
    }

}
