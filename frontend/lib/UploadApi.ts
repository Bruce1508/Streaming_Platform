import { makeAuthenticationRequest } from "./api";

export async function getUserFiles(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
} = {}): Promise<any> {
    try {
        const searchParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value) searchParams.append(key, value.toString());
        });

        const response = await makeAuthenticationRequest(
            `/upload/files?${searchParams.toString()}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch files');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user files:', error);
        throw error;
    }
}

export async function deleteUserFile(fileId: string): Promise<any> {
    try {
        const response = await makeAuthenticationRequest(
            `/upload/files/${fileId}`,
            { method: 'DELETE' }
        );

        if (!response.ok) {
            throw new Error('Failed to delete file');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
}