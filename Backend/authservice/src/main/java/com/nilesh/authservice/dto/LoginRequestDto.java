package com.nilesh.authservice.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String email;
    private String password;
}
