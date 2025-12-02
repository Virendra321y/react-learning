# Spring Boot Backend - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Database Configuration](#database-configuration)
4. [Application Configuration](#application-configuration)
5. [Running the Application](#running-the-application)
6. [Testing the API](#testing-the-api)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Java Development Kit (JDK) 17+**
  - Download: https://www.oracle.com/java/technologies/downloads/
  - Verify: `java -version`

- **Maven 3.6+**
  - Download: https://maven.apache.org/download.cgi
  - Verify: `mvn -version`

- **MySQL 5.7 or Higher**
  - Download: https://www.mysql.com/downloads/
  - Verify: `mysql --version`

- **Git** (Optional)
  - Download: https://git-scm.com/

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: Minimum 2GB free
- **OS**: Windows, macOS, or Linux

---

## Project Setup

### Step 1: Navigate to Backend Directory

```powershell
cd "d:\Project -for-development\UI-React-Projects\react-learning\backend"
```

### Step 2: Verify Project Structure

The backend folder should contain:
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/learning/
│   │   └── resources/
│   └── test/
├── pom.xml
└── README.md
```

---

## Database Configuration

### Step 1: Install MySQL (If Not Already Installed)

**Windows:**
1. Download MySQL installer from https://dev.mysql.com/downloads/mysql/
2. Run installer and follow setup wizard
3. Configure MySQL as a service

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

### Step 2: Start MySQL Service

**Windows:**
```powershell
# If MySQL is installed as service
net start MySQL80

# Or start MySQL server directly
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld"
```

**macOS/Linux:**
```bash
sudo systemctl start mysql
# or
mysql.server start
```

### Step 3: Create Database

```bash
# Connect to MySQL
mysql -u root -p

# Enter your MySQL root password when prompted
```

Then in MySQL console:
```sql
-- Create database
CREATE DATABASE react_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify creation
SHOW DATABASES;

-- View database info
USE react_learning;

-- Exit MySQL
EXIT;
```

### Step 4: Verify Database Connection

```bash
# Test connection
mysql -u root -p -h localhost -D react_learning

# If successful, exit
EXIT;
```

---

## Application Configuration

### Step 1: Update database.properties

Edit `backend/src/main/resources/application.properties`:

```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/react_learning?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root  # Change this to your MySQL password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update  # Options: update, create, create-drop, validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
```

### Step 2: Configure JWT

In the same `application.properties`:

```properties
# JWT Configuration (Change the secret in production!)
jwt.secret=YourSuperSecretKeyThatIsAtLeast32CharactersLongForHS256AlgorithmHere123
jwt.expiration=3600000    # 1 hour in milliseconds
jwt.refresh-expiration=604800000  # 7 days in milliseconds
```

### Step 3: Configure Logging (Optional)

```properties
# Logging Configuration
logging.level.root=INFO
logging.level.com.example.learning=DEBUG
logging.level.org.hibernate=INFO
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

---

## Running the Application

### Option 1: Using Maven (Recommended)

```powershell
# Navigate to backend directory
cd "d:\Project -for-development\UI-React-Projects\react-learning\backend"

# Clean and build
mvn clean install

# Run application
mvn spring-boot:run
```

**Expected Output:**
```
Started LearningApplication in X.XXX seconds
```

### Option 2: Using Java Directly

```powershell
# Build the project
mvn clean package

# Run the JAR file
java -jar target/react-learning-backend-1.0.0.jar
```

### Option 3: Using IDE (IntelliJ IDEA / Eclipse)

1. **IntelliJ IDEA:**
   - Right-click `LearningApplication.java`
   - Select "Run 'LearningApplication.main()'"

2. **Eclipse:**
   - Right-click project → Run As → Java Application
   - Select `LearningApplication`

### Verify Application Started

Once running, you should see:
```
Tomcat started on port(s): 8080
```

### Access Application

- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **Health Check**: http://localhost:8080/api/actuator/health

---

## Testing the API

### Using cURL (Command Line)

#### 1. Register User
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+15550123"
  }'
```

#### 2. Login User
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

Save the `token` from response.

#### 3. Get Current User
```bash
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Create Post
```bash
curl -X POST http://localhost:8080/api/v1/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my first post about React and Spring Boot",
    "status": "PUBLISHED"
  }'
```

#### 5. Get All Posts
```bash
curl -X GET "http://localhost:8080/api/v1/posts?page=0&size=10" \
  -H "Content-Type: application/json"
```

### Using Postman (GUI)

#### Setup Postman

1. **Download Postman**: https://www.postman.com/downloads/
2. **Import API Collection** (optional):
   - File → New → Import → Enter API endpoint

#### Create Requests

1. **Register Request**
   - Method: POST
   - URL: `http://localhost:8080/api/v1/auth/register`
   - Body (JSON):
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "TestPass123!",
     "firstName": "Test",
     "lastName": "User",
     "phone": "+15550123"
   }
   ```

2. **Login Request**
   - Method: POST
   - URL: `http://localhost:8080/api/v1/auth/login`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "TestPass123!"
   }
   ```
   - Save the token from response

3. **Protected Request (Get Current User)**
   - Method: GET
   - URL: `http://localhost:8080/api/v1/users/me`
   - Header: `Authorization: Bearer <YOUR_TOKEN>`

