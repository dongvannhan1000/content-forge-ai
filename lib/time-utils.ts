/**
 * Utility functions for time formatting and countdown
 */

/**
 * Calculate time remaining from now to a future date
 * @param targetDate - The target date/time
 * @returns Human-readable time remaining (e.g., "in 2 hours 15 minutes")
 */
export function getTimeRemaining(targetDate: Date): string {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    // If in the past
    if (diff <= 0) {
        return 'Overdue';
    }

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        const remainingHours = hours % 24;
        if (remainingHours > 0) {
            return `in ${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
        }
        return `in ${days} day${days > 1 ? 's' : ''}`;
    }

    if (hours > 0) {
        const remainingMinutes = minutes % 60;
        if (remainingMinutes > 0) {
            return `in ${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
        }
        return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    }

    if (minutes > 0) {
        return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    return 'in less than a minute';
}

/**
 * Format a Firestore Timestamp to readable date/time string
 * @param timestamp - Firestore Timestamp
 * @returns Formatted string (e.g., "Nov 23, 2:30 PM")
 */
export function formatDateTime(timestamp: any): string {
    if (!timestamp) return 'N/A';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Format a Firestore Timestamp to just date
 * @param timestamp - Firestore Timestamp
 * @returns Formatted string (e.g., "Nov 23, 2024")
 */
export function formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
