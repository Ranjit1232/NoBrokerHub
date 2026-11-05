package com.zerobroker.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zerobroker.dto.AdminUserResponse;
import com.zerobroker.dto.ForgotPasswordRequest;
import com.zerobroker.dto.LoginResponse;
import com.zerobroker.dto.OtpVerifyRequest;
import com.zerobroker.dto.ResetPasswordRequest;
import com.zerobroker.dto.UserLoginRequest;
import com.zerobroker.dto.UserProfileResponse;
import com.zerobroker.dto.UserRegistrationRequest;
import com.zerobroker.entity.Roles;
import com.zerobroker.entity.User;
import com.zerobroker.entity.Property;
import com.zerobroker.entity.PropertyImage;
import com.zerobroker.entity.PropertyVideo;
import com.zerobroker.repository.RoleRepository;
import com.zerobroker.repository.UserRepository;
import com.zerobroker.repository.PropertyRepository;
import com.zerobroker.repository.PropertyImageRepository;
import com.zerobroker.repository.PropertyVideoRepository;
import com.zerobroker.repository.RentalRequestRepository;
import com.zerobroker.repository.FavoriteRepository;
import com.zerobroker.repository.ComplaintRepository;
import com.zerobroker.security.JwtUtil;

import org.springframework.http.HttpStatus;    //handle proper Exception
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    // Store OTP and its expiry time
    private final Map<String, String> otpStorage = new HashMap<>();
    private final Map<String, Long> otpExpiryStorage = new HashMap<>();

    // Admin delete functionality
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final PropertyVideoRepository propertyVideoRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final FavoriteRepository favoriteRepository;
    private final ComplaintRepository complaintRepository;

    private final EmailService emailService;
    
    
    private final JwtUtil jwtUtil;  //login

    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PropertyRepository propertyRepository,
            PropertyImageRepository propertyImageRepository,
            PropertyVideoRepository propertyVideoRepository,
            RentalRequestRepository rentalRequestRepository,
            FavoriteRepository favoriteRepository,
            ComplaintRepository complaintRepository,
            EmailService emailService,
            JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.propertyVideoRepository = propertyVideoRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.favoriteRepository = favoriteRepository;
        this.complaintRepository = complaintRepository;
        this.emailService = emailService;
        this.jwtUtil=jwtUtil;
    }

    // Register User
    public User registerUser(UserRegistrationRequest request) {

        Roles role = roleRepository
                .findByRoleName(request.getRoleName().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setPhone(request.getPhone());
        user.setCity(request.getCity());

        user.setRole(role);

        return userRepository.save(user);
    }

 // Login
    public LoginResponse loginUser(UserLoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        String token = jwtUtil.generateToken(
                user.getUserId().longValue(),
                user.getEmail(),
                user.getRole().getRoleName()
        );

        return new LoginResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().getRoleName(),
                token
        );
    }

    // Get User Profile
    public UserProfileResponse getUserProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getCity(),
                user.getRole().getRoleName(),
                user.getStatus()
        );
    }

    // Admin - Get All Users
    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new AdminUserResponse(
                        user.getUserId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getCity(),
                        user.getRole().getRoleName(),
                        user.getStatus()
                ))
                .toList();
    }

    // Admin - Get All Owners
    public List<AdminUserResponse> getAllOwners() {

        return userRepository.findByRole_RoleName("OWNER")
                .stream()
                .map(user -> new AdminUserResponse(
                        user.getUserId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getCity(),
                        user.getRole().getRoleName(),
                        user.getStatus()
                ))
                .toList();
    }

    // Forgot Password
    public String forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return "Email not found";
        }

        // Generate 6-digit OTP
        String otp = String.valueOf(
                100000 + new java.security.SecureRandom().nextInt(900000)
        );

        // Store OTP
        otpStorage.put(user.getEmail(), otp);

        // OTP expires after 60 seconds
        otpExpiryStorage.put(
                user.getEmail(),
                System.currentTimeMillis() + 60_000
        );

        // Send OTP to registered email
        try {
            emailService.sendOtpEmail(user.getEmail(), otp);

            return "OTP sent successfully to your registered email";

        } catch (Exception e) {

            otpStorage.remove(user.getEmail());
            otpExpiryStorage.remove(user.getEmail());

            System.err.println(
                    "Failed to send OTP email: " + e.getMessage()
            );

            return "Failed to send OTP email. Please try again.";
        }
    }

    // Verify OTP
    public String verifyOtp(OtpVerifyRequest request) {

        String email = request.getEmail();
        String storedOtp = otpStorage.get(email);
        Long expiryTime = otpExpiryStorage.get(email);

        if (storedOtp == null) {
            return "OTP not found or expired";
        }

        // Check OTP expiry
        if (expiryTime == null ||
                System.currentTimeMillis() >= expiryTime) {

            otpStorage.remove(email);
            otpExpiryStorage.remove(email);

            return "OTP expired. Please request a new OTP.";
        }

        // Check OTP correctness
        if (!storedOtp.equals(request.getOtp())) {
            return "Invalid OTP";
        }

        return "OTP verified successfully";
    }

    // Reset Password
    public String resetPassword(ResetPasswordRequest request) {

        String email = request.getEmail();
        String storedOtp = otpStorage.get(email);
        Long expiryTime = otpExpiryStorage.get(email);

        if (storedOtp == null) {
            return "OTP verification required";
        }

        // Check OTP expiry before password reset
        if (expiryTime == null ||
                System.currentTimeMillis() >= expiryTime) {

            otpStorage.remove(email);
            otpExpiryStorage.remove(email);

            return "OTP expired. Please request a new OTP.";
        }

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            return "New password and confirm password do not match";
        }

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return "Email not found";
        }

        user.setPassword(request.getNewPassword());

        userRepository.save(user);

        // Remove OTP after successful password reset
        otpStorage.remove(email);
        otpExpiryStorage.remove(email);

        return "Password reset successfully";
    }

    // Admin - Delete Owner
    @Transactional
    public void deleteOwner(Long userId) {

        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // Only OWNER can be deleted here
        if (!"OWNER".equals(owner.getRole().getRoleName())) {
            throw new RuntimeException("This user is not an OWNER");
        }

        // Find all properties of this owner
        List<Property> properties =
                propertyRepository.findByOwner_UserId(userId);

        // Delete property-related data
        for (Property property : properties) {

            Long propertyId = property.getPropertyId();

            // Delete rental requests
            rentalRequestRepository
                    .deleteByProperty_PropertyId(propertyId);

            // Delete favorites
            favoriteRepository
                    .deleteByProperty_PropertyId(propertyId);

            // Delete complaints
            complaintRepository
                    .deleteByProperty_PropertyId(propertyId);

            // Delete property images
            List<PropertyImage> images =
                    propertyImageRepository
                            .findByProperty_PropertyId(propertyId);

            propertyImageRepository.deleteAll(images);

            // Delete property videos
            List<PropertyVideo> videos =
                    propertyVideoRepository
                            .findByProperty_PropertyId(propertyId);

            propertyVideoRepository.deleteAll(videos);

            // Delete property
            propertyRepository.delete(property);
        }

        // Finally delete owner
        userRepository.delete(owner);
    }

    // Admin - Delete User
    @Transactional
    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String roleName = user.getRole().getRoleName();

        // ADMIN cannot be deleted
        if ("ADMIN".equals(roleName)) {
            throw new RuntimeException("Admin user cannot be deleted");
        }

        // OWNER should be deleted from Manage Owners
        if ("OWNER".equals(roleName)) {
            throw new RuntimeException(
                    "Owner cannot be deleted from Manage Users. Please use Manage Owners."
            );
        }

        // Delete user's rental requests
        List<com.zerobroker.entity.RentalRequest> rentalRequests =
                rentalRequestRepository.findByUser_UserId(userId);

        rentalRequestRepository.deleteAll(rentalRequests);

        // Delete user's favorites
        List<com.zerobroker.entity.Favorite> favorites =
                favoriteRepository.findByUser_UserId(userId);

        favoriteRepository.deleteAll(favorites);

        // Delete user's complaints
        List<com.zerobroker.entity.Complaint> complaints =
                complaintRepository.findByUser_UserId(userId);

        complaintRepository.deleteAll(complaints);

        // Finally delete user
        userRepository.delete(user);
    }
}
