"use client"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { AcademicCapIcon, CodeBracketIcon, BeakerIcon, GlobeAltIcon, CalculatorIcon, ChartBarIcon, BookOpenIcon, HeartIcon, MusicalNoteIcon, PaintBrushIcon, WrenchScrewdriverIcon, BuildingLibraryIcon, CpuChipIcon, ShieldCheckIcon, BuildingOffice2Icon, LanguageIcon, TruckIcon, SparklesIcon, FilmIcon, PencilIcon, UserGroupIcon, GlobeAmericasIcon } from '@heroicons/react/24/outline';

const programs = [
    {
        icon: <AcademicCapIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Education',
        desc: 'Enhance your knowledge and develop yourself.',
        partners: ['Harvard', 'MIT', 'Stanford']
    },
    {
        icon: <CodeBracketIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Computer Science',
        desc: 'Programming, AI, big data, and technology.',
        partners: ['Google', 'Microsoft', 'Meta']
    },
    {
        icon: <BeakerIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Biology',
        desc: 'Explore the world of biology and scientific research.',
        partners: ['BioNTech', 'Pfizer', 'WHO']
    },
    {
        icon: <GlobeAltIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'International Studies',
        desc: 'Global integration, languages, and cultures.',
        partners: ['UNESCO', 'British Council', 'Goethe']
    },
    {
        icon: <CalculatorIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Mathematics',
        desc: 'Pure and applied mathematics, statistics, and logic.',
        partners: ['AMS', 'Fields Institute', 'Princeton']
    },
    {
        icon: <ChartBarIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Business Administration',
        desc: 'Management, marketing, finance, and entrepreneurship.',
        partners: ['Wharton', 'Kellogg', 'INSEAD']
    },
    {
        icon: <BookOpenIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Literature',
        desc: 'World literature, creative writing, and critical theory.',
        partners: ['Oxford', 'Yale', 'Penguin']
    },
    {
        icon: <HeartIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Medicine',
        desc: 'Medical sciences, healthcare, and clinical practice.',
        partners: ['Johns Hopkins', 'Mayo Clinic', 'Cleveland Clinic']
    },
    {
        icon: <MusicalNoteIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Music',
        desc: 'Music theory, performance, and composition.',
        partners: ['Juilliard', 'Berklee', 'Yamaha']
    },
    {
        icon: <PaintBrushIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Fine Arts',
        desc: 'Painting, sculpture, design, and visual arts.',
        partners: ['RISD', 'Parsons', 'MoMA']
    },
    {
        icon: <WrenchScrewdriverIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Engineering',
        desc: 'Mechanical, electrical, civil, and chemical engineering.',
        partners: ['Caltech', 'ETH Zurich', 'Siemens']
    },
    {
        icon: <BuildingLibraryIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Law',
        desc: 'Legal studies, public policy, and international law.',
        partners: ['Harvard Law', 'Yale Law', 'UN']
    },
    {
        icon: <CpuChipIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Data Science',
        desc: 'Big data, analytics, and machine learning.',
        partners: ['DeepMind', 'IBM', 'Coursera']
    },
    {
        icon: <GlobeAmericasIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Hospitality & Tourism',
        desc: 'Hotel, restaurant, flight services, and global tourism.',
        partners: ['Marriott', 'Hilton', 'Air Canada']
    },
    {
        icon: <UserGroupIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Human Services',
        desc: 'Social work, child development, and community services.',
        partners: ['CAMH', 'YMCA', 'UNICEF']
    },
    {
        icon: <SparklesIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Esthetics & Wellness',
        desc: 'Medical spa, esthetics, and health promotion.',
        partners: ['Dermalogica', 'Shoppers', 'Wellness Canada']
    },
    {
        icon: <FilmIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Media & Broadcasting',
        desc: 'Television, radio, journalism, and digital storytelling.',
        partners: ['CBC', 'CTV', 'Rogers']
    },
    {
        icon: <PencilIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Design & Animation',
        desc: 'Graphic design, game art, 3D animation, and VFX.',
        partners: ['Ubisoft', 'Pixar', 'Adobe']
    },
    {
        icon: <ShieldCheckIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Public Safety & Policing',
        desc: 'Firefighting, emergency services, and law enforcement.',
        partners: ['Toronto Police', 'Fire Marshal', 'Justice Canada']
    },
    {
        icon: <BuildingOffice2Icon className="h-10 w-10 text-[#16294a]" />,
        name: 'Administration & Office Services',
        desc: 'Legal, medical, and executive office administration.',
        partners: ['Service Canada', 'Ministry of Health', 'MLT Aikins']
    },
    {
        icon: <TruckIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Logistics & Supply Chain',
        desc: 'Procurement, global logistics, and operations management.',
        partners: ['FedEx', 'Amazon', 'DHL']
    },  
    {
        icon: <LanguageIcon className="h-10 w-10 text-[#16294a]" />,
        name: 'Languages & TESL',
        desc: 'TESL certification, academic English, and translation.',
        partners: ['British Council', 'TESL Ontario', 'Duolingo']
    }
];

