package com.digiarogya.backend.dto;

import java.util.List;

public class PaginatedRecordResponse {

    private List<PatientRecordResponse> records;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;

    public PaginatedRecordResponse(
            List<PatientRecordResponse> records,
            int currentPage,
            int totalPages,
            long totalElements,
            int pageSize,
            boolean hasNext,
            boolean hasPrevious
    ) {
        this.records = records;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.pageSize = pageSize;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
    }

    public List<PatientRecordResponse> getRecords() { return records; }
    public int getCurrentPage() { return currentPage; }
    public int getTotalPages() { return totalPages; }
    public long getTotalElements() { return totalElements; }
    public int getPageSize() { return pageSize; }
    public boolean isHasNext() { return hasNext; }
    public boolean isHasPrevious() { return hasPrevious; }
}
