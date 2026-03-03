import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your backend API URL
  withCredentials: true, // Include cookies in requests  //cookies automatically sent to the server with each request
  
});

export default axiosInstance;