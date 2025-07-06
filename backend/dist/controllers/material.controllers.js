"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaterialStats = exports.reportMaterial = exports.updateComment = exports.deleteComment = exports.removeRating = exports.getMaterialsByProgram = exports.getPopularMaterials = exports.getFeaturedMaterials = exports.getMaterialsByCourse = exports.deleteStudyMaterial = exports.updateStudyMaterial = exports.getUserUploadedMaterials = exports.getUserSavedMaterials = exports.addComment = exports.rateMaterial = exports.removeSavedMaterial = exports.saveMaterial = exports.getMaterialsByCategory = exports.createStudyMaterial = exports.searchMaterials = exports.getStudyMaterials = exports.getStudyMaterialById = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const StudyMaterial_1 = __importDefault(require("../models/StudyMaterial"));
const User_1 = __importDefault(require("../models/User"));
const Api_utils_1 = require("../utils/Api.utils");
const Format_utils_1 = require("../utils/Format.utils");
const Cache_utils_1 = require("../utils/Cache.utils");
const Search_utils_1 = require("../utils/Search.utils");
const Random_utils_1 = require("../utils/Random.utils");
// ✅ Enhanced getStudyMaterialById with caching
const getStudyMaterialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const authReq = req;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }
        // ✅ Try cache first
        const cacheKey = (0, Cache_utils_1.generateCacheKey)('material', id);
        const cachedMaterial = Cache_utils_1.cache.get(cacheKey);
        if (cachedMaterial) {
            return res.json({
                success: true,
                data: cachedMaterial
            });
        }
        const material = yield StudyMaterial_1.default.findById(id)
            .populate('author', 'fullName profilePic email')
            .populate('academic.school', 'name location')
            .populate('academic.program', 'name code')
            .populate('academic.course', 'code name')
            .populate('comments.user', 'fullName profilePic')
            .exec();
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        // Check access permissions
        if (!material.isPublic && (!authReq.user || !material.author.equals(authReq.user._id))) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to this study material'
            });
        }
        // Increment views using instance method
        yield material.incrementViews();
        // ✅ Cache the material
        Cache_utils_1.cache.set(cacheKey, material, 600); // 10 minutes
        return res.json({
            success: true,
            data: material
        });
    }
    catch (error) {
        console.error('Error fetching study material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching study material',
            error: error.message
        });
    }
});
exports.getStudyMaterialById = getStudyMaterialById;
// ✅ Enhanced getAllMaterials with comprehensive utils integration
const getStudyMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        // ✅ Log API request
        (0, Api_utils_1.logApiRequest)(authReq);
        const { page = '1', limit = '12', search, category, difficulty, tags, author, school, program, course, sort = 'createdAt' } = req.query;
        // ✅ Extract pagination with utils
        const { page: pageNum, limit: limitNum, skip } = (0, Api_utils_1.extractPagination)(req);
        // ✅ Check cache first
        const cacheKey = (0, Cache_utils_1.generateCacheKey)('materials_list', JSON.stringify(req.query));
        const cached = (0, Cache_utils_1.getCachedStats)(cacheKey);
        if (cached) {
            return res.json(cached);
        }
        // ✅ Build query with utils
        const baseQuery = (0, Api_utils_1.buildMongoQuery)(req, ['category', 'difficulty', 'school', 'program', 'course']);
        const filter = Object.assign({ status: 'published', isPublic: true }, baseQuery);
        // ✅ Enhanced search functionality
        if (search) {
            filter.$text = { $search: search };
        }
        // Academic filters
        if (author)
            filter.author = author;
        // Tags filter
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            filter['metadata.tags'] = { $in: tagArray };
        }
        // ✅ Build sort object with utils
        let sortObj = {};
        switch (sort) {
            case 'newest':
                sortObj = { createdAt: -1 };
                break;
            case 'oldest':
                sortObj = { createdAt: 1 };
                break;
            case 'popular':
                sortObj = { views: -1, averageRating: -1 };
                break;
            case 'rating':
                sortObj = { averageRating: -1, totalRatings: -1 };
                break;
            case 'title':
                sortObj = { title: 1 };
                break;
            case 'relevance':
                sortObj = search ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
                break;
            default:
                sortObj = { createdAt: -1 };
        }
        // Execute query with comprehensive population
        const [materials, total] = yield Promise.all([
            StudyMaterial_1.default.find(filter)
                .populate('author', 'fullName profilePic')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .populate('academic.course', 'code name')
                .sort(sortObj)
                .limit(limitNum)
                .skip(skip)
                .exec(),
            StudyMaterial_1.default.countDocuments(filter)
        ]);
        // ✅ Enhanced materials with formatting
        const enhancedMaterials = materials.map((material) => (Object.assign(Object.assign({}, material.toObject()), { 
            // Add formatted fields
            truncatedDescription: material.description ? (0, Format_utils_1.truncate)(material.description, 150) : "", slug: (0, Format_utils_1.generateSlug)(material.title), 
            // Format any file sizes if they exist
            formattedFileSize: material.fileSize ? (0, Format_utils_1.formatFileSize)(material.fileSize) : null })));
        // Get aggregated stats
        const stats = yield StudyMaterial_1.default.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalMaterials: { $sum: 1 },
                    avgRating: { $avg: '$averageRating' },
                    totalViews: { $sum: '$views' },
                    totalSaves: { $sum: '$saves' }
                }
            }
        ]);
        // ✅ Create paginated response with utils
        const response = (0, Api_utils_1.createPaginatedResponse)(enhancedMaterials, total, pageNum, limitNum, 'Study materials retrieved successfully');
        // Add stats to response
        response.data.stats = stats[0] || {
            totalMaterials: 0,
            avgRating: 0,
            totalViews: 0,
            totalSaves: 0
        };
        response.data.filters = {
            search, category, difficulty, tags, author, school, program, course, sort
        };
        // ✅ Cache the response
        (0, Cache_utils_1.cacheStats)(cacheKey, response, 300); // 5 minutes
        return res.json(response);
    }
    catch (error) {
        console.error("Error fetching study materials:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching study materials",
            error: error.message
        });
    }
});
exports.getStudyMaterials = getStudyMaterials;
// ✅ NEW: Enhanced search materials endpoint
const searchMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        (0, Api_utils_1.logApiRequest)(authReq);
        // ✅ Use search utils
        const results = yield (0, Search_utils_1.searchMaterials)(StudyMaterial_1.default, req.query);
        // ✅ Format results
        const enhancedResults = results.map((material) => (Object.assign(Object.assign({}, material), { truncatedDescription: material.description ? (0, Format_utils_1.truncate)(material.description, 150) : "", formattedFileSize: material.fileSize ? (0, Format_utils_1.formatFileSize)(material.fileSize) : null })));
        return res.json({
            success: true,
            data: {
                materials: enhancedResults,
                total: enhancedResults.length
            },
            message: 'Search completed successfully'
        });
    }
    catch (error) {
        console.error('Error in search materials:', error);
        return res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
});
exports.searchMaterials = searchMaterials;
// ✅ Enhanced createStudyMaterial with formatting and random filename
const createStudyMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        (0, Api_utils_1.logApiRequest)(authReq);
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { title, description, content, category, attachments = [], isPublic = true, status = 'published', 
        // Academic context - all required
        school, program, course, semester, week, professor, 
        // Metadata
        difficulty = 'beginner', completionTime, grade } = req.body;
        // Required fields validation
        if (!(title === null || title === void 0 ? void 0 : title.trim())) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }
        if (!(description === null || description === void 0 ? void 0 : description.trim())) {
            return res.status(400).json({
                success: false,
                message: "Description is required"
            });
        }
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }
        // Academic context validation (required)
        if (!school || !program || !course || !semester) {
            return res.status(400).json({
                success: false,
                message: "Academic context (school, program, course, semester) is required"
            });
        }
        if (!semester.term || !semester.year) {
            return res.status(400).json({
                success: false,
                message: "Semester term and year are required"
            });
        }
        // Validate ObjectIds
        if (!mongoose_1.default.Types.ObjectId.isValid(school) ||
            !mongoose_1.default.Types.ObjectId.isValid(program) ||
            !mongoose_1.default.Types.ObjectId.isValid(course)) {
            return res.status(400).json({
                success: false,
                message: "Invalid school, program, or course ID"
            });
        }
        // ✅ Enhanced attachments with utils
        const processedAttachments = attachments.map((attachment) => {
            var _a;
            return (Object.assign(Object.assign({}, attachment), { 
                // Generate random filename if not provided
                filename: attachment.filename || (0, Random_utils_1.generateRandomFileName)(((_a = attachment.originalName) === null || _a === void 0 ? void 0 : _a.split('.').pop()) || 'txt'), 
                // Format file size
                formattedSize: attachment.size ? (0, Format_utils_1.formatFileSize)(attachment.size) : null }));
        });
        // ✅ Create material with enhanced data
        const newMaterial = new StudyMaterial_1.default({
            title: (0, Format_utils_1.capitalize)(title.trim()),
            description: description.trim(),
            content: content === null || content === void 0 ? void 0 : content.trim(),
            author: authReq.user._id,
            category,
            // Required academic context
            academic: Object.assign(Object.assign({ school: new mongoose_1.default.Types.ObjectId(school), program: new mongoose_1.default.Types.ObjectId(program), course: new mongoose_1.default.Types.ObjectId(course), semester: {
                    term: semester.term,
                    year: parseInt(semester.year)
                } }, (week && { week: parseInt(week) })), (professor && { professor: professor.trim() })),
            // Metadata
            metadata: Object.assign(Object.assign(Object.assign({ difficulty }, (completionTime && { completionTime: parseInt(completionTime) })), (grade && { grade: grade.trim() })), { isVerified: false, qualityScore: 0 }),
            attachments: processedAttachments,
            isPublic: Boolean(isPublic),
            status: status === 'draft' ? 'draft' : 'published',
            views: 0,
            saves: 0,
            ratings: [],
            comments: [],
            isFeatured: false,
            isReported: false,
            reportCount: 0
        });
        const savedMaterial = yield newMaterial.save();
        // Update user stats
        yield authReq.user.incrementUploadCount();
        // Populate for response
        yield savedMaterial.populate([
            { path: 'author', select: 'fullName profilePic email' },
            { path: 'academic.school', select: 'name location' },
            { path: 'academic.program', select: 'name code' },
            { path: 'academic.course', select: 'code name' }
        ]);
        console.log('✅ Study material created:', {
            id: savedMaterial._id,
            title: savedMaterial.title,
            author: authReq.user.fullName,
            category: savedMaterial.category,
            course: savedMaterial.academic.course
        });
        return res.status(201).json({
            success: true,
            message: "Study material created successfully",
            data: savedMaterial
        });
    }
    catch (error) {
        console.error('❌ Create study material error:', error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Duplicate material detected"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to create study material",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});
