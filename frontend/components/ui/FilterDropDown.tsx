'use client'

import { useEffect, useRef } from "react";
import { Filter } from "lucide-react";

interface FilterOptions {
    nativeLanguage: string;
    learningLanguage: string;
    location: string;
}

const FilterDropdown: React.FC<{
    filters: FilterOptions;
    setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
    showFilters: boolean;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
    clearFilters: () => void;
    languages: string[];
}> = ({ filters, setFilters, showFilters, setShowFilters, clearFilters, languages }) => {
    const hasActiveFilters = filters.nativeLanguage || filters.learningLanguage || filters.location;
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };

        if (showFilters) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showFilters, setShowFilters]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-base-300 rounded-lg hover:bg-base-200 transition-colors"
            >
                <Filter className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                    <span className="bg-primary text-white text-xs rounded-full w-2 h-2"></span>
                )}
            </button>

            <div className={`
                absolute right-0 top-full mt-2 w-80 bg-base-100 border border-base-300 rounded-lg shadow-lg z-10 p-4
                transition-all duration-300 ease-out transform origin-top-right
                ${showFilters ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            `}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-base-content">Filters</h3>
                    <button
                        onClick={clearFilters}
                        className="text-sm text-primary hover:text-primary-focus"
                    >
                        Clear all
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Native Language Filter */}
                    <div>
                        <label className="block text-sm font-medium text-base-content/70 mb-2">
                            Native Language
                        </label>
                        <select
                            value={filters.nativeLanguage}
                            onChange={(e) => setFilters(prev => ({ ...prev, nativeLanguage: e.target.value }))}
                            className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All languages</option>
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    {/* Learning Language Filter */}
                    <div>
                        <label className="block text-sm font-medium text-base-content/70 mb-2">
                            Learning Language
                        </label>
                        <select
                            value={filters.learningLanguage}
                            onChange={(e) => setFilters(prev => ({ ...prev, learningLanguage: e.target.value }))}
                            className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All languages</option>
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                        <label className="block text-sm font-medium text-base-content/70 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            placeholder="Enter city or country"
                            value={filters.location}
                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterDropdown