package com.digiarogya.backend.exception;

import com.digiarogya.backend.entity.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidEnum(HttpMessageNotReadableException ex) {

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
}