exports.createStudyMaterial = createStudyMaterial;
// ✅ Get materials by category - using static method
const getMaterialsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        const { difficulty, limit = '20' } = req.query;
        const options = {
            filter: Object.assign({}, (difficulty && { 'metadata.difficulty': difficulty })),
            limit: parseInt(limit),
            sort: { averageRating: -1, views: -1 }
        };
        // ✅ Use static method from schema
        const materials = yield StudyMaterial_1.default.findByCategory(category, options);
        const totalCount = yield StudyMaterial_1.default.countDocuments(Object.assign({ category, status: 'published', isPublic: true }, (difficulty && { 'metadata.difficulty': difficulty })));
        return res.json({
            success: true,
            data: {
                category,
                materials,
                stats: {
                    totalMaterials: totalCount
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching materials by category:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching materials by category',
            error: error.message
        });
    }
});
exports.getMaterialsByCategory = getMaterialsByCategory;
// ✅ Save material to user's collection
const saveMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { id } = req.params;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }
        const material = yield StudyMaterial_1.default.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        // ✅ Check if already saved
        if (authReq.user.savedMaterials.includes(new mongoose_1.default.Types.ObjectId(id))) {
            return res.status(400).json({
                success: false,
                message: 'Material already saved'
            });
        }
        // ✅ Use User instance method to save material
        yield authReq.user.saveMaterial(new mongoose_1.default.Types.ObjectId(id));
        // ✅ Increment saves count in material
        material.saves += 1;
        yield material.save();
        // ✅ Clear relevant caches
        const userCacheKey = (0, Cache_utils_1.generateCacheKey)('user', authReq.user._id.toString());
        Cache_utils_1.cache.del(userCacheKey);
        return res.json({
            success: true,
            message: 'Study material saved successfully'
        });
    }
    catch (error) {
        console.error('Error saving study material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error saving study material',
            error: error.message
        });
    }
});
exports.saveMaterial = saveMaterial;
// ✅ Remove saved material
const removeSavedMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { id } = req.params;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }
        // ✅ Check if material is saved 
        if (!authReq.user.savedMaterials.includes(new mongoose_1.default.Types.ObjectId(id))) {
            return res.status(400).json({
                success: false,
                message: 'Material not in saved list'
            });
        }
        // ✅ Use User instance method to unsave material
        yield authReq.user.unsaveMaterial(new mongoose_1.default.Types.ObjectId(id));
        // ✅ Decrement saves count
        const material = yield StudyMaterial_1.default.findById(id);
        if (material && material.saves > 0) {
            material.saves -= 1;
            yield material.save();
        }
        return res.json({
            success: true,
            message: 'Study material removed from saved list'
        });
    }
    catch (error) {
        console.error("Error removing saved material:", error);
        return res.status(500).json({
            success: false,
            message: 'Error removing saved materials',
            error: error.message
        });
    }
});
exports.removeSavedMaterial = removeSavedMaterial;
// ✅ Rate material
const rateMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { id } = req.params;
        const { rating } = req.body;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }
        const material = yield StudyMaterial_1.default.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        // ✅ Can't rate own material
        if (material.author.equals(authReq.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'You cannot rate your own study material'
            });
        }
        // ✅ Use instance method to add rating
        yield material.addRating(authReq.user._id, parseInt(rating));
        // ✅ Update user stats
        authReq.user.studyStats.ratingsGiven += 1;
        yield authReq.user.save();
        return res.json({
            success: true,
            message: 'Rating added successfully',
            data: {
                averageRating: material.averageRating,
                totalRatings: material.totalRatings
            }
        });
    }
    catch (error) {
        console.error('Error rating study material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error rating study material',
            error: error.message
        });
    }
});
exports.rateMaterial = rateMaterial;
// ✅ Add comment
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { id } = req.params;
        const { content } = req.body;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });
        }
        if (content.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot exceed 500 characters"
            });
        }
        const material = yield StudyMaterial_1.default.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        // ✅ Add comment to material
        material.comments.push({
            user: authReq.user._id,
            content: content.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        });
        yield material.save();
        // ✅ Populate the new comment
        const updatedMaterial = yield StudyMaterial_1.default.findById(id)
            .populate('comments.user', 'fullName profilePic')
            .exec();
        const newComment = updatedMaterial === null || updatedMaterial === void 0 ? void 0 : updatedMaterial.comments[updatedMaterial.comments.length - 1];
        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: newComment
        });
    }
    catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding comment",
            error: error.message
        });
    }
});
exports.addComment = addComment;
// ✅ Get user's saved materials
const getUserSavedMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { page = '1', limit = '12' } = req.query;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const user = yield User_1.default.findById(authReq.user._id)
            .populate({
            path: 'savedMaterials',
            populate: [
                {
                    path: 'author',
                    select: 'fullName profilePic'
                },
                {
                    path: 'academic.course',
                    select: 'code name'
                }
            ],
            options: {
                limit: limitNum,
                skip: (pageNum - 1) * limitNum,
                sort: { createdAt: -1 }
            }
        });
        const totalSaved = authReq.user.savedMaterials.length;
        return res.json({
            success: true,
            data: {
                materials: (user === null || user === void 0 ? void 0 : user.savedMaterials) || [],
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(totalSaved / limitNum),
                    totalItems: totalSaved,
                    hasNext: pageNum * limitNum < totalSaved,
                    hasPrev: pageNum > 1
                }
            }
        });
    }
    catch (error) {
        console.error("Error getting user saved materials:", error);
        return res.status(500).json({
            success: false,
            message: "Error getting saved materials",
            error: error.message
        });
    }
});
exports.getUserSavedMaterials = getUserSavedMaterials;
// ✅ Get user's uploaded materials
const getUserUploadedMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { page = '1', limit = '12', status } = req.query;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const filter = { author: authReq.user._id };
        if (status)
            filter.status = status;
        const materials = yield StudyMaterial_1.default.find(filter)
            .populate('author', 'fullName profilePic')
            .populate('academic.course', 'code name')
            .populate('academic.program', 'name')
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum)
            .exec();
        const total = yield StudyMaterial_1.default.countDocuments(filter);
        return res.json({
            success: true,
            data: {
                materials,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    totalItems: total,
                    hasNext: pageNum * limitNum < total,
                    hasPrev: pageNum > 1
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching uploaded materials:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching uploaded materials',
            error: error.message
        });
    }
});
exports.getUserUploadedMaterials = getUserUploadedMaterials;
// ✅ Update study material
const updateStudyMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { id } = req.params;
        const updateData = req.body;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }
        const material = yield StudyMaterial_1.default.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        // ✅ Check ownership
        if (!material.author.equals(authReq.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only edit your own materials'
            });
        }
        // ✅ Update with validation
        const updatedMaterial = yield StudyMaterial_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true }).populate([
            { path: 'author', select: 'fullName profilePic' },
            { path: 'academic.school', select: 'name location' },
            { path: 'academic.program', select: 'name code' },
            { path: 'academic.course', select: 'code name' }
        ]);
        return res.json({
            success: true,
            message: 'Study material updated successfully',
            data: updatedMaterial
        });
    }
    catch (error) {
        console.error('Error updating study material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating study material',
            error: error.message
        });
    }
});
exports.updateStudyMaterial = updateStudyMaterial;
// ✅ Delete study material
const deleteStudyMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { id } = req.params;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }
        const material = yield StudyMaterial_1.default.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        // ✅ Check ownership
        if (!material.author.equals(authReq.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete your own materials'
            });
        }
        // ✅ Remove from all users' saved lists
        yield User_1.default.updateMany({ savedMaterials: id }, { $pull: { savedMaterials: id } });
        // ✅ Delete the material
        yield StudyMaterial_1.default.findByIdAndDelete(id);
        return res.json({
            success: true,
            message: 'Study material deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting study material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting study material',
            error: error.message
        });
    }
});
exports.deleteStudyMaterial = deleteStudyMaterial;
// ✅ Get materials by course (using static method)
const getMaterialsByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const { limit = '20', sort = 'newest' } = req.query;
        if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid course ID'
            });
        }
        const sortOptions = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            popular: { views: -1, averageRating: -1 },
            rating: { averageRating: -1, totalRatings: -1 }
        };
        const options = {
            limit: parseInt(limit),
            sort: sortOptions[sort] || sortOptions.newest
        };
        // ✅ Use static method
        const materials = yield StudyMaterial_1.default.findByCourse(courseId, options);
        return res.json({
            success: true,
            data: {
                courseId,
                materials,
                count: materials.length
            }
        });
    }
    catch (error) {
        console.error('Error fetching materials by course:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching materials by course',
            error: error.message
        });
    }
});
exports.getMaterialsByCourse = getMaterialsByCourse;
// ✅ Get featured materials (using static method)
const getFeaturedMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = '10' } = req.query;
        // ✅ Use static method
        const materials = yield StudyMaterial_1.default.findFeatured(parseInt(limit));
        return res.json({
            success: true,
            data: {
                materials,
                count: materials.length
            }
        });
    }
    catch (error) {
        console.error('Error fetching featured materials:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching featured materials',
            error: error.message
        });
    }
});
exports.getFeaturedMaterials = getFeaturedMaterials;
// ✅ Get popular materials (using static method)
const getPopularMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = '10' } = req.query;
        // ✅ Use static method
        const materials = yield StudyMaterial_1.default.getPopularMaterials(parseInt(limit));
        return res.json({
            success: true,
            data: {
                materials,
                count: materials.length
            }
        });
    }
    catch (error) {
        console.error('Error fetching popular materials:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching popular materials',
            error: error.message
        });
    }
});
exports.getPopularMaterials = getPopularMaterials;
// ✅ Get materials by program (using static method)
const getMaterialsByProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { programId } = req.params;
        const { limit = '20', category, difficulty } = req.query;
        if (!mongoose_1.default.Types.ObjectId.isValid(programId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid program ID'
            });
        }
        const options = {
            filter: Object.assign(Object.assign({}, (category && { category })), (difficulty && { 'metadata.difficulty': difficulty })),
            limit: parseInt(limit),
            sort: { averageRating: -1, createdAt: -1 }
        };
        // ✅ Use static method
        const materials = yield StudyMaterial_1.default.findByProgram(programId, options);
        return res.json({
            success: true,
            data: {
                programId,
                materials,
                count: materials.length
            }
        });
    }
    catch (error) {
        console.error('Error fetching materials by program:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching materials by program',
            error: error.message
        });
    }
});
exports.getMaterialsByProgram = getMaterialsByProgram;
// ✅ Remove rating from material
const removeRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { id } = req.params;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }
        const material = yield StudyMaterial_1.default.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        // ✅ Check if user has rated this material
        const hasRated = material.ratings.some(rating => rating.user.equals(authReq.user._id));
        if (!hasRated) {
            return res.status(400).json({
                success: false,
                message: 'You have not rated this material'
            });
        }
        // ✅ Use instance method to remove rating
        yield material.removeRating(authReq.user._id);
        // ✅ Update user stats
        if (authReq.user.studyStats.ratingsGiven > 0) {
            authReq.user.studyStats.ratingsGiven -= 1;
            yield authReq.user.save();
        }
        return res.json({
            success: true,
            message: 'Rating removed successfully',
            data: {
                averageRating: material.averageRating,
                totalRatings: material.totalRatings
            }
        });
    }
    catch (error) {
        console.error('Error removing rating:', error);
        return res.status(500).json({
            success: false,
            message: 'Error removing rating',
            error: error.message
        });
    }
});
exports.removeRating = removeRating;
// ✅ Delete comment
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { id, commentId } = req.params;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id) || !mongoose_1.default.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid material or comment ID'
            });
        }
        const material = yield StudyMaterial_1.default.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        // ✅ Check ownership (user can delete own comments, author can delete any comment on their material)
        if (!material.author.equals(authReq.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete your own comments'
            });
        }
        // ✅ Remove comment
        const index = material.comments.findIndex((c) => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
        if (index !== -1) {
            material.comments.splice(index, 1);
        }
        yield material.save();
        return res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting comment',
            error: error.message
        });
    }
});
exports.deleteComment = deleteComment;
// ✅ Update comment
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { id, commentId } = req.params;
        const { content } = req.body;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }
        if (content.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Comment cannot exceed 500 characters'
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id) || !mongoose_1.default.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid material or comment ID'
            });
        }
        const material = yield StudyMaterial_1.default.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        // ✅ Check ownership
        if (!material.author.equals(authReq.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only edit your own comments'
            });
        }
        // ✅ Update comment
        const comment = material.comments.find((c) => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }
        comment.content = content.trim();
        comment.updatedAt = new Date();
        yield material.save();
        // ✅ Populate updated comment
        yield material.populate('comments.user', 'fullName profilePic');
        const updatedComment = material.comments.find((c) => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
        return res.json({
            success: true,
            message: 'Comment updated successfully',
            data: updatedComment
        });
    }
    catch (error) {
        console.error('Error updating comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating comment',
            error: error.message
        });
    }
});
exports.updateComment = updateComment;
// ✅ Report material
const reportMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        const { id } = req.params;
        const { reason } = req.body;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!reason || reason.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Report reason is required'
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }
        const material = yield StudyMaterial_1.default.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        // ✅ Can't report own material
        if (material.author.equals(authReq.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'You cannot report your own study material'
            });
        }
        // ✅ Update report status
        material.isReported = true;
        material.reportCount += 1;
        yield material.save();
        // TODO: In a real app, you might want to create a separate Report model
        // to track who reported what and for what reason
        return res.json({
            success: true,
            message: 'Study material reported successfully. Thank you for helping maintain quality content.'
        });
    }
    catch (error) {
        console.error('Error reporting material:', error);
        return res.status(500).json({
            success: false,
            message: 'Error reporting material',
            error: error.message
        });
    }
});
exports.reportMaterial = reportMaterial;
// ✅ Get material statistics
const getMaterialStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid study material ID'
            });
        }
        const material = yield StudyMaterial_1.default.findById(id)
            .select('views saves averageRating totalRatings commentCount')
            .exec();
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        return res.json({
            success: true,
            data: {
                views: material.views,
                saves: material.saves,
                averageRating: material.averageRating,
                totalRatings: material.totalRatings,
                commentCount: material.commentCount
            }
        });
    }
    catch (error) {
        console.error('Error fetching material stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching material stats',
            error: error.message
        });
    }
});
exports.getMaterialStats = getMaterialStats;
//# sourceMappingURL=material.controllers.js.map