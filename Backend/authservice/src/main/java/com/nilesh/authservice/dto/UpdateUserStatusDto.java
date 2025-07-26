package com.nilesh.authservice.dto;

import com.nilesh.authservice.model.UserStatus;
import lombok.Data;

@Data
public class UpdateUserStatusDto {
    private UserStatus status;
}