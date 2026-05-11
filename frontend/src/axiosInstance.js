import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jesin.pythonanywhere.com/",
});

// Automatically attach JWT token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
