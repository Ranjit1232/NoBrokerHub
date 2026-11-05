package com.zerobroker.controller;

import org.springframework.web.bind.annotation.*;

import com.zerobroker.dto.ForgotPasswordRequest;
import com.zerobroker.dto.LoginResponse;
import com.zerobroker.dto.OtpVerifyRequest;
import com.zerobroker.dto.ResetPasswordRequest;
import com.zerobroker.dto.UserLoginRequest;
import com.zerobroker.dto.UserProfileResponse;
import com.zerobroker.dto.UserRegistrationRequest;
import com.zerobroker.entity.User;
import com.zerobroker.service.UserService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    //http://localhost:8080/api/users/register
    @PostMapping("/register")
    public User registerUser(
            @RequestBody UserRegistrationRequest request) {

        return userService.registerUser(request);
    }
    
    //http://localhost:8080/api/users/login{email:",password}
    @PostMapping("/login")
    public LoginResponse loginUser(
            @RequestBody UserLoginRequest request) {

        return userService.loginUser(request);
    }
    
 // Get User Profile
   // http://localhost:8080/api/users/profile/4
    @GetMapping("/profile/{userId}")
    public UserProfileResponse getUserProfile(
            @PathVariable Long userId) {

        return userService.getUserProfile(userId);
    }
    
 // Forgot Password
 // http://localhost:8080/api/users/forgot-password
 @PostMapping("/forgot-password")
 public String forgotPassword(
         @RequestBody ForgotPasswordRequest request) {

     return userService.forgotPassword(request);
 }
    
//Verify OTP
//http://localhost:8080/api/users/verify-otp
@PostMapping("/verify-otp")
public String verifyOtp(
      @RequestBody OtpVerifyRequest request) {

  return userService.verifyOtp(request);
}

//Reset Password
//http://localhost:8080/api/users/reset-password
@PostMapping("/reset-password")
public String resetPassword(
     @RequestBody ResetPasswordRequest request) {

 return userService.resetPassword(request);
}
    
    
    
}