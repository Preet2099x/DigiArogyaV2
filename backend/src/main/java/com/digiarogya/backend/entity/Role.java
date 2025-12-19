package com.digiarogya.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {

    PATIENT,
    DOCTOR,
    HOSPITAL,
    PHARMACY,
    AMBULANCE,
    LAB,
    INSURANCE,
    ADMIN;

    /**
     * Called by Jackson when converting JSON -> Role
     * Accepts values case-insensitively.
     */
    @JsonCreator
    public static Role fromString(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Role cannot be null or empty");
        }

        return Role.valueOf(value.trim().toUpperCase());
    }

    /**
     * Called by Jackson when converting Role -> JSON
     * Ensures consistent output.
     */
    @JsonValue
    public String toValue() {
        return this.name();
    }
}
