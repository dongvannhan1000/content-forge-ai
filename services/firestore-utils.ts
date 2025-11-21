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

// Collection names
export const COLLECTIONS = {
    ARTICLES: 'articles',
    USERS: 'users',
    USER_SETTINGS: 'userSettings',
    SCHEDULES: 'schedules',
    GENERATION_JOBS: 'generation_jobs',
    GENERATED_ARTICLES: 'generated_articles',
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
