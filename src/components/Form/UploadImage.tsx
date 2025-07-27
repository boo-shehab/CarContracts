import React, { useRef, useState } from 'react';
import { FiCamera, FiUpload } from 'react-icons/fi';

interface UploadImageProps {
  onChange: (files: File[]) => void;
  oldImages?: string[];
  disabled?: boolean;
}

const UploadImage: React.FC<UploadImageProps> = ({ onChange, oldImages, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [allFiles, setAllFiles] = useState<File[]>([]);

  // Show old images if available
  React.useEffect(() => {
    if (oldImages) {
      setImages(oldImages);
    }
  }, [oldImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
      // Reset input value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleFiles = (files: File[]) => {
    if (disabled) return;
    const newFiles = [...allFiles, ...files];
    setAllFiles(newFiles);
    onChange(newFiles);

    // Append new image URLs to existing images
    const imgUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...imgUrls]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="w-32 h-32 rounded-xl overflow-hidden bg-white border border-blue-100 flex items-center justify-center"
            >
              <img src={src} alt={`uploaded-${idx}`} className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      )}
      <div
        className={`bg-blue-50 rounded-xl p-6 border border-blue-200 transition-all duration-200 ${
          dragActive ? 'ring-2 ring-blue-400' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex items-center justify-center gap-12 w-full mb-4">
          {/* Upload File */}
          <div
            className={`flex flex-col items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-blue-100 mb-2">
              <FiUpload size={36} className="text-blue-400" />
            </div>
            <span className="text-blue-400 text-lg font-medium">تحميل ملف</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={disabled}
              onChange={handleFileChange}
            />
          </div>
          {/* Capture Image */}
          <div
            className={`flex flex-col items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={() => !disabled && cameraInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-blue-100 mb-2">
              <FiCamera size={36} className="text-blue-400" />
            </div>
            <span className="text-blue-400 text-lg font-medium">التقط صورة</span>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              disabled={disabled}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="text-center text-blue-300 mt-2 text-sm">يمكنك سحب وإفلات الصور هنا</div>
      </div>
    </>
  );
};

export default UploadImage;
