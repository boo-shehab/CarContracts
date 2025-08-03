import axios from './axios';

export const createCompany = async (data: any) => {
  return axios.post('/companies', data);
};
export const getCompanies = async (params: any) => {
  return axios.get('/companies', { params });
};

export const updateCompany = async (id: string, data: any) => {
  return axios.put(`/companies/${id}`, data);
};
