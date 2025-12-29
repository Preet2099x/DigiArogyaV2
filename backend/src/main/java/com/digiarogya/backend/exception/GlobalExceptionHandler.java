package com.digiarogya.backend.exception;

import com.digiarogya.backend.entity.RecordType;
import com.digiarogya.backend.entity.Role;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidEnum(HttpMessageNotReadableException ex) {
        String message = ex.getMessage();
        
        // Check if it's a RecordType enum error
        if (message != null && message.contains("RecordType")) {
            List<String> allowedTypes = Arrays.stream(RecordType.values())
                    .map(Enum::name)
                    .toList();

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "INVALID_RECORD_TYPE",
                            "message", "Invalid record type provided",
                            "allowedTypes", allowedTypes
                    ));
        }
        
        // Check if it's a Role enum error
        if (message != null && message.contains("Role")) {
            List<String> allowedRoles = Arrays.stream(Role.values())
                    .map(Enum::name)
                    .toList();

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "INVALID_ROLE",
                            "message", "Invalid role provided",
                            "allowedRoles", allowedRoles
                    ));
        }

        // Generic JSON parse error
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error", "INVALID_REQUEST",
                        "message", "Invalid request body"
                ));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(
            InvalidCredentialsException ex) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "error", "INVALID_CREDENTIALS",
                        "message", "Email or password is incorrect"
                ));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(
            AccessDeniedException ex) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "FORBIDDEN",
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(AccessRequiredException.class)
    public ResponseEntity<Map<String, String>> handleAccessRequired(
            AccessRequiredException ex) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "ACCESS_REQUIRED",
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateEmail(
            DuplicateEmailException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "error", "DUPLICATE_EMAIL",
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, String>> handleValidation(
            ValidationException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error", "VALIDATION_ERROR",
                        "message", ex.getMessage()
                ));
    }


}
