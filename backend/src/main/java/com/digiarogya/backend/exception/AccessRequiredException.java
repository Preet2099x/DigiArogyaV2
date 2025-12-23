package com.digiarogya.backend.exception;

public class AccessRequiredException extends RuntimeException {
    public AccessRequiredException(String message) {
        super(message);
    }
}
