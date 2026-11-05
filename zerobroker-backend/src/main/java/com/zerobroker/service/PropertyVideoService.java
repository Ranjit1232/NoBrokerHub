package com.zerobroker.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zerobroker.entity.Property;
import com.zerobroker.entity.PropertyVideo;
import com.zerobroker.repository.PropertyVideoRepository;

@Service
public class PropertyVideoService {

    private final PropertyVideoRepository propertyVideoRepository;

    private final String uploadDir = "uploads/property-videos/";

    public PropertyVideoService(PropertyVideoRepository propertyVideoRepository) {
        this.propertyVideoRepository = propertyVideoRepository;
    }

    // Existing method
    public PropertyVideo addVideo(PropertyVideo propertyVideo) {
        return propertyVideoRepository.save(propertyVideo);
    }

    // Upload actual video
    public PropertyVideo uploadVideo(Long propertyId, MultipartFile file) throws IOException {

        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName =
                System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath);

        Property property = new Property();
        property.setPropertyId(propertyId);

        PropertyVideo propertyVideo = new PropertyVideo();
        propertyVideo.setProperty(property);
        propertyVideo.setVideoUrl("/uploads/property-videos/" + fileName);

        return propertyVideoRepository.save(propertyVideo);
    }

    // Delete video
    public void deleteVideo(Long videoId) throws IOException {

        PropertyVideo propertyVideo =
                propertyVideoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        String videoUrl = propertyVideo.getVideoUrl();

        if (videoUrl != null && videoUrl.startsWith("/uploads/")) {

            String filePath = videoUrl.substring(1);

            Path path = Paths.get(filePath);

            if (Files.exists(path)) {
                Files.delete(path);
            }
        }

        propertyVideoRepository.delete(propertyVideo);
    }

    // Get all videos of property
    public List<PropertyVideo> getVideosByProperty(Long propertyId) {

        return propertyVideoRepository.findByProperty_PropertyId(propertyId);
    }
}