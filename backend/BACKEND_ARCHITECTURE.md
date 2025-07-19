# StudyHub Backend Architecture

## 🏗️ Kiến Trúc Tổng Quan

StudyHub Backend được xây dựng với kiến trúc **Layered Architecture** (MVC Pattern) sử dụng **Node.js + TypeScript + Express.js**

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  Frontend (Next.js) + Mobile Apps + External APIs          │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                         │
│     Rate Limiting + Authentication + Validation            │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  CONTROLLER LAYER                           │
│           Business Logic + Request Handling                 │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                             │
│        Core Business Logic + External Services              │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                               │
│    MongoDB (Primary) + Redis (Cache) + AWS S3 (Files)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication & Authorization Architecture

### **Current Authentication Methods**

1. **Magic Link Authentication** ✨ (Primary)
   - Passwordless authentication
   - Email-based verification
   - 10-minute expiry tokens stored in Redis
   - Auto-creates accounts for new users

2. **OAuth Integration** 🔗
   - Google OAuth 2.0
   - Handled via NextAuth.js
   - Auto-verification for educational emails

3. **Session Management** 🔄
   - JWT-based tokens (Access + Refresh)
   - Redis-based session storage
   - 7-day session expiry
   - Device-specific logout capability

### **Educational Email Verification System** 🎓

```typescript
// Educational Domains Detection
const eduDomains = [
    'senecacollege.ca', 'georgebrown.ca', 'humber.ca', 
    'centennialcollege.ca', 'torontomu.ca', 'yorku.ca',
    'utoronto.ca', 'queensu.ca', '.edu', '.ac.ca'
];
```

**Benefits for Verified Students:**
- ✅ Green checkmark badge
- 🎯 Access to exclusive academic resources
- 🏆 Higher trust score in community
- 📚 Educational institution attribution

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers & business logic
│   │   ├── auth.controllers.ts      # 🔐 Authentication (Magic Link + OAuth)
│   │   ├── user.controllers.ts      # 👤 User management
│   │   ├── program.controllers.ts   # 🎓 Academic programs
│   │   ├── course.controllers.ts    # 📚 Course management
│   │   ├── material.controllers.ts  # 📖 Study materials
│   │   ├── notification.controllers.ts # 🔔 Notifications
│   │   └── chat.controllers.ts      # 💬 Real-time chat
│   │
│   ├── models/               # MongoDB schemas
│   │   ├── User.ts          # 👤 User profiles & authentication
│   │   ├── Program.ts       # 🎓 Academic programs
│   │   ├── StudyMaterial.ts # 📖 Learning resources
│   │   ├── Notification.ts  # 🔔 User notifications
│   │   └── UserSession.ts   # 🔐 Session management
│   │
│   ├── routes/              # API endpoints
│   │   ├── auth.routes.ts   # 🔐 /auth/* endpoints
│   │   ├── user.routes.ts   # 👤 /users/* endpoints
│   │   ├── program.routes.ts # 🎓 /programs/* endpoints
│   │   └── material.routes.ts # 📖 /materials/* endpoints
│   │
│   ├── middleware/          # Request processing
│   │   ├── auth.middleware.ts      # 🔐 JWT verification
│   │   ├── rateLimiter.ts         # 🚦 Rate limiting
│   │   ├── error.middleware.ts    # ❌ Error handling
│   │   └── validation/            # ✅ Input validation
│   │       ├── auth.validation.ts
│   │       ├── user.validation.ts
│   │       └── common.validation.ts
│   │
│   ├── utils/               # Shared utilities
│   │   ├── email.utils.ts   # 📧 Email sending (Magic links)
│   │   ├── jwt.enhanced.ts  # 🔐 JWT token management
│   │   ├── Cache.utils.ts   # ⚡ Redis caching
│   │   ├── logger.utils.ts  # 📝 Structured logging
│   │   └── Api.utils.ts     # 🛠️ API helpers
│   │
│   └── types/               # TypeScript definitions
│       ├── User.ts
│       ├── Program.ts
│       └── express/
│
├── scripts/                 # Database & maintenance scripts
│   ├── scrapers/           # 🕷️ Data collection
│   └── migration/          # 🔄 Database migrations
│
└── dist/                   # Compiled JavaScript
```

---

## 🗄️ Database Design

### **MongoDB Collections**

#### 1. **Users Collection** 👤
```typescript
interface IUser {
    fullName: string;
    email: string;                    // Unique identifier
    profilePic?: string;
    bio?: string;
    location?: string;
    
