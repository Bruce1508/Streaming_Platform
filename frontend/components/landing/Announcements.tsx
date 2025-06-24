import Image from 'next/image';
import Link from 'next/link';

const announcements = [
    {
        category: "New",
        title: "Upcoming Exam Schedule",
        description: "Check out the updated exam schedule for the Fall semester.",
        imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4c88?q=80&w=2070&auto=format&fit=crop",
        link: "/announcements/exam-schedule"
    },
    {
        category: "Event",
        title: "Study Skills Workshop",
        description: "Join our workshop to improve your study techniques and time management.",
        imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop",
        link: "/events/study-skills-workshop"
    }
];

const Announcements = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold mb-12">Announcements & News</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {announcements.map((item, index) => (
                        <Link href={item.link} key={item.title}>
                            <div className="flex flex-col md:flex-row items-center gap-8 group cursor-pointer">
                                <div className={`relative h-56 w-full md:w-2/5 rounded-lg overflow-hidden ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-blue-600 uppercase">{item.category}</p>
                                    <h3 className="text-2xl font-bold mt-2">{item.title}</h3>
                                    <p className="mt-2 text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Announcements; 