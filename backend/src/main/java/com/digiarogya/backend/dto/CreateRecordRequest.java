package com.digiarogya.backend.dto;

import com.digiarogya.backend.entity.RecordType;

public class CreateRecordRequest {

    private RecordType type;
    private String title;
    private String content;

    public RecordType getType() { return type; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
}
