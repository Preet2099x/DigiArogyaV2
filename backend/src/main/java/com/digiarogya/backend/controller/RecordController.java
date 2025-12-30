package com.digiarogya.backend.controller;

import com.digiarogya.backend.dto.GrantAccessRequest;
import com.digiarogya.backend.dto.PaginatedRecordResponse;
import com.digiarogya.backend.service.RecordService;
import com.digiarogya.backend.dto.CreateRecordRequest;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

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
    public PaginatedRecordResponse getMyRecords(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Long patientId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        return recordService.getMyRecords(patientId, role, page, size);
    }

    // =========================
    // DOCTOR: VIEW PATIENT RECORDS
    // =========================
    @GetMapping("/{patientId}")
    public PaginatedRecordResponse getPatientRecords(
            HttpServletRequest request,
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Long doctorId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        return recordService.getPatientRecordsForDoctor(
                doctorId,
                patientId,
                role,
                page,
                size
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
