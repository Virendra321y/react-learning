# React + Spring Boot Backend Integration Guide

## Project Overview

This document provides a complete backend specification for the React Learning Project using **Spring Boot**. It includes all necessary APIs, request/response payloads, database design, and implementation roadmap.

---

## Part 1: Backend Architecture Overview

### Technology Stack (Spring Boot)
```
Framework: Spring Boot 3.x
Java Version: 17+
Build Tool: Maven/Gradle
Database: PostgreSQL (Recommended)
ORM: Spring Data JPA/Hibernate
Security: Spring Security + JWT
Validation: Spring Validation (Bean Validation)
Testing: JUnit 5 + Mockito
Documentation: Springdoc OpenAPI (Swagger)
```

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────┐
│              React Frontend                              │
└─────────────────────────────────────────────────────────┘
                        ↑
                   (HTTP/REST)
                        ↓
┌─────────────────────────────────────────────────────────┐
│            Spring Boot API Gateway                        │
│  (Controllers → Services → Repositories)                 │
└─────────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
    PostgreSQL    JWT Auth        File Storage
    Database      (Security)       (Optional)
```

---

## Part 2: Database Design

### Entity Relationship Diagram

```
┌──────────────────┐
│      Users       │
├──────────────────┤
│ id (PK)          │
│ username (UQ)    │
│ email (UQ)       │
│ password         │
│ firstName        │
│ lastName         │
│ phone            │
│ avatar           │
│ role             │
│ status           │
│ createdAt        │
│ updatedAt        │
└──────────────────┘
        │
        ├──────────────┬──────────────┐
        ↓              ↓              ↓
   ┌─────────┐  ┌──────────┐  ┌──────────────┐
   │  Posts  │  │ Comments │  │  UserRoles   │
   └─────────┘  └──────────┘  └──────────────┘
```

### Database Tables

#### 1. Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

#### 2. Posts Table
```sql
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

#### 3. Comments Table
```sql
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```

#### 4. User Roles Table (Authorization)
```sql
CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
```

---

## Part 3: API Specifications

### Total APIs Required: **22 Endpoints**

---

## Category 1: Authentication APIs (4 Endpoints)

### 1.1 User Registration
**Endpoint**: `POST /api/v1/auth/register`

**Request Payload:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-0123"
}
```

**Validation Rules:**
- Username: 3-50 characters, alphanumeric + underscore
- Email: Valid email format, unique
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- Phone: Valid phone format (optional)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "status": "ACTIVE",
    "createdAt": "2025-12-01T10:00:00Z"
  },
  "timestamp": "2025-12-01T10:00:00Z"
}
```

**Error Response (400/409):**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "Email already registered",
    "details": [
      {
        "field": "email",
        "message": "Email must be unique"
      }
    ]
  },
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 1.2 User Login
**Endpoint**: `POST /api/v1/auth/login`

**Request Payload:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "avatar": null
    },
    "expiresIn": 3600
  },
  "timestamp": "2025-12-01T10:00:00Z"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  },
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 1.3 Token Refresh
**Endpoint**: `POST /api/v1/auth/refresh-token`

**Request Payload:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 1.4 Logout
**Endpoint**: `POST /api/v1/auth/logout`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

## Category 2: User Management APIs (8 Endpoints)

### 2.1 Get All Users (Paginated)
**Endpoint**: `GET /api/v1/users?page=0&size=10&sort=createdAt,desc`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1-555-0123",
        "avatar": "https://example.com/avatars/1.jpg",
        "role": "USER",
        "status": "ACTIVE",
        "createdAt": "2025-12-01T10:00:00Z",
        "updatedAt": "2025-12-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 10,
      "totalElements": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrevious": false
    }
  },
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 2.2 Get User by ID
**Endpoint**: `GET /api/v1/users/{userId}`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-0123",
    "avatar": "https://example.com/avatars/1.jpg",
    "role": "USER",
    "status": "ACTIVE",
    "posts": [
      {
        "id": 1,
        "title": "My First Post",
        "createdAt": "2025-12-01T10:00:00Z"
      }
    ],
    "createdAt": "2025-12-01T10:00:00Z",
    "updatedAt": "2025-12-01T10:00:00Z"
  },
  "timestamp": "2025-12-01T10:00:00Z"
}
```

---

### 2.3 Update User Profile
**Endpoint**: `PUT /api/v1/users/{userId}`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Payload:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1-555-0456",
  "avatar": "https://example.com/avatars/new-avatar.jpg"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1-555-0456",
    "avatar": "https://example.com/avatars/new-avatar.jpg",
    "updatedAt": "2025-12-01T11:00:00Z"
  },
  "timestamp": "2025-12-01T11:00:00Z"
}
```

