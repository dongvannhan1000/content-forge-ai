'use client';

import { useEffect, useState } from 'react';

/**
 * Firebase Configuration Alert
 * 
 * Purpose: Shows a warning banner when Firebase is not configured.
 * This helps developers know they need to set up their .env.local file.
 */

export function FirebaseConfigAlert() {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        // Check if Firebase environment variables are present
        const isConfigured = !!(
            process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
            process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        );

        setShowAlert(!isConfigured);
    }, []);

    if (!showAlert) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#FEF3C7',
            borderBottom: '2px solid #F59E0B',
            padding: '12px 16px',
            zIndex: 9999,
            fontSize: '14px',
            color: '#92400E',
            textAlign: 'center',
        }}>
            <strong>⚠️ Firebase Not Configured:</strong> Please copy{' '}
            <code style={{
                backgroundColor: '#FDE68A',
                padding: '2px 6px',
                borderRadius: '3px',
                fontFamily: 'monospace'
            }}>
                .env.local.example
            </code>
            {' '}to{' '}
            <code style={{
                backgroundColor: '#FDE68A',
                padding: '2px 6px',
                borderRadius: '3px',
                fontFamily: 'monospace'
            }}>
                .env.local
            </code>
            {' '}and add your Firebase credentials.{' '}
            <button
                onClick={() => setShowAlert(false)}
                style={{
                    marginLeft: '8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}
                title="Dismiss"
            >
                ✕
            </button>
        </div>
    );
}
