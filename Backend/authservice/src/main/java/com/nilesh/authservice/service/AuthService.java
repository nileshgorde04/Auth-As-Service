package com.nilesh.authservice.service;

import com.nilesh.authservice.dto.AuthRequestDto;
import com.nilesh.authservice.dto.AuthResponseDto;
import com.nilesh.authservice.model.*;
import com.nilesh.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponseDto register(AuthRequestDto request) {

        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        Role role = Role.valueOf(request.getRole().toUpperCase());

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .provider(AuthProvider.EMAIL)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);

        String jwt = jwtService.generateToken(user);
        return new AuthResponseDto(jwt);
    }
}