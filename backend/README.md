# Spring Boot Backend - React Learning Project

This is a complete Spring Boot backend implementation for the React Learning project with MySQL database, JWT authentication, and full CRUD operations.

## 📋 Project Structure

```
backend/
├── src/main/java/com/example/learning/
│   ├── config/                      # Configuration classes
│   │   ├── SecurityConfig.java
│   │   └── CorsConfig.java
│   │
│   ├── controller/                  # REST Controllers
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── PostController.java
│   │   └── CommentController.java
│   │
│   ├── service/                     # Service interfaces
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── PostService.java
│   │   └── CommentService.java
│   │
│   ├── service/impl/                # Service implementations
│   │   ├── AuthServiceImpl.java
│   │   ├── UserServiceImpl.java
│   │   ├── PostServiceImpl.java
│   │   └── CommentServiceImpl.java
│   │
│   ├── repository/                  # Data Access Layer
│   │   ├── UserRepository.java
│   │   ├── PostRepository.java
│   │   ├── CommentRepository.java
│   │   └── UserRoleRepository.java
│   │
│   ├── entity/                      # JPA Entities
│   │   ├── User.java
│   │   ├── Post.java
│   │   ├── Comment.java
│   │   └── UserRole.java
│   │
│   ├── dto/                         # Data Transfer Objects
│   │   ├── request/                 # Request DTOs
│   │   │   ├── RegisterRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── UpdateUserRequest.java
│   │   │   ├── ChangePasswordRequest.java
│   │   │   ├── CreatePostRequest.java
│   │   │   ├── UpdatePostRequest.java
│   │   │   ├── CreateCommentRequest.java
│   │   │   └── RefreshTokenRequest.java
│   │   │
│   │   └── response/                # Response DTOs
│   │       ├── UserResponse.java
│   │       ├── PostResponse.java
│   │       ├── CommentResponse.java
│   │       ├── AuthResponse.java
│   │       ├── TokenResponse.java
│   │       ├── PageResponse.java
│   │       ├── UserStatisticsResponse.java
│   │       └── ApiResponse.java
│   │
│   ├── exception/                   # Custom Exceptions
│   │   ├── ResourceNotFoundException.java
│   │   ├── DuplicateEmailException.java
│   │   ├── InvalidTokenException.java
│   │   ├── UnauthorizedException.java
│   │   └── GlobalExceptionHandler.java
│   │
│   ├── security/                    # JWT & Security
│   │   ├── JwtProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   │
│   ├── util/                        # Utilities
│   │   └── AuthenticationUtils.java
│   │
│   └── LearningApplication.java     # Main Application Class
│
├── src/main/resources/
│   └── application.properties       # Configuration
│
├── pom.xml                          # Maven Dependencies
└── README.md                        # This file
```

## 🛠️ Prerequisites

- **Java 17+** - [Download JDK](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.6+** - [Download Maven](https://maven.apache.org/download.cgi)
- **MySQL 5.7+** - [Download MySQL](https://www.mysql.com/downloads/)
- **Git** - [Download Git](https://git-scm.com/)

## 📦 Installation & Setup

### Step 1: Install MySQL and Create Database

```bash
# Start MySQL service
# On Windows (if using MySQL as service):
net start MySQL80

# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE react_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify database creation
SHOW DATABASES;

# Exit MySQL
EXIT;
```

### Step 2: Clone and Navigate to Backend

```bash
cd d:\Project-for-development\UI-React-Projects\react-learning\backend
```

### Step 3: Configure Database Connection

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/react_learning?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 4: Build Project

```bash
mvn clean install
```

### Step 5: Run Application

```bash
mvn spring-boot:run
```

Or run using:
```bash
java -jar target/react-learning-backend-1.0.0.jar
```

## 🚀 Access Application

- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **API Docs**: http://localhost:8080/api/v3/api-docs

## 📚 API Endpoints Summary

### Authentication (4 endpoints)
```
POST   /api/v1/auth/register        - Register new user
POST   /api/v1/auth/login           - Login user
POST   /api/v1/auth/refresh-token   - Refresh JWT token
POST   /api/v1/auth/logout          - Logout user
```

### Users (8 endpoints)
```
GET    /api/v1/users                - Get all users (paginated)
GET    /api/v1/users/{id}           - Get user by ID
PUT    /api/v1/users/{id}           - Update user profile
PUT    /api/v1/users/{id}/password  - Change password
GET    /api/v1/users/search         - Search users
GET    /api/v1/users/me             - Get current user
DELETE /api/v1/users/{id}           - Delete user
GET    /api/v1/users/{id}/statistics - Get user statistics
```

### Posts (6 endpoints)
```
POST   /api/v1/posts                - Create post
GET    /api/v1/posts                - Get all posts (paginated)
GET    /api/v1/posts/{id}           - Get post by ID
PUT    /api/v1/posts/{id}           - Update post
DELETE /api/v1/posts/{id}           - Delete post
GET    /api/v1/users/{userId}/posts - Get user's posts
```

### Comments (4 endpoints)
```
POST   /api/v1/posts/{postId}/comments    - Create comment
GET    /api/v1/posts/{postId}/comments    - Get post comments
PUT    /api/v1/comments/{id}              - Update comment
DELETE /api/v1/comments/{id}              - Delete comment
```

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Example Authentication Flow

1. **Register User**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-0123"
  }'
```

2. **Login User**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

3. **Use Token**
```bash
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer <token_from_login>"
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username)
);
```

### Posts Table
```sql
CREATE TABLE posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

### Comments Table
```sql
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id)
);
```

### User Roles Table
```sql
CREATE TABLE user_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id)
);
```

## 🧪 Testing with Postman

1. Import the API endpoints into Postman
2. Create environment variables:
   - `base_url`: http://localhost:8080/api
   - `token`: (will be set after login)
3. Test each endpoint following the API flow

## 🐛 Common Issues & Solutions

### Issue: Database Connection Failed
**Solution**: Ensure MySQL is running and credentials in application.properties are correct

### Issue: Port 8080 Already in Use
**Solution**: Change port in application.properties:
```properties
server.port=8081
```

### Issue: JWT Token Expired
**Solution**: Use refresh-token endpoint to get new token

### Issue: CORS Errors
**Solution**: CORS is already configured for localhost:3000 and localhost:5173

## 📝 Key Features

✅ **JWT Authentication** - Secure token-based authentication  
✅ **Password Encryption** - BCrypt password hashing  
✅ **Input Validation** - Comprehensive request validation  
✅ **Exception Handling** - Global exception handler  
✅ **Pagination** - Support for paginated responses  
✅ **Search** - Full-text search on users and posts  
✅ **Soft Deletes** - Logical deletion of records  
✅ **CORS Support** - Cross-origin requests allowed  
✅ **API Documentation** - Swagger UI integration  

## 🔒 Security Features

- Password validation (min 8 chars, uppercase, lowercase, number, special char)
- JWT token expiration (1 hour)
- Refresh token support (7 days)
- User role-based access control
- SQL injection prevention via JPA
- CSRF protection enabled
- Secure password encoding with BCrypt

## 📞 Support

For issues or questions, please check:
- API Documentation: http://localhost:8080/api/swagger-ui.html
- Application logs in console

## 📄 License

This project is part of the React Learning roadmap.

---

**Last Updated**: December 1, 2025  
**Backend Status**: ✅ Ready for Development
