package com.digiarogya.backend.controller;

import com.digiarogya.backend.dto.FileUploadResponse;
import com.digiarogya.backend.entity.PatientRecord;
import com.digiarogya.backend.entity.RecordAttachment;
import com.digiarogya.backend.exception.AccessDeniedException;
import com.digiarogya.backend.exception.AccessRequiredException;
import com.digiarogya.backend.repository.AccessRepository;
import com.digiarogya.backend.repository.PatientRecordRepository;
import com.digiarogya.backend.repository.RecordAttachmentRepository;
import com.digiarogya.backend.service.AzureBlobService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final AzureBlobService azureBlobService;
    private final PatientRecordRepository patientRecordRepository;
    private final RecordAttachmentRepository recordAttachmentRepository;
    private final AccessRepository accessRepository;

    public FileUploadController(
            AzureBlobService azureBlobService,
            PatientRecordRepository patientRecordRepository,
            RecordAttachmentRepository recordAttachmentRepository,
            AccessRepository accessRepository
    ) {
        this.azureBlobService = azureBlobService;
        this.patientRecordRepository = patientRecordRepository;
        this.recordAttachmentRepository = recordAttachmentRepository;
        this.accessRepository = accessRepository;
    }

    /**
     * Upload files to a record
     */
    @PostMapping("/upload/{recordId}")
    public ResponseEntity<List<FileUploadResponse>> uploadFiles(
            HttpServletRequest request,
            @PathVariable Long recordId,
            @RequestParam("files") MultipartFile[] files
    ) {
        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        if (!"DOCTOR".equals(role)) {
            throw new AccessDeniedException("Only doctors can upload files");
        }

        PatientRecord record = patientRecordRepository.findById(recordId)
                .orElseThrow(() -> new AccessDeniedException("Record not found"));

        // Verify doctor has access to this patient
        boolean hasAccess = accessRepository.existsByPatientIdAndDoctorIdAndExpiresAtAfter(
                record.getPatientId(), userId, Instant.now()
        );

        if (!hasAccess) {
            throw new AccessRequiredException("You don't have access to this patient's records");
        }

        List<FileUploadResponse> responses = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                String blobUrl = azureBlobService.uploadFile(file, record.getPatientId(), recordId);

                RecordAttachment attachment = new RecordAttachment();
                attachment.setRecord(record);
                attachment.setFileName(file.getOriginalFilename());
                attachment.setBlobUrl(blobUrl);
                attachment.setFileType(file.getContentType());
                attachment.setFileSize(file.getSize());

                attachment = recordAttachmentRepository.save(attachment);

                responses.add(new FileUploadResponse(
                        attachment.getId(),
                        attachment.getFileName(),
                        blobUrl,
                        attachment.getFileType(),
                        attachment.getFileSize()
                ));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload files: " + e.getMessage());
        }

        return ResponseEntity.ok(responses);
    }

    /**
     * Get download URL for a file
     */
    @GetMapping("/download/{attachmentId}")
    public ResponseEntity<Map<String, String>> getDownloadUrl(
            HttpServletRequest request,
            @PathVariable Long attachmentId
    ) {
        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        RecordAttachment attachment = recordAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new AccessDeniedException("Attachment not found"));

        PatientRecord record = attachment.getRecord();

        // Check access based on role
        if ("PATIENT".equals(role)) {
            if (!record.getPatientId().equals(userId)) {
                throw new AccessDeniedException("You can only access your own records");
            }
        } else if ("DOCTOR".equals(role)) {
            boolean hasAccess = accessRepository.existsByPatientIdAndDoctorIdAndExpiresAtAfter(
                    record.getPatientId(), userId, Instant.now()
            );
            if (!hasAccess) {
                throw new AccessRequiredException("You don't have access to this patient's records");
            }
        } else {
            throw new AccessDeniedException("Access denied");
        }

        // Generate SAS URL valid for 30 minutes
        String downloadUrl = azureBlobService.generateDownloadUrl(attachment.getBlobUrl(), 30);

        return ResponseEntity.ok(Map.of(
                "downloadUrl", downloadUrl,
                "fileName", attachment.getFileName()
        ));
    }

    /**
     * Get all attachments for a record
     */
    @GetMapping("/record/{recordId}")
    public ResponseEntity<List<FileUploadResponse>> getRecordAttachments(
            HttpServletRequest request,
            @PathVariable Long recordId
    ) {
        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        PatientRecord record = patientRecordRepository.findById(recordId)
                .orElseThrow(() -> new AccessDeniedException("Record not found"));

        // Check access
        if ("PATIENT".equals(role)) {
            if (!record.getPatientId().equals(userId)) {
                throw new AccessDeniedException("You can only access your own records");
            }
        } else if ("DOCTOR".equals(role)) {
            boolean hasAccess = accessRepository.existsByPatientIdAndDoctorIdAndExpiresAtAfter(
                    record.getPatientId(), userId, Instant.now()
            );
            if (!hasAccess) {
                throw new AccessRequiredException("You don't have access to this patient's records");
            }
        }

        List<RecordAttachment> attachments = recordAttachmentRepository.findByRecordId(recordId);
        List<FileUploadResponse> responses = attachments.stream()
                .map(a -> new FileUploadResponse(
                        a.getId(),
                        a.getFileName(),
                        a.getBlobUrl(),
                        a.getFileType(),
                        a.getFileSize()
                ))
                .toList();

        return ResponseEntity.ok(responses);
    }

    /**
     * Delete an attachment
     */
    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
            HttpServletRequest request,
            @PathVariable Long attachmentId
    ) {
        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        String role = (String) request.getAttribute("role");

        if (!"DOCTOR".equals(role)) {
            throw new AccessDeniedException("Only doctors can delete files");
        }

        RecordAttachment attachment = recordAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new AccessDeniedException("Attachment not found"));

        // Delete from Azure
        azureBlobService.deleteFile(attachment.getBlobUrl());

        // Delete from database
        recordAttachmentRepository.delete(attachment);

        return ResponseEntity.ok().build();
    }
}
