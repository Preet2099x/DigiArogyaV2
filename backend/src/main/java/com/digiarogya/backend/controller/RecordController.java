package com.digiarogya.backend.controller;

import com.digiarogya.backend.dto.PatientRecordResponse;
import com.digiarogya.backend.service.RecordService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/records")
public class RecordController {

    private final RecordService recordService;

    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping("/me")
    public List<PatientRecordResponse> getMyRecords(HttpServletRequest request) {

        Long userId = Long.valueOf(
                (String) request.getAttribute("userId")
        );

        String role = (String) request.getAttribute("role");

        return recordService.getRecordsForPatient(userId, role);
    }
}
