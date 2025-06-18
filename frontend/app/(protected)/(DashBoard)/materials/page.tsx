// app/(protected)/(DashBoard)/materials/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PlusIcon, SearchIcon, EyeIcon, StarIcon, ClockIcon, DownloadIcon } from 'lucide-react';
import { useMaterials } from '@/hooks/useMaterial';
import { Material } from '@/types/Material';

export default function MaterialsPage() {
    const { user } = useAuth();
    
    // ✅ Local filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        language: '',
        level: ''
    });

    // ✅ Use custom hook
    const { materials, loading, error, fetchMaterials } = useMaterials();

    // ✅ Refetch when filters change
    useEffect(() => {
        const delayedFetch = setTimeout(() => {
            fetchMaterials({
                search: searchQuery || undefined,
                category: filters.category || undefined,
                language: filters.language || undefined,
                level: filters.level || undefined,
            });
        }, 500); // Debounce search

        return () => clearTimeout(delayedFetch);
    }, [searchQuery, filters, fetchMaterials]);

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="alert alert-error">
                    <span>{error}</span>
                    <button 
                        className="btn btn-sm"
                        onClick={() => fetchMaterials()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Study Materials</h1>
                    <p className="text-base-content/60 mt-1">
                        Discover and share learning resources ({materials.length} materials)
                    </p>
                </div>
                
                <Link href="/materials/upload" className="btn btn-primary">
                    <PlusIcon className="w-5 h-5" />
                    Upload Material
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="card bg-base-100 shadow-md mb-6">
                <div className="card-body p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                                <input
                                    type="text"
                                    placeholder="Search materials..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input input-bordered w-full pl-10"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
                            className="select select-bordered"
                        >
                            <option value="">All Categories</option>
                            <option value="grammar">Grammar</option>
                            <option value="vocabulary">Vocabulary</option>
                            <option value="listening">Listening</option>
                            <option value="speaking">Speaking</option>
                            <option value="reading">Reading</option>
                            <option value="writing">Writing</option>
                            <option value="practice">Practice</option>
                            <option value="culture">Culture</option>
                            <option value="pronunciation">Pronunciation</option>
                        </select>

                        <select
                            value={filters.level}
                            onChange={(e) => setFilters(prev => ({...prev, level: e.target.value}))}
                            className="select select-bordered"
                        >
                            <option value="">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Language"
                            value={filters.language}
                            onChange={(e) => setFilters(prev => ({...prev, language: e.target.value}))}
                            className="input input-bordered"
                        />
                    </div>
                </div>
            </div>

            {/* Materials Grid */}
            {materials.length === 0 ? (
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body text-center py-16">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-2xl font-semibold mb-3">No materials found</h3>
                        <p className="text-base-content/60 text-lg">
                            {searchQuery 
                                ? "Try adjusting your search or filters"
                                : "Be the first to share a learning material"
                            }
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((material) => (
                        <MaterialCard key={material._id} material={material} />
                    ))}
                </div>
            )}
        </div>
    );
}

// MaterialCard component (same as before)
function MaterialCard({ material }: { material: Material }) {
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <StarIcon 
                    key={i} 
                    className={`w-4 h-4 ${i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
            );
        }
        return stars;
    };

    return (
        <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className={`badge ${
                            material.level === 'beginner' ? 'badge-success' :
                            material.level === 'intermediate' ? 'badge-warning' :
                            'badge-error'
                        } badge-sm`}>
                            {material.level.toUpperCase()}
                        </span>
                        <span className="badge badge-outline badge-sm">
                            {material.category}
                        </span>
                    </div>
                </div>

                {/* Title & Description */}
                <h3 className="card-title text-lg mb-2 line-clamp-2">
                    {material.title}
                </h3>
                <p className="text-sm text-base-content/70 mb-4 line-clamp-3">
                    {material.description}
                </p>

                {/* Tags */}
                {material.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {material.tags.slice(0, 3).map((tag: any, index: number) => (
                            <span key={index} className="badge badge-ghost badge-sm">
                                #{tag}
                            </span>
                        ))}
                        {material.tags.length > 3 && (
                            <span className="badge badge-ghost badge-sm">
                                +{material.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Attachments */}
                {material.attachments.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm font-medium text-base-content/80 mb-2 flex items-center gap-1">
                            📎 {material.attachments.length} file(s)
                        </p>
                        <div className="space-y-1">
                            {material.attachments.slice(0, 2).map((file: any, index: number) => (
                                <div key={index} className="flex items-center justify-between text-xs bg-base-200 rounded p-2">
                                    <span className="truncate flex-1 mr-2">
                                        {file.originalName}
                                    </span>
                                    <span className="text-base-content/50">
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                            ))}
                            {material.attachments.length > 2 && (
                                <p className="text-xs text-base-content/50">
                                    +{material.attachments.length - 2} more files
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Author */}
                <div className="flex items-center mb-4">
                    <div className="avatar mr-3">
                        <div className="w-8 h-8 rounded-full">
                            {material.author.profilePic ? (
                                <img
                                    src={material.author.profilePic}
                                    alt={material.author.fullName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-xs font-medium">
                                        {material.author.fullName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{material.author.fullName}</p>
                        <p className="text-xs text-base-content/50 flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {new Date(material.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <EyeIcon className="w-4 h-4" />
                            {material.views}
                        </span>
                        <span className="flex items-center gap-1">
                            <DownloadIcon className="w-4 h-4" />
                            {material.saves}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {renderStars(material.averageRating)}
                        <span className="text-xs ml-1">({material.totalRatings})</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="card-actions justify-end mt-4">
                    <Link 
                        href={`/materials/${material._id}`}
                        className="btn btn-primary btn-sm"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}