---

### 2.4 Update User Password
**Endpoint**: `PUT /api/v1/users/{userId}/password`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Payload:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
```

**Validation Rules:**
- Current password must match existing password
- New password must differ from current password
- New password must meet complexity requirements
- Passwords must match

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "timestamp": "2025-12-01T11:00:00Z"
}
```

---

### 2.5 Search Users
**Endpoint**: `GET /api/v1/users/search?q=john&page=0&size=10`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Search results",
  "data": {
    "content": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://example.com/avatars/1.jpg"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 10,
      "totalElements": 1,
      "totalPages": 1
    }
  },
  "timestamp": "2025-12-01T11:00:00Z"
}
```

---

### 2.6 Get Current User Profile
**Endpoint**: `GET /api/v1/users/me`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Current user retrieved successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-0123",
    "avatar": "https://example.com/avatars/1.jpg",
    "role": "USER",
    "status": "ACTIVE",
    "createdAt": "2025-12-01T10:00:00Z"
  },
  "timestamp": "2025-12-01T11:00:00Z"
}
```

---

### 2.7 Delete User (Soft Delete)
**Endpoint**: `DELETE /api/v1/users/{userId}`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "timestamp": "2025-12-01T11:00:00Z"
}
```

---

### 2.8 Get User Statistics
**Endpoint**: `GET /api/v1/users/{userId}/statistics`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User statistics retrieved",
  "data": {
    "userId": 1,
    "totalPosts": 15,
    "totalComments": 42,
    "totalLikes": 120,
    "accountAge": 180,
    "lastLoginAt": "2025-12-01T08:30:00Z",
    "accountStatus": "ACTIVE"
  },
  "timestamp": "2025-12-01T11:00:00Z"
}
```

---

## Category 3: Posts Management APIs (6 Endpoints)

### 3.1 Create Post
**Endpoint**: `POST /api/v1/posts`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Payload:**
```json
{
  "title": "Learning React with Spring Boot",
  "content": "This is a comprehensive guide to building modern web applications...",
  "status": "PUBLISHED"
}
```

**Validation Rules:**
- Title: 5-255 characters, required
- Content: Min 10 characters, required
- Status: DRAFT, PUBLISHED, ARCHIVED

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": 1,
    "title": "Learning React with Spring Boot",
    "content": "This is a comprehensive guide...",
    "status": "PUBLISHED",
    "author": {
      "id": 1,
      "username": "john_doe",
      "avatar": "https://example.com/avatars/1.jpg"
    },
    "createdAt": "2025-12-01T12:00:00Z",
    "updatedAt": "2025-12-01T12:00:00Z"
  },
  "timestamp": "2025-12-01T12:00:00Z"
}
```

---

### 3.2 Get All Posts (Paginated)
**Endpoint**: `GET /api/v1/posts?page=0&size=10&status=PUBLISHED&sort=createdAt,desc`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Learning React with Spring Boot",
        "content": "This is a comprehensive guide...",
        "status": "PUBLISHED",
        "author": {
          "id": 1,
          "username": "john_doe"
        },
        "commentCount": 5,
        "createdAt": "2025-12-01T12:00:00Z",
        "updatedAt": "2025-12-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 10,
      "totalElements": 50,
      "totalPages": 5,
      "hasNext": true
    }
  },
  "timestamp": "2025-12-01T12:00:00Z"
}
```

---

