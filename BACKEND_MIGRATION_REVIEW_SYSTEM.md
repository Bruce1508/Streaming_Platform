# Backend Migration: Review System Upgrade (5-Star → 100-Point Scale)

## Overview
Dự án đã chuyển từ hệ thống đánh giá 5 sao sang thang điểm 100 với nhiều tiêu chí đánh giá chi tiết. Tài liệu này liệt kê những thay đổi cần thiết ở backend.

## 1. Database Schema Changes

### 1.1 Review Model Updates
**File:** `backend/src/models/ProgramReviews.ts`

**Thay đổi cần thiết:**
```typescript
// CŨ (cần xóa):
rating: number; // 1-5

// MỚI (cần thêm):
overallRating: number;      // 0-100
instructorRating: number;   // 0-100  
contentQualityRating: number; // 0-100
practicalValueRating: number; // 0-100
currentSemester: string;    // e.g., "Fall 2024"

// CŨ (cần xóa nếu có):
fieldOfStudy?: string;
```

### 1.2 Database Migration Script
**Cần tạo:** `backend/scripts/migrate-review-system.ts`

**Nội dung cần có:**
- Chuyển đổi `rating` (1-5) thành `overallRating` (0-100)
- Thêm các field mới với giá trị mặc định
- Xóa field `fieldOfStudy` (nếu có)
- Cập nhật indexes

## 2. API Endpoints Updates

### 2.1 Review Controllers
**File:** `backend/src/controllers/programReview.controllers.ts`

**Thay đổi cần thiết:**
- Cập nhật validation cho các field mới (0-100)
- Xóa validation cho `rating` (1-5)
- Thêm validation cho `currentSemester`
- Cập nhật logic tính toán điểm trung bình

### 2.2 Validation Schema
**File:** `backend/src/middleware/validation/program.validation.ts`

**Cần cập nhật:**
```typescript
// XÓA:
rating: Joi.number().min(1).max(5).required()

// THÊM:
overallRating: Joi.number().min(0).max(100).required(),
instructorRating: Joi.number().min(0).max(100).required(),
contentQualityRating: Joi.number().min(0).max(100).required(),
practicalValueRating: Joi.number().min(0).max(100).required(),
currentSemester: Joi.string().required()
```

## 3. API Response Format Changes

### 3.1 Review Statistics
**Thay đổi format response:**

```typescript
// CŨ (cần xóa):
interface ReviewStats {
  averageRating: number; // 1-5
  ratingCounts: number[]; // [1star, 2star, 3star, 4star, 5star]
}

// MỚI (cần implement):
interface ReviewStats {
  averageRating: number; // 0-100
  gradeDistribution: {
    'A+': number,
    'A': number,
    'B+': number,
    'B': number,
    'C+': number,
    'C': number,
    'D': number,
    'F': number
  }
}
```

### 3.2 Individual Review Response
```typescript
// CŨ (cần xóa):
interface ReviewResponse {
  rating: number; // 1-5
  fieldOfStudy?: string;
}

// MỚI (cần implement):
interface ReviewResponse {
  overallRating: number;
  instructorRating: number;
  contentQualityRating: number;
  practicalValueRating: number;
  currentSemester: string;
}
```

## 4. Business Logic Updates

### 4.1 Grade Calculation Helper
**Cần tạo:** `backend/src/utils/gradeCalculator.ts`

```typescript
export const getGradeFromScore = (score: number): string => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};
```

### 4.2 Statistics Calculation
**File:** `backend/src/utils/Stats.utils.ts`

**Cần cập nhật:**
- Logic tính toán grade distribution
- Xóa logic tính toán star rating
- Thêm logic tính average cho từng tiêu chí

## 5. Routes Updates

### 5.1 Review Routes
**File:** `backend/src/routes/programReview.routes.ts`

**Kiểm tra và cập nhật:**
- Endpoint tạo review mới
- Endpoint lấy statistics
- Endpoint filter theo grade thay vì star rating

## 6. Database Cleanup Tasks

### 6.1 Indexes to Remove
```sql
-- Xóa indexes cũ liên quan đến rating (1-5)
DROP INDEX IF EXISTS idx_program_reviews_rating;
```

### 6.2 Indexes to Add
```sql
-- Thêm indexes mới
CREATE INDEX idx_program_reviews_overall_rating ON program_reviews(overallRating);
CREATE INDEX idx_program_reviews_semester ON program_reviews(currentSemester);
```

## 7. Testing Updates

### 7.1 Unit Tests
**Files cần cập nhật:**
- `backend/tests/controllers/programReview.test.ts`
- `backend/tests/models/ProgramReviews.test.ts`
- `backend/tests/utils/Stats.test.ts`

### 7.2 Integration Tests
- Cập nhật test cases cho API endpoints
- Test migration script
- Test grade calculation logic

## 8. Documentation Updates

### 8.1 API Documentation
**File:** `backend/API_DOCS.md` (nếu có)

**Cần cập nhật:**
- Request/Response schemas
- Example payloads
- Error codes

### 8.2 Database Documentation
- Cập nhật ERD diagrams
- Schema documentation

## 9. Configuration Changes

### 9.1 Environment Variables
**Kiểm tra nếu cần:**
- Thresholds cho grade calculation
- Migration flags

## 10. Deployment Considerations

### 10.1 Migration Strategy
1. **Backup database** trước khi migrate
2. **Run migration script** trong maintenance mode
3. **Deploy new API** với backward compatibility
4. **Verify data integrity** sau migration
5. **Remove old code** sau khi confirm stable

### 10.2 Rollback Plan
- Backup schema và data trước migration
- Script để rollback nếu cần thiết

## Priority Level

### High Priority (Critical):
- [ ] Database schema migration
- [ ] API validation updates
- [ ] Review model updates

### Medium Priority:
- [ ] Statistics calculation logic
- [ ] Grade helper functions
- [ ] API response format

### Low Priority:
- [ ] Documentation updates
- [ ] Test updates
- [ ] Index optimization

## Notes
- **Không được** xóa data cũ cho đến khi confirm migration thành công
- **Phải test** thoroughly trên staging environment trước
- **Backup** database trước mọi thay đổi
- **Monitor** performance sau migration

---
*Generated on: $(date)*
*Review System Migration: 5-Star → 100-Point Scale* 