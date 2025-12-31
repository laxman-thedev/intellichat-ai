import { OpenAI } from "openai";

/**
 * OpenAI client configuration
 *
 * Note:
 * - Uses Gemini API via OpenAI-compatible interface
 * - `baseURL` points to Google Generative Language API
 *
 * This allows using OpenAI SDK syntax with Gemini models
 */
const openai = new OpenAI({
    // API key for Gemini / Google AI
    apiKey: process.env.GEMINI_API_KEY,

    // Custom base URL for Gemini OpenAI-compatible endpoint
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export default openai;