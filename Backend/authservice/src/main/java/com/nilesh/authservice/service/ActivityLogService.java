package com.nilesh.authservice.service;

import com.nilesh.authservice.model.ActivityLog;
import com.nilesh.authservice.model.User;
import com.nilesh.authservice.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public void logActivity(User user, String action, String ipAddress, String details) {
        ActivityLog log = ActivityLog.builder()
                .user(user)
                .action(action)
                .ipAddress(ipAddress)
                .details(details)
                .build();
        activityLogRepository.save(log);
    }
}