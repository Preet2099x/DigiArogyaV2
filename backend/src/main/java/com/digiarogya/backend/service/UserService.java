package com.digiarogya.backend.service;

import com.digiarogya.backend.entity.Role;
import com.digiarogya.backend.entity.User;
import com.digiarogya.backend.repository.UserRepository;
import com.digiarogya.backend.exception.InvalidCredentialsException;
import com.digiarogya.backend.exception.DuplicateEmailException;
import com.digiarogya.backend.exception.ValidationException;


import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(String name, String email, String password, Role role) {
        // Validate name is not null or empty
        if (name == null || name.trim().isEmpty()) {
            throw new ValidationException("Name is required");
        }
        
        // Check if user with email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateEmailException(email);
        }
        
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        return userRepository.save(user);
    }

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return user;
    }


    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}