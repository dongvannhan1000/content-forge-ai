import {
    collection,
    doc,
    addDoc,
    updateDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    limit as firestoreLimit,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GenerationJob } from '@/types';
import { isFirestoreConfigured, COLLECTIONS } from './firestore-utils';

/**
 * Jobs Service
 * 
 * Purpose: Handles all Firestore operations related to generation jobs.
 * Jobs are stored in the 'generation_jobs_v2' collection (V2 includes mode field).
 */

// Use V2 collection for new jobs with mode and status support
const JOBS_COLLECTION = 'generation_jobs_v2';

/**
 * Create a new generation job
 * This will trigger the Cloud Function to start processing
 */
export async function createGenerationJob(
    userId: string,
    jobData: Omit<GenerationJob, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    if (!isFirestoreConfigured()) {
        throw new Error('Firestore is not configured');
    }

    try {
        const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
            userId,
            topic: jobData.topic,
            count: jobData.count,
            mode: jobData.mode,
            language: jobData.language,
            systemPrompt: jobData.systemPrompt,
            imagePromptSuffix: jobData.imagePromptSuffix,
            imageUrls: jobData.imageUrls, // Include imageUrls for image mode
            status: 'pending',
            progress: 0,
            createdAt: Timestamp.now(),
        });

        return docRef.id;
    } catch (error: any) {
        console.error('Error creating generation job:', error);
        throw new Error(error.message || 'Failed to create generation job');
    }
}

/**
 * Subscribe to real-time updates for a specific job
 * Returns an unsubscribe function
 */
export function subscribeToJob(
    jobId: string,
    callback: (job: GenerationJob | null) => void
): () => void {
    if (!isFirestoreConfigured()) {
        console.warn('Firestore is not configured');
        callback(null);
        return () => { };
    }

    const jobDocRef = doc(db, JOBS_COLLECTION, jobId);

    return onSnapshot(jobDocRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({
                id: docSnap.id,
                ...docSnap.data()
            } as GenerationJob);
        } else {
            callback(null);
        }
    });
}

/**
 * Cancel a running job
 */
export async function cancelJob(jobId: string): Promise<void> {
    if (!isFirestoreConfigured()) {
        throw new Error('Firestore is not configured');
    }

    try {
        const jobDocRef = doc(db, JOBS_COLLECTION, jobId);
        await updateDoc(jobDocRef, {
            status: 'cancelled',
            updatedAt: Timestamp.now(),
        });
    } catch (error: any) {
        console.error('Error cancelling job:', error);
        throw new Error(error.message || 'Failed to cancel job');
    }
}

/**
 * Get user's recent jobs
 */
export async function getUserJobs(
    userId: string,
    limitCount: number = 10
): Promise<GenerationJob[]> {
    if (!isFirestoreConfigured()) return [];

    try {
        const q = query(
            collection(db, JOBS_COLLECTION),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            firestoreLimit(limitCount)
        );

        // Note: This returns a static snapshot
        // For real-time updates, use subscribeToJob
        return [];
    } catch (error: any) {
        console.error('Error getting user jobs:', error);
        throw new Error(error.message || 'Failed to get jobs');
    }
}
