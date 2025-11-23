import {
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    UploadTask,
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

/**
 * Storage Service
 * 
 * Purpose: Handles Firebase Storage operations for file uploads (images, etc.).
 * This service manages file storage separately from UI components.
 */

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'images/user123/photo.jpg')
 * @returns The download URL of the uploaded file
 */
export async function uploadFile(
    file: File,
    path: string
): Promise<string> {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error: any) {
        console.error('Error uploading file:', error);
        throw new Error(error.message || 'Failed to upload file');
    }
}

/**
 * Upload a file with progress tracking
 * @param file - The file to upload
 * @param path - The storage path
 * @param onProgress - Callback for upload progress (0-100)
 * @returns The download URL of the uploaded file
 */
export async function uploadFileWithProgress(
    file: File,
    path: string,
    onProgress?: (progress: number) => void
): Promise<string> {
    try {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Track progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) {
                        onProgress(progress);
                    }
                },
                (error) => {
                    // Handle error
                    console.error('Error uploading file:', error);
                    reject(new Error(error.message || 'Failed to upload file'));
                },
                async () => {
                    // Upload completed successfully
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    } catch (error: any) {
        console.error('Error uploading file:', error);
        throw new Error(error.message || 'Failed to upload file');
    }
}

/**
 * Delete a file from Firebase Storage
 * @param path - The storage path of the file to delete
 */
export async function deleteFile(path: string): Promise<void> {
    try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
    } catch (error: any) {
        console.error('Error deleting file:', error);
        throw new Error(error.message || 'Failed to delete file');
    }
}

/**
 * Get the download URL for a file
 * @param path - The storage path
 * @returns The download URL
 */
export async function getFileURL(path: string): Promise<string> {
    try {
        const storageRef = ref(storage, path);
        return await getDownloadURL(storageRef);
    } catch (error: any) {
        console.error('Error getting file URL:', error);
        throw new Error(error.message || 'Failed to get file URL');
    }
}

/**
 * Generate a unique filename for uploads
 * @param userId - The user ID
 * @param originalFilename - The original filename
 * @returns A unique storage path
 */
export function generateStoragePath(
    userId: string,
    originalFilename: string,
    folder: string = 'images'
): string {
    const timestamp = Date.now();
    const extension = originalFilename.split('.').pop();
    const filename = `${timestamp}_${Math.random().toString(36).substring(7)}.${extension}`;
    return `${folder}/${userId}/${filename}`;
}

/**
 * Upload multiple images to Firebase Storage
 * @param userId - The user ID
 * @param files - Array of files to upload
 * @param folder - The storage folder (default: 'user-uploads')
 * @returns Array of download URLs in the same order as input files
 */
export async function uploadMultipleImages(
    userId: string,
    files: File[],
    folder: string = 'user-uploads'
): Promise<string[]> {
    try {
        // Upload all files concurrently
        const uploadPromises = files.map(async (file, index) => {
            const path = generateStoragePath(userId, file.name, folder);
            const url = await uploadFile(file, path);
            return { url, index };
        });

        const results = await Promise.all(uploadPromises);

        // Sort by original index to maintain order
        results.sort((a, b) => a.index - b.index);

        return results.map(r => r.url);
    } catch (error: any) {
        console.error('Error uploading multiple images:', error);
        throw new Error(error.message || 'Failed to upload images');
    }
}

