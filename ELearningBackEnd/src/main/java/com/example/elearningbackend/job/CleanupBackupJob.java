package com.example.elearningbackend.job;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.stereotype.Component;

import java.io.File;
import java.time.Instant;

@Component
public class CleanupBackupJob implements Job {

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        File backupDir = new File("D:/backup");

        if (!backupDir.exists() || !backupDir.isDirectory()) {
            System.err.println("Thư mục backup không tồn tại hoặc không phải là thư mục: " + backupDir.getAbsolutePath());
            return;
        }

        File[] backupFiles = backupDir.listFiles();
        if (backupFiles == null || backupFiles.length == 0) {
            System.out.println("Không có file backup nào để xóa.");
            return;
        }

        Instant now = Instant.now();
        long sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000L; // 7 ngày tính bằng millisecond
        int deletedCount = 0;

        for (File file : backupFiles) {
            if (file.isFile() && file.getName().endsWith(".dump")) { // Chỉ xử lý các file .dump
                long lastModifiedTime = file.lastModified();
                if (now.toEpochMilli() - lastModifiedTime > sevenDaysInMillis) {
                    if (file.delete()) {
                        deletedCount++;
                        System.out.println("Đã xóa file: " + file.getName());
                    } else {
                        System.err.println("Không thể xóa file: " + file.getName());
                    }
                }
            }
        }

        System.out.println("Đã xóa " + deletedCount + " file backup quá 7 ngày.");
    }
}
