"use client"

import { Marquee } from "@/components/magicui/marquee";
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

// Component for individual program card
const ProgramCard = ({ program }: { program: typeof programs[0] }) => {
    return (
        <div className="bg-[#F8FFE5] rounded-xl border border-gray-200 min-h-[200px] w-[400px] flex flex-col justify-between transition-all cursor-pointer duration-300 hover:shadow-2xl hover:border-2 hover:bg-white/95 flex-shrink-0 mx-4"
            style={{ 
                boxShadow: '0 8px 32px 0 rgba(16,30,54,0.08), 0 1.5px 3px 0 rgba(16,30,54,0.03), 0 0 0 1px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1), 0 16px 32px rgba(0,0,0,0.1)' 
            }}
        >
            <div className="h-5 w-full bg-slate-500 rounded-t-xl" />
            <div className="p-8 pb-6">
                <div className="mb-6 flex items-center gap-3">{program.icon}</div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-4">{program.name}</h3>
                <p className="text-gray-600 text-base mb-6">{program.desc}</p>
                {/* <a href="#" className="inline-flex items-center text-indigo-600 font-semibold hover:underline text-sm">
                    Learn more <span className="ml-1">→</span>
                </a> */}
            </div>
            <div className="border-t border-gray-200 px-6 py-3 flex gap-4 items-center min-h-[50px] justify-center">
                {program.partners.map((partner, i) => (
                    <span key={i} className="text-xs text-gray-400 font-semibold tracking-wide uppercase whitespace-nowrap">
                        {partner}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default function ExplorePrograms() {
    return (
        <section className="pt-40 pb-40 bg-[#F8FFE5] w-full border-t border-gray-200 overflow-hidden">
            <div className="w-full max-w-full mx-auto">
                <h2 className="text-4xl sm:text-6xl font-bold mb-6 text-center tracking-tight">
                    <span className="text-[#9B2037]">Your Voice</span> <span className="text-black">Matters</span>
                </h2>
                <p className="text-[#899499] text-md mb-10 text-center max-w-3xl mx-auto font-semibold">
                    Share your experiences and help others make informed decisions about their education.
                </p>
                
                {/* MagicUI Marquee */}
                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <Marquee pauseOnHover className="[--duration:60s]">
                        {programs.map((program, idx) => (
                            <ProgramCard key={idx} program={program} />
                        ))}
                    </Marquee>
                    
                    {/* Fade overlays */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#FAF9F6]"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#FAF9F6]"></div>
                </div>
            </div>
        </section>
    );
} 