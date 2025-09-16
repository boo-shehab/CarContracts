import React, { useEffect, useRef, useState } from 'react';
import { compressImage } from '../../utilities/compressImage';

export type CardSide = 'front' | 'back';

interface CardImagesPickerProps {
  title: string;
  formData: {
    frontImage?: string;
    backImage?: string;
  };
  setFormData: (data: { [key: string]: File | undefined | string }) => void;
  frontKey: string;
  backKey: string;
  disabled?: boolean;
}

const CardImagesPicker: React.FC<CardImagesPickerProps> = ({
  title,
  formData,
  setFormData,
  frontKey,
  backKey,
  disabled = false
}) => {
  const [images, setImages] = useState<Record<CardSide, { preview?: string; file?: File }>>({
    front: {},
    back: {},
  });

  const fileInputs = {
    front: useRef<HTMLInputElement>(null),
    back: useRef<HTMLInputElement>(null),
  } as const;

  useEffect(() => {
    if (formData.frontImage) {
      setImages((prev) => ({
        ...prev,
        front: { preview: formData.frontImage },
      }));
    }
    if (formData.backImage) {
      setImages((prev) => ({
        ...prev,
        back: { preview: formData.backImage },
      }));
    }
  }, [formData.frontImage, formData.backImage]);

  const handleSelectFile = (side: CardSide) => {
    if (disabled) return;
    fileInputs[side].current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (disabled) return;
    const side = e.target.dataset.side as CardSide;
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedFile = await compressImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImages((prev) => ({
        ...prev,
        [side]: {
          preview: reader.result as string,
          file: compressedFile,
        },
      }));

      setFormData({
        [side === 'front' ? frontKey : backKey]: compressedFile,
      });
    };
    reader.readAsDataURL(compressedFile);
  };

  return (
    <div dir="rtl" className="w-full max-w-3xl space-y-4">
      <div className="relative block">
        <div className="w-full appearance-none rounded-lg border border-neutral-400 bg-white py-2 pr-4 pl-10 text-right text-xl">
          {title}
        </div>
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.957a.75.75 0 111.08 1.04l-4.24 4.528a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      <div className="rounded-2xl border border-primary-400 p-4">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <CaptureBox
            side="back"
            label="الجانب الخلفي"
            image={images.back.preview}
            onClick={handleSelectFile}
            inputRef={fileInputs.back}
            disabled={disabled}
            onFileChange={handleFileChange}
          />
          <CaptureBox
            side="front"
            label="الجانب الامامي"
            image={images.front.preview}
            onClick={handleSelectFile}
            inputRef={fileInputs.front}
            disabled={disabled}
            onFileChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CardImagesPicker;

interface CaptureBoxProps {
  side: CardSide;
  label: string;
  image?: string;
  inputRef: React.RefObject<HTMLInputElement> | any;
  onClick: (side: CardSide) => void;
  onFileChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

const CaptureBox: React.FC<CaptureBoxProps> = ({
  side,
  label,
  image,
  inputRef,
  onClick,
  onFileChange,
  disabled
}) => {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <div>
        <p className="text-lg font-medium text-neutral-400 mb-4">{label}</p>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onClick(side)}
          className={`relative flex py-3.5 px-6 h-40 w-60 items-center justify-center rounded-md border-2 border-dashed 
            ${disabled ? 'border-gray-300 bg-gray-100 cursor-not-allowed' : 'border-primary-300'}
            focus:outline-none`}        >
          {image ? (
            <img src={image} alt={label} className="h-full w-full rounded-2xl object-cover" />
          ) : (
            <div className="h-full w-full rounded-2xl bg-gray-300" />
          )}
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onClick(side)}
          className={`mt-2 w-full rounded-md border px-4 py-2 
          ${disabled
            ? 'text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed'
            : 'text-primary-500 border-primary-600 bg-white hover:bg-primary-600 hover:text-white'}`}
        >
          امسح الصورة هنا
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        data-side={side}
        disabled={disabled}
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
};
