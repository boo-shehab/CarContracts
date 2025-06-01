import { CompanyFormData } from '../components/Company/types';
import axios from './axios';

export const createCompany = async (data: CompanyFormData) => {
  return axios.post('/companies', data);
};
export const getCompanies = async (params: any) => {
  return axios.get('/companies', { params });
};