### 3.3 Get Post by ID
**Endpoint**: `GET /api/v1/posts/{postId}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "id": 1,
    "title": "Learning React with Spring Boot",
    "content": "This is a comprehensive guide...",
    "status": "PUBLISHED",
    "author": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatars/1.jpg"
    },
    "comments": [
      {
        "id": 1,
        "content": "Great post!",
        "author": {
          "id": 2,
          "username": "jane_doe"
        },
        "createdAt": "2025-12-01T13:00:00Z"
      }
    ],
    "createdAt": "2025-12-01T12:00:00Z",
    "updatedAt": "2025-12-01T12:00:00Z"
  },
  "timestamp": "2025-12-01T12:00:00Z"
}
```

---

### 3.4 Update Post
**Endpoint**: `PUT /api/v1/posts/{postId}`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Payload:**
```json
{
  "title": "Updated: Learning React with Spring Boot",
  "content": "Updated content goes here...",
  "status": "PUBLISHED"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": 1,
    "title": "Updated: Learning React with Spring Boot",
    "content": "Updated content goes here...",
    "status": "PUBLISHED",
    "updatedAt": "2025-12-01T14:00:00Z"
  },
  "timestamp": "2025-12-01T14:00:00Z"
}
```

---

### 3.5 Delete Post
**Endpoint**: `DELETE /api/v1/posts/{postId}`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "timestamp": "2025-12-01T14:00:00Z"
}
```

---

### 3.6 Get Posts by User
**Endpoint**: `GET /api/v1/users/{userId}/posts?page=0&size=10`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User posts retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Learning React with Spring Boot",
        "status": "PUBLISHED",
        "commentCount": 5,
        "createdAt": "2025-12-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 10,
      "totalElements": 15,
      "totalPages": 2
    }
  },
  "timestamp": "2025-12-01T14:00:00Z"
}
```

---

## Category 4: Comments Management APIs (4 Endpoints)

### 4.1 Create Comment
**Endpoint**: `POST /api/v1/posts/{postId}/comments`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Payload:**
```json
{
  "content": "Great tutorial! Very helpful and easy to understand."
}
```

**Validation Rules:**
- Content: 1-5000 characters, required
- Post must exist

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": 1,
    "content": "Great tutorial! Very helpful...",
    "author": {
      "id": 2,
      "username": "jane_doe",
      "avatar": "https://example.com/avatars/2.jpg"
    },
    "postId": 1,
    "createdAt": "2025-12-01T13:00:00Z"
  },
  "timestamp": "2025-12-01T13:00:00Z"
}
```

---

### 4.2 Get Comments for Post
**Endpoint**: `GET /api/v1/posts/{postId}/comments?page=0&size=20&sort=createdAt,desc`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "content": "Great tutorial!",
        "author": {
          "id": 2,
          "username": "jane_doe",
          "avatar": "https://example.com/avatars/2.jpg"
        },
        "createdAt": "2025-12-01T13:00:00Z",
        "updatedAt": "2025-12-01T13:00:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 42,
      "totalPages": 3
    }
  },
  "timestamp": "2025-12-01T13:00:00Z"
}
```

---

### 4.3 Update Comment
**Endpoint**: `PUT /api/v1/comments/{commentId}`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Payload:**
```json
{
  "content": "Updated comment: Excellent tutorial! Very helpful..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "id": 1,
    "content": "Updated comment: Excellent tutorial!",
    "updatedAt": "2025-12-01T14:00:00Z"
  },
  "timestamp": "2025-12-01T14:00:00Z"
}
```

---

