package com.zerobroker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.zerobroker.entity.RentalRequest;
import com.zerobroker.service.RentalRequestService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/rental-requests")
public class RentalRequestController {


private final RentalRequestService rentalRequestService;

public RentalRequestController(RentalRequestService rentalRequestService) {
    this.rentalRequestService = rentalRequestService;
}

// Create Rental Request
// POST http://localhost:8080/api/rental-requests
@PostMapping
public RentalRequest createRequest(
        @RequestBody RentalRequest rentalRequest) {

    return rentalRequestService.createRequest(rentalRequest);
}

// Get requests by User
// GET http://localhost:8080/api/rental-requests/user/1
@GetMapping("/user/{userId}")
public List<RentalRequest> getRequestsByUser(
        @PathVariable Long userId) {

    return rentalRequestService.getRequestsByUser(userId);
}

// Get requests by Property
// GET http://localhost:8080/api/rental-requests/property/15
@GetMapping("/property/{propertyId}")
public List<RentalRequest> getRequestsByProperty(
        @PathVariable Long propertyId) {

    return rentalRequestService.getRequestsByProperty(propertyId);
}

// Accept Rental Request
// PUT http://localhost:8080/api/rental-requests/1/accept
@PutMapping("/{requestId}/accept")
public RentalRequest acceptRequest(
        @PathVariable Long requestId) {

    return rentalRequestService.acceptRequest(requestId);
}

// Reject Rental Request
// PUT http://localhost:8080/api/rental-requests/1/reject
@PutMapping("/{requestId}/reject")
public RentalRequest rejectRequest(
        @PathVariable Long requestId) {

    return rentalRequestService.rejectRequest(requestId);
}

}
