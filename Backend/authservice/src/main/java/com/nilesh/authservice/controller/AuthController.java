package com.nilesh.authservice.controller;

import com.nilesh.authservice.dto.AuthRequestDto;
import com.nilesh.authservice.dto.AuthResponseDto;
import com.nilesh.authservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody AuthRequestDto request) {
        return ResponseEntity.ok(authService.register(request));
    }
}
