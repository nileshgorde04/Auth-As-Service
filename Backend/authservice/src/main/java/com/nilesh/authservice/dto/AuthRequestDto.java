package com.nilesh.authservice.dto;

import lombok.Data;

@Data
public class AuthRequestDto {
    private String email;
    private String password;
    private String confirmPassword;
    private String role; // ADMIN or USER
}