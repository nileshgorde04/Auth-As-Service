# Auth-as-a-Service Backend Implementation Plan

Based on the analysis of the frontend structure, this document outlines the necessary backend components to support the authentication and authorization features.

## Required API Endpoints

### Authentication Endpoints
1. **POST /api/auth/register**
   - Creates a new user account
   - Request: `{ email, password, role (optional) }`
   - Response: `{ id, email, role, token }`

2. **POST /api/auth/login**
   - Authenticates a user with email/password
   - Request: `{ email, password }`
   - Response: `{ id, email, role, token }`

3. **POST /api/auth/logout**
   - Invalidates the current user's token
   - Request: `{ token }`
   - Response: `{ success: true }`

4. **POST /api/auth/refresh-token**
   - Refreshes an expired JWT token
   - Request: `{ refreshToken }`
   - Response: `{ token, refreshToken }`

5. **POST /api/auth/reset-password/request**
   - Initiates password reset process
   - Request: `{ email }`
   - Response: `{ success: true }`

6. **POST /api/auth/reset-password/confirm**
   - Completes password reset with token
   - Request: `{ token, newPassword }`
   - Response: `{ success: true }`

### OAuth Endpoints
1. **GET /api/auth/oauth2/google**
   - Initiates Google OAuth2 authentication flow
   - Redirects to Google login

2. **GET /api/auth/oauth2/github**
   - Initiates GitHub OAuth2 authentication flow
   - Redirects to GitHub login

3. **GET /api/auth/oauth2/callback/{provider}**
   - OAuth2 callback endpoint
   - Handles the OAuth provider's response
   - Redirects to frontend with token

### User Management Endpoints
1. **GET /api/users/me**
   - Gets current user profile
   - Response: `{ id, email, role, provider, avatar, lastLogin }`

2. **PUT /api/users/me**
   - Updates current user profile
   - Request: `{ email, avatar }`
   - Response: `{ id, email, role, provider, avatar }`

3. **GET /api/users**
   - Admin only: Lists all users
   - Response: `[{ id, email, role, provider, status, lastLogin }]`

4. **GET /api/users/{id}**
   - Admin only: Gets specific user details
   - Response: `{ id, email, role, provider, status, lastLogin }`

5. **PUT /api/users/{id}/role**
   - Admin only: Updates user role
   - Request: `{ role }`
   - Response: `{ success: true }`

6. **PUT /api/users/{id}/status**
   - Admin only: Activates/suspends user
   - Request: `{ status }`
   - Response: `{ success: true }`

7. **DELETE /api/users/{id}/tokens**
   - Admin only: Revokes user tokens
   - Response: `{ success: true }`

### Activity Logs Endpoints
1. **GET /api/logs**
   - Admin only: Gets system activity logs
   - Response: `[{ id, action, user, timestamp, ip }]`

2. **GET /api/users/me/activity**
   - Gets current user's activity logs
   - Response: `[{ action, timestamp, ip }]`

## Required Entities

### User Entity
```java
public class User {
    private String id;
    private String email;
    private String password; // Hashed
    private Role role;       // ADMIN, USER
    private String provider; // EMAIL, GOOGLE, GITHUB
    private UserStatus status; // ACTIVE, SUSPENDED
    private String avatar;
    private Date lastLogin;
    private Date createdAt;
    private Date updatedAt;
}
```

### Token Entity
```java
public class Token {
    private String id;
    private String userId;
    private String value;
    private TokenType type; // ACCESS, REFRESH, RESET_PASSWORD
    private Date expiresAt;
    private Date createdAt;
    private boolean revoked;
}
```

### Role Entity
```java
public enum Role {
    ADMIN,
    USER
}
```

### ActivityLog Entity
```java
public class ActivityLog {
    private String id;
    private String userId;
    private String action;
    private String ipAddress;
    private Date timestamp;
    private Map<String, Object> details;
}
```

## Data Flow Between Frontend and Backend

### Authentication Flow
1. User submits login/signup form
2. Backend validates credentials
3. Backend generates JWT token with user role and permissions
4. Frontend stores token in localStorage
5. Frontend includes token in Authorization header for subsequent requests
6. Backend validates token for protected routes
7. Token expiration handled by refresh token mechanism

### OAuth2 Flow
1. User clicks OAuth provider button (Google/GitHub)
2. Frontend redirects to `/api/auth/oauth2/{provider}`
3. Backend redirects to OAuth provider login
4. User authenticates with provider
5. Provider redirects to `/api/auth/oauth2/callback/{provider}`
6. Backend processes OAuth response, creates/updates user
7. Backend generates JWT token
8. Backend redirects to frontend with token
9. Frontend stores token and user info

### Role-Based Access
1. JWT token contains user role (ADMIN, USER)
2. Frontend conditionally renders components based on role
3. Backend validates role for protected endpoints
4. Admin-only endpoints return 403 Forbidden for non-admin users

## Authentication & Authorization Middleware

### JWT Authentication Filter
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // Intercepts requests, validates JWT token
    // Sets authenticated user in SecurityContext
}
```

### Role-Based Authorization
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Configure endpoint access based on roles
    // /api/users/** - ADMIN only
    // /api/logs - ADMIN only
    // /api/users/me/** - Authenticated users
}
```

### CORS Configuration
```java
@Configuration
public class CorsConfig {
    // Configure CORS to allow frontend domain
}
```

## OAuth2 Implementation

### OAuth2 Client Configuration
```java
@Configuration
public class OAuth2Config {
    // Configure OAuth2 clients (Google, GitHub)
    // Set redirect URIs
    // Set scopes (email, profile)
}
```

### OAuth2 Success Handler
```java
@Component
public class OAuth2AuthenticationSuccessHandler {
    // Handle successful OAuth2 authentication
    // Generate JWT token
    // Redirect to frontend with token
}
```

## Required Dependencies

```xml
<!-- Spring Web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Database (PostgreSQL or MySQL) -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>

<!-- JWT Support -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
</dependency>

<!-- OAuth2 Client -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- Lombok (optional) -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

## Security Considerations

1. **Password Storage**: Use BCrypt for password hashing
2. **JWT Security**: 
   - Short expiration time for access tokens (15-30 minutes)
   - Longer expiration for refresh tokens (7-30 days)
   - Include only necessary claims in tokens
3. **CSRF Protection**: Implement for cookie-based authentication
4. **Rate Limiting**: Prevent brute force attacks on login/signup endpoints
5. **Input Validation**: Validate all user inputs
6. **Role Assignment**: Only allow admins to create other admins
7. **Token Revocation**: Implement blacklisting for compromised tokens
8. **Audit Logging**: Log all authentication and authorization events

## Implementation Phases

1. **Phase 1**: Basic Authentication
   - User registration and login
   - JWT token generation and validation
   - Protected routes

2. **Phase 2**: OAuth Integration
   - Google OAuth2 integration
   - GitHub OAuth2 integration
   - Provider-based user creation

3. **Phase 3**: User Management
   - User profile management
   - Admin dashboard functionality
   - Role-based access control

4. **Phase 4**: Advanced Features
   - Password reset
   - Account suspension
   - Activity logging
   - Token revocation