### 4.4 Delete Comment
**Endpoint**: `DELETE /api/v1/comments/{commentId}`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "timestamp": "2025-12-01T14:00:00Z"
}
```

---

## Part 4: Spring Boot Project Structure

```
spring-boot-backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/learning/
│   │   │   ├── config/                      # Configuration classes
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── JwtConfig.java
│   │   │   │   └── CorsConfig.java
│   │   │   │
│   │   │   ├── controller/                  # REST Controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── UserController.java
│   │   │   │   ├── PostController.java
│   │   │   │   └── CommentController.java
│   │   │   │
│   │   │   ├── service/                     # Business Logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── UserService.java
│   │   │   │   ├── PostService.java
│   │   │   │   └── CommentService.java
│   │   │   │
│   │   │   ├── repository/                  # Data Access
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── PostRepository.java
│   │   │   │   └── CommentRepository.java
│   │   │   │
│   │   │   ├── entity/                      # JPA Entities
│   │   │   │   ├── User.java
│   │   │   │   ├── Post.java
│   │   │   │   ├── Comment.java
│   │   │   │   └── UserRole.java
│   │   │   │
│   │   │   ├── dto/                         # Data Transfer Objects
│   │   │   │   ├── request/
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── CreatePostRequest.java
│   │   │   │   │   └── CreateCommentRequest.java
│   │   │   │   └── response/
│   │   │   │       ├── UserResponse.java
│   │   │   │       ├── PostResponse.java
│   │   │   │       ├── AuthResponse.java
│   │   │   │       └── CommentResponse.java
│   │   │   │
│   │   │   ├── exception/                   # Custom Exceptions
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── DuplicateEmailException.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │
│   │   │   ├── security/                    # JWT & Security
│   │   │   │   ├── JwtProvider.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── CustomUserDetailsService.java
│   │   │   │
│   │   │   ├── validation/                  # Custom Validators
│   │   │   │   ├── PasswordValidator.java
│   │   │   │   └── EmailValidator.java
│   │   │   │
│   │   │   ├── util/                        # Utilities
│   │   │   │   └── ApiResponse.java
│   │   │   │
│   │   │   └── LearningApplication.java     # Main class
│   │   │
│   │   └── resources/
│   │       ├── application.properties       # Configuration
│   │       ├── application-dev.properties
│   │       └── application-prod.properties
│   │
│   └── test/
│       ├── java/com/example/learning/
│       │   ├── controller/
│       │   ├── service/
│       │   └── repository/
│       └── resources/
│           └── application-test.properties
│
├── pom.xml                                  # Maven Dependencies
├── Dockerfile                               # Docker config
├── docker-compose.yml                       # Docker Compose
└── README.md
```

---

## Part 5: Spring Boot Dependencies (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>react-learning-backend</artifactId>
    <version>1.0.0</version>
    <name>React Learning Backend</name>
    <description>Spring Boot Backend for React Learning Project</description>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.12.3</jjwt.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>42.6.0</version>
            <scope>runtime</scope>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- MapStruct -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>1.5.5.Final</version>
        </dependency>

        <!-- Springdoc OpenAPI (Swagger) -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.0.0</version>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Mockito -->
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-core</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                        <path>
                            <groupId>org.mapstruct</groupId>
                            <artifactId>mapstruct-processor</artifactId>
                            <version>1.5.5.Final</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## Part 6: Implementation Roadmap

### Phase 1: Project Setup (Week 1)
- [ ] Create Spring Boot project with Maven
- [ ] Configure PostgreSQL database
- [ ] Set up project structure
- [ ] Configure application.properties
- [ ] Add all dependencies to pom.xml
- [ ] Configure CORS and security basics

### Phase 2: Authentication System (Week 2-3)
- [ ] Implement User entity and repository
- [ ] Create JWT provider and filters
- [ ] Implement AuthService with registration/login
- [ ] Create AuthController endpoints
- [ ] Add password hashing (BCrypt)
- [ ] Implement token refresh mechanism
- [ ] Write unit tests for authentication

### Phase 3: User Management (Week 4)
- [ ] Implement UserService with CRUD operations
- [ ] Create UserController with all endpoints
- [ ] Add pagination and sorting
- [ ] Implement search functionality
- [ ] Add user profile update
- [ ] Password change functionality
- [ ] Write integration tests

### Phase 4: Post Management (Week 5)
- [ ] Implement Post entity and repository
- [ ] Create PostService with business logic
- [ ] Implement PostController
- [ ] Add query methods for filtering
- [ ] Pagination and sorting
- [ ] User-specific post retrieval
- [ ] Write service tests

### Phase 5: Comments Management (Week 6)
- [ ] Implement Comment entity and repository
- [ ] Create CommentService
- [ ] Implement CommentController
- [ ] Add nested resource endpoints
- [ ] Pagination for comments
- [ ] Write tests

### Phase 6: Security & Validation (Week 7)
- [ ] Add input validation
- [ ] Implement custom validators
- [ ] Global exception handling
- [ ] Authorization checks
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Security tests

### Phase 7: API Documentation & Testing (Week 8)
- [ ] Configure Swagger/OpenAPI
- [ ] Generate API documentation
- [ ] Write comprehensive tests
- [ ] Performance testing
- [ ] Load testing
- [ ] Security testing

### Phase 8: Deployment & DevOps (Week 9)
- [ ] Docker containerization
- [ ] Docker Compose setup
- [ ] CI/CD pipeline configuration
- [ ] Environment configuration
- [ ] Database migrations
- [ ] Logging and monitoring

---

## Part 7: Configuration Files

### application.properties
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/react_learning
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your-secret-key-at-least-32-characters-long
jwt.expiration=3600000
jwt.refresh-expiration=604800000

# Logging
logging.level.root=INFO
logging.level.com.example.learning=DEBUG

# Actuator
management.endpoints.web.exposure.include=health,info

# API Documentation
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/v3/api-docs
```

