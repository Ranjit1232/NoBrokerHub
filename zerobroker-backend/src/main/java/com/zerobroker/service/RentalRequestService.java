package com.zerobroker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zerobroker.entity.RentalRequest;
import com.zerobroker.repository.RentalRequestRepository;

@Service
public class RentalRequestService {

private final RentalRequestRepository rentalRequestRepository;

public RentalRequestService(RentalRequestRepository rentalRequestRepository) {
    this.rentalRequestRepository = rentalRequestRepository;
}

// Create Rental Request
public RentalRequest createRequest(RentalRequest rentalRequest) {
    return rentalRequestRepository.save(rentalRequest);
}

// Get requests by User
public List<RentalRequest> getRequestsByUser(Long userId) {
    return rentalRequestRepository.findByUser_UserId(userId);
}

// Get requests by Property
public List<RentalRequest> getRequestsByProperty(Long propertyId) {
    return rentalRequestRepository.findByProperty_PropertyId(propertyId);
}

// Accept Rental Request
public RentalRequest acceptRequest(Long requestId) {

    RentalRequest rentalRequest =
            rentalRequestRepository.findById(requestId)
                    .orElseThrow(() ->
                            new RuntimeException("Rental request not found"));

    rentalRequest.setRequestStatus("ACCEPTED");

    return rentalRequestRepository.save(rentalRequest);
}

// Reject Rental Request
public RentalRequest rejectRequest(Long requestId) {

    RentalRequest rentalRequest =
            rentalRequestRepository.findById(requestId)
                    .orElseThrow(() ->
                            new RuntimeException("Rental request not found"));

    rentalRequest.setRequestStatus("REJECTED");

    return rentalRequestRepository.save(rentalRequest);
}


}