export default function ExplorePrograms() {
    return (
        <section className="pt-30 pb-40 bg-[#F6F9FC] w-full border-t border-gray-200 overflow-visible">
            <div className="w-full max-w-full mx-auto overflow-visible">
            <h2 className="text-4xl sm:text-6xl font-extrabold mb-6 text-center tracking-tight">
                <span className="text-gray-300">Discover.</span>{' '}
                <span className="text-gray-500">Learn.</span>{' '}
                <span className="text-[#301934]">Succeed</span>
            </h2>
            <p className="text-[#899499] text-md mb-10 text-center max-w-3xl mx-auto font-semibold">Select a program to unlock resources shared by students like you.</p>
                <div className="w-full overflow-visible">
                    <Swiper
                        spaceBetween={100}
                        slidesPerView={1.2}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3.1, spaceBetween: 50 },
                            1440: { slidesPerView: 4.1, spaceBetween: 50 },
                            1920: { slidesPerView: 5, spaceBetween: 100 },
                            2560: { slidesPerView: 6, spaceBetween: 120 },
                            3840: { slidesPerView: 8, spaceBetween: 150 },
                            4096: { slidesPerView: 12, spaceBetween: 200 },
                        }}
                        className="pb-8 overflow-visible"
                        style={{ width: '100%' }}
                        grabCursor={true}
                    >
                        {programs.map((program, idx) => (
                            <SwiperSlide key={idx} className="overflow-visible">
                                <div className="bg-[#FAF9F6] rounded-xl border border-gray-200 min-h-[500px] w-[480px] flex flex-col justify-between transition-all duration-300 hover:z-30 origin-center hover:scale-105 hover:shadow-2xl hover:border-2 hover:bg-white/95" style={{ boxShadow: '0 8px 32px 0 rgba(16,30,54,0.08), 0 1.5px 3px 0 rgba(16,30,54,0.03), 0 0 0 1px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1), 0 16px 32px rgba(0,0,0,0.1)' }}>
                                    <div className="h-2 w-full bg-slate-500 rounded-t-xl" />
                                    <div className="p-14 pb-8">
                                        <div className="mb-6 flex items-center gap-3">{program.icon}</div>
                                        <h3 className="text-2xl font-extrabold text-gray-900 mb-4">{program.name}</h3>
                                        <p className="text-gray-600 text-lg mb-8">{program.desc}</p>
                                        <a href="#" className="inline-flex items-center text-indigo-600 font-semibold hover:underline text-base">Learn more <span className="ml-1">→</span></a>
                                    </div>
                                    <div className="border-t border-gray-200 px-10 py-4 flex gap-8 items-center min-h-[60px] justify-center">
                                        {(program.partners ?? []).map((partner, i) => (
                                            <span key={i} className="text-sm text-gray-400 font-semibold tracking-wide uppercase whitespace-nowrap pb-2">{partner}</span>
                                        ))}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
} 