package com.digiarogya.backend.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class AzureBlobService {

    @Value("${azure.storage.connection-string}")
    private String connectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    private BlobContainerClient containerClient;

    @PostConstruct
    public void init() {
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();
        containerClient = blobServiceClient.getBlobContainerClient(containerName);
        
        // Create container if it doesn't exist
        if (!containerClient.exists()) {
            containerClient.create();
        }
    }

    /**
     * Upload a file to Azure Blob Storage
     * @param file The file to upload
     * @param patientId The patient ID (used for organizing files)
     * @param recordId The record ID
     * @return The blob URL
     */
    public String uploadFile(MultipartFile file, Long patientId, Long recordId) throws IOException {
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : "";
        String blobName = String.format("patient-%d/record-%d/%s%s", 
                patientId, recordId, UUID.randomUUID().toString(), extension);

        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // Set content type
        BlobHttpHeaders headers = new BlobHttpHeaders()
                .setContentType(file.getContentType());

        // Upload file
        blobClient.upload(file.getInputStream(), file.getSize(), true);
        blobClient.setHttpHeaders(headers);

        return blobClient.getBlobUrl();
    }

    /**
     * Generate a SAS URL for secure file download
     * @param blobUrl The blob URL
     * @param expiryMinutes How long the URL should be valid
     * @return Signed URL for download
     */
    public String generateDownloadUrl(String blobUrl, int expiryMinutes) {
        // Extract blob name from URL
        String blobName = extractBlobName(blobUrl);
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // Generate SAS token
        BlobSasPermission permission = new BlobSasPermission().setReadPermission(true);
        OffsetDateTime expiryTime = OffsetDateTime.now().plusMinutes(expiryMinutes);
        
        BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(expiryTime, permission);
        String sasToken = blobClient.generateSas(sasValues);

        return blobClient.getBlobUrl() + "?" + sasToken;
    }

    /**
     * Delete a file from Azure Blob Storage
     * @param blobUrl The blob URL to delete
     */
    public void deleteFile(String blobUrl) {
        String blobName = extractBlobName(blobUrl);
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        if (blobClient.exists()) {
            blobClient.delete();
        }
    }

    private String extractBlobName(String blobUrl) {
        // Extract blob name from full URL
        // URL format: https://<account>.blob.core.windows.net/<container>/<blob-name>
        String containerPath = containerName + "/";
        int index = blobUrl.indexOf(containerPath);
        if (index != -1) {
            return blobUrl.substring(index + containerPath.length());
        }
        return blobUrl;
    }
}
