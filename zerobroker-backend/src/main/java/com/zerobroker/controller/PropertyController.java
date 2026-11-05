package com.zerobroker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.zerobroker.dto.OwnerResponse;
import com.zerobroker.entity.Property;
import com.zerobroker.service.PropertyService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // Add Property
    //http://localhost:8080/api/properties
    @PostMapping
    public Property addProperty(@RequestBody Property property) {
        return propertyService.addProperty(property);
    }
// *********** Filter bar*************
    // Search Properties by City 
    //http://localhost:8080/api/properties/search?city=Pune
    @GetMapping("/search")
    public List<Property> searchPropertiesByCity(
            @RequestParam String city) {

        return propertyService.searchPropertiesByCity(city);
    }
    
 // Search Properties by Location
 // http://localhost:8080/api/properties/search-location?location=Baner 
    @GetMapping("/search-location")
    public List<Property> searchPropertiesByLocation(
            @RequestParam String location) {

        return propertyService.searchPropertiesByLocation(location);
    }
    
 // Filter Properties by Rent
    //http://localhost:8080/api/properties/filter/rent?minRent=10000&maxRent=20000  get
    @GetMapping("/filter/rent")
    public List<Property> filterPropertiesByRent(
            @RequestParam Double minRent,
            @RequestParam Double maxRent) {

        return propertyService.filterPropertiesByRent(
                minRent,
                maxRent);
    }
    
 // Filter Properties by Property Type
    //http://localhost:8080/api/properties/filter/type?propertyType=1 BHK  get
    @GetMapping("/filter/type")
    public List<Property> filterPropertiesByType(
            @RequestParam String propertyType) {

        return propertyService.filterPropertiesByType(propertyType);
    }
    
 // Filter Properties by Furnishing
    // http://localhost:8080/api/properties/filter/furnishing?furnishing=SEMI-FURNISHED  get
    //http://localhost:8080/api/properties/filter/furnishing?furnishing=UNFURNISHED
    //http://localhost:8080/api/properties/filter/furnishing?furnishing=FULLY-FURNISHED
    @GetMapping("/filter/furnishing")
    public List<Property> filterPropertiesByFurnishing(
            @RequestParam String furnishing) {

        return propertyService
                .filterPropertiesByFurnishing(furnishing);
    }
    
 // Filter Properties by Tenant Preference
 // http://localhost:8080/api/properties/filter/tenant-preference?tenantPreference=FAMILY
   //http://localhost:8080/api/properties/filter/tenant-preference?tenantPreference=BACHELOR
    @GetMapping("/filter/tenant-preference")
    public List<Property> filterPropertiesByTenantPreference(
            @RequestParam String tenantPreference) {

        return propertyService
                .filterPropertiesByTenantPreference(tenantPreference);
    }
    
 // Filter Properties by Status
    //http://localhost:8080/api/properties/filter/status?status=AVAILABLE
    //http://localhost:8080/api/properties/filter/status?status=RENTED
    @GetMapping("/filter/status")
    public List<Property> filterPropertiesByStatus(
            @RequestParam String status) {

        return propertyService
                .filterPropertiesByStatus(status);
    }
    
 
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // Get All Properties
    //http://localhost:8080/api/properties
    @GetMapping
    public List<Property> getAllProperties() {
        return propertyService.getAllProperties();
    }

    // Get Property By ID
    //http://localhost:8080/api/properties/5
    @GetMapping("/{propertyId}")
    public Property getPropertyById(@PathVariable Long propertyId) {
        return propertyService.getPropertyById(propertyId);
    }
    
 // Get Owner Details by Property ID
 //http://localhost:8080/api/properties/15/owner
    @GetMapping("/{propertyId}/owner")
    public OwnerResponse getOwnerByPropertyId(
            @PathVariable Long propertyId) {

        return propertyService
                .getOwnerByPropertyId(propertyId);
    }
    
    
    
    

    // Delete Property
    //http://localhost:8080/api/properties/5
    @DeleteMapping("/{propertyId}")
    public String deleteProperty(@PathVariable Long propertyId) {

        propertyService.deleteProperty(propertyId);

        return "Property deleted successfully";
    }
    
    
    @PutMapping("/{propertyId}")
    public Property updateProperty(
            @PathVariable Long propertyId,
            @RequestBody Property property) {

        return propertyService.updateProperty(propertyId, property);
    }
}

