import {
    collection,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    onSnapshot,
    DocumentData,
    setDoc,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserSettings } from '@/types';
import { isFirestoreConfigured, COLLECTIONS } from './firestore-utils';

/**
 * Settings Service
 * 
 * Handles all Firestore operations related to user settings.
 * Settings are stored in the 'users' collection as a nested field.
 */

/**
 * Get user settings from users collection
 * Settings are stored as a nested field within the user document
 */
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
    if (!isFirestoreConfigured()) return null;

    try {
        const userDocRef = doc(db, COLLECTIONS.USERS, userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.settings as UserSettings || null;
        }
        return null;
    } catch (error) {
        console.error('Error getting user settings from users collection:', error);
        return null;
    }
}

/**
 * Save user settings to users collection
 * Settings are merged into the user document
 */
export async function saveUserSettings(userId: string, settings: UserSettings): Promise<void> {
    if (!isFirestoreConfigured()) {
        throw new Error('Firestore is not configured');
    }

    try {
        const userDocRef = doc(db, COLLECTIONS.USERS, userId);
        await setDoc(userDocRef, {
            settings,
            updatedAt: Timestamp.now()
        }, { merge: true });
    } catch (error: any) {
        console.error('Error saving user settings to users collection:', error);
        throw error;
    }
}

/**
 * Subscribe to real-time updates for user settings
 * Listens to changes in the users collection
 * Returns an unsubscribe function
 */
export function subscribeToUserSettings(
    userId: string,
    callback: (settings: UserSettings | null) => void
): () => void {
    if (!isFirestoreConfigured()) {
        console.warn('Firestore is not configured. Please set up your .env.local file.');
        callback(null);
        return () => { }; // No-op unsubscribe
    }

    const userDocRef = doc(db, COLLECTIONS.USERS, userId);

    return onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            callback(userData.settings as UserSettings || null);
        } else {
            callback(null);
        }
    });
}

/**
 * Initialize user document with default settings
 * Called when a new user signs up
 */
export async function initializeUserDocument(
    userId: string,
    email: string | null,
    name: string | null,
    photoURL: string | null,
    defaultSettings: UserSettings
): Promise<void> {
    if (!isFirestoreConfigured()) {
        throw new Error('Firestore is not configured');
    }

    try {
        const userDocRef = doc(db, COLLECTIONS.USERS, userId);
        await setDoc(userDocRef, {
            uid: userId,
            email,
            name,
            photoURL,
            settings: defaultSettings,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        }, { merge: true });
    } catch (error: any) {
        console.error('Error initializing user document:', error);
        throw error;
    }
}
