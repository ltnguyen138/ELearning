package com.example.elearningbackend.util;

import com.example.elearningbackend.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.UUID;

@RequiredArgsConstructor
public class MultipartfileUtil {

    private final static String notFoundImageDir = "uploads/404.png";
    private final static String createChaptersAndLecturesTemplate = "uploads/file_mau.xlsx";
    private final static Path notFoundImage = Paths.get(notFoundImageDir);
    private final MediaType mediaType;

    public static void checkImage(MultipartFile file) {
        if(file.getSize() > 20*1024*1024){
            throw new BusinessException("File size is too large");
        }
        if(file.getContentType() == null || !file.getContentType().startsWith("image/")){
            throw new BusinessException("Invalid file type");
        }
    }

    public static void checkVideo(MultipartFile file) {
        if(file.getSize() > 800*1024*1024){
            throw new BusinessException("File size is too large");
        }
        if(file.getContentType() == null || !file.getContentType().startsWith("video/")){
            throw new BusinessException("Invalid file type");
        }
    }

    public static void checkDocumentFile(MultipartFile file) {
        if(file.getSize() > 100*1024*1024){
            throw new BusinessException("File size is too large");
        }
        if(file.getContentType() == null ||
                !(file.getContentType().startsWith("application/pdf") || file.getContentType().startsWith("text/"))){
            throw new BusinessException("Invalid file type");
        }
    }

    public static String saveFile(MultipartFile file, String path) throws IOException {
        String fileName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        Path uploadPath = Paths.get(path);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path destination = Paths.get(uploadPath.toString(), uniqueFileName);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFileName;
    }

    public static String saveFile(MultipartFile file, String path, String fileName) throws IOException {
        Path uploadPath = Paths.get(path);
        if (! Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path destination = Paths.get(uploadPath.toString(), fileName);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }

    public static void deleteFile(String fileName, String path) throws IOException {
        Path filePath = Paths.get(path).resolve(fileName).normalize();
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        } else {
            throw new FileNotFoundException("File not found: " + filePath.toString());
        }
    }

    public static UrlResource loadImageFile(String imageName, String path) throws IOException {
        Path filePath = Paths.get(path).resolve(imageName).normalize();

        try {
            UrlResource resource = new UrlResource(filePath.toUri());
            if(resource.exists() || resource.isReadable()){
                return resource;
            }
            else {
                return new UrlResource(notFoundImage.toUri());
            }

        } catch (MalformedURLException e) {
            return new UrlResource(notFoundImage.toUri());
        }
    }

  public static Resource loadVideoFile(String videoName, String path) throws IOException {
        Path filePath = Paths.get(path).resolve(videoName).normalize();

        try {
            UrlResource resource = new UrlResource(filePath.toUri());
            if(resource.exists() || resource.isReadable()){
                return resource;
            }
            else {
                return new UrlResource(notFoundImage.toUri());
            }

        } catch (MalformedURLException e) {
            return new UrlResource(notFoundImage.toUri());
        }
    }

    public static Resource loadDocumentFile(String documentName, String path) throws IOException {
        Path filePath = Paths.get(path).resolve(documentName).normalize();

        try {
            UrlResource resource = new UrlResource(filePath.toUri());
            if(resource.exists() || resource.isReadable()){
                return resource;
            }
            else {
                return new UrlResource(notFoundImage.toUri());
            }

        } catch (MalformedURLException e) {
            return new UrlResource(notFoundImage.toUri());
        }
    }

    public static Resource getFileCreateChaptersAndLecturesTemplate() throws MalformedURLException {

        try {
            UrlResource resource = new UrlResource(Paths.get(createChaptersAndLecturesTemplate).toUri());
            if(resource.exists() || resource.isReadable()){
                return resource;
            }
            else {
                return new UrlResource(notFoundImage.toUri());
            }

        } catch (MalformedURLException e) {
            return new UrlResource(notFoundImage.toUri());
        }
    }

    public static MediaType getMediaType(String fileName) {

        int dotIndex = fileName.lastIndexOf(".");
        String fileExtension = (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1);

        if (Arrays.asList("jpg", "jpeg", "png").contains(fileExtension)) {
            return MediaType.IMAGE_JPEG;
        } else if (Arrays.asList("mp4", "webm", "ogg").contains(fileExtension)) {
            return MediaType.valueOf("video/" + fileExtension);
        } else if (Arrays.asList("pdf", "txt").contains(fileExtension)) {
            return MediaType.valueOf("application/" + fileExtension);
        } else {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
}
