/**
 * Firebase Barrel Export
 * 
 * Purpose: Centralized export point for all Firebase-related modules.
 * This allows clean imports throughout the app: import { auth, db } from '@/lib/firebase'
 */

export { auth, db, storage } from './config';
export { default as app } from './config';
