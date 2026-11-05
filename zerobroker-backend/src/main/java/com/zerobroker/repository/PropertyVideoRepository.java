package com.zerobroker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zerobroker.entity.PropertyVideo;

public interface PropertyVideoRepository extends JpaRepository<PropertyVideo, Long> {

    List<PropertyVideo> findByProperty_PropertyId(Long propertyId);

}
