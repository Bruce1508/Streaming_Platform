# 🚀 Backend Setup Guide

## ❌ Lỗi JWT Secret không được cấu hình

Nếu bạn gặp lỗi `❌ JWT Secret not configured`, hãy làm theo các bước sau:

## 🔧 Bước 1: Tạo file .env

Chạy lệnh sau để tự động tạo file `.env` với JWT secret ngẫu nhiên:

```bash
npm run setup
```

Hoặc tạo thủ công file `.env` trong thư mục `backend/` với nội dung:

```env
# ===== JWT CONFIGURATION =====
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# ===== DATABASE CONFIGURATION =====
MONGODB_URI=mongodb://localhost:27017/studybuddy

# ===== REDIS CONFIGURATION =====
REDIS_URL=redis://localhost:6379

# ===== SERVER CONFIGURATION =====
PORT=5000
NODE_ENV=development

# ===== CORS CONFIGURATION =====
CORS_ORIGIN=http://localhost:3000
```

## 🔧 Bước 2: Cài đặt dependencies

```bash
npm install
```

## 🔧 Bước 3: Khởi động MongoDB (nếu chưa có)

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

## 🔧 Bước 4: Khởi động Redis (nếu chưa có)

```bash
# Windows
redis-server

# macOS
brew services start redis

# Linux
sudo systemctl start redis
```

## 🔧 Bước 5: Chạy server

```bash
npm run dev
```

## ✅ Kết quả mong đợi

Sau khi hoàn thành, bạn sẽ thấy:

```
✅ .env file created successfully with secure JWT secret
📝 Please update the following variables as needed:
   - MONGODB_URI (if using different database)
   - SMTP_USER and SMTP_PASS (for email functionality)
   - AWS credentials (if using S3)

> backend@1.0.0 dev
> tsx src/server.ts

🚀 Server running on port 5000
📊 MongoDB connected successfully
🔴 Redis connected successfully
```

## 🔧 Cấu hình tùy chọn

### Email Service
Để sử dụng email service, cập nhật trong `.env`:

```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### AWS S3 (nếu cần)
```env
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
```

## 🆘 Troubleshooting

### Lỗi MongoDB
- Đảm bảo MongoDB đang chạy
- Kiểm tra connection string trong `.env`

### Lỗi Redis
- Đảm bảo Redis đang chạy
- Kiểm tra Redis URL trong `.env`

### Lỗi Port
- Thay đổi PORT trong `.env` nếu port 5000 đã được sử dụng

## 📞 Hỗ trợ

Nếu vẫn gặp vấn đề, hãy kiểm tra:
1. File `.env` đã được tạo chưa
2. JWT_SECRET_KEY có giá trị không
3. MongoDB và Redis đang chạy không
4. Port 5000 có bị chiếm không 