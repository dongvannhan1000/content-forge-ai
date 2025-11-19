import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    Query,
    DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Article, GeneratorSettings } from '@/types';

/**
 * Firestore Service
 * 
 * Purpose: Encapsulates all Firestore database operations.
 * This service centralizes database logic and prevents direct Firestore calls in UI components.
 */

// Check if Firestore is configured
function isFirestoreConfigured(): boolean {
    return db !== undefined && db !== null;
}

// Collection names
const COLLECTIONS = {
    ARTICLES: 'articles',
    USER_SETTINGS: 'userSettings',
};

/**
 * Convert Firestore Timestamp to Date
 */
function timestampToDate(timestamp: any): Date {
    if (timestamp?.toDate) {
        return timestamp.toDate();
    }
    return new Date(timestamp);
}

/**
 * Convert Article from Firestore format to app format
 */
function mapFirestoreArticle(id: string, data: DocumentData): Article {
    return {
        id,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        mode: data.mode,
        status: data.status,
        scheduledAt: data.scheduledAt ? timestampToDate(data.scheduledAt) : undefined,
        platforms: data.platforms,
        createdAt: timestampToDate(data.createdAt),
    };
}

/**
 * Convert Article to Firestore format
 */
function articleToFirestore(article: Partial<Article>): DocumentData {
    const data: DocumentData = {
        ...article,
    };

    // Convert dates to Firestore Timestamps
    if (article.scheduledAt) {
        data.scheduledAt = Timestamp.fromDate(article.scheduledAt);
    }
    if (article.createdAt) {
        data.createdAt = Timestamp.fromDate(article.createdAt);
    }

    return data;
}

// ========== Article Operations ==========

/**
 * Create a new article
 */
export async function createArticle(
    userId: string,
    article: Omit<Article, 'id'>
): Promise<string> {
    if (!isFirestoreConfigured()) {
        throw new Error('Firestore is not configured. Please set up your .env.local file.');
    }

    try {
        const articleData = articleToFirestore({
            ...article,
            createdAt: article.createdAt || new Date(),
        });

        const docRef = await addDoc(collection(db, COLLECTIONS.ARTICLES), {
            ...articleData,
            userId,
        });

        return docRef.id;
    } catch (error: any) {
        console.error('Error creating article:', error);
        throw new Error(error.message || 'Failed to create article');
    }
}

/**
 * Get a single article by ID
 */
export async function getArticle(articleId: string): Promise<Article | null> {
    try {
        const docRef = doc(db, COLLECTIONS.ARTICLES, articleId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return mapFirestoreArticle(docSnap.id, docSnap.data());
    } catch (error: any) {
        console.error('Error getting article:', error);
        throw new Error(error.message || 'Failed to get article');
    }
}

/**
 * Get all articles for a user
 */
export async function getUserArticles(userId: string): Promise<Article[]> {
    try {
        const q = query(
            collection(db, COLLECTIONS.ARTICLES),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc =>
            mapFirestoreArticle(doc.id, doc.data())
        );
    } catch (error: any) {
        console.error('Error getting user articles:', error);
        throw new Error(error.message || 'Failed to get articles');
    }
}

/**
 * Update an article
 */
export async function updateArticle(
    articleId: string,
    updates: Partial<Article>
): Promise<void> {
    try {
        const docRef = doc(db, COLLECTIONS.ARTICLES, articleId);
        const updateData = articleToFirestore(updates);

        // Remove id from updates if present
        delete updateData.id;

        await updateDoc(docRef, updateData);
    } catch (error: any) {
        console.error('Error updating article:', error);
        throw new Error(error.message || 'Failed to update article');
    }
}

/**
 * Delete an article
 */
export async function deleteArticle(articleId: string): Promise<void> {
    try {
        const docRef = doc(db, COLLECTIONS.ARTICLES, articleId);
        await deleteDoc(docRef);
    } catch (error: any) {
        console.error('Error deleting article:', error);
        throw new Error(error.message || 'Failed to delete article');
    }
}

/**
 * Subscribe to real-time updates for user's articles
 * Returns an unsubscribe function
 */
export function subscribeToUserArticles(
    userId: string,
    callback: (articles: Article[]) => void
): () => void {
    if (!isFirestoreConfigured()) {
        console.warn('Firestore is not configured. Please set up your .env.local file.');
        callback([]);
        return () => { }; // No-op unsubscribe
    }

    const q = query(
        collection(db, COLLECTIONS.ARTICLES),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
        const articles = querySnapshot.docs.map(doc =>
            mapFirestoreArticle(doc.id, doc.data())
        );
        callback(articles);
    });
}

// ========== User Settings Operations ==========

/**
 * Get user settings
 */
export async function getUserSettings(userId: string): Promise<GeneratorSettings | null> {
    try {
        const docRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return docSnap.data() as GeneratorSettings;
    } catch (error: any) {
        console.error('Error getting user settings:', error);
        throw new Error(error.message || 'Failed to get settings');
    }
}

/**
 * Save user settings
 */
export async function saveUserSettings(
    userId: string,
    settings: GeneratorSettings
): Promise<void> {
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
 * Subscribe to real-time updates for user settings
 * Returns an unsubscribe function
 */
export function subscribeToUserSettings(
    userId: string,
    callback: (settings: GeneratorSettings | null) => void
): () => void {
    if (!isFirestoreConfigured()) {
        console.warn('Firestore is not configured. Please set up your .env.local file.');
        callback(null);
        return () => { }; // No-op unsubscribe
    }

    const docRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);

    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data() as GeneratorSettings);
        } else {
            callback(null);
        }
    });
}
