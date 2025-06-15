// hooks/useMaterials.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMaterials, getMaterialById } from '@/lib/materialAPI';
import toast from 'react-hot-toast';
import { Material, MaterialFilters, UseMaterialsReturn } from '@/types/Material';


export const useMaterials = (initialFilters: MaterialFilters = {}): UseMaterialsReturn => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Memoized fetchMaterials function
    const fetchMaterials = useCallback(async (filters: MaterialFilters = {}) => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await getMaterials({
                search: filters.search || undefined,
                category: filters.category || undefined,
                language: filters.language || undefined,
                level: filters.level || undefined,
                page: 1,
                limit: 20
            });
            
            if (data.success) {
                setMaterials(data.data || []);
            } else {
                const errorMsg = data.message || 'Failed to load materials';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (error: any) {
            console.error('Fetch materials error:', error);
            const errorMsg = error.message || 'Failed to load materials';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Refetch with current filters
    const refetch = useCallback(async () => {
        await fetchMaterials(initialFilters);
    }, [fetchMaterials, initialFilters]);

    // ✅ Initial fetch
    useEffect(() => {
        fetchMaterials(initialFilters);
    }, [fetchMaterials, initialFilters]);

    return {
        materials,
        loading,
        error,
        fetchMaterials,
        refetch
    };
};

// ✅ Hook for single material
export const useMaterial = (id: string) => {
    const [material, setMaterial] = useState<Material | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMaterial = useCallback(async () => {
        if (!id) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const data = await getMaterialById(id);
            
            if (data.success) {
                setMaterial(data.data);
            } else {
                const errorMsg = data.message || 'Failed to load material';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (error: any) {
            console.error('Fetch material error:', error);
            const errorMsg = error.message || 'Failed to load material';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchMaterial();
    }, [fetchMaterial]);

    return {
        material,
        loading,
        error,
        refetch: fetchMaterial
    };
};