package com.example.elearningbackend.aws;

import com.example.elearningbackend.configurations.S3PresignerConfig;
import com.example.elearningbackend.util.AppUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${amazonProperties.bucketName}")
    private String bucketName;

    @Value("${amazonProperties.region}")
    private String region;


    @Value("${amazonProperties.accessKey}")
    private String accessKey;

    @Value("${amazonProperties.secretKey}")
    private String secretKey;
    public String uploadPublicFile(String filePath, MultipartFile file) throws IOException {

        String fileName = AppUtil.removeAccentAndSpaces(file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        String key = filePath + "/" + uniqueFileName;
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();
        File convFile = convertMultipartFileToFile(file);
        s3Client.putObject(putObjectRequest, RequestBody.fromFile(convFile));

        return uniqueFileName;
    }

    public String uploadFile(String filePath, MultipartFile file) throws IOException {

        String fileName = AppUtil.removeAccentAndSpaces(file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        String key = filePath + "/" + uniqueFileName;
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        try (InputStream inputStream = file.getInputStream()) {
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
        }

        return uniqueFileName;
    }

    public  String uploadFile(String filePath, File file) throws IOException {

        String fileName = file.getName();
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        String key = filePath + "/" + uniqueFileName;
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.putObject(putObjectRequest, RequestBody.fromFile(file));

        return uniqueFileName;
    }

    public String uploadDocumentFile(String filePath, MultipartFile file) throws IOException {

        String fileName = AppUtil.removeAccentAndSpaces(file.getOriginalFilename());

        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        Map<String, String> metadata = new HashMap<>();
        metadata.put("Content-Disposition", "attachment; filename=\"" + uniqueFileName + "\"");
        String key = filePath + "/" + uniqueFileName;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
//                .contentDisposition("attachment; filename=\"" + uniqueFileName + "\"")
                .build();
        try (InputStream inputStream = file.getInputStream()) {
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
        }
        return uniqueFileName;
    }

    public void deleteFile(String key) {
        s3Client.deleteObject(builder -> builder.bucket(bucketName).key(key));
    }

    public String presignedUrl(String filePath, String filename, Duration duration) {
        S3Presigner presigner = new S3PresignerConfig().createPresigner(accessKey, secretKey, region);
        String key = filePath + "/" + filename;
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(duration)
                .getObjectRequest(getObjectRequest)
                .build();
        PresignedGetObjectRequest presignedGetObjectRequest = presigner.presignGetObject(getObjectPresignRequest);
        presigner.close();
        System.out.println(presignedGetObjectRequest.url());
        return presignedGetObjectRequest.url().toString();
    }


    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }
}
