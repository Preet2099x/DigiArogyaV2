package com.digiarogya.backend.controller;

import com.digiarogya.backend.dto.PaginatedAuditLogResponse;
import com.digiarogya.backend.security.JwtUtil;
import com.digiarogya.backend.service.AuditLogService;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<PaginatedAuditLogResponse> getAuditLogs(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = JwtUtil.parseToken(token);
        Long userId = Long.parseLong(claims.getSubject());
        String role = claims.get("role", String.class);

        PaginatedAuditLogResponse response = auditLogService.getAuditLogs(userId, role, page, size);
        return ResponseEntity.ok(response);
    }
}
