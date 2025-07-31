package com.nilesh.authservice.repository;

import com.nilesh.authservice.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, String> {
    List<ActivityLog> findByUserOrderByTimestampDesc(com.nilesh.authservice.model.User user);
}