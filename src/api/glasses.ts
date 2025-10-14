// api/users.js
import axios from './axios';

export const getAllGlasses = async () => {
    const response = await axios.get('/glasses');
    return response.data
}

export const getGlasses = async (id: number) => {
      const response = await axios.get(`/glasses/${id}`);
  return response.data;
}