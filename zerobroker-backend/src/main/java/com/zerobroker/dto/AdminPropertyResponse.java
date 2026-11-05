package com.zerobroker.dto;

import java.time.LocalDate;

public class AdminPropertyResponse {

    private Long propertyId;
    private String title;
    private String description;
    private String propertyType;
    private Integer bhk;
    private Double rent;
    private Double deposit;
    private String city;
    private String location;
    private String address;
    private String furnishing;
    private LocalDate availableFrom;
    private String tenantPreference;
    private String status;

    private Long ownerId;
    private String ownerName;
    private String ownerEmail;

    public AdminPropertyResponse() {
    }

    public AdminPropertyResponse(
            Long propertyId,
            String title,
            String description,
            String propertyType,
            Integer bhk,
            Double rent,
            Double deposit,
            String city,
            String location,
            String address,
            String furnishing,
            LocalDate availableFrom,
            String tenantPreference,
            String status,
            Long ownerId,
            String ownerName,
            String ownerEmail) {

        this.propertyId = propertyId;
        this.title = title;
        this.description = description;
        this.propertyType = propertyType;
        this.bhk = bhk;
        this.rent = rent;
        this.deposit = deposit;
        this.city = city;
        this.location = location;
        this.address = address;
        this.furnishing = furnishing;
        this.availableFrom = availableFrom;
        this.tenantPreference = tenantPreference;
        this.status = status;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public Integer getBhk() {
        return bhk;
    }

    public void setBhk(Integer bhk) {
        this.bhk = bhk;
    }

    public Double getRent() {
        return rent;
    }

    public void setRent(Double rent) {
        this.rent = rent;
    }

    public Double getDeposit() {
        return deposit;
    }

    public void setDeposit(Double deposit) {
        this.deposit = deposit;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getFurnishing() {
        return furnishing;
    }

    public void setFurnishing(String furnishing) {
        this.furnishing = furnishing;
    }

    public LocalDate getAvailableFrom() {
        return availableFrom;
    }

    public void setAvailableFrom(LocalDate availableFrom) {
        this.availableFrom = availableFrom;
    }

    public String getTenantPreference() {
        return tenantPreference;
    }

    public void setTenantPreference(String tenantPreference) {
        this.tenantPreference = tenantPreference;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }
}