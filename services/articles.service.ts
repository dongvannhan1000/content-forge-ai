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
    DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GeneratedArticle } from '@/types';
import { isFirestoreConfigured, COLLECTIONS, timestampToDate } from './firestore-utils';

/**
 * Article Service
 * 
 * Handles all Firestore operations for articles.
 * Articles are stored in the 'generated_articles' collection.
 */

/**
 * Convert GeneratedArticle from Firestore format to app format
 */
function mapFirestoreArticle(id: string, data: DocumentData): GeneratedArticle {
    return {
        id,
        userId: data.userId,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        imagePrompt: data.imagePrompt,
        topic: data.topic,
        mode: data.mode || 'topics', // Default for old records
        status: data.status || 'published', // Old records default to published
        scheduledAt: data.scheduledAt,
        platforms: data.platforms,
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt,
        jobId: data.jobId,
    };
}

/**
 * Convert GeneratedArticle to Firestore format
 */
function articleToFirestore(article: Partial<GeneratedArticle>): DocumentData {
    const data: DocumentData = {
        ...article,
    };

    // Timestamps are already in Firestore format from GeneratedArticle
    // No conversion needed

    return data;
}

/**
 * Create a new article
 */
export async function createArticle(
    userId: string,
    article: Omit<GeneratedArticle, 'id'>
): Promise<string> {
    if (!isFirestoreConfigured()) {
        throw new Error('Firestore is not configured. Please set up your .env.local file.');
    }

    try {
        const articleData = articleToFirestore({
            ...article,
            createdAt: article.createdAt || Timestamp.now(),
        });

        const docRef = await addDoc(collection(db, COLLECTIONS.GENERATED_ARTICLES), {
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
export async function getArticle(articleId: string): Promise<GeneratedArticle | null> {
    if (!isFirestoreConfigured()) return null;

    try {
        const docRef = doc(db, COLLECTIONS.GENERATED_ARTICLES, articleId);
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
export async function getUserArticles(userId: string): Promise<GeneratedArticle[]> {
    if (!isFirestoreConfigured()) return [];

    try {
        const q = query(
            collection(db, COLLECTIONS.GENERATED_ARTICLES),
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
    updates: Partial<GeneratedArticle>
): Promise<void> {
    if (!isFirestoreConfigured()) {
        throw new Error('Firestore is not configured');
    }

    try {
        const docRef = doc(db, COLLECTIONS.GENERATED_ARTICLES, articleId);
        const updateData = articleToFirestore(updates);

        // Remove id from updates if present
        delete updateData.id;

        // Add updatedAt timestamp
        updateData.updatedAt = Timestamp.now();

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
    if (!isFirestoreConfigured()) {
        throw new Error('Firestore is not configured');
    }

    try {
        const docRef = doc(db, COLLECTIONS.GENERATED_ARTICLES, articleId);
        await deleteDoc(docRef);
    } catch (error: any) {
        console.error('Error deleting article:', error);
        throw new Error(error.message || 'Failed to delete article');
    }
}

/**
 * Get user articles filtered by status
 */
export async function getUserArticlesByStatus(
    userId: string,
    status: 'draft' | 'scheduled' | 'published'
): Promise<GeneratedArticle[]> {
    if (!isFirestoreConfigured()) return [];

    try {
        const q = query(
            collection(db, COLLECTIONS.GENERATED_ARTICLES),
            where('userId', '==', userId),
            where('status', '==', status),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc =>
            mapFirestoreArticle(doc.id, doc.data())
        );
    } catch (error: any) {
        console.error('Error getting user articles by status:', error);
        throw new Error(error.message || 'Failed to get articles');
    }
}

/**
 * Subscribe to real-time updates for user's articles
 * Returns an unsubscribe function
 */
export function subscribeToUserArticles(
    userId: string,
    callback: (articles: GeneratedArticle[]) => void
): () => void {
    if (!isFirestoreConfigured()) {
        console.warn('Firestore is not configured. Please set up your .env.local file.');
        callback([]);
        return () => { }; // No-op unsubscribe
    }

    const q = query(
        collection(db, COLLECTIONS.GENERATED_ARTICLES),
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

/**
 * Subscribe to real-time updates for user's articles filtered by status
 * Returns an unsubscribe function
 */
export function subscribeToUserArticlesByStatus(
    userId: string,
    status: 'draft' | 'scheduled' | 'published',
    callback: (articles: GeneratedArticle[]) => void
): () => void {
    if (!isFirestoreConfigured()) {
        console.warn('Firestore is not configured. Please set up your .env.local file.');
        callback([]);
        return () => { }; // No-op unsubscribe
    }

    const q = query(
        collection(db, COLLECTIONS.GENERATED_ARTICLES),
        where('userId', '==', userId),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
        const articles = querySnapshot.docs.map(doc =>
            mapFirestoreArticle(doc.id, doc.data())
        );
        callback(articles);
    });
}
