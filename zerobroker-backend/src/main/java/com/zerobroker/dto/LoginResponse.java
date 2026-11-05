
package com.zerobroker.dto;

public class LoginResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String roleName;
    private String token; // New JWT token field

    public LoginResponse() {
    }

    public LoginResponse(
            Long userId,
            String fullName,
            String email,
            String roleName,
            String token) {

        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.roleName = roleName;
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
