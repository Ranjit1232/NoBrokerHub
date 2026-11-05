package com.zerobroker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zerobroker.entity.Complaint;
import com.zerobroker.repository.ComplaintRepository;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    // Create Complaint
    public Complaint createComplaint(Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    // Get all complaints of a particular user
    public List<Complaint> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUser_UserId(userId);
    }

    // Get all complaints of a particular property
    public List<Complaint> getComplaintsByProperty(Long propertyId) {
        return complaintRepository.findByProperty_PropertyId(propertyId);
    }

    // Admin - Get all complaints
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }
    
    // Admin - Update Complaint Status
    public Complaint updateComplaintStatus(
            Long complaintId,
            String status) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status.toUpperCase());

        return complaintRepository.save(complaint);
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}