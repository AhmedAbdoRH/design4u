import imageCompression from 'browser-image-compression';

/**
 * Compress and resize an image file to be under a max size and with specific dimensions.
 * @param file The original image file
 * @param maxWidth The maximum width for resizing
 * @param maxHeight The maximum height for resizing
 * @param maxSizeMB The maximum allowed size in MB (default 2MB)
 * @returns A Promise that resolves to the compressed File
 */
export async function compressImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  maxSizeMB = 2
): Promise<File> {
  const options = {
    maxSizeMB,
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    useWebWorker: true,
    initialQuality: 0.8,
    alwaysKeepResolution: false,
    fileType: 'image/webp',
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    // fallback: return original file if compression fails
    return file;
  }
}
