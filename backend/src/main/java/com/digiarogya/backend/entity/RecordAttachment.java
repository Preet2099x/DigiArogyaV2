package com.digiarogya.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "record_attachments")
public class RecordAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id", nullable = false)
    private PatientRecord record;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String blobUrl;

    private String fileType;

    private Long fileSize;

    private Instant uploadedAt = Instant.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PatientRecord getRecord() { return record; }
    public void setRecord(PatientRecord record) { this.record = record; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getBlobUrl() { return blobUrl; }
    public void setBlobUrl(String blobUrl) { this.blobUrl = blobUrl; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
}
