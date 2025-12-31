import ImageKit from "imagekit";

/**
 * ImageKit configuration
 *
 * Used for:
 * - Uploading AI-generated images
 * - Serving optimized image URLs
 *
 * Credentials are loaded from environment variables
 */
const imagekit = new ImageKit({
    // Public key used on client-side or for identification
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,

    // Private key used securely on server
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,

    // Base URL where images are hosted
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});

export default imagekit;