// src/utilities/handleCarImageUpdates.ts
import { uploadCarAttachments, deleteCarAttachment } from '../services/CarService';

export interface Attachment {
  id: string | number;
  fileKey: string;
  mimeType: string;
}

export async function handleCarImageUpdates(
  carId: string,
  images: (File | Attachment)[],        // current images (new files or existing attachments)
  originalAttachments: Attachment[] = [] // original attachments from backend
) {
  // Existing attachments in current images
  const keptExisting = images.filter((i): i is Attachment => (i as Attachment).id !== undefined);

  // New files to upload
  const newFiles = images.filter((i) => i instanceof File) as File[];

  // Determine which original attachments were removed
  const toDelete = originalAttachments.filter(
    (orig) => !keptExisting.some((img) => img.id === orig.id)
  );

  // Delete removed attachments
  const deletePromises = toDelete.map((att: Attachment) =>
    deleteCarAttachment(carId, att.id).catch((err) => {
      console.warn('deleteCarAttachment failed for', att.id, err);
    })
  );
  
  console.log(newFiles);
  

  // Upload new files if any
  const uploadPromise = newFiles.length > 0
    ? uploadCarAttachments(carId, newFiles)
    : Promise.resolve();

  await Promise.all([...deletePromises, uploadPromise]);
}
