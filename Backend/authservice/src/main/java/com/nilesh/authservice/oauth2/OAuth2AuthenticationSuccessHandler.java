package com.nilesh.authservice.oauth2;

import com.nilesh.authservice.model.*;
import com.nilesh.authservice.repository.UserRepository;
import com.nilesh.authservice.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
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
        String email = oAuth2User.getEmail();

        // === START: ADD THIS BLOCK TO HANDLE GITHUB'S NULL EMAIL ===
        if (email == null) {
            String registrationId = ((org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken) authentication)
                    .getAuthorizedClientRegistrationId();

            if ("github".equalsIgnoreCase(registrationId)) {
                // Redirect to the login page with a specific error for GitHub
                String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/")
                        .queryParam("error", "Unable to get email from GitHub. Please set a public email in your GitHub profile.")
                        .build().toUriString();
                response.sendRedirect(targetUrl);
                return;
            }
        }
        // === END: GITHUB FIX ===

        String registrationId = ((org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken) authentication)
                .getAuthorizedClientRegistrationId();

        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());

        // Find user by email. If not present, create a new one.
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewUser(email, provider));

        // Update provider if user exists but logged in with a new OAuth method
        if (user.getProvider() != provider) {
            user.setProvider(provider);
            userRepository.save(user);
        }

        String token = jwtService.generateToken(user);

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .build().toUriString();

        response.sendRedirect(targetUrl);
    }

    private User createNewUser(String email, AuthProvider provider) {
        User newUser = User.builder()
                .email(email)
                .role(Role.USER) // Default role for all new OAuth users
                .provider(provider)
                .status(UserStatus.ACTIVE)
                .build();
        return userRepository.save(newUser);
    }
}