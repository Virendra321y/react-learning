# Spring Boot Backend - Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites Check
```bash
# Check Java
java -version  # Should be 17+

# Check Maven
mvn -version  # Should be 3.6+

# Check MySQL
mysql --version  # Should be 5.7+
```

### 2. Setup Database
```bash
# Connect to MySQL
mysql -u root -p

# Run these commands:
CREATE DATABASE react_learning;
USE react_learning;
EXIT;
```

### 3. Configure Backend
Edit: `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/react_learning
spring.datasource.username=root
spring.datasource.password=root  # Your MySQL password
```

### 4. Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 5. Access Application
- **API**: http://localhost:8080/api
- **Swagger**: http://localhost:8080/api/swagger-ui.html

---

## 📚 API Quick Reference

### Register User
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user1",
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+15551234567"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

### Login User
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Current User (Authenticated)
```bash
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Post (Authenticated)
```bash
curl -X POST http://localhost:8080/api/v1/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "Learning React with Spring Boot",
    "status": "PUBLISHED"
  }'
```

### Get All Posts
```bash
curl -X GET "http://localhost:8080/api/v1/posts?page=0&size=10"
```

### Create Comment (Authenticated)
```bash
curl -X POST http://localhost:8080/api/v1/posts/1/comments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!"
  }'
```

---

## 🔑 Authentication

### JWT Token Structure
```
Authorization: Bearer <access_token>
```

### Token Expiration
- Access Token: 1 hour (3600000 ms)
- Refresh Token: 7 days (604800000 ms)

### Refresh Token
```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/auth/register | No | Register user |
| POST | /api/v1/auth/login | No | Login user |
| POST | /api/v1/auth/refresh-token | No | Refresh JWT |
| POST | /api/v1/auth/logout | Yes | Logout user |
| GET | /api/v1/users | Yes | Get all users |
| GET | /api/v1/users/{id} | Yes | Get user by ID |
| PUT | /api/v1/users/{id} | Yes | Update user |
| PUT | /api/v1/users/{id}/password | Yes | Change password |
| GET | /api/v1/users/me | Yes | Get current user |
| DELETE | /api/v1/users/{id} | Yes | Delete user |
| GET | /api/v1/posts | No | Get all posts |
| POST | /api/v1/posts | Yes | Create post |
| GET | /api/v1/posts/{id} | No | Get post by ID |
| PUT | /api/v1/posts/{id} | Yes | Update post |
| DELETE | /api/v1/posts/{id} | Yes | Delete post |
| GET | /api/v1/posts/{id}/comments | No | Get comments |
| POST | /api/v1/posts/{id}/comments | Yes | Create comment |
| PUT | /api/v1/comments/{id} | Yes | Update comment |
| DELETE | /api/v1/comments/{id} | Yes | Delete comment |

---

## 🛠️ Common Issues & Solutions

### Issue: Port 8080 in use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8080
kill -9 <PID>
```

### Issue: MySQL Connection Failed
1. Ensure MySQL is running: `net start MySQL80`
2. Check credentials in application.properties
3. Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Issue: Build Fails
```bash
mvn clean install -DskipTests
```

### Issue: Swagger not loading
- Try: http://localhost:8080/api/swagger-ui.html
- Check logs for errors

---

## 📁 Important Files

| File | Location | Purpose |
|------|----------|---------|
| pom.xml | /backend/ | Maven dependencies |
| application.properties | /backend/src/main/resources/ | Configuration |
| LearningApplication.java | /backend/src/main/java/.../LearningApplication.java | Main class |
| SecurityConfig.java | /backend/src/main/java/.../config/ | Security setup |
| JwtProvider.java | /backend/src/main/java/.../security/ | JWT handling |

---

## 💻 IDE Setup

### IntelliJ IDEA
1. Open project
2. Right-click `LearningApplication.java`
3. Click "Run LearningApplication.main()"

### Eclipse
1. Right-click project
2. Run As → Java Application
3. Select `LearningApplication`

### VS Code
1. Install Extension Pack for Java
2. Press F5 to run
3. Select "Spring Boot App"

---

## 📝 Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (@$!%*?&)

**Example**: `SecurePass123!`

---

## 🔐 Security Features

✅ JWT Authentication  
✅ Password Encryption (BCrypt)  
✅ CORS Protection  
✅ Input Validation  
✅ Exception Handling  
✅ Authorization Checks  
✅ Soft Deletes  

---

## 📊 Pagination Query Parameters

```bash
# Get page 2 with 20 items per page, sorted by createdAt descending
GET /api/v1/users?page=1&size=20&sort=createdAt&direction=DESC
```

**Parameters:**
- `page`: 0-indexed page number (default: 0)
- `size`: Items per page (default: 10)
- `sort`: Sort field name (default: createdAt)
- `direction`: ASC or DESC (default: DESC)

---

## 🧪 Testing Tools

### Postman Collection Template
```json
{
  "info": {
    "name": "React Learning API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        { "request": { "method": "POST", "url": "{{base_url}}/auth/register" } },
        { "request": { "method": "POST", "url": "{{base_url}}/auth/login" } }
      ]
    },
    {
      "name": "Users",
      "item": [
        { "request": { "method": "GET", "url": "{{base_url}}/users" } }
      ]
    }
  ]
}
```

### Environment Variables
```
base_url = http://localhost:8080/api
token = <your_jwt_token>
```

---

## 📞 Useful Commands

```bash
# View logs
mvn spring-boot:run -Dlogging.level.root=DEBUG

# Run tests
mvn test

# Skip tests during build
mvn clean install -DskipTests

# Build JAR
mvn package

# Run JAR
java -jar target/react-learning-backend-1.0.0.jar

# Check running processes
ps aux | grep java

# Stop running server (Unix)
pkill -f "react-learning-backend"
```

---

## 📖 Documentation Files

1. **REACT_LEARNING_ROADMAP.md** - Complete React learning path
2. **BACKEND_SPECIFICATION.md** - Full API specification
3. **BACKEND_SETUP_GUIDE.md** - Detailed setup instructions
4. **IMPLEMENTATION_SUMMARY.md** - Implementation overview
5. **backend/README.md** - Backend documentation
6. **QUICK_REFERENCE.md** - This file

---

## 🚀 Production Checklist

- [ ] Change JWT secret in production
- [ ] Use production database credentials
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate`
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up logging aggregation
- [ ] Configure rate limiting
- [ ] Setup database backups
- [ ] Monitor application performance
- [ ] Setup error tracking (Sentry, etc.)

---

## 📞 Support Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **JWT Guide**: https://jwt.io/introduction
- **MySQL Docs**: https://dev.mysql.com/doc/
- **Postman Docs**: https://learning.postman.com/

---

**Last Updated**: December 1, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

