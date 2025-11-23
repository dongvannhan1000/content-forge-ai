import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase/config';
import { Article } from '@/types';

/**
 * Article Service
 * 
 * Purpose: Centralize article-related business logic.
 * Handles webhook posting, text regeneration, and image regeneration.
 */

/**
 * Post article to webhook URL
 * Sends article data (title, content, imageUrl) via POST request
 */
export async function postArticleToWebhook(
    article: Article,
    webhookUrl: string
): Promise<void> {
    if (!webhookUrl || webhookUrl.trim() === '') {
        throw new Error('Webhook URL is required');
    }

    if (!article.title || !article.content) {
        throw new Error('Article must have title and content');
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: article.title,
                content: article.content,
                imageUrl: article.imageUrl || '',
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Webhook request failed: ${response.status} - ${errorText}`);
        }
    } catch (error: any) {
        console.error('Error posting to webhook:', error);
        throw new Error(error.message || 'Failed to post article to webhook');
    }
}

/**
 * Regenerate article text (title and content)
 * Calls the regenerateArticleText cloud function
 */
export async function regenerateArticleText(
    article: Article,
    systemPrompt: string
): Promise<{ title: string; content: string }> {
    if (!article) {
        throw new Error('Article is required');
    }

    try {
        const regenerateText = httpsCallable(functions, 'regenerateArticleText');
        const result = await regenerateText({
            article: {
                title: article.title,
                content: article.content,
                topic: article.topic,
            },
            systemPrompt,
        });

        const data = result.data as { text: { title: string; content: string } };
        return data.text;
    } catch (error: any) {
        console.error('Error regenerating article text:', error);
        throw new Error(error.message || 'Failed to regenerate article text');
    }
}

/**
 * Regenerate image prompt for an article
 * Calls the regenerateImagePrompt cloud function
 */
export async function regenerateImagePrompt(
    article: Article,
    systemPrompt: string,
    imagePromptSuffix: string
): Promise<string> {
    if (!article) {
        throw new Error('Article is required');
    }

    try {
        const regeneratePrompt = httpsCallable(functions, 'regenerateImagePrompt');
        const result = await regeneratePrompt({
            article: {
                title: article.title,
                content: article.content,
                imagePrompt: article.imagePrompt,
                topic: article.topic,
            },
            systemPrompt,
            imagePromptSuffix,
        });

        const data = result.data as { imagePrompt: string };
        return data.imagePrompt;
    } catch (error: any) {
        console.error('Error regenerating image prompt:', error);
        throw new Error(error.message || 'Failed to regenerate image prompt');
    }
}

/**
 * Generate image from a prompt
 * Calls the generateImage cloud function
 */
export async function generateImageFromPrompt(
    imagePrompt: string
): Promise<string> {
    if (!imagePrompt || imagePrompt.trim() === '') {
        throw new Error('Image prompt is required');
    }

    try {
        const generateImg = httpsCallable(functions, 'generateImage');
        const result = await generateImg({
            prompt: imagePrompt,
        });

        const data = result.data as { imageUrl: string };
        return data.imageUrl;
    } catch (error: any) {
        console.error('Error generating image:', error);
        throw new Error(error.message || 'Failed to generate image');
    }
}
