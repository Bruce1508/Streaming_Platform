// ===== FORUM MOCK DATA =====
// Dữ liệu mẫu cho forum posts với đa dạng chủ đề và tác giả

export const mockForumPosts = [
  {
    _id: "1",
    title: "Cách học React hiệu quả cho người mới bắt đầu?",
    content: "Mình mới bắt đầu học React và cảm thấy hơi bối rối với các khái niệm như components, props, state. Có ai có tips hay resources nào để học React hiệu quả không? Mình đã biết HTML, CSS và JavaScript cơ bản rồi.",
    author: {
      _id: "user1",
      fullName: "Nguyễn Văn An",
      profilePic: "/default-avatar.jpg"
    },
    program: undefined,
    tags: ["react", "frontend", "javascript", "learning"],
    category: "question",
    status: "open",
    views: 156,
    upvotes: ["user2", "user3"],
    downvotes: ["user4"],
    voteCount: 1,
    isPinned: false,
    isAnonymous: false,
    commentCount: 8,
    lastActivity: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    displayAuthor: {
      _id: "user1",
      fullName: "Nguyễn Văn An",
      profilePic: "/default-avatar.jpg"
    }
  },
  {
    _id: "2",
    title: "Kinh nghiệm thực tập tại các công ty tech lớn",
    content: "Chia sẻ kinh nghiệm apply và phỏng vấn thực tập tại Google, Microsoft, Amazon. Mình đã thực tập tại Google và muốn chia sẻ tips để các bạn có thể chuẩn bị tốt hơn cho quá trình apply.",
    author: {
      _id: "user2",
      fullName: "Trần Thị Bình",
      profilePic: "/default-avatar.jpg"
    },
    program: "Software Engineering",
    tags: ["internship", "career", "google", "microsoft", "amazon"],
    category: "discussion",
    status: "open",
    views: 342,
    upvotes: ["user1", "user5"],
    downvotes: ["user3"],
    voteCount: 2,
    isPinned: true,
    isAnonymous: false,
    commentCount: 15,
    lastActivity: "2024-01-15T14:20:00Z",
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    displayAuthor: {
      _id: "user2",
      fullName: "Trần Thị Bình",
      profilePic: "/default-avatar.jpg"
    }
  },
  {
    _id: "3",
    title: "Bài tập Algorithm khó quá, ai giúp mình với?",
    content: "Mình đang làm bài tập về Dynamic Programming và gặp khó khăn với bài toán Longest Common Subsequence. Có ai có thể giải thích thuật toán này một cách đơn giản không?",
    author: {
      _id: "user3",
      fullName: "Lê Văn Cường",
      profilePic: "/default-avatar.jpg"
    },
    program: "Computer Science",
    tags: ["algorithm", "dynamic-programming", "homework", "help"],
    category: "assignment",
    status: "open",
    views: 89,
    upvotes: ["user2", "user4"],
    downvotes: ["user1"],
    voteCount: 1,
    isPinned: false,
    isAnonymous: false,
    commentCount: 6,
    lastActivity: "2024-01-15T16:45:00Z",
    createdAt: "2024-01-15T15:30:00Z",
    updatedAt: "2024-01-15T16:45:00Z",
    displayAuthor: {
      _id: "user3",
      fullName: "Lê Văn Cường",
      profilePic: "/default-avatar.jpg"
    }
  },
  {
    _id: "4",
    title: "Review khóa học Machine Learning của Andrew Ng",
    content: "Mình vừa hoàn thành khóa học Machine Learning của Andrew Ng trên Coursera. Đây là review chi tiết về nội dung, độ khó và những gì mình học được. Khóa học rất hay và phù hợp cho người mới bắt đầu.",
    author: {
      _id: "user4",
      fullName: "Phạm Thị Dung",
      profilePic: "/default-avatar.jpg"
    },
    program: "Data Science",
    tags: ["machine-learning", "coursera", "andrew-ng", "review"],
    category: "career",
    status: "open",
    views: 234,
    upvotes: ["user1", "user2", "user3"],
    downvotes: ["user5"],
    voteCount: 3,
    isPinned: false,
    isAnonymous: false,
    commentCount: 12,
    lastActivity: "2024-01-15T18:10:00Z",
    createdAt: "2024-01-15T16:00:00Z",
    updatedAt: "2024-01-15T18:10:00Z",
    displayAuthor: {
      _id: "user4",
      fullName: "Phạm Thị Dung",
      profilePic: "/default-avatar.jpg"
    }
  },
  {
    _id: "5",
    title: "Tips ôn thi môn Database Systems",
    content: "Sắp thi môn Database Systems rồi, mình muốn chia sẻ một số tips ôn thi hiệu quả. Tập trung vào SQL queries, normalization, và transaction management. Có ai có thêm tips gì không?",
    author: {
      _id: "user5",
      fullName: "Hoàng Văn Em",
      profilePic: "/default-avatar.jpg"
    },
    program: "Information Technology",
    tags: ["database", "exam", "sql", "study-tips"],
    category: "exam",
    status: "open",
    views: 167,
    upvotes: ["user1", "user2", "user3"],
    downvotes: ["user4"],
    voteCount: 3,
    isPinned: false,
    isAnonymous: false,
    commentCount: 9,
    lastActivity: "2024-01-15T19:30:00Z",
    createdAt: "2024-01-15T17:15:00Z",
    updatedAt: "2024-01-15T19:30:00Z",
    displayAuthor: {
      _id: "user5",
      fullName: "Hoàng Văn Em",
      profilePic: "/default-avatar.jpg"
    }
  },
  {
    _id: "6",
    title: "Cơ hội việc làm cho sinh viên IT tại Việt Nam",
    content: "Thảo luận về thị trường việc làm IT tại Việt Nam hiện tại. Các công ty nào đang tuyển dụng nhiều? Mức lương thế nào? Cần kỹ năng gì để có việc làm tốt?",
    author: {
      _id: "user6",
      fullName: "Vũ Thị Phương",
      profilePic: "/default-avatar.jpg"
    },
    program: "Software Engineering",
    tags: ["career", "job-market", "vietnam", "salary"],
    category: "career",
    status: "open",
    views: 456,
    upvotes: ["user1", "user2", "user3", "user4", "user5"],
    downvotes: ["user6"],
    voteCount: 5,
    isPinned: false,
    isAnonymous: false,
    commentCount: 23,
    lastActivity: "2024-01-15T20:15:00Z",
    createdAt: "2024-01-15T18:30:00Z",
    updatedAt: "2024-01-15T20:15:00Z",
    displayAuthor: {
      _id: "user6",
      fullName: "Vũ Thị Phương",
      profilePic: "/default-avatar.jpg"
    }
  },
  {
    _id: "7",
    title: "Làm sao để debug code hiệu quả?",
    content: "Mình thường mất rất nhiều thời gian để debug code. Có ai có thể chia sẻ các techniques và tools để debug hiệu quả không? Mình đang dùng VS Code và Chrome DevTools.",
    author: {
      _id: "user7",
      fullName: "Đặng Văn Giang",
      profilePic: "/default-avatar.jpg"
    },
    program: "Computer Science",
    tags: ["debugging", "vscode", "devtools", "programming"],
    category: "general",
    status: "open",
    views: 123,
    upvotes: ["user1", "user2", "user3", "user4", "user5"],
    downvotes: ["user6", "user7"],
    voteCount: 5,
    isPinned: false,
    isAnonymous: false,
    commentCount: 7,
    lastActivity: "2024-01-15T21:00:00Z",
    createdAt: "2024-01-15T19:45:00Z",
    updatedAt: "2024-01-15T21:00:00Z",
    displayAuthor: {
      _id: "user7",
      fullName: "Đặng Văn Giang",
      profilePic: "/default-avatar.jpg"
    }
  },
  {
    _id: "8",
    title: "So sánh các framework JavaScript: React vs Vue vs Angular",
    content: "Mình đang phân vân giữa việc học React, Vue hay Angular. Có ai có thể so sánh ưu nhược điểm của từng framework không? Mình muốn tìm hiểu để chọn framework phù hợp cho dự án sắp tới.",
    author: {
      _id: "user8",
      fullName: "Ngô Thị Hoa",
      profilePic: "/default-avatar.jpg"
    },
    program: "Web Development",
    tags: ["react", "vue", "angular", "javascript", "framework"],
    category: "career",
    status: "open",
    views: 298,
    upvotes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7"],
    downvotes: ["user8"],
    voteCount: 7,
    isPinned: false,
    isAnonymous: false,
    commentCount: 18,
    lastActivity: "2024-01-15T22:30:00Z",
    createdAt: "2024-01-15T20:00:00Z",
    updatedAt: "2024-01-15T22:30:00Z",
    displayAuthor: {
      _id: "user8",
      fullName: "Ngô Thị Hoa",
      profilePic: "/default-avatar.jpg"
    }
  },
  {
    _id: "9",
    title: "Kinh nghiệm làm project capstone",
    content: "Mình sắp bắt đầu làm project capstone và muốn chia sẻ kinh nghiệm với các bạn. Project capstone rất quan trọng vì nó thể hiện khả năng của bạn. Cần chuẩn bị gì và làm sao để có kết quả tốt?",
    author: {
      _id: "user9",
      fullName: "Lý Văn Inh",
      profilePic: "/default-avatar.jpg"
    },
    program: "Software Engineering",
    tags: ["capstone", "project", "graduation", "portfolio"],
    category: "general",
    status: "open",
    views: 189,
    upvotes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8"],
    downvotes: ["user9"],
    voteCount: 8,
    isPinned: false,
    isAnonymous: false,
    commentCount: 11,
    lastActivity: "2024-01-15T23:15:00Z",
    createdAt: "2024-01-15T21:30:00Z",
    updatedAt: "2024-01-15T23:15:00Z",
    displayAuthor: {
      _id: "user9",
      fullName: "Lý Văn Inh",
      profilePic: "/default-avatar.jpg"
    }
  },
  {
    _id: "10",
    title: "Cách học lập trình online hiệu quả",
    content: "Mình muốn chia sẻ cách học lập trình online hiệu quả. Với tình hình hiện tại, học online là lựa chọn tốt. Mình đã thử nhiều platform và muốn chia sẻ kinh nghiệm với các bạn.",
    author: {
      _id: "user10",
      fullName: "Anonymous User",
      profilePic: "/default-avatar.jpg"
    },
    program: "Computer Science",
    tags: ["online-learning", "programming", "education", "tips"],
    category: "general",
    status: "open",
    views: 145,
    upvotes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9"],
    downvotes: ["user10"],
    voteCount: 9,
    isPinned: false,
    isAnonymous: true,
    commentCount: 8,
    lastActivity: "2024-01-16T00:00:00Z",
    createdAt: "2024-01-15T22:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
    displayAuthor: {
      _id: "user10",
      fullName: "Anonymous User",
      profilePic: "/default-avatar.jpg"
    }
  }
];

