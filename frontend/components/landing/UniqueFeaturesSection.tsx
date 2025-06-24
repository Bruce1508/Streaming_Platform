import Image from "next/image";

const features = [
    {
        title: "Hệ thống học thuật thông minh",
        description:
            "Quản lý trường, chương trình, khóa học, tài liệu học tập, enrollment, bookmark... Hỗ trợ phân loại tài liệu theo trường, chương trình, học kỳ, v.v.",
        icon: "🎓",
        cta: { label: "Xem chi tiết", href: "#academic-system" },
    },
    {
        title: "Tìm kiếm & lọc nâng cao",
        description:
            "Tìm kiếm theo từ khóa, bộ lọc theo trường, chương trình, khóa học, độ khó, loại tài liệu, v.v.",
        icon: "🔍",
        cta: { label: "Khám phá tìm kiếm", href: "#search" },
    },
    {
        title: "Đánh giá, bình luận, lưu trữ cá nhân",
        description:
            "Người dùng có thể đánh giá, bình luận, bookmark, tạo thư mục cá nhân, nhắc nhở, v.v.",
        icon: "⭐",
        cta: { label: "Tính năng cộng đồng", href: "#community" },
    },
    {
        title: "Dashboard & phân tích học tập",
        description:
            "Thống kê hoạt động, tiến độ học tập, top đóng góp, tài liệu nổi bật, v.v.",
        icon: "📊",
        cta: { label: "Xem dashboard", href: "#dashboard" },
    },
];

export default function UniqueFeaturesSection() {
    return (
        <section className="w-full bg-[#0a2540] py-20 px-4 md:px-0 relative">
            {/* Diagonal Border Top */}
            <div className="absolute top-0 left-0 w-full h-20 overflow-hidden">
                <div 
                    className="w-full h-full bg-slate-200"
                    style={{
                        clipPath: 'polygon(0 100%, 100% 0%, 100% 0, 0 0)'
                    }}
                />
            </div>
            
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                {/* Left: Text */}
                <div className="flex-1 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ship faster with powerful and easy-to-use <span className="text-blue-400">Academic APIs</span>
                    </h2>
                    <p className="mb-8 text-lg text-blue-100">
                        Save your time with a unified academic platform: manage, search, and share study materials, track learning progress, and connect with a vibrant student community.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow transition mb-4">
                        Get Started
                    </button>
                </div>
                {/* Right: SVG Illustration in Card */}
                <div className="flex-1 flex justify-center items-center">
                    <div className="bg-[#16294a] rounded-2xl shadow-lg p-6 w-full max-w-md flex items-center justify-center">
                        <img
                            src="/feature.svg"
                            alt="Unique features illustration"
                            className="w-full h-64 object-contain drop-shadow-xl"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
            {/* Features List */}
            <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="flex flex-col h-full p-8 hover:bg-[#0f1b2e] transition-all duration-300 group rounded-lg"
                    >
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-6 text-3xl shadow-lg">
                            {feature.icon}
                        </div>
                        <h3 className="font-semibold text-white text-xl mb-4 leading-tight">{feature.title}</h3>
                        <p className="text-slate-300 text-base flex-1 mb-6 leading-relaxed">{feature.description}</p>
                        <a
                            href={feature.cta.href}
                            className="mt-auto text-cyan-400 font-medium inline-flex items-center gap-2 hover:gap-3 transition-all group-hover:text-cyan-300"
                        >
                            {feature.cta.label} <span className="transition-transform">→</span>
                        </a>
                    </div>
                ))}
            </div>
            
            {/* Diagonal Border Bottom */}
            <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden">
                <div 
                    className="w-full h-full bg-slate-200"
                    style={{
                        clipPath: 'polygon(0 100%, 100% 0%, 100% 100%, 0 100%)'
                    }}
                />
            </div>
        </section>
    );
} 