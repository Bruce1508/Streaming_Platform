import { Metadata } from 'next';
import FileGallery from '@/components/ui/FileGallery';

export const metadata: Metadata = {
    title: 'My Files | Linguex',
    description: 'Manage your uploaded files and documents',
};

export default function FilesPage() {
    return (
        <div>
            <FileGallery />
        </div> 
    );
}