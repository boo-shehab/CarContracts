import axios from './axios';

export const createUserToCompany = async (data: any) => {
  return axios.post('/companies/addUserToCompany', data);
};

export const createNewAccount = async (data: object, images: any) => {
    console.log("Creating new account with data:", data);
    
    const formData = new FormData();

    // Append account info fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append person files
    if (images.nationalIdFrontFile) formData.append("nationalIdFrontFile", images.nationalIdFrontFile);
    if (images.nationalIdBackFile) formData.append("nationalIdBackFile", images.nationalIdBackFile);
    if (images.residenceCardFrontFile) formData.append("residenceCardFrontFile", images.residenceCardFrontFile);
    if (images.residenceCardBackFile) formData.append("residenceCardBackFile", images.residenceCardBackFile);

    images.othreFiles.forEach((file) => {
      formData.append("othreFiles", file);
    });

    return axios.post("/person", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
}

export const createNewCar = async (data: any, images?: any[]) => {
  
      const carFormData = new FormData();
      for (const key in data) {
        carFormData.append(key, data[key]);
      }

      const response = await axios.post('/car', carFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const carId = response.data.data.id;

      if (images && images.length > 0) {
        const imagesFormData = new FormData();
        images.forEach((image) => imagesFormData.append('files', image));
        await axios.post(`/car/${carId}/attachments`, imagesFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      return response.data;
    }