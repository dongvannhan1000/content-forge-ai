import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';

/**
 * Firebase Configuration
 * 
 * Purpose: Initialize Firebase services with configuration from environment variables.
 * This file ensures a single Firebase instance is created and shared across the app.
 */

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is available
function isConfigured(): boolean {
    return !!(
        firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.storageBucket &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId
    );
}

// Validate that all required environment variables are present
function validateConfig() {
    const requiredVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID',
    ];

    const missingVars = requiredVars.filter(
        varName => !process.env[varName]
    );

    if (missingVars.length > 0) {
        console.warn(
            `Missing Firebase environment variables: ${missingVars.join(', ')}\n` +
            'Please copy .env.local.example to .env.local and fill in your Firebase credentials.'
        );
        return false;
    }
    return true;
}

// Initialize Firebase (singleton pattern) - only if configured
let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;
let storageInstance: FirebaseStorage | undefined;
let functionsInstance: Functions | undefined;

if (typeof window !== 'undefined' && isConfigured()) {
    // Only initialize on client-side and when configured
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }

    // Initialize Firebase services
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    storageInstance = getStorage(app);
    functionsInstance = getFunctions(app);
} else if (typeof window !== 'undefined') {
    // Warn in browser if not configured
    validateConfig();
}

// Export Firebase services
// These will be undefined during build, but defined when used in the browser with proper config
export const auth = authInstance!;
export const db = dbInstance!;
export const storage = storageInstance!;
export const functions = functionsInstance!;
export default app;

