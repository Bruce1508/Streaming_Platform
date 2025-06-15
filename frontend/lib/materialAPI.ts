import { CreateMaterialData, MaterialFilters } from "@/types/Material";

// ✅ Get all materials with filters
export const getMaterials = async (filters: MaterialFilters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials?${params.toString()}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch materials');
    }
    
    return await response.json();
};

// ✅ Get material by ID
export const getMaterialById = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch material');
    }
    
    return await response.json();
};

// ✅ Create new material
export const createMaterial = async (data: CreateMaterialData) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create material');
    }
    
    return await response.json();
};

// ✅ Update material
export const updateMaterial = async (id: string, data: Partial<CreateMaterialData>) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update material');
    }
    
    return await response.json();
};

// ✅ Delete material
export const deleteMaterial = async (id: string) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete material');
    }
    
    return await response.json();
};

// ✅ Save/bookmark material
export const saveMaterial = async (id: string) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}/save`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save material');
    }
    
    return await response.json();
};

// ✅ Remove saved material
export const removeSavedMaterial = async (id: string) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}/save`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove saved material');
    }
    
    return await response.json();
};

// ✅ Rate material
export const rateMaterial = async (id: string, rating: number) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}/rate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to rate material');
    }
    
    return await response.json();
};

// ✅ Add comment
export const addComment = async (id: string, content: string) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
    }
    
    return await response.json();
};

// ✅ Get user's saved materials
export const getUserSavedMaterials = async (filters: MaterialFilters = {}) => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
    });
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/user/saved?${params.toString()}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch saved materials');
    }
    
    return await response.json();
};

// ✅ Get user's uploaded materials
export const getUserUploadedMaterials = async (filters: MaterialFilters = {}) => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
    });
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/user/uploaded?${params.toString()}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch uploaded materials');
    }
    
    return await response.json();
};

// ✅ Get materials by category
export const getMaterialsByCategory = async (category: string, filters: MaterialFilters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/category/${category}?${params.toString()}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch materials by category');
    }
    
    return await response.json();
};