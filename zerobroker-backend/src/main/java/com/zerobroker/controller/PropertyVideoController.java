package com.zerobroker.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.zerobroker.entity.PropertyVideo;
import com.zerobroker.service.PropertyVideoService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/property-videos")
public class PropertyVideoController {

    private final PropertyVideoService propertyVideoService;

    public PropertyVideoController(PropertyVideoService propertyVideoService) {
        this.propertyVideoService = propertyVideoService;
    }

    // Existing endpoint - save video URL
    @PostMapping
    public PropertyVideo addVideo(@RequestBody PropertyVideo propertyVideo) {
        return propertyVideoService.addVideo(propertyVideo);
    }

    // Upload actual video file
    @PostMapping("/upload")
    public PropertyVideo uploadVideo(
            @RequestParam("propertyId") Long propertyId,
            @RequestParam("file") MultipartFile file) throws IOException {

        return propertyVideoService.uploadVideo(propertyId, file);
    }

    // Get all videos of a property
    @GetMapping("/property/{propertyId}")
    public List<PropertyVideo> getVideosByProperty(
            @PathVariable Long propertyId) {

        return propertyVideoService.getVideosByProperty(propertyId);
    }

    // Delete video
    @DeleteMapping("/{videoId}")
    public ResponseEntity<String> deleteVideo(
            @PathVariable Long videoId) throws IOException {

        propertyVideoService.deleteVideo(videoId);

        return ResponseEntity.ok("Video deleted successfully");
    }
}