### Using Swagger UI (Web Interface)

1. Open: http://localhost:8080/api/swagger-ui.html
2. All endpoints are listed with documentation
3. Click "Try it out" to test endpoints directly

---

## Troubleshooting

### Issue 1: MySQL Connection Failed

**Error:**
```
Could not get a connection, pool error Could not connect to address=(host=localhost)
```

**Solution:**
1. Verify MySQL is running:
   ```powershell
   # Check if MySQL service is running
   Get-Service | findstr MySQL
   ```

2. Check connection credentials in `application.properties`

3. Ensure database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

### Issue 2: Port 8080 Already in Use

**Error:**
```
Address already in use
```

**Solution 1: Change Port**
```properties
# In application.properties
server.port=8081
```

**Solution 2: Kill Process Using Port**

**Windows:**
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill process (replace PID with actual ID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :8080
kill -9 <PID>
```

### Issue 3: JWT Token Expired

**Error:**
```
Expired JWT token
```

**Solution:**
- Use refresh-token endpoint to get new token
- Default token expiration: 1 hour
- Refresh token expiration: 7 days

### Issue 4: CORS Error

**Error:**
```
Access to XMLHttpRequest from origin 'http://localhost:3000' blocked
```

**Note:**
- CORS is already configured for localhost:3000 and localhost:5173
- For other origins, update `CorsConfig.java`

### Issue 5: Build Failures

**Solution:**
1. Clean Maven cache:
   ```bash
   mvn clean
   ```

2. Update dependencies:
   ```bash
   mvn dependency:resolve
   ```

3. Rebuild:
   ```bash
   mvn clean install
   ```

### Issue 6: Lombok Not Working

**Solution:**
- Install Lombok plugin in your IDE
- For IntelliJ: Preferences → Plugins → Search "Lombok" → Install
- For Eclipse: Download and install from https://projectlombok.org/

---

## Environment Variables (Optional)

You can also use environment variables for sensitive data:

```bash
# Windows PowerShell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/react_learning"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
$env:JWT_SECRET="your-secret-key"
```

---

## Next Steps

1. ✅ Backend is running successfully
2. 🔄 Set up React Frontend (http://localhost:3000 or 5173)
3. 🧪 Connect frontend to backend API
4. 📚 Implement authentication in React
5. 🚀 Deploy to production

---

## Additional Resources

- **Spring Boot Documentation**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **JWT Documentation**: https://jwt.io/
- **MySQL Documentation**: https://dev.mysql.com/doc/

---

**Last Updated**: December 1, 2025  
**Status**: ✅ Ready for Development