    // Authentication
    authProvider: 'local' | 'google' | 'magic-link';
    isActive: boolean;
    isVerified: boolean;              // ✅ Educational email verified
    verificationStatus: 'unverified' | 'email-verified' | 'edu-verified';
    verificationMethod: 'none' | 'email-link' | 'edu-domain';
    
    // Educational Info
    institutionInfo: {
        name: string;                 // e.g., "University of Toronto"
        domain: string;               // e.g., "utoronto.ca"
        type: 'university' | 'college' | 'polytechnic';
    };
    
    // Activity Tracking
    activity: {
        loginCount: number;
        uploadCount: number;
        downloadCount: number;
        contributionScore: number;    // Gamification
    };
    
    savedMaterials: ObjectId[];       // Bookmarked content
    uploadedMaterials: ObjectId[];    // Created content
}
```

#### 2. **Programs Collection** 🎓
```typescript
interface IProgram {
    title: string;
    description: string;
    school: ObjectId;                 // Reference to School
    level: 'certificate' | 'diploma' | 'degree' | 'graduate';
    duration: string;
    tuitionFee: number;
    requirements: string[];
    career_prospects: string[];
    isActive: boolean;
}
```

#### 3. **StudyMaterials Collection** 📖
```typescript
interface IStudyMaterial {
    title: string;
    description: string;
    uploader: ObjectId;               // Reference to User
    program: ObjectId;                // Reference to Program
    fileUrl: string;                  // AWS S3 URL
    fileType: 'pdf' | 'doc' | 'ppt' | 'video' | 'image';
    tags: string[];
    rating: {
        average: number;
        count: number;
    };
    downloadCount: number;
    isApproved: boolean;              // Moderation status
}
```

### **Redis Cache Structure** ⚡

```typescript
// Session Storage
session:{sessionId} = {
    userId: string;
    email: string;
    role: string;
    lastLogin: ISO_DATE;
}

// Magic Link Tokens
magic:{token} = {
    userId: string;
    email: string;
    createdAt: ISO_DATE;
}

// User Cache
user:{userId} = {
    _id, fullName, email, role,
    isOnboarded, isVerified, isActive
}

