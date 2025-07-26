package com.nilesh.authservice.config;

import com.nilesh.authservice.oauth2.CustomOAuth2UserService;
import com.nilesh.authservice.oauth2.OAuth2AuthenticationFailureHandler;
import com.nilesh.authservice.oauth2.OAuth2AuthenticationSuccessHandler;
import com.nilesh.authservice.repository.UserRepository;
import com.nilesh.authservice.service.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

    @Value("${oauth2.authorized-redirect-uri}")
    private String authorizedRedirectUri;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler(
            JwtService jwtService, UserRepository userRepository) {
        return new OAuth2AuthenticationSuccessHandler(authorizedRedirectUri, jwtService, userRepository);
    }

    @Bean
    public OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler() {
        return new OAuth2AuthenticationFailureHandler();
    }

    @Bean
    public CustomOAuth2UserService customOAuth2UserService() {
        return new CustomOAuth2UserService();
    }
}