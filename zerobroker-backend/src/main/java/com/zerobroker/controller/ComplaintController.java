package com.zerobroker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.zerobroker.entity.Complaint;
import com.zerobroker.service.ComplaintService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // Create Complaint
//    http://localhost:8080/api/complaints
    @PostMapping
    public Complaint createComplaint(
            @RequestBody Complaint complaint) {
        return complaintService.createComplaint(complaint);
    }

    // Get complaints by User ID
//    http://localhost:8080/api/complaints/user/4
    @GetMapping("/user/{userId}")
    public List<Complaint> getComplaintsByUser(
            @PathVariable Long userId) {
        return complaintService.getComplaintsByUser(userId);
    }

    // Get complaints by Property ID
//    http://localhost:8080/api/complaints/property/15
    @GetMapping("/property/{propertyId}")
    public List<Complaint> getComplaintsByProperty(
            @PathVariable Long propertyId) {
        return complaintService.getComplaintsByProperty(propertyId);
    }

    // Admin - Get All Complaints
//    http://localhost:8080/api/complaints
    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }
}