// ===== MOCK COMMENTS DATA =====
export const mockComments = [
  {
    _id: "comment1",
    postId: "1",
    content: "Mình khuyên bạn nên bắt đầu với React Tutorial chính thức trên trang web của React. Nó rất chi tiết và dễ hiểu.",
    author: {
      _id: "user11",
      fullName: "Trần Văn Khoa",
      profilePic: "/default-avatar.jpg"
    },
    upvotes: ["user12"],
    downvotes: [],
    isAcceptedAnswer: false,
    isAnonymous: false,
    replyCount: 2,
    createdAt: "2024-01-15T10:15:00Z",
    updatedAt: "2024-01-15T10:15:00Z"
  },
  {
    _id: "comment2",
    postId: "1",
    content: "Bạn cũng nên thử làm các project nhỏ để thực hành. Mình thấy cách này hiệu quả hơn là chỉ đọc lý thuyết.",
    author: {
      _id: "user12",
      fullName: "Lê Thị Lan",
      profilePic: "/default-avatar.jpg"
    },
    upvotes: ["user11"],
    downvotes: [],
    isAcceptedAnswer: false,
    isAnonymous: false,
    replyCount: 0,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  }
];

// ===== MOCK USERS DATA =====
export const mockTopUsers = [
  {
    _id: "user1",
    fullName: "Nguyễn Văn An",
    profilePic: "/default-avatar.jpg",
    isVerified: true,
    reputation: 1250,
    postsCount: 15,
    answersCount: 45
  },
  {
    _id: "user2",
    fullName: "Trần Thị Bình",
    profilePic: "/default-avatar.jpg",
    isVerified: true,
    reputation: 980,
    postsCount: 12,
    answersCount: 38
  },
  {
    _id: "user4",
    fullName: "Phạm Thị Dung",
    profilePic: "/default-avatar.jpg",
    isVerified: true,
    reputation: 850,
    postsCount: 8,
    answersCount: 32
  },
  {
    _id: "user6",
    fullName: "Vũ Thị Phương",
    profilePic: "/default-avatar.jpg",
    isVerified: true,
    reputation: 720,
    postsCount: 10,
    answersCount: 28
  },
  {
    _id: "user8",
    fullName: "Ngô Thị Hoa",
    profilePic: "/default-avatar.jpg",
    isVerified: true,
    reputation: 650,
    postsCount: 6,
    answersCount: 25
  }
];

// ===== MOCK TRENDING TOPICS =====
export const mockTrendingTopics = [
  { tag: "react", count: 125 },
  { tag: "javascript", count: 89 },
  { tag: "algorithm", count: 67 },
  { tag: "career", count: 54 },
  { tag: "machine-learning", count: 43 },
  { tag: "database", count: 38 },
  { tag: "frontend", count: 35 },
  { tag: "internship", count: 32 }
];

// ===== MOCK RECENT ACTIVITY =====
export const mockRecentActivity = [
  {
    id: "1",
    user: "John Doe",
    action: "answered",
    target: "How to deploy Next.js?",
    time: "2 minutes ago"
  },
  {
    id: "2",
    user: "Sarah Kim",
    action: "posted",
    target: "React State Management",
    time: "5 minutes ago"
  },
  {
    id: "3",
    user: "Mike Chen",
    action: "liked",
    target: "CSS Grid Layout",
    time: "10 minutes ago"
  },
  {
    id: "4",
    user: "Emily Wang",
    action: "commented on",
    target: "TypeScript Best Practices",
    time: "15 minutes ago"
  },
  {
    id: "5",
    user: "David Lee",
    action: "started following",
    target: "Machine Learning topic",
    time: "20 minutes ago"
  }
]; 