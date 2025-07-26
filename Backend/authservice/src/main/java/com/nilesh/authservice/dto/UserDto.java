package com.nilesh.authservice.dto;

import com.nilesh.authservice.model.AuthProvider;
import com.nilesh.authservice.model.Role;
import com.nilesh.authservice.model.UserStatus;
import lombok.Data;

import java.util.Date;

@Data
public class UserDto {
    private String id;
    private String email;
    private Role role;
    private AuthProvider provider;
    private UserStatus status;
    private Date lastLogin;
    private String avatar;
}