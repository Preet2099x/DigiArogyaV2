package com.digiarogya.backend.service;

import com.digiarogya.backend.entity.User;
import com.digiarogya.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(String email, String password, String role) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);

        return userRepository.save(user);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}