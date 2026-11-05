package com.zerobroker.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.zerobroker.entity.PropertyImage;
import com.zerobroker.service.PropertyImageService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/property-images")
public class PropertyImageController {

    private final PropertyImageService propertyImageService;

    public PropertyImageController(PropertyImageService propertyImageService) {
        this.propertyImageService = propertyImageService;
    }

    // Existing endpoint - save image URL
    @PostMapping
    public PropertyImage addImage(@RequestBody PropertyImage propertyImage) {
        return propertyImageService.addImage(propertyImage);
    }

    // Upload actual image file
    //http://localhost:8080/api/property-images/upload
    @PostMapping("/upload")
    public PropertyImage uploadImage(
            @RequestParam("propertyId") Long propertyId,
            @RequestParam("file") MultipartFile file) throws IOException {

        return propertyImageService.uploadImage(propertyId, file);
    }

    // Get all images of a property
    @GetMapping("/property/{propertyId}")
    public List<PropertyImage> getImagesByProperty(
            @PathVariable Long propertyId) {

        return propertyImageService.getImagesByProperty(propertyId);
    }

    // Delete image
    //http://localhost:8080/api/property-images/21
    @DeleteMapping("/{imageId}")
    public ResponseEntity<String> deleteImage(
            @PathVariable Long imageId) throws IOException {

        propertyImageService.deleteImage(imageId);

        return ResponseEntity.ok("Image deleted successfully");
    }
}