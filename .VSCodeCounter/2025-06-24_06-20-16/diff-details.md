# Diff Details

Date : 2025-06-24 06:20:16

Directory c:\\Users\\Bruce Vo\\Documents\\project\\linguex\\Streaming_Platform

Total : 450 files,  819727 codes, 84428 comments, 10251 blanks, all 914406 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [backend/.env](/backend/.env) | Properties | 28 | 11 | 4 | 43 |
| [backend/REDIS\_SETUP.md](/backend/REDIS_SETUP.md) | Markdown | 109 | 0 | 47 | 156 |
| [backend/SETUP.md](/backend/SETUP.md) | Markdown | 92 | 0 | 37 | 129 |
| [backend/package-lock.json](/backend/package-lock.json) | JSON | 2,045 | 0 | 0 | 2,045 |
| [backend/package.json](/backend/package.json) | JSON | 21 | 0 | 0 | 21 |
| [backend/scripts/migration/01-academic-migration.ts](/backend/scripts/migration/01-academic-migration.ts) | TypeScript | 1,066 | 29 | 44 | 1,139 |
| [backend/scripts/migration/02-enrollment-migration.ts](/backend/scripts/migration/02-enrollment-migration.ts) | TypeScript | 101 | 5 | 24 | 130 |
| [backend/scripts/migration/03-bookmark-migration.ts](/backend/scripts/migration/03-bookmark-migration.ts) | TypeScript | 39 | 5 | 9 | 53 |
| [backend/scripts/migration/README.md](/backend/scripts/migration/README.md) | Markdown | 1 | 0 | 0 | 1 |
| [backend/scripts/migration/database-backup.ts](/backend/scripts/migration/database-backup.ts) | TypeScript | 51 | 3 | 15 | 69 |
| [backend/scripts/migration/run-migration.ts](/backend/scripts/migration/run-migration.ts) | TypeScript | 113 | 6 | 20 | 139 |
| [backend/scripts/migration/types.ts](/backend/scripts/migration/types.ts) | TypeScript | 40 | 2 | 9 | 51 |
| [backend/src/config/aws.ts](/backend/src/config/aws.ts) | TypeScript | 48 | 6 | 10 | 64 |
| [backend/src/config/cloudinary.ts](/backend/src/config/cloudinary.ts) | TypeScript | -7 | 0 | -2 | -9 |
| [backend/src/controllers/auth.controllers.ts](/backend/src/controllers/auth.controllers.ts) | TypeScript | 457 | 35 | 79 | 571 |
| [backend/src/controllers/chat.controllers.ts](/backend/src/controllers/chat.controllers.ts) | TypeScript | 5 | 3 | 1 | 9 |
| [backend/src/controllers/course.controllers.ts](/backend/src/controllers/course.controllers.ts) | TypeScript | 587 | 97 | 120 | 804 |
| [backend/src/controllers/dashboard.controllers.ts](/backend/src/controllers/dashboard.controllers.ts) | TypeScript | 334 | 55 | 66 | 455 |
| [backend/src/controllers/material.controller.ts](/backend/src/controllers/material.controller.ts) | TypeScript | -715 | -37 | -117 | -869 |
| [backend/src/controllers/material.controllers.ts](/backend/src/controllers/material.controllers.ts) | TypeScript | 1,208 | 92 | 196 | 1,496 |
| [backend/src/controllers/onboarding.controllers.ts](/backend/src/controllers/onboarding.controllers.ts) | TypeScript | 258 | 45 | 62 | 365 |
| [backend/src/controllers/program.controllers.ts](/backend/src/controllers/program.controllers.ts) | TypeScript | 328 | 74 | 90 | 492 |
| [backend/src/controllers/school.controllers.ts](/backend/src/controllers/school.controllers.ts) | TypeScript | 283 | 70 | 79 | 432 |
| [backend/src/controllers/session.controllers.ts](/backend/src/controllers/session.controllers.ts) | TypeScript | 86 | 19 | 19 | 124 |
| [backend/src/controllers/upload.controllers.ts](/backend/src/controllers/upload.controllers.ts) | TypeScript | 287 | 44 | 53 | 384 |
| [backend/src/controllers/user.controllers.ts](/backend/src/controllers/user.controllers.ts) | TypeScript | 772 | 47 | 87 | 906 |
| [backend/src/lib/schoolData.ts](/backend/src/lib/schoolData.ts) | TypeScript | 983 | 8 | 12 | 1,003 |
| [backend/src/middleWare/auth.middleware.ts](/backend/src/middleWare/auth.middleware.ts) | TypeScript | -31 | 0 | -7 | -38 |
| [backend/src/middleWare/material.middleware.ts](/backend/src/middleWare/material.middleware.ts) | TypeScript | -272 | -24 | -47 | -343 |
| [backend/src/middleware/auth.middleware.ts](/backend/src/middleware/auth.middleware.ts) | TypeScript | 199 | 42 | 48 | 289 |
| [backend/src/middleware/error.middleware.ts](/backend/src/middleware/error.middleware.ts) | TypeScript | 76 | 12 | 12 | 100 |
| [backend/src/middleware/material.middleware.ts](/backend/src/middleware/material.middleware.ts) | TypeScript | 287 | 27 | 53 | 367 |
| [backend/src/middleware/rateLimiter.ts](/backend/src/middleware/rateLimiter.ts) | TypeScript | 96 | 16 | 21 | 133 |
| [backend/src/middleware/session.middleware.ts](/backend/src/middleware/session.middleware.ts) | TypeScript | 83 | 12 | 17 | 112 |
| [backend/src/middleware/upload.middleware.ts](/backend/src/middleware/upload.middleware.ts) | TypeScript | 30 | 4 | 4 | 38 |
| [backend/src/middleware/validation/auth.validation.ts](/backend/src/middleware/validation/auth.validation.ts) | TypeScript | 397 | 49 | 66 | 512 |
| [backend/src/middleware/validation/common.validation.ts](/backend/src/middleware/validation/common.validation.ts) | TypeScript | 132 | 14 | 30 | 176 |
| [backend/src/middleware/validation/course.validation.ts](/backend/src/middleware/validation/course.validation.ts) | TypeScript | 172 | 14 | 24 | 210 |
| [backend/src/middleware/validation/enrollment.validation.ts](/backend/src/middleware/validation/enrollment.validation.ts) | TypeScript | 61 | 5 | 16 | 82 |
| [backend/src/middleware/validation/onboarding.validation.ts](/backend/src/middleware/validation/onboarding.validation.ts) | TypeScript | 69 | 4 | 16 | 89 |
| [backend/src/middleware/validation/password.validation.ts](/backend/src/middleware/validation/password.validation.ts) | TypeScript | 22 | 1 | 5 | 28 |
| [backend/src/middleware/validation/program.validation.ts](/backend/src/middleware/validation/program.validation.ts) | TypeScript | 109 | 3 | 25 | 137 |
| [backend/src/middleware/validation/query.validation.ts](/backend/src/middleware/validation/query.validation.ts) | TypeScript | 100 | 6 | 25 | 131 |
| [backend/src/middleware/validation/school.validation.ts](/backend/src/middleware/validation/school.validation.ts) | TypeScript | 72 | 2 | 16 | 90 |
| [backend/src/middleware/validation/session.validation.ts](/backend/src/middleware/validation/session.validation.ts) | TypeScript | 61 | 12 | 15 | 88 |
| [backend/src/middleware/validation/user.validation.ts](/backend/src/middleware/validation/user.validation.ts) | TypeScript | 174 | 8 | 40 | 222 |
| [backend/src/models/BookMark.ts](/backend/src/models/BookMark.ts) | TypeScript | 206 | 12 | 38 | 256 |
| [backend/src/models/Course.ts](/backend/src/models/Course.ts) | TypeScript | 269 | 6 | 7 | 282 |
| [backend/src/models/Enrollment.ts](/backend/src/models/Enrollment.ts) | TypeScript | 260 | 11 | 33 | 304 |
| [backend/src/models/File.ts](/backend/src/models/File.ts) | TypeScript | 63 | 0 | 3 | 66 |
| [backend/src/models/Material.ts](/backend/src/models/Material.ts) | TypeScript | -311 | -21 | -41 | -373 |
| [backend/src/models/Notification.ts](/backend/src/models/Notification.ts) | TypeScript | 331 | 15 | 44 | 390 |
| [backend/src/models/Post.ts](/backend/src/models/Post.ts) | TypeScript | -4 | 0 | -2 | -6 |
| [backend/src/models/Program.ts](/backend/src/models/Program.ts) | TypeScript | 125 | 3 | 4 | 132 |
| [backend/src/models/Report.ts](/backend/src/models/Report.ts) | TypeScript | 413 | 21 | 59 | 493 |
| [backend/src/models/School.ts](/backend/src/models/School.ts) | TypeScript | 59 | 3 | 4 | 66 |
| [backend/src/models/StudyMaterial.ts](/backend/src/models/StudyMaterial.ts) | TypeScript | 479 | 35 | 56 | 570 |
| [backend/src/models/User.ts](/backend/src/models/User.ts) | TypeScript | 389 | 27 | 40 | 456 |
| [backend/src/models/UserSession.ts](/backend/src/models/UserSession.ts) | TypeScript | 97 | 7 | 11 | 115 |
| [backend/src/routes/auth.routes.ts](/backend/src/routes/auth.routes.ts) | TypeScript | 62 | 18 | 14 | 94 |
| [backend/src/routes/chat.routes.ts](/backend/src/routes/chat.routes.ts) | TypeScript | 2 | 9 | 2 | 13 |
| [backend/src/routes/course.routes.ts](/backend/src/routes/course.routes.ts) | TypeScript | 278 | 120 | 51 | 449 |
| [backend/src/routes/dashboard.routes.ts](/backend/src/routes/dashboard.routes.ts) | TypeScript | 51 | 42 | 11 | 104 |
| [backend/src/routes/material.routes.ts](/backend/src/routes/material.routes.ts) | TypeScript | 20 | -36 | -4 | -20 |
| [backend/src/routes/onboarding.routes.ts](/backend/src/routes/onboarding.routes.ts) | TypeScript | 22 | 24 | 10 | 56 |
| [backend/src/routes/program.routes.ts](/backend/src/routes/program.routes.ts) | TypeScript | 36 | 45 | 15 | 96 |
| [backend/src/routes/school.routes.ts](/backend/src/routes/school.routes.ts) | TypeScript | 37 | 45 | 15 | 97 |
| [backend/src/routes/session.routes.ts](/backend/src/routes/session.routes.ts) | TypeScript | 25 | 21 | 8 | 54 |
| [backend/src/routes/upload.routes.ts](/backend/src/routes/upload.routes.ts) | TypeScript | 11 | 19 | 7 | 37 |
| [backend/src/routes/user.routes.ts](/backend/src/routes/user.routes.ts) | TypeScript | 36 | 100 | 18 | 154 |
| [backend/src/server.ts](/backend/src/server.ts) | TypeScript | 38 | 7 | 5 | 50 |
| [backend/src/types/Academic.ts](/backend/src/types/Academic.ts) | TypeScript | 290 | 14 | 24 | 328 |
| [backend/src/types/express/index.d.ts](/backend/src/types/express/index.d.ts) | TypeScript | 23 | 0 | 1 | 24 |
| [backend/src/types/studyMaterial.ts](/backend/src/types/studyMaterial.ts) | TypeScript | 28 | 0 | 4 | 32 |
| [backend/src/types/uploadTypes/post.ts](/backend/src/types/uploadTypes/post.ts) | TypeScript | 37 | 1 | 3 | 41 |
| [backend/src/types/uploadTypes/upload.ts](/backend/src/types/uploadTypes/upload.ts) | TypeScript | 42 | 1 | 3 | 46 |
| [backend/src/uploadTypes/post.ts](/backend/src/uploadTypes/post.ts) | TypeScript | -37 | -1 | -3 | -41 |
| [backend/src/uploadTypes/upload.ts](/backend/src/uploadTypes/upload.ts) | TypeScript | -30 | -1 | -2 | -33 |
| [backend/src/utils/Api.utils.ts](/backend/src/utils/Api.utils.ts) | TypeScript | 80 | 10 | 16 | 106 |
| [backend/src/utils/ApiError.ts](/backend/src/utils/ApiError.ts) | TypeScript | 25 | 12 | 4 | 41 |
| [backend/src/utils/ApiResponse.ts](/backend/src/utils/ApiResponse.ts) | TypeScript | 13 | 20 | 3 | 36 |
| [backend/src/utils/Cache.utils.ts](/backend/src/utils/Cache.utils.ts) | TypeScript | 254 | 42 | 60 | 356 |
| [backend/src/utils/Date.utils.ts](/backend/src/utils/Date.utils.ts) | TypeScript | 76 | 6 | 11 | 93 |
| [backend/src/utils/Format.utils.ts](/backend/src/utils/Format.utils.ts) | TypeScript | 84 | 15 | 21 | 120 |
| [backend/src/utils/Random.utils.ts](/backend/src/utils/Random.utils.ts) | TypeScript | 65 | 16 | 16 | 97 |
| [backend/src/utils/Search.utils.ts](/backend/src/utils/Search.utils.ts) | TypeScript | 149 | 18 | 35 | 202 |
| [backend/src/utils/Stats.utils.ts](/backend/src/utils/Stats.utils.ts) | TypeScript | 404 | 15 | 53 | 472 |
| [backend/src/utils/asyncHandler.ts](/backend/src/utils/asyncHandler.ts) | TypeScript | 12 | 20 | 4 | 36 |
| [backend/src/utils/database.utils.ts](/backend/src/utils/database.utils.ts) | TypeScript | 73 | 9 | 12 | 94 |
| [backend/src/utils/email.utils.ts](/backend/src/utils/email.utils.ts) | TypeScript | 295 | 16 | 36 | 347 |
| [backend/src/utils/jwt.enhanced.ts](/backend/src/utils/jwt.enhanced.ts) | TypeScript | 176 | 43 | 43 | 262 |
| [backend/src/utils/logger.utils.ts](/backend/src/utils/logger.utils.ts) | TypeScript | 92 | 7 | 20 | 119 |
| [backend/src/utils/migration.utilts.ts](/backend/src/utils/migration.utilts.ts) | TypeScript | 27 | 3 | 7 | 37 |
| [backend/src/utils/password.security.ts](/backend/src/utils/password.security.ts) | TypeScript | 23 | 3 | 4 | 30 |
| [backend/src/utils/session.utils.ts](/backend/src/utils/session.utils.ts) | TypeScript | 87 | 13 | 20 | 120 |
| [backend/src/utils/typeValidation.ts](/backend/src/utils/typeValidation.ts) | TypeScript | 10 | 0 | 1 | 11 |
| [backend/src/utils/validation.ts](/backend/src/utils/validation.ts) | TypeScript | -60 | -13 | -15 | -88 |
| [backend/types/express/index.d.ts](/backend/types/express/index.d.ts) | TypeScript | -14 | -1 | -1 | -16 |
| [backend/types/studyMaterial.ts](/backend/types/studyMaterial.ts) | TypeScript | -28 | 0 | -4 | -32 |
| [frontend/.next/app-build-manifest.json](/frontend/.next/app-build-manifest.json) | JSON | -27 | 0 | 0 | -27 |
| [frontend/.next/cache/images/EcapzrmLt-cUuvFBiJxyrnXErpWYY8fAW\_XAzrgayok/60.1750657667526.Vy8iNDBiLTE5NzM3YzZkNWE2Ig.Vy8iNDBiLTE5NzM3YzZkNWE2Ig.svg](/frontend/.next/cache/images/EcapzrmLt-cUuvFBiJxyrnXErpWYY8fAW_XAzrgayok/60.1750657667526.Vy8iNDBiLTE5NzM3YzZkNWE2Ig.Vy8iNDBiLTE5NzM3YzZkNWE2Ig.svg) | XML | 1 | 0 | 0 | 1 |
| [frontend/.next/server/app-paths-manifest.json](/frontend/.next/server/app-paths-manifest.json) | JSON | -1 | 0 | 0 | -1 |
| [frontend/.next/server/app/(protected)/(DashBoard)/files/page.js](/frontend/.next/server/app/(protected)/(DashBoard)/files/page.js) | JavaScript | 16 | 0 | 1 | 17 |
| [frontend/.next/server/app/(protected)/(DashBoard)/files/page/app-build-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/files/page/app-build-manifest.json) | JSON | 26 | 0 | 0 | 26 |
| [frontend/.next/server/app/(protected)/(DashBoard)/files/page/app-paths-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/files/page/app-paths-manifest.json) | JSON | 3 | 0 | 0 | 3 |
| [frontend/.next/server/app/(protected)/(DashBoard)/files/page/build-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/files/page/build-manifest.json) | JSON | 19 | 0 | 0 | 19 |
| [frontend/.next/server/app/(protected)/(DashBoard)/files/page/next-font-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/files/page/next-font-manifest.json) | JSON | 11 | 0 | 0 | 11 |
| [frontend/.next/server/app/(protected)/(DashBoard)/files/page/react-loadable-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/files/page/react-loadable-manifest.json) | JSON | 1 | 0 | 0 | 1 |
| [frontend/.next/server/app/(protected)/(DashBoard)/files/page/server-reference-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/files/page/server-reference-manifest.json) | JSON | 4 | 0 | 0 | 4 |
| [frontend/.next/server/app/(protected)/(DashBoard)/files/page\_client-reference-manifest.js](/frontend/.next/server/app/(protected)/(DashBoard)/files/page_client-reference-manifest.js) | JavaScript | 2 | 0 | 1 | 3 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/page.js](/frontend/.next/server/app/(protected)/(DashBoard)/materials/page.js) | JavaScript | 16 | 0 | 1 | 17 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/page/app-build-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/page/app-build-manifest.json) | JSON | 25 | 0 | 0 | 25 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/page/app-paths-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/page/app-paths-manifest.json) | JSON | 3 | 0 | 0 | 3 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/page/build-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/page/build-manifest.json) | JSON | 19 | 0 | 0 | 19 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/page/next-font-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/page/next-font-manifest.json) | JSON | 11 | 0 | 0 | 11 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/page/react-loadable-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/page/react-loadable-manifest.json) | JSON | 1 | 0 | 0 | 1 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/page/server-reference-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/page/server-reference-manifest.json) | JSON | 4 | 0 | 0 | 4 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/page\_client-reference-manifest.js](/frontend/.next/server/app/(protected)/(DashBoard)/materials/page_client-reference-manifest.js) | JavaScript | 2 | 0 | 1 | 3 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page.js](/frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page.js) | JavaScript | 16 | 0 | 1 | 17 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/app-build-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/app-build-manifest.json) | JSON | 26 | 0 | 0 | 26 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/app-paths-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/app-paths-manifest.json) | JSON | 3 | 0 | 0 | 3 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/build-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/build-manifest.json) | JSON | 19 | 0 | 0 | 19 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/next-font-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/next-font-manifest.json) | JSON | 11 | 0 | 0 | 11 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/react-loadable-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/react-loadable-manifest.json) | JSON | 1 | 0 | 0 | 1 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/server-reference-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page/server-reference-manifest.json) | JSON | 4 | 0 | 0 | 4 |
| [frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page\_client-reference-manifest.js](/frontend/.next/server/app/(protected)/(DashBoard)/materials/upload/page_client-reference-manifest.js) | JavaScript | 2 | 0 | 1 | 3 |
| [frontend/.next/server/app/(protected)/(DashBoard)/notifications/page/app-build-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/notifications/page/app-build-manifest.json) | JSON | 1 | 0 | 0 | 1 |
| [frontend/.next/server/app/(protected)/(DashBoard)/page/app-build-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/page/app-build-manifest.json) | JSON | -1 | 0 | 0 | -1 |
| [frontend/.next/server/app/(protected)/(DashBoard)/profile/page.js](/frontend/.next/server/app/(protected)/(DashBoard)/profile/page.js) | JavaScript | -2 | 0 | 0 | -2 |
| [frontend/.next/server/app/(protected)/(DashBoard)/profile/page/app-build-manifest.json](/frontend/.next/server/app/(protected)/(DashBoard)/profile/page/app-build-manifest.json) | JSON | -2 | 0 | 0 | -2 |
| [frontend/.next/server/app/(protected)/page.js](/frontend/.next/server/app/(protected)/page.js) | JavaScript | 1 | 0 | 0 | 1 |
| [frontend/.next/server/app/(protected)/page/app-build-manifest.json](/frontend/.next/server/app/(protected)/page/app-build-manifest.json) | JSON | -1 | 0 | 0 | -1 |
| [frontend/.next/server/app/(protected)/profile/page.js](/frontend/.next/server/app/(protected)/profile/page.js) | JavaScript | 14 | 0 | 1 | 15 |
| [frontend/.next/server/app/(protected)/profile/page/app-build-manifest.json](/frontend/.next/server/app/(protected)/profile/page/app-build-manifest.json) | JSON | 23 | 0 | 0 | 23 |
| [frontend/.next/server/app/(protected)/profile/page/app-paths-manifest.json](/frontend/.next/server/app/(protected)/profile/page/app-paths-manifest.json) | JSON | 3 | 0 | 0 | 3 |
| [frontend/.next/server/app/(protected)/profile/page/build-manifest.json](/frontend/.next/server/app/(protected)/profile/page/build-manifest.json) | JSON | 19 | 0 | 0 | 19 |
| [frontend/.next/server/app/(protected)/profile/page/next-font-manifest.json](/frontend/.next/server/app/(protected)/profile/page/next-font-manifest.json) | JSON | 11 | 0 | 0 | 11 |
| [frontend/.next/server/app/(protected)/profile/page/react-loadable-manifest.json](/frontend/.next/server/app/(protected)/profile/page/react-loadable-manifest.json) | JSON | 1 | 0 | 0 | 1 |
| [frontend/.next/server/app/(protected)/profile/page/server-reference-manifest.json](/frontend/.next/server/app/(protected)/profile/page/server-reference-manifest.json) | JSON | 4 | 0 | 0 | 4 |
| [frontend/.next/server/app/(protected)/profile/page\_client-reference-manifest.js](/frontend/.next/server/app/(protected)/profile/page_client-reference-manifest.js) | JavaScript | 2 | 0 | 1 | 3 |
| [frontend/.next/server/app/api/auth/\[...nextauth\]/route.js](/frontend/.next/server/app/api/auth/%5B...nextauth%5D/route.js) | JavaScript | 6 | 0 | 0 | 6 |
| [frontend/.next/server/app/page.js](/frontend/.next/server/app/page.js) | JavaScript | 3 | 0 | 0 | 3 |
| [frontend/.next/server/chunks/69cb7\_mime-db\_8620ab1f.\_.js](/frontend/.next/server/chunks/69cb7_mime-db_8620ab1f._.js) | JavaScript | 12 | 7 | 5 | 24 |
| [frontend/.next/server/chunks/\[root-of-the-server\]\_\_87a0376b.\_.js](/frontend/.next/server/chunks/%5Broot-of-the-server%5D__87a0376b._.js) | JavaScript | 418 | 6 | 48 | 472 |
| [frontend/.next/server/chunks/node\_modules\_axios\_lib\_c4a55de8.\_.js](/frontend/.next/server/chunks/node_modules_axios_lib_c4a55de8._.js) | JavaScript | 3,886 | 636 | 57 | 4,579 |
| [frontend/.next/server/chunks/node\_modules\_bd3cbde1.\_.js](/frontend/.next/server/chunks/node_modules_bd3cbde1._.js) | JavaScript | 7,012 | 954 | 126 | 8,092 |
| [frontend/.next/server/chunks/node\_modules\_jose\_dist\_node\_cjs\_b4a80197.\_.js](/frontend/.next/server/chunks/node_modules_jose_dist_node_cjs_b4a80197._.js) | JavaScript | 5,223 | 1 | 87 | 5,311 |
| [frontend/.next/server/chunks/node\_modules\_next-auth\_0aed504c.\_.js](/frontend/.next/server/chunks/node_modules_next-auth_0aed504c._.js) | JavaScript | 4,449 | 1 | 48 | 4,498 |
| [frontend/.next/server/chunks/node\_modules\_next\_ebd985e5.\_.js](/frontend/.next/server/chunks/node_modules_next_ebd985e5._.js) | JavaScript | 7,954 | 902 | 77 | 8,933 |
| [frontend/.next/server/chunks/node\_modules\_openid-client\_ef38b3be.\_.js](/frontend/.next/server/chunks/node_modules_openid-client_ef38b3be._.js) | JavaScript | 3,252 | 62 | 32 | 3,346 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_0e47f687.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__0e47f687._.js) | JavaScript | 1,316 | 3 | 16 | 1,335 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_21dac545.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__21dac545._.js) | JavaScript | 767 | 3 | 15 | 785 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_32284f3f.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__32284f3f._.js) | JavaScript | 1,047 | 9 | 37 | 1,093 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_5ad803e7.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__5ad803e7._.js) | JavaScript | 273 | 2 | 13 | 288 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_7bc0165b.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__7bc0165b._.js) | JavaScript | 1,200 | 2 | 15 | 1,217 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_89839932.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__89839932._.js) | JavaScript | 2,585 | 6 | 49 | 2,640 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_8dffd476.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__8dffd476._.js) | JavaScript | 523 | 25 | 42 | 590 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_9040c938.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__9040c938._.js) | JavaScript | 1,397 | 10 | 38 | 1,445 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_96f3454a.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__96f3454a._.js) | JavaScript | -291 | -4 | 2 | -293 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_c3516c0f.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__c3516c0f._.js) | JavaScript | 1,876 | 13 | 38 | 1,927 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_c7a04ae0.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__c7a04ae0._.js) | JavaScript | 474 | 1 | 10 | 485 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_dd9e8ab5.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__dd9e8ab5._.js) | JavaScript | 241 | 1 | 18 | 260 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_e73a09ce.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__e73a09ce._.js) | JavaScript | 1,984 | 188 | 46 | 2,218 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_e8bca49f.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__e8bca49f._.js) | JavaScript | 20 | 0 | 8 | 28 |
| [frontend/.next/server/chunks/ssr/\[root-of-the-server\]\_\_e9706de6.\_.js](/frontend/.next/server/chunks/ssr/%5Broot-of-the-server%5D__e9706de6._.js) | JavaScript | -26 | -7 | 0 | -33 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_0293575c.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_0293575c._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_03dc37be.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_03dc37be._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_1cdcf883.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_1cdcf883._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_2b33c0f7.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_2b33c0f7._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_2da6f952.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_2da6f952._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_4bf6516e.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_4bf6516e._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_4f6553fe.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_4f6553fe._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_669c50c1.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_669c50c1._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_756e0622.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_756e0622._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_770555c9.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_770555c9._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_7943174c.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_7943174c._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_8648febd.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_8648febd._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_86bf1f49.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_86bf1f49._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_8bf9ce50.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_8bf9ce50._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_b3a6bf81.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_b3a6bf81._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_b9e00c1e.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_b9e00c1e._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_cbb61d38.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_cbb61d38._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_d28c5c27.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_d28c5c27._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_d3b673c4.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_d3b673c4._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_d842c031.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_d842c031._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\[turbopack\]\_browser\_dev\_hmr-client\_hmr-client\_ts\_ff82f81d.\_.js](/frontend/.next/server/chunks/ssr/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_ff82f81d._.js) | JavaScript | 13 | 0 | 3 | 16 |
| [frontend/.next/server/chunks/ssr/\_006be25b.\_.js](/frontend/.next/server/chunks/ssr/_006be25b._.js) | JavaScript | 891 | 2 | 19 | 912 |
| [frontend/.next/server/chunks/ssr/\_06236123.\_.js](/frontend/.next/server/chunks/ssr/_06236123._.js) | JavaScript | 1,635 | 86 | 25 | 1,746 |
| [frontend/.next/server/chunks/ssr/\_09809b86.\_.js](/frontend/.next/server/chunks/ssr/_09809b86._.js) | JavaScript | 1,342 | 44 | 18 | 1,404 |
| [frontend/.next/server/chunks/ssr/\_10215b1a.\_.js](/frontend/.next/server/chunks/ssr/_10215b1a._.js) | JavaScript | 983 | 15 | 10 | 1,008 |
| [frontend/.next/server/chunks/ssr/\_1db3b352.\_.js](/frontend/.next/server/chunks/ssr/_1db3b352._.js) | JavaScript | 971 | 4 | 31 | 1,006 |
| [frontend/.next/server/chunks/ssr/\_24674e13.\_.js](/frontend/.next/server/chunks/ssr/_24674e13._.js) | JavaScript | 464 | 1 | 19 | 484 |
| [frontend/.next/server/chunks/ssr/\_249bd033.\_.js](/frontend/.next/server/chunks/ssr/_249bd033._.js) | JavaScript | 2,018 | 32 | 14 | 2,064 |
| [frontend/.next/server/chunks/ssr/\_25159dab.\_.js](/frontend/.next/server/chunks/ssr/_25159dab._.js) | JavaScript | 2,159 | 40 | 12 | 2,211 |
| [frontend/.next/server/chunks/ssr/\_3d02739b.\_.js](/frontend/.next/server/chunks/ssr/_3d02739b._.js) | JavaScript | 1,642 | 85 | 26 | 1,753 |
| [frontend/.next/server/chunks/ssr/\_3f279935.\_.js](/frontend/.next/server/chunks/ssr/_3f279935._.js) | JavaScript | 600 | 3 | 13 | 616 |
| [frontend/.next/server/chunks/ssr/\_3f613bef.\_.js](/frontend/.next/server/chunks/ssr/_3f613bef._.js) | JavaScript | 600 | 3 | 13 | 616 |
| [frontend/.next/server/chunks/ssr/\_41c338cc.\_.js](/frontend/.next/server/chunks/ssr/_41c338cc._.js) | JavaScript | 617 | 1 | 20 | 638 |
| [frontend/.next/server/chunks/ssr/\_4990add2.\_.js](/frontend/.next/server/chunks/ssr/_4990add2._.js) | JavaScript | 66 | 1 | 12 | 79 |
| [frontend/.next/server/chunks/ssr/\_49ba6fdf.\_.js](/frontend/.next/server/chunks/ssr/_49ba6fdf._.js) | JavaScript | 506 | 1 | 22 | 529 |
| [frontend/.next/server/chunks/ssr/\_4b47c0cf.\_.js](/frontend/.next/server/chunks/ssr/_4b47c0cf._.js) | JavaScript | 66 | 1 | 12 | 79 |
| [frontend/.next/server/chunks/ssr/\_519aa6d1.\_.js](/frontend/.next/server/chunks/ssr/_519aa6d1._.js) | JavaScript | -32 | 0 | 0 | -32 |
| [frontend/.next/server/chunks/ssr/\_51c4a45b.\_.js](/frontend/.next/server/chunks/ssr/_51c4a45b._.js) | JavaScript | 595 | 3 | 12 | 610 |
| [frontend/.next/server/chunks/ssr/\_51e73945.\_.js](/frontend/.next/server/chunks/ssr/_51e73945._.js) | JavaScript | 471 | 1 | 18 | 490 |
| [frontend/.next/server/chunks/ssr/\_59d40ead.\_.js](/frontend/.next/server/chunks/ssr/_59d40ead._.js) | JavaScript | 842 | 2 | 18 | 862 |
| [frontend/.next/server/chunks/ssr/\_5a77d05a.\_.js](/frontend/.next/server/chunks/ssr/_5a77d05a._.js) | JavaScript | 289 | 4 | 21 | 314 |
| [frontend/.next/server/chunks/ssr/\_60fe3ed0.\_.js](/frontend/.next/server/chunks/ssr/_60fe3ed0._.js) | JavaScript | 833 | 4 | 31 | 868 |
| [frontend/.next/server/chunks/ssr/\_6a6cfda1.\_.js](/frontend/.next/server/chunks/ssr/_6a6cfda1._.js) | JavaScript | -15 | 3 | 0 | -12 |
| [frontend/.next/server/chunks/ssr/\_70705be7.\_.js](/frontend/.next/server/chunks/ssr/_70705be7._.js) | JavaScript | 363 | 4 | 24 | 391 |
| [frontend/.next/server/chunks/ssr/\_73875dad.\_.js](/frontend/.next/server/chunks/ssr/_73875dad._.js) | JavaScript | 630 | 1 | 19 | 650 |
| [frontend/.next/server/chunks/ssr/\_76f4a1e2.\_.js](/frontend/.next/server/chunks/ssr/_76f4a1e2._.js) | JavaScript | 763 | 2 | 7 | 772 |
| [frontend/.next/server/chunks/ssr/\_7a8745e2.\_.js](/frontend/.next/server/chunks/ssr/_7a8745e2._.js) | JavaScript | 718 | 2 | 8 | 728 |
| [frontend/.next/server/chunks/ssr/\_82295b60.\_.js](/frontend/.next/server/chunks/ssr/_82295b60._.js) | JavaScript | 791 | 2 | 7 | 800 |
| [frontend/.next/server/chunks/ssr/\_8301a503.\_.js](/frontend/.next/server/chunks/ssr/_8301a503._.js) | JavaScript | 464 | 1 | 19 | 484 |
| [frontend/.next/server/chunks/ssr/\_83e0b2af.\_.js](/frontend/.next/server/chunks/ssr/_83e0b2af._.js) | JavaScript | 595 | 3 | 12 | 610 |
| [frontend/.next/server/chunks/ssr/\_863a2000.\_.js](/frontend/.next/server/chunks/ssr/_863a2000._.js) | JavaScript | 891 | 2 | 19 | 912 |
| [frontend/.next/server/chunks/ssr/\_9831ca18.\_.js](/frontend/.next/server/chunks/ssr/_9831ca18._.js) | JavaScript | 27 | 0 | 0 | 27 |
| [frontend/.next/server/chunks/ssr/\_a1dcf1d9.\_.js](/frontend/.next/server/chunks/ssr/_a1dcf1d9._.js) | JavaScript | 1,862 | 25 | 12 | 1,899 |
| [frontend/.next/server/chunks/ssr/\_a5fd4c5a.\_.js](/frontend/.next/server/chunks/ssr/_a5fd4c5a._.js) | JavaScript | 1,343 | 62 | 23 | 1,428 |
| [frontend/.next/server/chunks/ssr/\_a8738c7a.\_.js](/frontend/.next/server/chunks/ssr/_a8738c7a._.js) | JavaScript | 344 | 48 | 13 | 405 |
| [frontend/.next/server/chunks/ssr/\_a9e2c56c.\_.js](/frontend/.next/server/chunks/ssr/_a9e2c56c._.js) | JavaScript | 1,714 | 52 | 36 | 1,802 |
| [frontend/.next/server/chunks/ssr/\_baf11752.\_.js](/frontend/.next/server/chunks/ssr/_baf11752._.js) | JavaScript | 0 | -9 | 0 | -9 |
| [frontend/.next/server/chunks/ssr/\_bca0b29f.\_.js](/frontend/.next/server/chunks/ssr/_bca0b29f._.js) | JavaScript | 363 | 4 | 24 | 391 |
| [frontend/.next/server/chunks/ssr/\_c5b72467.\_.js](/frontend/.next/server/chunks/ssr/_c5b72467._.js) | JavaScript | 659 | 3 | 7 | 669 |
| [frontend/.next/server/chunks/ssr/\_cc9a3b4a.\_.js](/frontend/.next/server/chunks/ssr/_cc9a3b4a._.js) | JavaScript | 449 | 19 | 10 | 478 |
| [frontend/.next/server/chunks/ssr/\_cff0ed03.\_.js](/frontend/.next/server/chunks/ssr/_cff0ed03._.js) | JavaScript | 1,643 | 24 | 11 | 1,678 |
| [frontend/.next/server/chunks/ssr/\_d206e29a.\_.js](/frontend/.next/server/chunks/ssr/_d206e29a._.js) | JavaScript | 842 | 2 | 18 | 862 |
| [frontend/.next/server/chunks/ssr/\_d7fa6951.\_.js](/frontend/.next/server/chunks/ssr/_d7fa6951._.js) | JavaScript | 600 | 3 | 13 | 616 |
| [frontend/.next/server/chunks/ssr/\_da8e705a.\_.js](/frontend/.next/server/chunks/ssr/_da8e705a._.js) | JavaScript | 96 | 1 | 13 | 110 |
| [frontend/.next/server/chunks/ssr/\_e5fffbb4.\_.js](/frontend/.next/server/chunks/ssr/_e5fffbb4._.js) | JavaScript | 833 | 1 | 7 | 841 |
| [frontend/.next/server/chunks/ssr/\_ec56fbff.\_.js](/frontend/.next/server/chunks/ssr/_ec56fbff._.js) | JavaScript | 66 | 1 | 12 | 79 |
| [frontend/.next/server/chunks/ssr/\_ee4f345f.\_.js](/frontend/.next/server/chunks/ssr/_ee4f345f._.js) | JavaScript | 643 | 1 | 18 | 662 |
| [frontend/.next/server/chunks/ssr/\_f9dd05c7.\_.js](/frontend/.next/server/chunks/ssr/_f9dd05c7._.js) | JavaScript | 588 | 4 | 30 | 622 |
| [frontend/.next/server/chunks/ssr/\_fc5c2acc.\_.js](/frontend/.next/server/chunks/ssr/_fc5c2acc._.js) | JavaScript | 1,144 | 4 | 7 | 1,155 |
| [frontend/.next/server/chunks/ssr/\_fd465e95.\_.js](/frontend/.next/server/chunks/ssr/_fd465e95._.js) | JavaScript | 1,174 | 45 | 17 | 1,236 |
| [frontend/.next/server/chunks/ssr/app\_(auth)\_sign-in\_page\_tsx\_e6815a91.\_.js](/frontend/.next/server/chunks/ssr/app_(auth)_sign-in_page_tsx_e6815a91._.js) | JavaScript | -169 | -15 | 0 | -184 |
| [frontend/.next/server/chunks/ssr/node\_modules\_03bcc046.\_.js](/frontend/.next/server/chunks/ssr/node_modules_03bcc046._.js) | JavaScript | 4,211 | 1,091 | 33 | 5,335 |
| [frontend/.next/server/chunks/ssr/node\_modules\_0a344632.\_.js](/frontend/.next/server/chunks/ssr/node_modules_0a344632._.js) | JavaScript | 4,211 | 1,091 | 33 | 5,335 |
| [frontend/.next/server/chunks/ssr/node\_modules\_0a485445.\_.js](/frontend/.next/server/chunks/ssr/node_modules_0a485445._.js) | JavaScript | 3,692 | 669 | 89 | 4,450 |
| [frontend/.next/server/chunks/ssr/node\_modules\_138aef0f.\_.js](/frontend/.next/server/chunks/ssr/node_modules_138aef0f._.js) | JavaScript | 11,362 | 1,501 | 39 | 12,902 |
| [frontend/.next/server/chunks/ssr/node\_modules\_1fe1724f.\_.js](/frontend/.next/server/chunks/ssr/node_modules_1fe1724f._.js) | JavaScript | 1,248 | 49 | 65 | 1,362 |
| [frontend/.next/server/chunks/ssr/node\_modules\_2db1fc38.\_.js](/frontend/.next/server/chunks/ssr/node_modules_2db1fc38._.js) | JavaScript | 11,391 | 1,507 | 40 | 12,938 |
| [frontend/.next/server/chunks/ssr/node\_modules\_2dd2ea4a.\_.js](/frontend/.next/server/chunks/ssr/node_modules_2dd2ea4a._.js) | JavaScript | 679 | 67 | 35 | 781 |
| [frontend/.next/server/chunks/ssr/node\_modules\_3b3ddf62.\_.js](/frontend/.next/server/chunks/ssr/node_modules_3b3ddf62._.js) | JavaScript | 4,211 | 1,091 | 33 | 5,335 |
| [frontend/.next/server/chunks/ssr/node\_modules\_403e2b43.\_.js](/frontend/.next/server/chunks/ssr/node_modules_403e2b43._.js) | JavaScript | 11,127 | 1,402 | 189 | 12,718 |
| [frontend/.next/server/chunks/ssr/node\_modules\_43cedd49.\_.js](/frontend/.next/server/chunks/ssr/node_modules_43cedd49._.js) | JavaScript | 3,651 | 1,052 | 11 | 4,714 |
| [frontend/.next/server/chunks/ssr/node\_modules\_448cea27.\_.js](/frontend/.next/server/chunks/ssr/node_modules_448cea27._.js) | JavaScript | 6,666 | 1,141 | 48 | 7,855 |
| [frontend/.next/server/chunks/ssr/node\_modules\_530d25a5.\_.js](/frontend/.next/server/chunks/ssr/node_modules_530d25a5._.js) | JavaScript | 11,431 | 1,513 | 42 | 12,986 |
| [frontend/.next/server/chunks/ssr/node\_modules\_548423e9.\_.js](/frontend/.next/server/chunks/ssr/node_modules_548423e9._.js) | JavaScript | 21,911 | 2,672 | 222 | 24,805 |
| [frontend/.next/server/chunks/ssr/node\_modules\_5d8330d5.\_.js](/frontend/.next/server/chunks/ssr/node_modules_5d8330d5._.js) | JavaScript | 18,076 | 1,591 | 210 | 19,877 |
| [frontend/.next/server/chunks/ssr/node\_modules\_68ca7d3e.\_.js](/frontend/.next/server/chunks/ssr/node_modules_68ca7d3e._.js) | JavaScript | 3,718 | 1,064 | 13 | 4,795 |
| [frontend/.next/server/chunks/ssr/node\_modules\_6d558152.\_.js](/frontend/.next/server/chunks/ssr/node_modules_6d558152._.js) | JavaScript | 4,181 | 1,091 | 33 | 5,305 |
| [frontend/.next/server/chunks/ssr/node\_modules\_75979fd8.\_.js](/frontend/.next/server/chunks/ssr/node_modules_75979fd8._.js) | JavaScript | 3,983 | 1,088 | 23 | 5,094 |
| [frontend/.next/server/chunks/ssr/node\_modules\_8000d830.\_.js](/frontend/.next/server/chunks/ssr/node_modules_8000d830._.js) | JavaScript | 7,806 | 246 | 46 | 8,098 |
| [frontend/.next/server/chunks/ssr/node\_modules\_8524a0de.\_.js](/frontend/.next/server/chunks/ssr/node_modules_8524a0de._.js) | JavaScript | 252 | 31 | 15 | 298 |
| [frontend/.next/server/chunks/ssr/node\_modules\_8769bc06.\_.js](/frontend/.next/server/chunks/ssr/node_modules_8769bc06._.js) | JavaScript | 3,562 | 1,040 | 5 | 4,607 |
| [frontend/.next/server/chunks/ssr/node\_modules\_8bb88407.\_.js](/frontend/.next/server/chunks/ssr/node_modules_8bb88407._.js) | JavaScript | 11,490 | 1,519 | 44 | 13,053 |
| [frontend/.next/server/chunks/ssr/node\_modules\_8fd55326.\_.js](/frontend/.next/server/chunks/ssr/node_modules_8fd55326._.js) | JavaScript | 4,086 | 723 | 107 | 4,916 |
| [frontend/.next/server/chunks/ssr/node\_modules\_9f205e4a.\_.js](/frontend/.next/server/chunks/ssr/node_modules_9f205e4a._.js) | JavaScript | 1,399 | 67 | 71 | 1,537 |
| [frontend/.next/server/chunks/ssr/node\_modules\_a3866330.\_.js](/frontend/.next/server/chunks/ssr/node_modules_a3866330._.js) | JavaScript | 21,971 | 1,809 | 265 | 24,045 |
| [frontend/.next/server/chunks/ssr/node\_modules\_a68643f5.\_.js](/frontend/.next/server/chunks/ssr/node_modules_a68643f5._.js) | JavaScript | 1,039 | 67 | 53 | 1,159 |
| [frontend/.next/server/chunks/ssr/node\_modules\_a6a3a872.\_.js](/frontend/.next/server/chunks/ssr/node_modules_a6a3a872._.js) | JavaScript | 4,156 | 1,091 | 30 | 5,277 |
| [frontend/.next/server/chunks/ssr/node\_modules\_bce26605.\_.js](/frontend/.next/server/chunks/ssr/node_modules_bce26605._.js) | JavaScript | 6,666 | 1,141 | 48 | 7,855 |
| [frontend/.next/server/chunks/ssr/node\_modules\_c42da23d.\_.js](/frontend/.next/server/chunks/ssr/node_modules_c42da23d._.js) | JavaScript | 19,714 | 1,740 | 237 | 21,691 |
| [frontend/.next/server/chunks/ssr/node\_modules\_c4b5c272.\_.js](/frontend/.next/server/chunks/ssr/node_modules_c4b5c272._.js) | JavaScript | 22,924 | 1,874 | 261 | 25,059 |
| [frontend/.next/server/chunks/ssr/node\_modules\_c5074abf.\_.js](/frontend/.next/server/chunks/ssr/node_modules_c5074abf._.js) | JavaScript | 519 | 67 | 27 | 613 |
| [frontend/.next/server/chunks/ssr/node\_modules\_cba33596.\_.js](/frontend/.next/server/chunks/ssr/node_modules_cba33596._.js) | JavaScript | 3,396 | 639 | 75 | 4,110 |
| [frontend/.next/server/chunks/ssr/node\_modules\_d6417345.\_.js](/frontend/.next/server/chunks/ssr/node_modules_d6417345._.js) | JavaScript | 4,181 | 1,091 | 33 | 5,305 |
| [frontend/.next/server/chunks/ssr/node\_modules\_e34c6155.\_.js](/frontend/.next/server/chunks/ssr/node_modules_e34c6155._.js) | JavaScript | 3,687 | 1,058 | 11 | 4,756 |
| [frontend/.next/server/chunks/ssr/node\_modules\_e85727d1.\_.js](/frontend/.next/server/chunks/ssr/node_modules_e85727d1._.js) | JavaScript | 11,379 | 1,507 | 40 | 12,926 |
| [frontend/.next/server/chunks/ssr/node\_modules\_f4ef7ee5.\_.js](/frontend/.next/server/chunks/ssr/node_modules_f4ef7ee5._.js) | JavaScript | 477 | 55 | 27 | 559 |
| [frontend/.next/server/chunks/ssr/node\_modules\_fb1fe7ba.\_.js](/frontend/.next/server/chunks/ssr/node_modules_fb1fe7ba._.js) | JavaScript | 3,835 | 1,076 | 17 | 4,928 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_30d1a681.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_30d1a681._.js) | JavaScript | 2,763 | 48 | 32 | 2,843 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_989ab699.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_989ab699._.js) | JavaScript | 20,996 | 1,695 | 222 | 22,913 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_a6826c32.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_a6826c32._.js) | JavaScript | 22,639 | 1,844 | 250 | 24,733 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_d33bf99e.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_d33bf99e._.js) | JavaScript | 2,763 | 48 | 32 | 2,843 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_d9a2b5b7.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_d9a2b5b7._.js) | JavaScript | 22,634 | 1,844 | 249 | 24,727 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_dist\_08aca538.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_dist_08aca538._.js) | JavaScript | 266 | 4 | 16 | 286 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_dist\_414379cd.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_dist_414379cd._.js) | JavaScript | 334 | 4 | 16 | 354 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_dist\_8a837b25.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_dist_8a837b25._.js) | JavaScript | 334 | 4 | 16 | 354 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_dist\_aceaad59.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_dist_aceaad59._.js) | JavaScript | 342 | 4 | 16 | 362 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_dist\_baaafdcf.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_dist_baaafdcf._.js) | JavaScript | 334 | 4 | 16 | 354 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_dist\_c8aafa91.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_dist_c8aafa91._.js) | JavaScript | 287 | 4 | 19 | 310 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_dist\_f491c985.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_dist_f491c985._.js) | JavaScript | 22,584 | 1,840 | 247 | 24,671 |
| [frontend/.next/server/chunks/ssr/node\_modules\_next\_ed21ef1b.\_.js](/frontend/.next/server/chunks/ssr/node_modules_next_ed21ef1b._.js) | JavaScript | 20,996 | 1,695 | 222 | 22,913 |
| [frontend/.next/server/chunks/ssr/node\_modules\_react-icons\_fa6\_index\_mjs\_d21d9af8.\_.js](/frontend/.next/server/chunks/ssr/node_modules_react-icons_fa6_index_mjs_d21d9af8._.js) | JavaScript | 38,923 | 2 | 4 | 38,929 |
| [frontend/.next/server/chunks/ssr/node\_modules\_react-icons\_lib\_b806b5fe.\_.js](/frontend/.next/server/chunks/ssr/node_modules_react-icons_lib_b806b5fe._.js) | JavaScript | 151 | 1 | 5 | 157 |
| [frontend/.next/server/chunks/ssr/node\_modules\_swiper\_50458eb0.\_.js](/frontend/.next/server/chunks/ssr/node_modules_swiper_50458eb0._.js) | JavaScript | 10,278 | 359 | 41 | 10,678 |
| [frontend/.next/server/chunks/ssr/node\_modules\_swiper\_65f9b25a.\_.js](/frontend/.next/server/chunks/ssr/node_modules_swiper_65f9b25a._.js) | JavaScript | 10,278 | 359 | 41 | 10,678 |
| [frontend/.next/server/chunks/ssr/node\_modules\_swiper\_ff4654a4.\_.js](/frontend/.next/server/chunks/ssr/node_modules_swiper_ff4654a4._.js) | JavaScript | 4,885 | 199 | 9 | 5,093 |
| [frontend/.next/server/chunks/ssr/node\_modules\_tailwind-merge\_dist\_bundle-mjs\_mjs\_6c53872a.\_.js](/frontend/.next/server/chunks/ssr/node_modules_tailwind-merge_dist_bundle-mjs_mjs_6c53872a._.js) | JavaScript | 3,539 | 1,040 | 4 | 4,583 |
| [frontend/.next/server/next-font-manifest.json](/frontend/.next/server/next-font-manifest.json) | JSON | -4 | 0 | 0 | -4 |
| [frontend/.next/static/chunks/\[root-of-the-server\]\_\_9d126714.\_.css](/frontend/.next/static/chunks/%5Broot-of-the-server%5D__9d126714._.css) | CSS | 1,139 | 0 | 275 | 1,414 |
| [frontend/.next/static/chunks/\_01371e4a.\_.js](/frontend/.next/static/chunks/_01371e4a._.js) | JavaScript | 1,214 | 45 | 16 | 1,275 |
| [frontend/.next/static/chunks/\_035e8c6d.\_.js](/frontend/.next/static/chunks/_035e8c6d._.js) | JavaScript | -295 | -4 | 2 | -297 |
| [frontend/.next/static/chunks/\_071c73f2.\_.js](/frontend/.next/static/chunks/_071c73f2._.js) | JavaScript | 683 | 3 | 6 | 692 |
| [frontend/.next/static/chunks/\_211c2949.\_.js](/frontend/.next/static/chunks/_211c2949._.js) | JavaScript | -15 | 3 | 0 | -12 |
| [frontend/.next/static/chunks/\_221e60f6.\_.js](/frontend/.next/static/chunks/_221e60f6._.js) | JavaScript | 1,386 | 44 | 17 | 1,447 |
| [frontend/.next/static/chunks/\_29c2fb8e.\_.js](/frontend/.next/static/chunks/_29c2fb8e._.js) | JavaScript | -26 | -7 | 0 | -33 |
| [frontend/.next/static/chunks/\_3fbf6168.\_.js](/frontend/.next/static/chunks/_3fbf6168._.js) | JavaScript | 1,027 | 15 | 9 | 1,051 |
| [frontend/.next/static/chunks/\_46e4fd3d.\_.js](/frontend/.next/static/chunks/_46e4fd3d._.js) | JavaScript | 1,220 | 2 | 8 | 1,230 |
| [frontend/.next/static/chunks/\_6361dba8.\_.js](/frontend/.next/static/chunks/_6361dba8._.js) | JavaScript | 381 | 48 | 12 | 441 |
| [frontend/.next/static/chunks/\_6ba32021.\_.js](/frontend/.next/static/chunks/_6ba32021._.js) | JavaScript | 749 | 2 | 7 | 758 |
| [frontend/.next/static/chunks/\_6dda5018.\_.js](/frontend/.next/static/chunks/_6dda5018._.js) | JavaScript | 1,170 | 4 | 6 | 1,180 |
| [frontend/.next/static/chunks/\_747a5303.\_.js](/frontend/.next/static/chunks/_747a5303._.js) | JavaScript | 362 | 39 | 12 | 413 |
| [frontend/.next/static/chunks/\_849dbb14.\_.js](/frontend/.next/static/chunks/_849dbb14._.js) | JavaScript | 1,725 | 85 | 25 | 1,835 |
| [frontend/.next/static/chunks/\_885cd454.\_.js](/frontend/.next/static/chunks/_885cd454._.js) | JavaScript | 2,315 | 40 | 11 | 2,366 |
| [frontend/.next/static/chunks/\_8a0512e5.\_.js](/frontend/.next/static/chunks/_8a0512e5._.js) | JavaScript | 1,412 | 10 | 11 | 1,433 |
| [frontend/.next/static/chunks/\_9bdacf30.\_.js](/frontend/.next/static/chunks/_9bdacf30._.js) | JavaScript | 0 | -9 | 0 | -9 |
| [frontend/.next/static/chunks/\_9e3b46e5.\_.js](/frontend/.next/static/chunks/_9e3b46e5._.js) | JavaScript | 1,350 | 3 | 9 | 1,362 |
| [frontend/.next/static/chunks/\_9f005748.\_.js](/frontend/.next/static/chunks/_9f005748._.js) | JavaScript | 27 | 0 | 0 | 27 |
| [frontend/.next/static/chunks/\_a2254658.\_.js](/frontend/.next/static/chunks/_a2254658._.js) | JavaScript | 2,811 | 14 | 44 | 2,869 |
| [frontend/.next/static/chunks/\_a5c0fcf9.\_.js](/frontend/.next/static/chunks/_a5c0fcf9._.js) | JavaScript | 825 | 2 | 6 | 833 |
| [frontend/.next/static/chunks/\_ab4403ab.\_.js](/frontend/.next/static/chunks/_ab4403ab._.js) | JavaScript | 1,898 | 13 | 11 | 1,922 |
| [frontend/.next/static/chunks/\_af2b3c56.\_.js](/frontend/.next/static/chunks/_af2b3c56._.js) | JavaScript | 478 | 25 | 7 | 510 |
| [frontend/.next/static/chunks/\_b0e1f07f.\_.js](/frontend/.next/static/chunks/_b0e1f07f._.js) | JavaScript | 509 | 19 | 9 | 537 |
| [frontend/.next/static/chunks/\_b509b6f5.\_.js](/frontend/.next/static/chunks/_b509b6f5._.js) | JavaScript | 853 | 1 | 6 | 860 |
| [frontend/.next/static/chunks/\_b6a9bc56.\_.js](/frontend/.next/static/chunks/_b6a9bc56._.js) | JavaScript | 795 | 3 | 8 | 806 |
| [frontend/.next/static/chunks/\_b887fab8.\_.js](/frontend/.next/static/chunks/_b887fab8._.js) | JavaScript | 274 | 2 | 6 | 282 |
| [frontend/.next/static/chunks/\_c5c3af78.\_.js](/frontend/.next/static/chunks/_c5c3af78._.js) | JavaScript | 1,380 | 62 | 22 | 1,464 |
| [frontend/.next/static/chunks/\_ceecc2f2.\_.js](/frontend/.next/static/chunks/_ceecc2f2._.js) | JavaScript | -74 | 3 | 0 | -71 |
| [frontend/.next/static/chunks/\_d3b5242f.\_.js](/frontend/.next/static/chunks/_d3b5242f._.js) | JavaScript | 2,003 | 25 | 11 | 2,039 |
| [frontend/.next/static/chunks/\_e2f439d0.\_.js](/frontend/.next/static/chunks/_e2f439d0._.js) | JavaScript | 1,715 | 86 | 24 | 1,825 |
| [frontend/.next/static/chunks/\_ebd5798f.\_.js](/frontend/.next/static/chunks/_ebd5798f._.js) | JavaScript | 2,162 | 32 | 13 | 2,207 |
| [frontend/.next/static/chunks/\_f211027b.\_.js](/frontend/.next/static/chunks/_f211027b._.js) | JavaScript | 1,776 | 24 | 10 | 1,810 |
| [frontend/.next/static/chunks/\_f2677280.\_.js](/frontend/.next/static/chunks/_f2677280._.js) | JavaScript | 797 | 2 | 6 | 805 |
| [frontend/.next/static/chunks/app\_(auth)\_sign-in\_page\_tsx\_2fb71492.\_.js](/frontend/.next/static/chunks/app_(auth)_sign-in_page_tsx_2fb71492._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_(auth)\_sign-in\_page\_tsx\_35904245.\_.js](/frontend/.next/static/chunks/app_(auth)_sign-in_page_tsx_35904245._.js) | JavaScript | -170 | -15 | 0 | -185 |
| [frontend/.next/static/chunks/app\_(auth)\_sign-in\_page\_tsx\_a67eeb27.\_.js](/frontend/.next/static/chunks/app_(auth)_sign-in_page_tsx_a67eeb27._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_(auth)\_sign-up\_page\_tsx\_2fb71492.\_.js](/frontend/.next/static/chunks/app_(auth)_sign-up_page_tsx_2fb71492._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_(auth)\_sign-up\_page\_tsx\_a67eeb27.\_.js](/frontend/.next/static/chunks/app_(auth)_sign-up_page_tsx_a67eeb27._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_files\_page\_tsx\_27e16dac.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_files_page_tsx_27e16dac._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_layout\_tsx\_187cced3.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_layout_tsx_187cced3._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_layout\_tsx\_40f460b6.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_layout_tsx_40f460b6._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_layout\_tsx\_b18cfa26.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_layout_tsx_b18cfa26._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_materials\_page\_tsx\_204d4c62.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_materials_page_tsx_204d4c62._.js) | JavaScript | 7 | 0 | 1 | 8 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_materials\_page\_tsx\_27e16dac.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_materials_page_tsx_27e16dac._.js) | JavaScript | 7 | 0 | 1 | 8 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_materials\_page\_tsx\_f0d8665b.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_materials_page_tsx_f0d8665b._.js) | JavaScript | 7 | 0 | 1 | 8 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_materials\_upload\_page\_tsx\_27e16dac.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_materials_upload_page_tsx_27e16dac._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_materials\_upload\_page\_tsx\_f0d8665b.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_materials_upload_page_tsx_f0d8665b._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_notifications\_page\_tsx\_f0d8665b.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_notifications_page_tsx_f0d8665b._.js) | JavaScript | 1 | 0 | 0 | 1 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_page\_tsx\_27e16dac.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_page_tsx_27e16dac._.js) | JavaScript | 5 | 0 | 1 | 6 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_page\_tsx\_53769dcd.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_page_tsx_53769dcd._.js) | JavaScript | 5 | 0 | 1 | 6 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_page\_tsx\_6c4b67ce.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_page_tsx_6c4b67ce._.js) | JavaScript | 5 | 0 | 1 | 6 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_page\_tsx\_f0d8665b.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_page_tsx_f0d8665b._.js) | JavaScript | -2 | 0 | 0 | -2 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_page\_tsx\_f88144d4.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_page_tsx_f88144d4._.js) | JavaScript | 5 | 0 | 1 | 6 |
| [frontend/.next/static/chunks/app\_(protected)\_(dashBoard)\_profile\_page\_tsx\_53769dcd.\_.js](/frontend/.next/static/chunks/app_(protected)_(dashBoard)_profile_page_tsx_53769dcd._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_(protected)\_layout\_tsx\_2fb71492.\_.js](/frontend/.next/static/chunks/app_(protected)_layout_tsx_2fb71492._.js) | JavaScript | 7 | 0 | 1 | 8 |
| [frontend/.next/static/chunks/app\_(protected)\_layout\_tsx\_a67eeb27.\_.js](/frontend/.next/static/chunks/app_(protected)_layout_tsx_a67eeb27._.js) | JavaScript | 7 | 0 | 1 | 8 |
| [frontend/.next/static/chunks/app\_(protected)\_page\_tsx\_26dbb2e0.\_.js](/frontend/.next/static/chunks/app_(protected)_page_tsx_26dbb2e0._.js) | JavaScript | 7 | 0 | 1 | 8 |
| [frontend/.next/static/chunks/app\_(protected)\_page\_tsx\_a63a88c5.\_.js](/frontend/.next/static/chunks/app_(protected)_page_tsx_a63a88c5._.js) | JavaScript | 7 | 0 | 1 | 8 |
| [frontend/.next/static/chunks/app\_(protected)\_page\_tsx\_e7e8eb0f.\_.js](/frontend/.next/static/chunks/app_(protected)_page_tsx_e7e8eb0f._.js) | JavaScript | 5 | 0 | 1 | 6 |
| [frontend/.next/static/chunks/app\_(protected)\_profile\_page\_tsx\_187cced3.\_.js](/frontend/.next/static/chunks/app_(protected)_profile_page_tsx_187cced3._.js) | JavaScript | 8 | 0 | 1 | 9 |
| [frontend/.next/static/chunks/app\_globals\_css\_f9ee138c.\_.single.css](/frontend/.next/static/chunks/app_globals_css_f9ee138c._.single.css) | CSS | 1,139 | 0 | 275 | 1,414 |
| [frontend/.next/static/chunks/app\_page\_tsx\_a67eeb27.\_.js](/frontend/.next/static/chunks/app_page_tsx_a67eeb27._.js) | JavaScript | 9 | 0 | 1 | 10 |
| [frontend/.next/static/chunks/node\_modules\_087db1be.\_.js](/frontend/.next/static/chunks/node_modules_087db1be._.js) | JavaScript | 18,361 | 1,637 | 92 | 20,090 |
| [frontend/.next/static/chunks/node\_modules\_08a2e30e.\_.js](/frontend/.next/static/chunks/node_modules_08a2e30e._.js) | JavaScript | 13,532 | 1,459 | 89 | 15,080 |
| [frontend/.next/static/chunks/node\_modules\_0932da54.\_.js](/frontend/.next/static/chunks/node_modules_0932da54._.js) | JavaScript | 13,328 | 1,477 | 78 | 14,883 |
| [frontend/.next/static/chunks/node\_modules\_0bb8a147.\_.js](/frontend/.next/static/chunks/node_modules_0bb8a147._.js) | JavaScript | 13,688 | 1,477 | 96 | 15,261 |
| [frontend/.next/static/chunks/node\_modules\_0df1685b.\_.js](/frontend/.next/static/chunks/node_modules_0df1685b._.js) | JavaScript | 12,968 | 1,477 | 60 | 14,505 |
| [frontend/.next/static/chunks/node\_modules\_17120478.\_.js](/frontend/.next/static/chunks/node_modules_17120478._.js) | JavaScript | 9,366 | 867 | 113 | 10,346 |
| [frontend/.next/static/chunks/node\_modules\_2c3b78d9.\_.js](/frontend/.next/static/chunks/node_modules_2c3b78d9._.js) | JavaScript | 8,972 | 813 | 95 | 9,880 |
| [frontend/.next/static/chunks/node\_modules\_35cab2ff.\_.js](/frontend/.next/static/chunks/node_modules_35cab2ff._.js) | JavaScript | 8,681 | 783 | 82 | 9,546 |
| [frontend/.next/static/chunks/node\_modules\_40ebdbf7.\_.js](/frontend/.next/static/chunks/node_modules_40ebdbf7._.js) | JavaScript | 3,718 | 1,064 | 12 | 4,794 |
| [frontend/.next/static/chunks/node\_modules\_474403c9.\_.js](/frontend/.next/static/chunks/node_modules_474403c9._.js) | JavaScript | 3,687 | 1,058 | 10 | 4,755 |
| [frontend/.next/static/chunks/node\_modules\_4bbe0de1.\_.js](/frontend/.next/static/chunks/node_modules_4bbe0de1._.js) | JavaScript | 11,511 | 1,510 | 43 | 13,064 |
| [frontend/.next/static/chunks/node\_modules\_697000f8.\_.js](/frontend/.next/static/chunks/node_modules_697000f8._.js) | JavaScript | 4,699 | 1,151 | 21 | 5,871 |
| [frontend/.next/static/chunks/node\_modules\_7c573168.\_.js](/frontend/.next/static/chunks/node_modules_7c573168._.js) | JavaScript | 3,835 | 1,076 | 16 | 4,927 |
| [frontend/.next/static/chunks/node\_modules\_7f7be971.\_.js](/frontend/.next/static/chunks/node_modules_7f7be971._.js) | JavaScript | 3,562 | 1,040 | 4 | 4,606 |
| [frontend/.next/static/chunks/node\_modules\_89168b15.\_.js](/frontend/.next/static/chunks/node_modules_89168b15._.js) | JavaScript | 3,651 | 1,052 | 10 | 4,713 |
| [frontend/.next/static/chunks/node\_modules\_8cb68ee9.\_.js](/frontend/.next/static/chunks/node_modules_8cb68ee9._.js) | JavaScript | 7,854 | 1,267 | 45 | 9,166 |
| [frontend/.next/static/chunks/node\_modules\_93a0c8b4.\_.js](/frontend/.next/static/chunks/node_modules_93a0c8b4._.js) | JavaScript | 4,817 | 288 | 63 | 5,168 |
| [frontend/.next/static/chunks/node\_modules\_996414f8.\_.js](/frontend/.next/static/chunks/node_modules_996414f8._.js) | JavaScript | 11,412 | 1,498 | 39 | 12,949 |
| [frontend/.next/static/chunks/node\_modules\_a526304a.\_.js](/frontend/.next/static/chunks/node_modules_a526304a._.js) | JavaScript | 11,383 | 1,492 | 38 | 12,913 |
| [frontend/.next/static/chunks/node\_modules\_bae8d9bd.\_.js](/frontend/.next/static/chunks/node_modules_bae8d9bd._.js) | JavaScript | 3,983 | 1,088 | 22 | 5,093 |
| [frontend/.next/static/chunks/node\_modules\_c1d9490c.\_.js](/frontend/.next/static/chunks/node_modules_c1d9490c._.js) | JavaScript | 7,242 | 591 | 92 | 7,925 |
| [frontend/.next/static/chunks/node\_modules\_c59c7ae1.\_.js](/frontend/.next/static/chunks/node_modules_c59c7ae1._.js) | JavaScript | 11,400 | 1,498 | 39 | 12,937 |
| [frontend/.next/static/chunks/node\_modules\_cc5449fa.\_.js](/frontend/.next/static/chunks/node_modules_cc5449fa._.js) | JavaScript | 11,452 | 1,504 | 41 | 12,997 |
| [frontend/.next/static/chunks/node\_modules\_d0874774.\_.js](/frontend/.next/static/chunks/node_modules_d0874774._.js) | JavaScript | 7,901 | 1,279 | 46 | 9,226 |
| [frontend/.next/static/chunks/node\_modules\_d30e0e48.\_.js](/frontend/.next/static/chunks/node_modules_d30e0e48._.js) | JavaScript | 7,578 | 1,239 | 31 | 8,848 |
| [frontend/.next/static/chunks/node\_modules\_ea7e53e6.\_.js](/frontend/.next/static/chunks/node_modules_ea7e53e6._.js) | JavaScript | 19,081 | 1,637 | 128 | 20,846 |
| [frontend/.next/static/chunks/node\_modules\_next\_dist\_b758c999.\_.js](/frontend/.next/static/chunks/node_modules_next_dist_b758c999._.js) | JavaScript | 864 | 70 | 9 | 943 |
| [frontend/.next/static/chunks/node\_modules\_swiper\_62da158d.\_.css](/frontend/.next/static/chunks/node_modules_swiper_62da158d._.css) | CSS | 250 | 3 | 58 | 311 |
| [frontend/.next/static/chunks/node\_modules\_swiper\_cd02c8fe.\_.css](/frontend/.next/static/chunks/node_modules_swiper_cd02c8fe._.css) | CSS | 229 | 3 | 52 | 284 |
| [frontend/.next/static/chunks/node\_modules\_swiper\_modules\_navigation\_css\_f9ee138c.\_.single.css](/frontend/.next/static/chunks/node_modules_swiper_modules_navigation_css_f9ee138c._.single.css) | CSS | 63 | 2 | 13 | 78 |
| [frontend/.next/static/chunks/node\_modules\_swiper\_modules\_scrollbar\_css\_f9ee138c.\_.single.css](/frontend/.next/static/chunks/node_modules_swiper_modules_scrollbar_css_f9ee138c._.single.css) | CSS | 42 | 2 | 7 | 51 |
| [frontend/.next/static/chunks/node\_modules\_swiper\_swiper\_css\_f9ee138c.\_.single.css](/frontend/.next/static/chunks/node_modules_swiper_swiper_css_f9ee138c._.single.css) | CSS | 187 | 2 | 43 | 232 |
| [frontend/.next/static/chunks/node\_modules\_swiper\_swiper\_d460eece.css](/frontend/.next/static/chunks/node_modules_swiper_swiper_d460eece.css) | CSS | 187 | 2 | 44 | 233 |
| [frontend/app/(auth)/sign-in/page.tsx](/frontend/app/(auth)/sign-in/page.tsx) | TypeScript JSX | -59 | -50 | -10 | -119 |
| [frontend/app/(auth)/sign-up/page.tsx](/frontend/app/(auth)/sign-up/page.tsx) | TypeScript JSX | 25 | 3 | 2 | 30 |
| [frontend/app/(protected)/(dashBoard)/friends/add/page.tsx](/frontend/app/(protected)/(dashBoard)/friends/add/page.tsx) | TypeScript JSX | -368 | -29 | -58 | -455 |
| [frontend/app/(protected)/(dashBoard)/friends/page.tsx](/frontend/app/(protected)/(dashBoard)/friends/page.tsx) | TypeScript JSX | -310 | -11 | -29 | -350 |
| [frontend/app/(protected)/(dashBoard)/layout.tsx](/frontend/app/(protected)/(dashBoard)/layout.tsx) | TypeScript JSX | -34 | -5 | -7 | -46 |
| [frontend/app/(protected)/(dashBoard)/notifications/page.tsx](/frontend/app/(protected)/(dashBoard)/notifications/page.tsx) | TypeScript JSX | -161 | -4 | -12 | -177 |
| [frontend/app/(protected)/(dashBoard)/page.tsx](/frontend/app/(protected)/(dashBoard)/page.tsx) | TypeScript JSX | -120 | -7 | -16 | -143 |
| [frontend/app/(protected)/(dashBoard)/profile/page.tsx](/frontend/app/(protected)/(dashBoard)/profile/page.tsx) | TypeScript JSX | -135 | -8 | -15 | -158 |
| [frontend/app/(protected)/call/\[id\]/page.tsx](/frontend/app/(protected)/call/%5Bid%5D/page.tsx) | TypeScript JSX | 1 | 0 | 0 | 1 |
| [frontend/app/(protected)/chat/\[id\]/page.tsx](/frontend/app/(protected)/chat/%5Bid%5D/page.tsx) | TypeScript JSX | 1 | 0 | 0 | 1 |
| [frontend/app/(protected)/layout.tsx](/frontend/app/(protected)/layout.tsx) | TypeScript JSX | -4 | -10 | -5 | -19 |
| [frontend/app/(protected)/onBoarding/page.tsx](/frontend/app/(protected)/onBoarding/page.tsx) | TypeScript JSX | 8 | 0 | 0 | 8 |
| [frontend/app/(protected)/profile/page.tsx](/frontend/app/(protected)/profile/page.tsx) | TypeScript JSX | 252 | 14 | 22 | 288 |
| [frontend/app/api/auth/\[...nextauth\]/route.ts](/frontend/app/api/auth/%5B...nextauth%5D/route.ts) | TypeScript | -16 | -3 | 2 | -17 |
| [frontend/app/globals.css](/frontend/app/globals.css) | CSS | 23 | 2 | 3 | 28 |
| [frontend/app/layout.tsx](/frontend/app/layout.tsx) | TypeScript JSX | -3 | 0 | 0 | -3 |
| [frontend/app/page.tsx](/frontend/app/page.tsx) | TypeScript JSX | 41 | 7 | 5 | 53 |
| [frontend/components/Footer.tsx](/frontend/components/Footer.tsx) | TypeScript JSX | 63 | 9 | 1 | 73 |
| [frontend/components/landing/Announcements.tsx](/frontend/components/landing/Announcements.tsx) | TypeScript JSX | 50 | 0 | 3 | 53 |
| [frontend/components/landing/ExplorePrograms.tsx](/frontend/components/landing/ExplorePrograms.tsx) | TypeScript JSX | 189 | 0 | 3 | 192 |
| [frontend/components/landing/FeaturedCourses.tsx](/frontend/components/landing/FeaturedCourses.tsx) | TypeScript JSX | 53 | 0 | 3 | 56 |
| [frontend/components/landing/HeroSection.tsx](/frontend/components/landing/HeroSection.tsx) | TypeScript JSX | 52 | 4 | 5 | 61 |
| [frontend/components/landing/LandingNavBar.tsx](/frontend/components/landing/LandingNavBar.tsx) | TypeScript JSX | 104 | 8 | 9 | 121 |
| [frontend/components/landing/QuickAccess.tsx](/frontend/components/landing/QuickAccess.tsx) | TypeScript JSX | 75 | 3 | 8 | 86 |
| [frontend/components/landing/UniqueFeaturesSection.tsx](/frontend/components/landing/UniqueFeaturesSection.tsx) | TypeScript JSX | 96 | 5 | 4 | 105 |
| [frontend/components/ui/Alert.tsx](/frontend/components/ui/Alert.tsx) | TypeScript JSX | 42 | 1 | 6 | 49 |
| [frontend/components/ui/Button.tsx](/frontend/components/ui/Button.tsx) | TypeScript JSX | 40 | 1 | 7 | 48 |
| [frontend/components/ui/FilePreview.tsx](/frontend/components/ui/FilePreview.tsx) | TypeScript JSX | 138 | 15 | 18 | 171 |
| [frontend/components/ui/FileUpload.tsx](/frontend/components/ui/FileUpload.tsx) | TypeScript JSX | 295 | 20 | 41 | 356 |
| [frontend/components/ui/NavBar.tsx](/frontend/components/ui/NavBar.tsx) | TypeScript JSX | -69 | -7 | -11 | -87 |
| [frontend/components/ui/NoFriendFound.tsx](/frontend/components/ui/NoFriendFound.tsx) | TypeScript JSX | -28 | 0 | -5 | -33 |
| [frontend/components/ui/NoNotificationFound.tsx](/frontend/components/ui/NoNotificationFound.tsx) | TypeScript JSX | -15 | 0 | -2 | -17 |
| [frontend/components/ui/ProfileDropDown.tsx](/frontend/components/ui/ProfileDropDown.tsx) | TypeScript JSX | -82 | -7 | -8 | -97 |
| [frontend/components/ui/ProgressBar.tsx](/frontend/components/ui/ProgressBar.tsx) | TypeScript JSX | 53 | 0 | 5 | 58 |
| [frontend/components/ui/SideBar.tsx](/frontend/components/ui/SideBar.tsx) | TypeScript JSX | -76 | 0 | -6 | -82 |
| [frontend/contexts/AuthContext.tsx](/frontend/contexts/AuthContext.tsx) | TypeScript JSX | -178 | -17 | -39 | -234 |
| [frontend/hooks/useAuthSession.ts](/frontend/hooks/useAuthSession.ts) | TypeScript | -20 | -2 | -4 | -26 |
| [frontend/hooks/useFriend.ts](/frontend/hooks/useFriend.ts) | TypeScript | -33 | -41 | -12 | -86 |
| [frontend/hooks/useFriends.ts](/frontend/hooks/useFriends.ts) | TypeScript | 0 | -121 | -19 | -140 |
| [frontend/hooks/useMaterial.ts](/frontend/hooks/useMaterial.ts) | TypeScript | 96 | 3 | 19 | 118 |
| [frontend/hooks/useUpload.ts](/frontend/hooks/useUpload.ts) | TypeScript | 242 | 18 | 40 | 300 |
| [frontend/lib/api.ts](/frontend/lib/api.ts) | TypeScript | -274 | 5 | -66 | -335 |
| [frontend/lib/mongoDB.ts](/frontend/lib/mongoDB.ts) | TypeScript | -22 | 0 | -6 | -28 |
| [frontend/lib/tokenUtils.ts](/frontend/lib/tokenUtils.ts) | TypeScript | -10 | 0 | -3 | -13 |
| [frontend/lib/utils.ts](/frontend/lib/utils.ts) | TypeScript | 50 | 6 | 14 | 70 |
| [frontend/next.config.ts](/frontend/next.config.ts) | TypeScript | 6 | 0 | 0 | 6 |
| [frontend/package-lock.json](/frontend/package-lock.json) | JSON | 79 | 0 | 0 | 79 |
| [frontend/package.json](/frontend/package.json) | JSON | 6 | 0 | 0 | 6 |
| [frontend/public/Durham\_College\_logo.svg](/frontend/public/Durham_College_logo.svg) | XML | 69 | 0 | 1 | 70 |
| [frontend/public/George\_Brown\_College\_logo.svg](/frontend/public/George_Brown_College_logo.svg) | XML | 121 | 0 | 1 | 122 |
| [frontend/public/Humber\_College\_logo.svg](/frontend/public/Humber_College_logo.svg) | XML | 8 | 0 | 1 | 9 |
| [frontend/public/Logo\_York\_University.svg](/frontend/public/Logo_York_University.svg) | XML | 126 | 1 | 1 | 128 |
| [frontend/public/QueensU\_Wordmark.svg](/frontend/public/QueensU_Wordmark.svg) | XML | 1,032 | 1 | 1 | 1,034 |
| [frontend/public/Ryerson\_University\_-\_2016\_school\_year\_logo.svg](/frontend/public/Ryerson_University_-_2016_school_year_logo.svg) | XML | 197 | 1 | 2 | 200 |
| [frontend/public/Seneca-logo.svg](/frontend/public/Seneca-logo.svg) | XML | 1 | 0 | 0 | 1 |
| [frontend/public/TMU\_logo.svg](/frontend/public/TMU_logo.svg) | XML | 45 | 1 | 0 | 46 |
| [frontend/types/Friend.ts](/frontend/types/Friend.ts) | TypeScript | 26 | 0 | 3 | 29 |
| [frontend/types/Material.ts](/frontend/types/Material.ts) | TypeScript | 52 | 0 | 3 | 55 |
| [frontend/types/SignIn.ts](/frontend/types/SignIn.ts) | TypeScript | 33 | 0 | 4 | 37 |
| [frontend/types/Upload.ts](/frontend/types/Upload.ts) | TypeScript | 32 | 0 | 3 | 35 |
| [package-lock.json](/package-lock.json) | JSON | 861 | 0 | 0 | 861 |
| [package.json](/package.json) | JSON | 3 | 0 | 0 | 3 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details