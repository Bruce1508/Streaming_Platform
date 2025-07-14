# Program Data Transformation Layer

## Overview

The transformation layer chuẩn hóa dữ liệu từ tất cả các trường học về cùng một format với các fields:

- `id`: Unique identifier
- `code`: Program code  
- `name`: Program name
- `duration`: Duration of the program
- `campus`: Array of campus locations
- `credential`: One of: `bachelor`, `diploma`, `advanced diploma`, `certificate`

## Supported Schools

1. **Seneca College** (`seneca`)
2. **Centennial College** (`centennial`) 
3. **York University** (`york`)
4. **George Brown College** (`georgebrown`)
5. **Humber College** (`humber`)
6. **Toronto Metropolitan University** (`tmu`)

## Usage

### 1. Test Transformation

Kiểm tra transformation layer hoạt động đúng:

```bash
cd backend
npm run test:transform
```

### 2. Universal Import

Import tất cả trường cùng lúc:
```bash
npm run import:unified all
```

Import các trường cụ thể:
```bash
npm run import:unified seneca centennial
npm run import:unified york
```

### 3. API Endpoint

Sử dụng API endpoint `/api/programs/bulk-import`:

```typescript
POST /api/programs/bulk-import
{
    "school": "seneca",
    "programs": [
        {
            "id": "program-123",
            "code": "PROG123",
            "name": "Computer Programming",
            "duration": "3 years",
            "campus": ["Newnham", "King"],
            "credential": "diploma"
        }
    ]
}
```

## File Structure

```
backend/
├── src/utils/programTransformer.ts    # Main transformation logic
├── scripts/
│   ├── test-transformation.ts         # Test script
│   ├── universal-importer.ts          # Universal import script
│   └── output/                        # Program data files
│       ├── seneca/all_programs.json
│       ├── centennial/centennial_programs_manual.json
│       ├── york/yorkUni.json
│       ├── george_brown/georgebrown_programs_complete.json
│       ├── humber/humber.json
│       └── tmu/tmu.json
└── src/controllers/program.controllers.ts  # API controllers
```

## Transformation Logic

### Field Mapping

| School | Original Field | Standardized Field |
|--------|---------------|-------------------|
| Seneca | `id` | `id` |
| Centennial | `id` | `id` |
| York | Generated from `name` | `id` |
| George Brown | `programId` | `id` |
| Humber | Generated from `name` | `id` |
| TMU | Generated from `name` | `id` |

### Credential Mapping

| Original | Standardized |
|----------|-------------|
| "Bachelor*", "BA", "BSc", etc. | `bachelor` |
| "Advanced Diploma" | `advanced diploma` |
| "Diploma" | `diploma` |
| Everything else | `certificate` |

### Code Generation

- For schools without codes: Generate from first letters of words
- Pattern matching for codes in program names: `(CODE123)`, `- CODE123`
- Fallback: Random code generation

## Validation

All programs must have:
- ✅ Non-empty `id`
- ✅ Non-empty `code`
- ✅ Non-empty `name`
- ✅ Valid `credential` (one of 4 allowed values)

Optional fields:
- `duration` (string)
- `campus` (array of strings)

## Error Handling

- Invalid programs are skipped during import
- Detailed error reporting for each failed program
- Batch processing with error aggregation
- Graceful handling of missing or malformed data

## Examples

### Input (George Brown):
```json
{
    "name": "Computer Programming",
    "credential": "diploma",
    "international": "Yes",
    "duration": "3 years",
    "programId": "GB123"
}
```

### Output (Standardized):
```json
{
    "id": "GB123",
    "code": "CP1A2B",
    "name": "Computer Programming", 
    "duration": "3 years",
    "campus": [],
    "credential": "diploma"
}
```

### Input (York):
```json
{
    "name": "Bachelor of Arts (BA)",
    "degree": "BA",
    "offeredBy": "Faculty of Liberal Arts",
    "campus": "Keele",
    "experientialEducation": "Yes",
    "url": "https://..."
}
```

### Output (Standardized):
```json
{
    "id": "bachelor-of-arts-ba-1234567890",
    "code": "BAOBA",
    "name": "Bachelor of Arts (BA)",
    "duration": "",
    "campus": ["Keele"],
    "credential": "bachelor"
}
```

## Performance

- Batch processing: 20 programs per API call
- 2 second delay between batches
- Parallel transformation for multiple schools
- Memory efficient streaming for large datasets

## Monitoring

Import progress includes:
- ✅ Success count
- ❌ Error count  
- 📊 Total processed
- 📋 Success rate percentage
- 🏫 Per-school breakdown
- 📝 Detailed error messages 