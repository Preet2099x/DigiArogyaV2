package com.digiarogya.backend.controller;

import com.digiarogya.backend.dto.PatientRecordResponse;
import com.digiarogya.backend.service.RecordService;
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

    // PATIENT
    @GetMapping("/me")
    public List<PatientRecordResponse> getMyRecords(HttpServletRequest request) {

        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        return recordService.getRecordsForPatient(userId, role);
    }

    // DOCTOR (ACCESS-GATED)
    @GetMapping("/{patientId}")
    public List<PatientRecordResponse> getPatientRecords(
            @PathVariable Long patientId,
            HttpServletRequest request
    ) {

        Long doctorId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        return recordService.getRecordsForDoctor(doctorId, patientId, role);
    }
}
