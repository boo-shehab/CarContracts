// src/services/CarService.ts
import axios from './axios'; // use your axios instance import path

export const getCarById = (id: string) => axios.get(`/car/${id}`);

export const updateCar = (id: string, data: any) => axios.put(`/car/${id}`, data);

/** Upload new attachments (files) for a car */
export const uploadCarAttachments = (carId: string, files: File[]) => {
  console.log('Uploading files for carId:', carId, files);

  return axios.post(`/car/${carId}/attachments`, files, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};


export const deleteCarAttachment = async (carId: string, attachmentKeyOrId: string | number) => {
  try {
    return await axios.delete(`/car/${carId}/attachments/${attachmentKeyOrId}`);
  } catch (err) {
    console.error('deleteCarAttachment failed for', attachmentKeyOrId, err);
  }
};
