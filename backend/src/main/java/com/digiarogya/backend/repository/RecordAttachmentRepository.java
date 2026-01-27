package com.digiarogya.backend.repository;

import com.digiarogya.backend.entity.RecordAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecordAttachmentRepository extends JpaRepository<RecordAttachment, Long> {
    List<RecordAttachment> findByRecordId(Long recordId);
}
