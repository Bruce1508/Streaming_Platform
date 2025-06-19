'use client';

import { useState, useEffect } from 'react';
import { getUserFiles, deleteUserFile } from '@/lib/UploadApi';
import { formatFileSize } from '@/lib/utils';
import { 
    FileText, 
    Image, 
    File, 
    Download, 
    Trash2, 
    Search,
    Plus,
    Eye,
    Calendar,
    HardDrive
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface UserFile {
    _id: string;
    originalName: string;
    filename: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedBy: string;
    category: 'image' | 'pdf' | 'document';
    uploadedAt: string;
    description?: string;
    tags?: string[];
}

const FileGallery = () => {
    const [files, setFiles] = useState<UserFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching files...', {
                page: currentPage,
                category: selectedCategory,
                search: searchQuery
            });

            const response = await getUserFiles({
                page: currentPage,
                limit: 12,
                category: selectedCategory || undefined,
                search: searchQuery || undefined
            });

            console.log('✅ Files response:', response);

            if (response.success) {
                setFiles(response.data.files || []);
                setTotalPages(response.data.pagination?.totalPages || 1);
                setTotalItems(response.data.pagination?.totalItems || 0);
            } else {
                throw new Error(response.message || 'Failed to load files');
            }
        } catch (error: any) {
            console.error('❌ Error fetching files:', error);
            toast.error('Failed to load files');
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [currentPage, selectedCategory, searchQuery]);

    const handleDelete = async (fileId: string, fileName: string) => {
        if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;

        try {
            setDeleting(fileId);
            await deleteUserFile(fileId);
            toast.success('File deleted successfully');
            fetchFiles(); // Refresh the list
        } catch (error: any) {
            console.error('Error deleting file:', error);
            toast.error('Failed to delete file');
        } finally {
            setDeleting(null);
        }
    };

    const handleViewFile = (fileUrl: string) => {
        window.open(fileUrl, '_blank');
    };

    const handleDownloadFile = (fileUrl: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getFileIcon = (mimeType: string, category: string) => {
        if (category === 'image') return Image;
        if (category === 'pdf') return FileText;
        return File;
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'image': return 'badge-success';
            case 'pdf': return 'badge-error';
            case 'document': return 'badge-warning';
            default: return 'badge-ghost';
        }
    };

    const renderFileCard = (file: UserFile) => {
        const IconComponent = getFileIcon(file.mimeType, file.category);
        const isDeleting = deleting === file._id;

        return (
            <div key={file._id} className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-300">
                <div className="card-body p-4">
                    {/* File preview */}
                    <div className="flex items-center justify-center h-32 bg-base-200 rounded-lg mb-3 relative overflow-hidden">
                        {file.category === 'image' ? (
                            <>
                                <img
                                    src={file.url}
                                    alt={file.originalName}
                                    className="max-h-full max-w-full object-contain rounded transition-transform hover:scale-105"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (nextElement) {
                                            nextElement.classList.remove('hidden');
                                        }
                                    }}
                                />
                                <div className="flex items-center justify-center w-full h-full">
                                    <IconComponent className="w-12 h-12 text-base-content/40" />
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center">
                                <IconComponent className="w-12 h-12 text-base-content/40" />
                            </div>
                        )}
                    </div>

                    {/* File info */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-sm truncate" title={file.originalName}>
                            {file.originalName}
                        </h3>
                        
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-base-content/60">
                                <HardDrive className="w-3 h-3" />
                                <span>{formatFileSize(file.size)}</span>
                            </div>
                            <span className={`badge badge-outline badge-xs ${getCategoryColor(file.category)}`}>
                                {file.category}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-base-content/50">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                        {/* View Button */}
                        <button
                            onClick={() => handleViewFile(file.url)}
                            className="btn btn-outline btn-xs flex-1 gap-1"
                            title="View file"
                        >
                            <Eye className="w-3 h-3" />
                            View
                        </button>
                        
                        {/* Download Button */}
                        <button
                            onClick={() => handleDownloadFile(file.url, file.originalName)}
                            className="btn btn-outline btn-xs gap-1"
                            title="Download file"
                        >
                            <Download className="w-3 h-3" />
                        </button>
                        
                        {/* Delete Button */}
                        <button
                            onClick={() => handleDelete(file._id, file.originalName)}
                            disabled={isDeleting}
                            className="btn btn-error btn-xs gap-1"
                            title="Delete file"
                        >
                            {isDeleting ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <Trash2 className="w-3 h-3" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">My Files</h1>
                    <p className="text-base-content/60 mt-1">
                        Manage your uploaded files and documents
                        {totalItems > 0 && (
                            <span className="ml-2 text-primary font-medium">
                                ({totalItems} files)
                            </span>
                        )}
                    </p>
                </div>
                
                <Link href="/materials/upload" className="btn btn-primary gap-2">
                    <Plus className="w-5 h-5" />
                    Upload New File
                </Link>
            </div>

            {/* Filters */}
            <div className="card bg-base-100 shadow-md mb-6 border border-base-300">
                <div className="card-body p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                                <input
                                    type="text"
                                    placeholder="Search files..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1); // Reset to first page
                                    }}
                                    className="input input-bordered w-full pl-10"
                                />
                            </div>
                        </div>

                        {/* Category filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1); // Reset to first page
                            }}
                            className="select select-bordered min-w-[140px]"
                        >
                            <option value="">All Categories</option>
                            <option value="image">Images</option>
                            <option value="pdf">PDFs</option>
                            <option value="document">Documents</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Files Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="text-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-base-content/60">Loading your files...</p>
                    </div>
                </div>
            ) : files.length === 0 ? (
                <div className="card bg-base-100 shadow-lg border border-base-300">
                    <div className="card-body text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-base-200 flex items-center justify-center">
                            <File className="w-10 h-10 text-base-content/30" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No files found</h3>
                        <p className="text-base-content/60 mb-6 max-w-md mx-auto">
                            {searchQuery || selectedCategory 
                                ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                                : 'You haven\'t uploaded any files yet. Start by uploading your first file!'
                            }
                        </p>
                        {!searchQuery && !selectedCategory && (
                            <Link href="/materials/upload" className="btn btn-primary gap-2">
                                <Plus className="w-5 h-5" />
                                Upload Your First File
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {files.map(renderFileCard)}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="join">
                                <button
                                    className="join-item btn btn-outline"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    « Previous
                                </button>
                                
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let page;
                                    if (totalPages <= 5) {
                                        page = i + 1;
                                    } else if (currentPage <= 3) {
                                        page = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        page = totalPages - 4 + i;
                                    } else {
                                        page = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <button
                                            key={page}
                                            className={`join-item btn ${currentPage === page ? 'btn-active btn-primary' : 'btn-outline'}`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                
                                <button
                                    className="join-item btn btn-outline"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next »
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FileGallery;