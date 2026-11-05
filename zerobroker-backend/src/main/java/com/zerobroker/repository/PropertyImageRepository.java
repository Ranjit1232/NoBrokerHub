package com.zerobroker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zerobroker.entity.PropertyImage;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {

    List<PropertyImage> findByProperty_PropertyId(Long propertyId);

}