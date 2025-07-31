package com.nilesh.authservice.controller;

import com.nilesh.authservice.dto.UserDto;
import com.nilesh.authservice.model.User;
import com.nilesh.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.nilesh.authservice.dto.UpdateAvatarDto;
import com.nilesh.authservice.dto.ChangePasswordDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import com.nilesh.authservice.service.ActivityLogService;
import jakarta.servlet.http.HttpServletRequest;
import com.nilesh.authservice.model.ActivityLog;
import com.nilesh.authservice.repository.ActivityLogRepository;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private final ActivityLogRepository activityLogRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(convertToDto(user));
    }

    @PutMapping("/me/avatar")
    public ResponseEntity<UserDto> updateAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateAvatarDto avatarDto) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAvatar(avatarDto.getAvatar());
        userRepository.save(user);

        return ResponseEntity.ok(convertToDto(user));
    }

    private final PasswordEncoder passwordEncoder;

    // ... add this new method
    @PostMapping("/me/password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordDto passwordDto, HttpServletRequest request) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Check if the current password is correct
        if (!passwordEncoder.matches(passwordDto.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect current password");
        }

        // 2. Check if the new passwords match
        if (!passwordDto.getNewPassword().equals(passwordDto.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("New passwords do not match");
        }

        // 3. Update the password
        user.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
        userRepository.save(user);
        activityLogService.logActivity(user, "PASSWORD_CHANGE", request.getRemoteAddr(), "User changed their password.");


        return ResponseEntity.ok("Password changed successfully");
    }

    @GetMapping("/me/activity")
    public ResponseEntity<List<ActivityLog>> getCurrentUserActivity(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(activityLogRepository.findByUserOrderByTimestampDesc(user));
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole());
        userDto.setProvider(user.getProvider());
        userDto.setStatus(user.getStatus());
        userDto.setLastLogin(user.getLastLogin());
        userDto.setAvatar(user.getAvatar());
        return userDto;
    }
}