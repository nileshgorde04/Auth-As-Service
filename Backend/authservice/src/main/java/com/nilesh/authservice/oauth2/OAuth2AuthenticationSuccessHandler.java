package com.nilesh.authservice.oauth2;

import com.nilesh.authservice.model.CustomOAuth2User;
import com.nilesh.authservice.model.User;
import com.nilesh.authservice.repository.UserRepository;
import com.nilesh.authservice.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;


public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final String redirectUri;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public OAuth2AuthenticationSuccessHandler(String redirectUri, JwtService jwtService, UserRepository userRepository) {
        this.redirectUri = redirectUri;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        User user = userRepository.findByEmail(oAuth2User.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(user);

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .build().toUriString();

        response.sendRedirect(targetUrl);
    }
}
