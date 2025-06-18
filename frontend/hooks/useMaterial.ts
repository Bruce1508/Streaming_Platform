'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getMaterialById, getMaterials } from '@/lib/materialAPI';
import toast from 'react-hot-toast';
import { Material, MaterialFilters,} from '@/types/Material';

export const useMaterials = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // ✅ Single source of truth - useRef only
    const fetchStateRef = useRef({
        hasInitialFetch: false,
        isLoading: false,
        mounted: true
    });

    const fetchMaterials = useCallback(async (filters: MaterialFilters = {}) => {
        const { hasInitialFetch, isLoading, mounted } = fetchStateRef.current;
        
        // ✅ Single guard logic
        if (!mounted || isLoading) return;
        if (hasInitialFetch && !filters.search && !filters.category) return;

        fetchStateRef.current.isLoading = true;
        setLoading(true);
        setError(null);
        
        try {
            console.log('🚀 Fetching materials...');
            const response = await getMaterials({
                search: filters.search || undefined,
                category: filters.category || undefined,
                language: filters.language || undefined,  
                level: filters.level || undefined,
                page: 1,
                limit: 20
            });
            
            if (!fetchStateRef.current.mounted) return;
            
            if (response.success) {
                const materialsArray = response.data?.materials || [];
                setMaterials(materialsArray);
                fetchStateRef.current.hasInitialFetch = true;
            } else {
                setError(response.message || 'Failed to load materials');
                setMaterials([]);
            }
        } catch (error: any) {
            if (fetchStateRef.current.mounted) {
                setError(error.message || 'Failed to load materials');
                setMaterials([]);
            }
        } finally {
            fetchStateRef.current.isLoading = false;
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!fetchStateRef.current.hasInitialFetch) {
            fetchMaterials();
        }
        
        return () => {
            fetchStateRef.current.mounted = false;
        };
    }, [fetchMaterials]);

    return { materials, loading, error, fetchMaterials, refetch: fetchMaterials };
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