package com.digiarogya.backend.controller;

import com.digiarogya.backend.entity.User;
import com.digiarogya.backend.service.UserService;

import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User createUser(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String role
    ) {
        return userService.createUser(email, password, role);
    }

    @GetMapping
    public User getUserByEmail(@RequestParam String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.orElse(null);
    }
}
