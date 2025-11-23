'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useGenerationJob } from '@/hooks/useGenerationJob';
import { GenerationJob, GenerationMode } from '@/types';

/**
 * JobContext
 * 
 * Purpose: Provides global access to generation job state and functions
 * across the entire application. This allows the progress bar to persist
 * across tab navigation and enables job cancellation from any page.
 */

interface JobContextValue {
    currentJob: GenerationJob | null;
    isGenerating: boolean;
    progress: {
        current: number;
        total: number;
        percentage: number;
    };
    error: string | null;
    createJob: (jobData: {
        mode: GenerationMode;
        topic?: string;
        count: number;
        imageFiles?: File[];
        language?: string;
    }) => Promise<void>;
    cancelJob: () => Promise<void>;
    clearJob: () => void;
}

const JobContext = createContext<JobContextValue | undefined>(undefined);

interface JobProviderProps {
    children: ReactNode;
}

export function JobProvider({ children }: JobProviderProps) {
    const jobState = useGenerationJob();

    return (
        <JobContext.Provider value={jobState}>
            {children}
        </JobContext.Provider>
    );
}

/**
 * Hook to access job context
 * Must be used within JobProvider
 */
export function useJob() {
    const context = useContext(JobContext);
    if (context === undefined) {
        throw new Error('useJob must be used within a JobProvider');
    }
    return context;
}
