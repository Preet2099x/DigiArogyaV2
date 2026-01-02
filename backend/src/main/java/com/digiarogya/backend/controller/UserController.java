package com.digiarogya.backend.controller;

import com.digiarogya.backend.dto.ChangePasswordRequest;
import com.digiarogya.backend.dto.CreateUserRequest;
import com.digiarogya.backend.dto.UpdateProfileRequest;
import com.digiarogya.backend.dto.UserResponse;
import com.digiarogya.backend.entity.User;
import com.digiarogya.backend.service.UserService;
import com.digiarogya.backend.dto.LoginRequest;
import com.digiarogya.backend.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // CREATE USER (unchanged)
    // =========================
    @PostMapping
    public UserResponse createUser(@RequestBody CreateUserRequest request) {

        User user = userService.createUser(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    // =========================
    // LOGIN (JWT ADDED)
    // =========================

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {


        User user = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        String token = JwtUtil.generateToken(user);

        return Map.of(
                "token", token,
                "userId", user.getId(),
                "name", user.getName(),
                "role", user.getRole().name()
        );
    }

    // =========================
    // GET CURRENT USER
    // =========================
    @GetMapping("/me")
    public UserResponse getCurrentUser(HttpServletRequest request) {
        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        User user = userService.getUser(userId);
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    // =========================
    // UPDATE PROFILE
    // =========================
    @PutMapping("/me")
    public UserResponse updateProfile(HttpServletRequest request, @RequestBody UpdateProfileRequest updateRequest) {
        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        User user = userService.updateProfile(userId, updateRequest.getName());
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    // =========================
    // CHANGE PASSWORD
    // =========================
    @PutMapping("/me/password")
    public void changePassword(HttpServletRequest request, @RequestBody ChangePasswordRequest changePasswordRequest) {
        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        userService.changePassword(
                userId,
                changePasswordRequest.getOldPassword(),
                changePasswordRequest.getNewPassword()
        );
    }
}
