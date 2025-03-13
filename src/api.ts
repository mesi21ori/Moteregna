import axios from 'axios';
import useSWR from 'swr';
import { Support } from './types';
import { PrivacyPolicy } from './types';


const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const useSupports = () => {
  return useSWR<Support[]>('http://134.209.218.229/api/support', fetcher);
};

export const createSupport = async (title: string, description: string, email: string, phone: string) => {
  return axios.post('http://134.209.218.229/api/support', { title, description, email, phone });
};

export const deleteSupport = async (id: number) => {
  return axios.delete(`http://134.209.218.229/api/support/${id}`);
};

export const usePrivacy = () => {
  return useSWR<PrivacyPolicy[]>('http://134.209.218.229/api/privacy-policy', fetcher);
};