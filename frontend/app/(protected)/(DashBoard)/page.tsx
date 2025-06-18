// app/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Upload, FileText, Image, File } from 'lucide-react';

export default function HomePage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						Study Materials Manager
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Upload, organize, and manage your study materials with ease.
						Support for documents, images, and more.
					</p>
				</div>

				{/* Quick Actions */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
					<Link href="/materials/upload">
						<div className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
							<Upload className="w-8 h-8 text-primary mb-3" />
							<h3 className="font-semibold text-foreground mb-2">Upload Files</h3>
							<p className="text-muted-foreground text-sm">
								Upload your study materials and documents
							</p>
						</div>
					</Link>

					<div className="bg-card rounded-lg shadow-md p-6 opacity-50">
						<FileText className="w-8 h-8 text-primary mb-3" />
						<h3 className="font-semibold text-foreground mb-2">My Documents</h3>
						<p className="text-muted-foreground text-sm">
							View and manage uploaded documents
						</p>
						<span className="text-xs text-muted-foreground mt-2 block">Coming soon</span>
					</div>

					<div className="bg-card rounded-lg shadow-md p-6 opacity-50">
						<Image className="w-8 h-8 text-primary mb-3" />
						<h3 className="font-semibold text-foreground mb-2">Image Gallery</h3>
						<p className="text-muted-foreground text-sm">
							Browse uploaded images and screenshots
						</p>
						<span className="text-xs text-muted-foreground mt-2 block">Coming soon</span>
					</div>

					<div className="bg-card rounded-lg shadow-md p-6 opacity-50">
						<File className="w-8 h-8 text-primary mb-3" />
						<h3 className="font-semibold text-foreground mb-2">All Files</h3>
						<p className="text-muted-foreground text-sm">
							Complete overview of all materials
						</p>
						<span className="text-xs text-muted-foreground mt-2 block">Coming soon</span>
					</div>
				</div>

				{/* CTA Section */}
				<div className="bg-card rounded-lg shadow-lg p-8 text-center">
					<h2 className="text-2xl font-bold text-foreground mb-4">
						Ready to Get Started?
					</h2>
					<p className="text-muted-foreground mb-6 max-w-md mx-auto">
						Upload your first study materials and experience the power of organized learning.
					</p>

					<div className="flex justify-center space-x-4">
						<Link href="/materials/upload">
							<Button size="lg" variant="default" className="px-8 cursor-pointer">
								<Upload className="w-5 h-5 mr-2" />
								Start Uploading
							</Button>
						</Link>
						
						<Button variant="secondary" size="lg" className="px-8 cursor-pointer">
							Learn More
						</Button>
					</div>
				</div>

				{/* Features Grid */}
				<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="text-center">
						<div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<Upload className="w-8 h-8 text-primary" />
						</div>
						<h3 className="font-semibold text-foreground mb-2">Easy Upload</h3>
						<p className="text-muted-foreground text-sm">
							Drag & drop or click to upload multiple files at once
						</p>
					</div>

					<div className="text-center">
						<div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<FileText className="w-8 h-8 text-primary" />
						</div>
						<h3 className="font-semibold text-foreground mb-2">Multiple Formats</h3>
						<p className="text-muted-foreground text-sm">
							Support for PDF, images, Word documents, and text files
						</p>
					</div>

					<div className="text-center">
						<div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<File className="w-8 h-8 text-primary" />
						</div>
						<h3 className="font-semibold text-foreground mb-2">Secure Storage</h3>
						<p className="text-muted-foreground text-sm">
							Your files are securely stored and easily accessible
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}