package com.nilesh.authservice.controller;

import com.nilesh.authservice.dto.UpdateUserStatusDto;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.nilesh.authservice.dto.UserDto;
import com.nilesh.authservice.model.User;
import com.nilesh.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nilesh.authservice.dto.UpdateUserStatusDto;
import java.util.List;
import java.util.stream.Collectors;
import com.nilesh.authservice.model.ActivityLog;
import com.nilesh.authservice.repository.ActivityLogRepository;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;

    /**
     * Endpoint to get a list of all users.
     * This endpoint is restricted to users with the 'ADMIN' role.
     * It returns a list of UserDto objects to avoid exposing sensitive entity information.
     *
     * @return A ResponseEntity containing a list of UserDto objects.
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        // Fetch all user entities from the database
        List<User> users = userRepository.findAll();

        // Convert the list of User entities to a list of UserDto objects
        List<UserDto> userDtos = users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDtos);
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserDto> updateUserStatus(@PathVariable String id, @RequestBody UpdateUserStatusDto statusDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setStatus(statusDto.getStatus());
        userRepository.save(user);

        return ResponseEntity.ok(convertToDto(user));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<ActivityLog>> getAllLogs() {
        return ResponseEntity.ok(activityLogRepository.findAll());
    }
    /**
     * A private helper method to convert a User entity to a UserDto.
     * This ensures that sensitive data (like the password hash) is not included in the API response.
     *
     * @param user The User entity to convert.
     * @return A UserDto object containing only the data safe to expose.
     */
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