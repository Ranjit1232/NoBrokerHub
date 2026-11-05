package com.zerobroker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zerobroker.entity.Complaint;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByUser_UserId(Long userId);

    List<Complaint> findByProperty_PropertyId(Long propertyId);

    void deleteByProperty_PropertyId(Long propertyId);
}

