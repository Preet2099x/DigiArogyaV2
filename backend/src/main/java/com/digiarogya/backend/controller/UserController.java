package com.digiarogya.backend.controller;

import com.digiarogya.backend.dto.CreateUserRequest;
import com.digiarogya.backend.dto.UserResponse;
import com.digiarogya.backend.entity.User;
import com.digiarogya.backend.service.UserService;
import com.digiarogya.backend.dto.LoginRequest;
import com.digiarogya.backend.security.JwtUtil;

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
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        return new UserResponse(
                user.getId(),
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
                "role", user.getRole().name()
        );
    }
}