---

## Part 8: API Summary Table

| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 1 | POST | /api/v1/auth/register | No | Register new user |
| 2 | POST | /api/v1/auth/login | No | User login |
| 3 | POST | /api/v1/auth/refresh-token | No | Refresh JWT token |
| 4 | POST | /api/v1/auth/logout | Yes | User logout |
| 5 | GET | /api/v1/users | Yes | List all users (paginated) |
| 6 | GET | /api/v1/users/{id} | Yes | Get user by ID |
| 7 | PUT | /api/v1/users/{id} | Yes | Update user profile |
| 8 | PUT | /api/v1/users/{id}/password | Yes | Change password |
| 9 | GET | /api/v1/users/search | Yes | Search users |
| 10 | GET | /api/v1/users/me | Yes | Get current user |
| 11 | DELETE | /api/v1/users/{id} | Yes | Delete user |
| 12 | GET | /api/v1/users/{id}/statistics | Yes | User statistics |
| 13 | POST | /api/v1/posts | Yes | Create post |
| 14 | GET | /api/v1/posts | No | List all posts (paginated) |
| 15 | GET | /api/v1/posts/{id} | No | Get post by ID |
| 16 | PUT | /api/v1/posts/{id} | Yes | Update post |
| 17 | DELETE | /api/v1/posts/{id} | Yes | Delete post |
| 18 | GET | /api/v1/users/{userId}/posts | No | Get user's posts |
| 19 | POST | /api/v1/posts/{postId}/comments | Yes | Create comment |
| 20 | GET | /api/v1/posts/{postId}/comments | No | Get comments for post |
| 21 | PUT | /api/v1/comments/{id} | Yes | Update comment |
| 22 | DELETE | /api/v1/comments/{id} | Yes | Delete comment |

---

## Part 9: Error Handling Strategy

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": [
      {
        "field": "fieldName",
        "message": "Validation error message"
      }
    ]
  },
  "timestamp": "2025-12-01T11:00:00Z"
}
```

### Common Error Codes
```
400 - BAD_REQUEST: Invalid input
401 - UNAUTHORIZED: Missing/invalid token
403 - FORBIDDEN: Insufficient permissions
404 - NOT_FOUND: Resource not found
409 - CONFLICT: Duplicate resource
422 - UNPROCESSABLE_ENTITY: Validation failed
500 - INTERNAL_SERVER_ERROR: Server error
```

---

## Part 10: Quick Start Guide

### Prerequisites
```bash
# Install Java 17+
java -version

# Install Maven
mvn -version

# Install PostgreSQL
```

### Setup Steps
```bash
# 1. Clone repository
git clone <repo-url>
cd spring-boot-backend

# 2. Create database
createdb react_learning

# 3. Update application.properties
# Edit src/main/resources/application.properties

# 4. Build project
mvn clean install

# 5. Run application
mvn spring-boot:run

# 6. Access API documentation
# http://localhost:8080/api/swagger-ui.html
```

---

**Total APIs: 22 Endpoints**  
**Total Database Tables: 4 Tables**  
**Estimated Development Time: 8-9 Weeks**  
**Current Date: December 1, 2025**

