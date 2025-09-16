import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 2,            // target maximum size
    maxWidthOrHeight: 1024,  // resize if too large
    useWebWorker: true,      // faster compression
  };  
  console.log("Original file size:", file.size / 1024 / 1024, "MB");
  

  try {
    const compressed = await imageCompression(file, options);
    console.log("Compressed file size:", compressed.size / 1024 / 1024, "MB");
    return compressed; // return compressed File
  } catch (error) {
    console.error("Image compression error:", error);
    return file; // fallback: return original file if compression fails
  }
}
