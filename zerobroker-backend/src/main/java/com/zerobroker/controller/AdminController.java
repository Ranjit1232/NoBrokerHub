package com.zerobroker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zerobroker.dto.AdminPropertyResponse;
import com.zerobroker.dto.AdminUserResponse;
import com.zerobroker.dto.ComplaintStatusUpdateRequest;
import com.zerobroker.entity.Complaint;
import com.zerobroker.service.ComplaintService;
import com.zerobroker.service.PropertyService;
import com.zerobroker.service.UserService;
import org.springframework.web.bind.annotation.DeleteMapping;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final PropertyService propertyService;
    private final ComplaintService complaintService;

    public AdminController(UserService userService,
            PropertyService propertyService, ComplaintService complaintService) {

        this.userService = userService;
        this.propertyService = propertyService;
        this.complaintService = complaintService;
    }

    // Admin - Get All Users
    //http://localhost:8080/api/admin/users         all user but without password
    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {
        return userService.getAllUsers();
    }
    
 // Admin - Get All Owners
    //http://localhost:8080/api/admin/owners
    @GetMapping("/owners")
    public List<AdminUserResponse> getAllOwners() {
        return userService.getAllOwners();
    }
    
 // Admin - Get All Properties
    //http://localhost:8080/api/admin/properties  get
    @GetMapping("/properties")
    public List<AdminPropertyResponse> getAllProperties() {
        return propertyService.getAllPropertiesForAdmin();
    }
    
    // Admin - Get All Complaints
    // http://localhost:8080/api/admin/complaints
    @GetMapping("/complaints")
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }
    
    // Admin - Update Complaint Status
    // http://localhost:8080/api/admin/complaints/{complaintId}/status
    //http://localhost:8080/api/admin/complaints/1/status   { "status": "RESOLVED"}
    @PutMapping("/complaints/{complaintId}/status")
    public Complaint updateComplaintStatus(
            @PathVariable Long complaintId,
            @RequestBody ComplaintStatusUpdateRequest request) {

        return complaintService.updateComplaintStatus(
                complaintId,
                request.getStatus()
        );
    }
    
 // Admin - Delete owner
    @DeleteMapping("/owners/{userId}")
    public String deleteOwner(@PathVariable Long userId) {

        userService.deleteOwner(userId);

        return "Owner deleted successfully";
    }
    
    
 // Admin - Delete User
 // DELETE http://localhost:8080/api/admin/users/{userId}

 @DeleteMapping("/users/{userId}")
 public String deleteUser(@PathVariable Long userId) {

     userService.deleteUser(userId);

     return "User deleted successfully";
 }
 
//Admin - Delete Property
@DeleteMapping("/properties/{propertyId}")
public String deleteProperty(@PathVariable Long propertyId) {

  propertyService.deleteProperty(propertyId);

  return "Property deleted successfully";
}
    
    
}