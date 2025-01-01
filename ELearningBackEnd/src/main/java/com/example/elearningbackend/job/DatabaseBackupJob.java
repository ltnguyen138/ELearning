package com.example.elearningbackend.job;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;


@Component
public class DatabaseBackupJob implements Job {


    private final String uploadPath = "backup";

    // Constructor để Spring có thể inject dependency

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {

        File backupDir = new File("D:/backup");
        if (!backupDir.exists() && !backupDir.mkdirs()) {
            throw new JobExecutionException("Không thể tạo thư mục backup tại: D:/backup");
        }

        String backupPath = "D:/backup/backup_" + System.currentTimeMillis() + ".sql";
        String command = "pg_dump -h localhost -U ltnguyen -F p -f " + backupPath + " ELearningDB";

        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command("cmd.exe", "/c", command);
        processBuilder.environment().put("PGPASSWORD", "000889");

        Process process = null;
        try {
            process = processBuilder.start();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // Đọc lỗi từ stderr
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        StringBuilder errorOutput = new StringBuilder();
        String line;
        while (true) {
            try {
                if (!((line = errorReader.readLine()) != null)) break;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            errorOutput.append(line).append("\n");
        }

        int exitCode = 0;
        try {
            exitCode = process.waitFor();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        if (exitCode == 0) {
            System.out.println("Backup thành công tại: " + backupPath);

        } else {
            System.out.println("Backup thất bại.");
            System.err.println("Lỗi chi tiết: " + errorOutput.toString());
        }
    }
}
