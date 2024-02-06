import axios from 'axios';

export const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40959971-e108149cae1c96c7625c265ce';

export const getAPI = async (query, page) => {
  const url = `${BASE_URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

  const response = await axios.get(url);

  return response.data;
};
