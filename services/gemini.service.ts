import { getFunctions, httpsCallable } from 'firebase/functions';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app, auth, storage } from '@/lib/firebase';
import { Article } from '@/types';

/**
 * Gemini AI Service
 * 
 * Purpose: Encapsulates all AI content generation operations using Firebase Functions.
 * This service handles article generation from various sources (topic, images, websites)
 * and integrates with the Gemini API through Cloud Functions.
 */

const functions = getFunctions(app);

/**
 * Generated article structure returned from AI
 */
export interface GeneratedArticleText {
    title: string;
    content: string;
}

/**
 * Generated article with image information
 */
export interface GeneratedArticleTextFromImage extends GeneratedArticleText {
    imagePrompt: string;
    imageUrl?: string;
}

/**
 * Generates a list of articles based on a topic.
 * 
 * @param topic - The topic to generate articles about
 * @param count - Number of articles to generate
 * @param language - Language for the articles
 * @param systemInstruction - Custom instructions for the AI
 * @param imagePromptSuffix - Suffix to add to image prompts
 * @returns Array of generated articles with image prompts
 */
export async function generateArticlesFromTopic(
    topic: string,
    count: number,
    language: string,
    systemInstruction: string,
    imagePromptSuffix: string
): Promise<GeneratedArticleTextFromImage[]> {
    const generateFn = httpsCallable(functions, 'generateArticlesFromTopic');
    const result = await generateFn({
        topic,
        count,
        language,
        systemPrompt: systemInstruction,
        imagePromptSuffix,
    });
    return (result.data as any).articles;
}

/**
 * Generates articles from provided images (one article per image).
 * 
 * @param images - Array of image files to analyze
 * @param language - Language for the articles
 * @param systemInstruction - Custom instructions for the AI
 * @returns Array of generated articles based on the images
 */
export async function generateArticlesFromImages(
    images: File[],
    language: string,
    systemInstruction: string
): Promise<GeneratedArticleTextFromImage[]> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User must be authenticated to upload images');
    }

    // Upload images to Firebase Storage and get URLs
    const imageUrls = await Promise.all(
        images.map(async (image, index) => {
            const timestamp = Date.now();
            const fileName = `${timestamp}_${index}_${image.name}`;
            const storageRef = ref(storage, `user-images/${user.uid}/${fileName}`);

            await uploadBytes(storageRef, image);
            const url = await getDownloadURL(storageRef);
            return url;
        })
    );

    const generateFn = httpsCallable(functions, 'generateArticlesFromImages');
    const result = await generateFn({
        imageUrls,
        language,
        systemPrompt: systemInstruction,
    });
    return (result.data as any).articles;
}

/**
 * Generates a single article by analyzing a website URL.
 * 
 * @param websiteUrl - URL of the website to analyze
 * @param language - Language for the article
 * @param systemInstruction - Custom instructions for the AI
 * @returns Generated article based on the website content
 */
export async function generateArticleFromWebsite(
    websiteUrl: string,
    language: string,
    systemInstruction: string
): Promise<GeneratedArticleTextFromImage> {
    const generateFn = httpsCallable(functions, 'generateArticleFromWebsite');
    const result = await generateFn({
        websiteUrl,
        language,
        systemPrompt: systemInstruction,
    });
    return (result.data as any).article;
}

/**
 * Regenerates the title and content for an existing article.
 * 
 * @param article - The article to regenerate
 * @param systemInstruction - Custom instructions for the AI
 * @returns New title and content for the article
 */
export async function regenerateArticleText(
    article: Article,
    systemInstruction: string
): Promise<GeneratedArticleText> {
    const regenerateFn = httpsCallable(functions, 'regenerateArticleText');
    const result = await regenerateFn({
        article,
        systemPrompt: systemInstruction,
    });
    return (result.data as any).text;
}

/**
 * Generates an image from a text prompt using AI.
 * 
 * @param prompt - Text description of the image to generate
 * @returns URL of the generated image
 */
export async function generateImage(prompt: string): Promise<string> {
    const generateFn = httpsCallable(functions, 'generateImage');
    const result = await generateFn({ prompt });
    return (result.data as any).imageUrl;
}

/**
 * Regenerates the image prompt for an existing article.
 * 
 * @param article - The article to generate a new image prompt for
 * @param systemInstruction - Custom instructions for the AI
 * @param imagePromptSuffix - Suffix to add to the image prompt
 * @returns New image prompt
 */
export async function regenerateImagePrompt(
    article: Article,
    systemInstruction: string,
    imagePromptSuffix: string
): Promise<string> {
    const regenerateFn = httpsCallable(functions, 'regenerateImagePrompt');
    const result = await regenerateFn({
        article,
        systemPrompt: systemInstruction,
        imagePromptSuffix,
    });
    return (result.data as any).imagePrompt;
}
