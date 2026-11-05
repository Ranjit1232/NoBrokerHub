package com.zerobroker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zerobroker.entity.RentalRequest;

public interface RentalRequestRepository
        extends JpaRepository<RentalRequest, Long> {

    List<RentalRequest> findByProperty_PropertyId(Long propertyId);

    List<RentalRequest> findByUser_UserId(Long userId);

    void deleteByProperty_PropertyId(Long propertyId);
}
