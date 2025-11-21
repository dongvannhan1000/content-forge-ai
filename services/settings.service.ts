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
import { UserSettings, GeneratorSettings } from '@/types';
import { isFirestoreConfigured, COLLECTIONS } from './firestore-utils';

/**
 * Settings Service
 * 
 * Handles all Firestore operations related to user settings
 */

/**
 * Get user settings from users collection
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
 */
export async function saveUserSettings(userId: string, settings: UserSettings): Promise<void> {
    if (!isFirestoreConfigured()) {
        throw new Error('Firestore is not configured');
    }

    try {
        const userDocRef = doc(db, COLLECTIONS.USERS, userId);
        await setDoc(userDocRef, { settings }, { merge: true });
    } catch (error: any) {
        console.error('Error saving user settings to users collection:', error);
        throw error;
    }
}

/**
 * Get user generator settings (legacy - from userSettings collection)
 */
export async function getGeneratorSettings(userId: string): Promise<UserSettings | null> {
    if (!isFirestoreConfigured()) return null;

    try {
        const docRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return docSnap.data() as UserSettings;
    } catch (error: any) {
        console.error('Error getting user settings:', error);
        throw new Error(error.message || 'Failed to get settings');
    }
}

/**
 * Save user generator settings (legacy - to userSettings collection)
 */
export async function saveGeneratorSettings(
    userId: string,
    settings: UserSettings
): Promise<void> {
    if (!isFirestoreConfigured()) {
        throw new Error('Firestore is not configured');
    }

    try {
        const docRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);
        await updateDoc(docRef, settings as DocumentData).catch(async () => {
            // If document doesn't exist, create it
            await addDoc(collection(db, COLLECTIONS.USER_SETTINGS), {
                ...settings,
                userId,
            });
        });
    } catch (error: any) {
        console.error('Error saving user settings:', error);
        throw new Error(error.message || 'Failed to save settings');
    }
}

/**
 * Subscribe to real-time updates for user settings (legacy)
 * Returns an unsubscribe function
 */
export function subscribeToGeneratorSettings(
    userId: string,
    callback: (settings: UserSettings | null) => void
): () => void {
    if (!isFirestoreConfigured()) {
        console.warn('Firestore is not configured. Please set up your .env.local file.');
        callback(null);
        return () => { }; // No-op unsubscribe
    }

    const docRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);

    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data() as UserSettings);
        } else {
            callback(null);
        }
    });
}
