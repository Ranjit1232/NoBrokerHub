package com.zerobroker.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zerobroker.entity.PropertyImage;
import com.zerobroker.entity.Property;
import com.zerobroker.repository.PropertyImageRepository;

@Service
public class PropertyImageService {

    private final PropertyImageRepository propertyImageRepository;

    private final String uploadDir = "uploads/property-images/";

    public PropertyImageService(PropertyImageRepository propertyImageRepository) {
        this.propertyImageRepository = propertyImageRepository;
    }

    // Existing method
    public PropertyImage addImage(PropertyImage propertyImage) {
        return propertyImageRepository.save(propertyImage);
    }

    // Upload Image
    public PropertyImage uploadImage(Long propertyId, MultipartFile file) throws IOException {

        // Create folder if not exists
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique file name
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path filePath = uploadPath.resolve(fileName);

        // Save actual file
        Files.copy(file.getInputStream(), filePath);

        // Create Property reference
        Property property = new Property();
        property.setPropertyId(propertyId);

        // Save DB record
        PropertyImage propertyImage = new PropertyImage();
        propertyImage.setProperty(property);

        // Save file path
        propertyImage.setImageUrl("/uploads/property-images/" + fileName);

        return propertyImageRepository.save(propertyImage);
    }

    // Delete Image
    public void deleteImage(Long imageId) throws IOException {

        PropertyImage propertyImage =
                propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // Get stored file path
        String imageUrl = propertyImage.getImageUrl();

        // Delete actual file
        if (imageUrl != null && imageUrl.startsWith("/uploads/")) {

            String filePath = imageUrl.substring(1);

            Path path = Paths.get(filePath);

            if (Files.exists(path)) {
                Files.delete(path);
            }
        }

        // Delete DB record
        propertyImageRepository.delete(propertyImage);
    }

    // Get all images of property
    public List<PropertyImage> getImagesByProperty(Long propertyId) {
        return propertyImageRepository.findByProperty_PropertyId(propertyId);
    }
}