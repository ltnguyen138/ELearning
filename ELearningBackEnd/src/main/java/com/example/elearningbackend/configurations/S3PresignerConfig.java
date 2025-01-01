package com.example.elearningbackend.configurations;

import org.springframework.beans.factory.annotation.Value;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

public class S3PresignerConfig {



    public S3Presigner createPresigner(String accessKey, String secretKey, String region) {
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);

        return S3Presigner.builder()
                .region(Region.of(region)) // Đặt region tùy theo khu vực bạn sử dụng
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
    }
}
