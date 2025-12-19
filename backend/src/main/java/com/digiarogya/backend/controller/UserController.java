package com.digiarogya.backend.controller;

import com.digiarogya.backend.dto.CreateUserRequest;
import com.digiarogya.backend.dto.UserResponse;
import com.digiarogya.backend.entity.User;
import com.digiarogya.backend.service.UserService;


import org.springframework.web.bind.annotation.*;
//import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

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

//    @GetMapping
//    public User getUserByEmail(@RequestParam String email) {
//        Optional<User> user = userService.getUserByEmail(email);
//        return user.orElse(null);
//    }
}
