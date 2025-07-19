package com.nilesh.authservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        // You can add more sophisticated logging here
        System.err.println("An exception occurred: " + ex.getMessage());

        // Return a proper JSON error response with a 401 Unauthorized status
        return new ResponseEntity<>(
                Map.of("message", ex.getMessage()),
                HttpStatus.UNAUTHORIZED
        );
    }
}