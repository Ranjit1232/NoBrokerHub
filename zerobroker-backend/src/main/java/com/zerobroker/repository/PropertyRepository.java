package com.zerobroker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zerobroker.entity.Property;

public interface PropertyRepository extends JpaRepository<Property, Long> {
	List<Property> findByCityIgnoreCase(String city);
	
	List<Property> findByLocationIgnoreCase(String location);
	
	List<Property> findByRentBetween(Double minRent, Double maxRent);
	
	List<Property> findByPropertyTypeIgnoreCase(String propertyType);

	List<Property> findByFurnishingIgnoreCase(String furnishing);
	
	List<Property> findByTenantPreferenceIgnoreCase(String tenantPreference);
	
	List<Property> findByStatusIgnoreCase(String status);
	
	// Find all properties of an owner
	List<Property> findByOwner_UserId(Long userId);
}

