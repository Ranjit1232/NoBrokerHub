
package com.zerobroker.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.zerobroker.dto.AdminPropertyResponse;
import com.zerobroker.dto.OwnerResponse;
import com.zerobroker.entity.Property;
import com.zerobroker.entity.PropertyImage;
import com.zerobroker.entity.PropertyVideo;
import com.zerobroker.entity.User;

import com.zerobroker.repository.ComplaintRepository;
import com.zerobroker.repository.FavoriteRepository;
import com.zerobroker.repository.PropertyImageRepository;
import com.zerobroker.repository.PropertyRepository;
import com.zerobroker.repository.PropertyVideoRepository;
import com.zerobroker.repository.RentalRequestRepository;
import com.zerobroker.repository.UserRepository;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final PropertyVideoRepository propertyVideoRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final FavoriteRepository favoriteRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public PropertyService(
            PropertyRepository propertyRepository,
            PropertyImageRepository propertyImageRepository,
            PropertyVideoRepository propertyVideoRepository,
            RentalRequestRepository rentalRequestRepository,
            FavoriteRepository favoriteRepository,
            ComplaintRepository complaintRepository,
            UserRepository userRepository) {

        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.propertyVideoRepository = propertyVideoRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.favoriteRepository = favoriteRepository;
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    
    //add property
    public Property addProperty(Property property) {

        User loggedInUser = getLoggedInUser();

        String roleName = loggedInUser.getRole().getRoleName();

        if (!"OWNER".equals(roleName)) {
            throw new AccessDeniedException(
                    "Only OWNER can add a property");
        }

        property.setOwner(loggedInUser);

        return propertyRepository.save(property);
    }

    // Get currently logged-in user
    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null) {
            throw new AccessDeniedException("Authentication required");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new AccessDeniedException("Authenticated user not found"));
    }

    // Get All Properties
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // Admin - Get All Properties
    public List<AdminPropertyResponse> getAllPropertiesForAdmin() {

        return propertyRepository.findAll()
                .stream()
                .map(property -> new AdminPropertyResponse(
                        property.getPropertyId(),
                        property.getTitle(),
                        property.getDescription(),
                        property.getPropertyType(),
                        property.getBhk(),
                        property.getRent(),
                        property.getDeposit(),
                        property.getCity(),
                        property.getLocation(),
                        property.getAddress(),
                        property.getFurnishing(),
                        property.getAvailableFrom(),
                        property.getTenantPreference(),
                        property.getStatus(),
                        property.getOwner().getUserId(),
                        property.getOwner().getFullName(),
                        property.getOwner().getEmail()
                ))
                .toList();
    }

    // Search Properties by City
    public List<Property> searchPropertiesByCity(String city) {
        return propertyRepository.findByCityIgnoreCase(city);
    }

    // Search Properties by Location
    public List<Property> searchPropertiesByLocation(String location) {
        return propertyRepository.findByLocationIgnoreCase(location);
    }

    // Filter Properties by Rent
    public List<Property> filterPropertiesByRent(
            Double minRent, Double maxRent) {

        return propertyRepository.findByRentBetween(minRent, maxRent);
    }

    // Filter Properties by Property Type
    public List<Property> filterPropertiesByType(String propertyType) {
        return propertyRepository.findByPropertyTypeIgnoreCase(propertyType);
    }

    // Filter Properties by Furnishing
    public List<Property> filterPropertiesByFurnishing(String furnishing) {
        return propertyRepository.findByFurnishingIgnoreCase(furnishing);
    }

    // Filter Properties by Tenant Preference
    public List<Property> filterPropertiesByTenantPreference(
            String tenantPreference) {

        return propertyRepository
                .findByTenantPreferenceIgnoreCase(tenantPreference);
    }

    // Filter Properties by Status
    public List<Property> filterPropertiesByStatus(String status) {
        return propertyRepository.findByStatusIgnoreCase(status);
    }

    // Get Property By ID
    public Property getPropertyById(Long propertyId) {

        return propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException("Property not found"));
    }

    // Get Owner Details by Property ID
    public OwnerResponse getOwnerByPropertyId(Long propertyId) {

        Property property = getPropertyById(propertyId);

        return new OwnerResponse(
                property.getOwner().getUserId(),
                property.getOwner().getFullName(),
                property.getOwner().getEmail(),
                property.getOwner().getPhone(),
                property.getOwner().getCity()
        );
    }

    // Update Property - only its owner
    public Property updateProperty(
            Long propertyId, Property updatedProperty) {

        User loggedInUser = getLoggedInUser();
        Property existingProperty = getPropertyById(propertyId);

        boolean isAdmin = "ADMIN".equals(
                loggedInUser.getRole().getRoleName());

        boolean isOwner = existingProperty.getOwner().getUserId()
                .equals(loggedInUser.getUserId());

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException(
                    "You are not allowed to update this property");
        }

        existingProperty.setTitle(updatedProperty.getTitle());
        existingProperty.setDescription(updatedProperty.getDescription());
        existingProperty.setPropertyType(updatedProperty.getPropertyType());
        existingProperty.setBhk(updatedProperty.getBhk());
        existingProperty.setRent(updatedProperty.getRent());
        existingProperty.setDeposit(updatedProperty.getDeposit());
        existingProperty.setCity(updatedProperty.getCity());
        existingProperty.setLocation(updatedProperty.getLocation());
        existingProperty.setAddress(updatedProperty.getAddress());
        existingProperty.setFurnishing(updatedProperty.getFurnishing());
        existingProperty.setAvailableFrom(updatedProperty.getAvailableFrom());
        existingProperty.setTenantPreference(
                updatedProperty.getTenantPreference());
        existingProperty.setStatus(updatedProperty.getStatus());

        return propertyRepository.save(existingProperty);
    }

    // Delete Property - only its owner
    @Transactional
    public void deleteProperty(Long propertyId) {

        User loggedInUser = getLoggedInUser();
        Property property = getPropertyById(propertyId);

        boolean isAdmin = "ADMIN".equals(
                loggedInUser.getRole().getRoleName());

        boolean isOwner = property.getOwner().getUserId()
                .equals(loggedInUser.getUserId());

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException(
                    "You are not allowed to delete this property");
        }

        // 1. Delete Rental Requests
        rentalRequestRepository.deleteByProperty_PropertyId(propertyId);

        // 2. Delete Favorites
        favoriteRepository.deleteByProperty_PropertyId(propertyId);

        // 3. Delete Complaints
        complaintRepository.deleteByProperty_PropertyId(propertyId);

        // 4. Delete Property Images
        List<PropertyImage> images =
                propertyImageRepository
                        .findByProperty_PropertyId(propertyId);

        propertyImageRepository.deleteAll(images);

        // 5. Delete Property Videos
        List<PropertyVideo> videos =
                propertyVideoRepository
                        .findByProperty_PropertyId(propertyId);

        propertyVideoRepository.deleteAll(videos);

        // 6. Finally Delete Property
        propertyRepository.delete(property);
    }
}
