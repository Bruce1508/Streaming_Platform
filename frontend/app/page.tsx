import LandingNavBar from "@/components/landing/LandingNavBar";
import HeroSection from "@/components/landing/HeroSection";
import ExplorePrograms from "@/components/landing/ExplorePrograms";
import ReadyToGetStarted from "@/components/landing/ReadyToGetStarted";
import Footer from "@/components/Footer";
import { GlowingEffectDemoSecond } from "@/components/landing/FeatureSection";

export default function HomePage() {
	return (
		<div className="bg-[#FAF9F6]">
			<LandingNavBar />
			<main>
				<HeroSection />

				{/* Trusted By Universities Section */}
				<GlowingEffectDemoSecond />

				{/* Trusted By Universities Section */}
				<div className="bg-[#FAF9F6] pb-10 pt-20">
					<div className="flex flex-col items-center gap-6 mb-10">
						<div className="flex flex-wrap justify-center items-center gap-20 mb-10">
							<img src="/Seneca-logo.svg" alt="Seneca College" className="h-10 hover:grayscale-0 transition" />
							<img src="/Logo_York_University.svg" alt="York University" className="h-12 hover:grayscale-0 transition" />
							<img src="/Humber_College_logo.svg" alt="Humber College" className="h-10 hover:grayscale-0 transition" />
							<img src="/Centennial.png" alt="Centennial College" className="h-12 hover:grayscale-0 transition" />
						</div>
						<div className="flex flex-wrap justify-center items-center gap-20">
							{/* <img src="/QueensU_Wordmark.svg" alt="Queen's University" className="h-10 hover:grayscale-0 transition" /> */}
							<img src="/TMU_logo.svg" alt="Toronto Metropolitan University" className="h-15 hover:grayscale-0 transition" />
							<img src="/George_Brown_College_logo.svg" alt="George Brown College" className="h-15 hover:grayscale-0 transition" />
							<img src="/University-of-Manitoba-logo_1.png" alt="University of Winnipeg" className="h-40 hover:grayscale-0 transition" />
							<img src="/UofT_Wordmark.png" alt="University of Toronto" className="h-12 hover:grayscale-0 transition" />
						</div>
					</div>
				</div>

				<ExplorePrograms />
				<ReadyToGetStarted />

				{/* Main Content Container */}
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-5xl mx-auto">
						{/* Future sections can be added here */}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

