import { Timestamp, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Firestore Utilities
 * 
 * Shared utilities for Firestore operations
 */

// Check if Firestore is configured
export function isFirestoreConfigured(): boolean {
    return db !== undefined && db !== null;
}

/**
 * Collection names - Aligned with proven database structure
 * 
 * This project uses 3 main Firestore collections:
 * - users: stores user profiles and their settings
 * - generated_articles: stores all generated articles
 * - generation_jobs: stores batch generation job information
 */
export const COLLECTIONS = {
    USERS: 'users',
    GENERATED_ARTICLES: 'generated_articles',
    GENERATION_JOBS: 'generation_jobs',
} as const;

/**
 * Convert Firestore Timestamp to Date
 */
export function timestampToDate(timestamp: any): Date {
    if (timestamp?.toDate) {
        return timestamp.toDate();
    }
    return new Date(timestamp);
}

/**
 * Convert Date to Firestore Timestamp
 */
export function dateToTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date);
}
