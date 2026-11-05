package com.zerobroker.dto;


/*DTO why :-Fronted kadun Aapan {
    "fullName": "Ranjit Mali",
    "email": "ranjit@gmail.com",
    "password": "12345",
    "phone": "9876543210",
    "city": "Pune",
    "roleName": "USER"
} he ghenar rolename ahe*/

public class UserRegistrationRequest {

    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String city;
    private String roleName;

    public UserRegistrationRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}