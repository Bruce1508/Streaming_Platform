// app/upload/page.tsx

'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import {
    Upload,
    FileText,
    CheckCircle,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Image,
    File,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
    const router = useRouter();
    const [uploadResults, setUploadResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);

    const handleUploadComplete = (results: any[]) => {
        console.log('Upload completed:', results);
        setUploadResults(results);
        setShowResults(true);
    };

    const resetUpload = () => {
        setUploadResults([]);
        setShowResults(false);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="cursor-pointer">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!showResults ? (
                    // Upload Interface
                    <div className="space-y-6">
                        {/* Instructions */}
                        <div className="bg-card rounded-lg shadow-sm border p-6">
                            <div className="flex items-start space-x-3">
                                <FileText className="w-6 h-6 text-primary mt-1" />
                                <div>
                                    <h2 className="text-lg font-medium text-foreground mb-2">
                                        Upload Your Study Materials
                                    </h2>
                                    <p className="text-muted-foreground mb-4">
                                        Upload documents, images, and other study materials to organize your learning resources.
                                        All files are securely stored and easily accessible.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-primary" />
                                            <span className="text-foreground">PDF Documents</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-primary" />
                                            <span className="text-foreground">Images (JPG, PNG, GIF)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-primary" />
                                            <span className="text-foreground">Word Documents</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-primary" />
                                            <span className="text-foreground">Text Files</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-primary" />
                                            <span className="text-foreground">Max 10MB per file</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-primary" />
                                            <span className="text-foreground">Up to 10 files</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Component */}
                        <div className="bg-card rounded-lg shadow-sm border p-6">
                            <FileUpload
                                onUploadComplete={handleUploadComplete}
                                maxFiles={10}
                            />
                        </div>
                    </div>
                ) : (
                    // Results Display
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Files Ready for Processing
                        </h2>
                        <p className="text-muted-foreground">
                            View the details below.
                        </p>
                    </div>
                )}
            </div>

            {/* Upload Results Summary */}
            {uploadResults.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="bg-card border border-border rounded-xl p-8 shadow-2xl">
                        {/* Upload Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {uploadResults.map((result, index) => (
                                <div
                                    key={index}
                                    className="bg-background border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    {/* File Icon & Status */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                                                {result?.data?.attachment?.originalName?.toLowerCase().endsWith('.pdf') ? (
                                                    <FileText className="w-5 h-5 text-destructive" />
                                                ) : result?.data?.attachment?.originalName?.toLowerCase().endsWith('.docx') ? (
                                                    <FileText className="w-5 h-5 text-primary" />
                                                ) : result?.data?.attachment?.originalName?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) ? (
                                                    <Image className="w-5 h-5 text-primary" />
                                                ) : (
                                                    <File className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-foreground text-sm truncate" title={result?.data?.attachment?.originalName}>
                                                    {result?.data?.attachment?.originalName || 'Unknown file'}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {result?.data?.attachment?.size ?
                                                        `${(result.data.attachment.size / 1024).toFixed(1)} KB` :
                                                        'Size unknown'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* File Actions */}
                                    <div className="flex space-x-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-xs cursor-pointer"
                                            onClick={() => {
                                                if (result?.data?.attachment?.url) {
                                                    window.open(result.data.attachment.url, '_blank');
                                                }
                                            }}
                                            disabled={!result?.data?.attachment?.url}
                                        >
                                            👁️ View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-xs cursor-pointer"
                                            onClick={() => {
                                                // Add to study session logic
                                                console.log('Add to study:', result);
                                            }}
                                        >
                                            📚 Study
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Upload Statistics */}
                        <div className="mt-10 pt-6 border-t border-border/50">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div>
                                    <p className="text-3xl font-bold text-foreground">
                                        {uploadResults.length}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Documents</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-foreground">
                                        {(() => {
                                            const totalSize = uploadResults.reduce((total, result) =>
                                                total + (result?.data?.attachment?.size || 0), 0
                                            );
                                            return totalSize > 1024 * 1024 ?
                                                `${(totalSize / (1024 * 1024)).toFixed(1)}MB` :
                                                `${(totalSize / 1024).toFixed(1)}KB`;
                                        })()}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Total Size</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-primary">
                                        {uploadResults.filter(r => r?.success).length}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Successful</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-primary">Ready</p>
                                    <p className="text-sm text-muted-foreground mt-1">Status</p>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="mt-10 pt-6 border-t border-border/50">
                            <h4 className="font-medium text-foreground mb-4">🚀 What's Next?</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-4 p-4 bg-primary/5 rounded-lg border cursor-pointer hover:bg-primary/10 transition-colors">
                                    <span className="text-2xl">🧠</span>
                                    <div>
                                        <p className="font-medium text-foreground">Start Learning</p>
                                        <p className="text-sm text-muted-foreground">Generate quizzes and flashcards</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 p-4 bg-primary/5 rounded-lg border cursor-pointer hover:bg-primary/10 transition-colors">
                                    <span className="text-2xl">📊</span>
                                    <div>
                                        <p className="font-medium text-foreground">Track Progress</p>
                                        <p className="text-sm text-muted-foreground">Monitor your study sessions</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-10">
                            <div className="flex justify-end space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={resetUpload}
                                    className="cursor-pointer"
                                >
                                    Upload More Files
                                </Button>
                                <Button
                                    onClick={() => router.push('/dashboard')}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                                >
                                    Start Studying
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}