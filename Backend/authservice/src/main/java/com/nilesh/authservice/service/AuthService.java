package com.nilesh.authservice.service;

import com.nilesh.authservice.dto.AuthRequestDto;
import com.nilesh.authservice.dto.AuthResponseDto;
import com.nilesh.authservice.dto.LoginRequestDto;
import com.nilesh.authservice.model.*;
import com.nilesh.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ActivityLogService activityLogService;

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
        return new AuthResponseDto(
                jwt,
                user.getEmail(),
                user.getRole().name(),
                user.getProvider().name()
        );
    }

    public AuthResponseDto login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (user.getProvider() != AuthProvider.EMAIL) {
            throw new RuntimeException("Please login using " + user.getProvider().name());
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String jwt = jwtService.generateToken(user);
        user.setLastLogin(new Date());
        userRepository.save(user);
        HttpServletRequest httpRequest = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        activityLogService.logActivity(user, "USER_LOGIN", httpRequest.getRemoteAddr(), "User logged in successfully.");
        return new AuthResponseDto(
                jwt,
                user.getEmail(),
                user.getRole().name(),
                user.getProvider().name()
        );
    }

}