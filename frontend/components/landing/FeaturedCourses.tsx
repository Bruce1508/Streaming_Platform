import Image from "next/image";
import Link from "next/link";

const courses = [
    {
        title: "Introduction to Programming",
        description: "Learn the basics of coding with Python.",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14694dd?q=80&w=2070&auto=format&fit=crop",
        link: "/courses/intro-to-programming"
    },
    {
        title: "Business Analytics Fundamentals",
        description: "Master data analysis techniques for business decisions.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        link: "/courses/business-analytics"
    },
    {
        title: "Digital Marketing Strategies",
        description: "Explore the latest trends in digital marketing.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
        link: "/courses/digital-marketing"
    }
];

const FeaturedCourses = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">Featured Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <Link href={course.link} key={course.title}>
                            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer h-full flex flex-col">
                                <div className="relative h-56 w-full">
                                    <Image
                                        src={course.imageUrl}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className="p-6 bg-white flex-grow">
                                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                                    <p className="text-gray-600">{course.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCourses; 