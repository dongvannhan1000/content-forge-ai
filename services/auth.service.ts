import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    User as FirebaseUser,
    updateProfile,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types';

/**
 * Authentication Service
 * 
 * Purpose: Encapsulates all Firebase Authentication operations.
 * This service separates Firebase Auth logic from UI components,
 * making the codebase more maintainable and testable.
 */

/**
 * Check if Firebase Auth is configured
 */
function isAuthConfigured(): boolean {
    return auth !== undefined && auth !== null;
}

/**
 * Convert Firebase User to our app's User type
 */
function mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
    };
}

/**
 * Sign up a new user with email and password
 */
export async function signupWithEmail(
    name: string,
    email: string,
    password: string
): Promise<User> {
    if (!isAuthConfigured()) {
        throw new Error('Firebase Authentication is not configured. Please set up your .env.local file.');
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update the user's display name
        await updateProfile(userCredential.user, {
            displayName: name,
        });

        return mapFirebaseUserToUser(userCredential.user);
    } catch (error: any) {
        console.error('Error signing up:', error);
        throw new Error(error.message || 'Failed to sign up');
    }
}

/**
 * Log in an existing user with email and password
 */
export async function loginWithEmail(
    email: string,
    password: string
): Promise<User> {
    if (!isAuthConfigured()) {
        throw new Error('Firebase Authentication is not configured. Please set up your .env.local file.');
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return mapFirebaseUserToUser(userCredential.user);
    } catch (error: any) {
        console.error('Error logging in:', error);
        throw new Error(error.message || 'Failed to log in');
    }
}

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
    if (!isAuthConfigured()) {
        throw new Error('Firebase Authentication is not configured. Please set up your .env.local file.');
    }

    try {
        await signOut(auth);
    } catch (error: any) {
        console.error('Error logging out:', error);
        throw new Error(error.message || 'Failed to log out');
    }
}

/**
 * Send a password reset email
 */
export async function resetPassword(email: string): Promise<void> {
    if (!isAuthConfigured()) {
        throw new Error('Firebase Authentication is not configured. Please set up your .env.local file.');
    }

    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        console.error('Error sending password reset email:', error);
        throw new Error(error.message || 'Failed to send password reset email');
    }
}

/**
 * Get the currently authenticated user
 */
export function getCurrentUser(): User | null {
    if (!isAuthConfigured()) {
        return null;
    }

    const firebaseUser = auth.currentUser;
    return firebaseUser ? mapFirebaseUserToUser(firebaseUser) : null;
}

/**
 * Subscribe to authentication state changes
 * Returns an unsubscribe function
 */
export function onAuthStateChange(
    callback: (user: User | null) => void
): () => void {
    if (!isAuthConfigured()) {
        // If Firebase is not configured, immediately call callback with null user
        // and return a no-op unsubscribe function
        console.warn('Firebase Authentication is not configured. Please set up your .env.local file.');
        callback(null);
        return () => { }; // No-op unsubscribe function
    }

    return onAuthStateChanged(auth, (firebaseUser) => {
        const user = firebaseUser ? mapFirebaseUserToUser(firebaseUser) : null;
        callback(user);
    });
}