// Rate Limiting
rate_limit:{ip}:{endpoint} = count
```

---

## 🛣️ API Endpoints

### **Authentication Endpoints** 🔐
```
POST /auth/oauth                    # OAuth callback (Google)
POST /auth/send-magic-link         # Send magic link email
POST /auth/magic-link-verify       # Verify magic link token
POST /auth/refresh                 # Refresh JWT tokens
POST /auth/logout                  # Logout (single device)
POST /auth/logout-all-devices      # Logout all devices
GET  /auth/me                      # Get current user
```

### **User Management** 👤
```
GET  /users/recommended            # Get recommended users
GET  /users/search?q={query}       # Search users
GET  /users/profile                # Get user profile
PUT  /users/profile                # Update profile
PUT  /users/onboarding             # Complete onboarding
```

### **Program Management** 🎓
```
GET  /programs                     # List programs (with filters)
GET  /programs/{id}                # Get program details
GET  /programs/search?q={query}    # Search programs
GET  /programs/schools             # Get all schools
POST /programs                     # Create program (admin)
```

### **Study Materials** 📖
```
GET  /materials                    # List materials
GET  /materials/{id}               # Get material details
POST /materials                    # Upload material
POST /materials/{id}/save          # Bookmark material
POST /materials/{id}/rate          # Rate material
```

---

## 🔧 Core Features & Services

### **1. Magic Link Authentication Service** ✨

```typescript
// Flow Overview
User enters email → Generate secure token → Store in Redis 
→ Send email with magic link → User clicks link → Auto-login
```

**Key Features:**
- 🔒 Secure token generation (32 bytes)
- ⏰ 10-minute expiry
- 📧 Beautiful email templates
- 🎓 Auto-verification for educational emails
- 🚀 Auto-account creation for new users

### **2. Educational Email Detection** 🎓

```typescript
const detectEducationalEmail = (email: string) => {
    const eduDomains = ['senecacollege.ca', '.edu', '.ac.ca'];
    const isEducational = eduDomains.some(domain => 
        email.toLowerCase().includes(domain)
    );
    
    return {
        isVerified: isEducational,
        institution: getInstitutionName(email),
        verificationMethod: 'edu-domain'
    };
};
```

### **3. Caching Strategy** ⚡

```typescript
// Multi-layer caching
1. User Session Cache (Redis) - 7 days
2. User Profile Cache (Redis) - 24 hours  
3. Program Data Cache (Redis) - 1 hour
4. API Response Cache (Memory) - 5 minutes
```

### **4. Rate Limiting** 🚦

```typescript
const rateLimits = {
    login: '5 requests per 15 minutes',
    magicLink: '3 requests per 15 minutes', 
    passwordReset: '3 requests per hour',
    general: '100 requests per 15 minutes',
    upload: '10 requests per hour'
};
```

### **5. File Upload & Storage** 📁

```typescript
// AWS S3 Integration
Upload Flow: Client → Presigned URL → S3 Direct Upload
Storage: /studyhub/{userId}/{materialId}/{filename}
CDN: CloudFront for global delivery
Security: Virus scanning + file type validation
```

---

## 🛡️ Security Measures

### **Authentication Security** 🔐
- ✅ JWT tokens with short expiry (15 minutes access, 7 days refresh)
- ✅ Secure session management in Redis
- ✅ CSRF protection with SameSite cookies
- ✅ Magic link tokens expire after 10 minutes
- ✅ Rate limiting on sensitive endpoints

### **Input Validation & Sanitization** 🛡️
- ✅ Joi schema validation on all inputs
- ✅ XSS prevention with HTML sanitization
- ✅ NoSQL injection protection
- ✅ File upload restrictions (type, size, virus scan)

### **Data Protection** 🔒
- ✅ Password hashing with bcrypt (for legacy accounts)
- ✅ Sensitive data masking in logs
- ✅ Email masking for privacy
- ✅ HTTPS enforcement
- ✅ Environment variable protection

---

## 📊 Monitoring & Logging

### **Structured Logging** 📝
```typescript
logger.info('User action', {
    userId: user._id,
    email: maskEmail(user.email),
    action: 'magic_link_sent',
    ip: req.ip,
    userAgent: req.get('User-Agent')
});
```

### **Key Metrics Tracked** 📈
- 🔐 Authentication success/failure rates
- 📧 Magic link conversion rates
- 🎓 Educational email verification rates
- 📊 API response times
- 🚨 Error rates by endpoint
- 👥 User activity and engagement

---

## 🚀 Performance Optimizations

### **Database Optimizations** 🗄️
- ✅ Proper indexing on frequently queried fields
- ✅ Aggregation pipelines for complex queries
- ✅ Connection pooling
- ✅ Query optimization

### **Caching Strategy** ⚡
- ✅ Redis for session and user data
- ✅ Memory caching for frequent API calls
- ✅ CDN for static assets
- ✅ Database query result caching

### **API Optimizations** 🛠️
- ✅ Response compression (gzip)
- ✅ Pagination for large datasets
- ✅ Field selection to reduce payload
- ✅ Async/await for non-blocking operations

---

## 🔄 Future Architecture Considerations

### **Microservices Migration** 🏗️
```
Current: Monolithic Express.js
Future: Service-oriented architecture
- Auth Service (Magic Link + OAuth)
- User Service (Profiles + Social)
- Content Service (Materials + Programs)
- Notification Service (Email + Push)
- Analytics Service (Tracking + Reports)
```

### **Scalability Plans** 📈
- 🔄 Database sharding for user data
- 🌐 Multi-region deployment
- 📊 Event-driven architecture
- 🚀 GraphQL for flexible API queries
- 🔍 Elasticsearch for advanced search

---

## 📋 Deployment & DevOps

### **Current Stack** 🛠️
- **Runtime**: Node.js 18+ with TypeScript
- **Database**: MongoDB Atlas (Cloud)
- **Cache**: Redis Cloud
- **Storage**: AWS S3 + CloudFront CDN
- **Email**: SMTP (Production) / Ethereal (Development)
- **Hosting**: To be determined

### **Environment Configuration** ⚙️
```bash
# Core Services
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
NODE_ENV=production

# Authentication
JWT_SECRET=...
JWT_REFRESH_SECRET=...
NEXTAUTH_SECRET=...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Email Service
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM=noreply@studyhub.com

# AWS Services
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=studyhub-uploads
AWS_REGION=us-east-1
```

---

**📝 Last Updated**: December 2024  
**🏗️ Architecture Version**: 2.0 (Magic Link + OAuth)  
**👨‍💻 Maintained by**: StudyHub Development Team 