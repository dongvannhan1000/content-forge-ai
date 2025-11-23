import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useSettings } from './useSettings';
import { GenerationJob, GenerationMode } from '@/types';
import * as jobsService from '@/services/jobs.service';

/**
 * Hook for managing generation jobs with real-time progress tracking
 */
export function useGenerationJob() {
    const { user } = useAuth();
    const { settings } = useSettings();
    const [currentJob, setCurrentJob] = useState<GenerationJob | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to job updates
    useEffect(() => {
        if (!currentJob?.id) return;

        const unsubscribe = jobsService.subscribeToJob(
            currentJob.id,
            (job) => {
                if (!job) {
                    setCurrentJob(null);
                    setIsGenerating(false);
                    return;
                }

                setCurrentJob(job);

                // Update generating state based on job status
                if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
                    setIsGenerating(false);
                }

                // Set error if job failed
                if (job.status === 'failed' && job.error) {
                    setError(job.error);
                }
            }
        );

        return () => unsubscribe();
    }, [currentJob?.id]);

    /**
     * Create a new generation job
     */
    const createJob = useCallback(async (jobData: {
        mode: GenerationMode;
        topic?: string;
        count: number;
        imageFiles?: File[];
        language?: string; // Optional: prioritize form language over settings
    }) => {
        if (!user) {
            setError('User must be authenticated');
            return;
        }

        try {
            setError(null);
            setIsGenerating(true);

            let imageUrls: string[] | undefined;

            // If image mode, upload images first
            if (jobData.mode === 'image' && jobData.imageFiles && jobData.imageFiles.length > 0) {
                const { uploadMultipleImages } = await import('@/services/storage.service');
                imageUrls = await uploadMultipleImages(user.uid, jobData.imageFiles);
                // Set count to match number of uploaded images
                jobData.count = imageUrls.length;
            }

            const jobId = await jobsService.createGenerationJob(user.uid, {
                mode: jobData.mode,
                topic: jobData.topic,
                count: jobData.count,
                language: jobData.language || settings.ai.contentLanguage, // Prioritize form language
                systemPrompt: settings.ai.systemPrompt,
                imagePromptSuffix: settings.vision.imagePromptSuffix,
                imageUrls: imageUrls,
            });

            // Set initial job state
            setCurrentJob({
                id: jobId,
                userId: user.uid,
                mode: jobData.mode,
                topic: jobData.topic,
                count: jobData.count,
                language: jobData.language || settings.ai.contentLanguage, // Prioritize form language
                systemPrompt: settings.ai.systemPrompt,
                imagePromptSuffix: settings.vision.imagePromptSuffix,
                imageUrls: imageUrls,
                status: 'pending',
                progress: 0,
                createdAt: new Date(),
            });
        } catch (err: any) {
            console.error('Error creating job:', err);
            setError(err.message || 'Failed to create generation job');
            setIsGenerating(false);
        }
    }, [user, settings]);

    /**
     * Cancel the current job
     */
    const cancelJob = useCallback(async () => {
        if (!currentJob?.id) return;

        try {
            await jobsService.cancelJob(currentJob.id);
        } catch (err: any) {
            console.error('Error cancelling job:', err);
            setError(err.message || 'Failed to cancel job');
        }
    }, [currentJob?.id]);

    /**
     * Clear current job and reset state
     */
    const clearJob = useCallback(() => {
        setCurrentJob(null);
        setIsGenerating(false);
        setError(null);
    }, []);

    // Calculate progress
    const progress = {
        current: currentJob?.progress || 0,
        total: currentJob?.count || 0,
        percentage: currentJob?.count
            ? Math.round(((currentJob.progress || 0) / currentJob.count) * 100)
            : 0,
    };

    return {
        currentJob,
        isGenerating,
        progress,
        error,
        createJob,
        cancelJob,
        clearJob,
    };
}
