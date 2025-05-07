import axios from "axios";

// Create an axios instance with base URL depending on the environment
export const axiosInstance = axios.create({
  // Set the base URL for API requests
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5000/api/v1"  // Development API URL
    : "/api/v1",  // Production API URL, relative to the current domain
  
  // Enable sending cookies with the request, useful for handling authentication tokens and sessions
  withCredentials: true,
});

// Optionally add request interceptors to handle authentication (if needed)
axiosInstance.interceptors.request.use(
  (config) => {
    // If you store the token in localStorage or cookies, you can add it here
    const token = localStorage.getItem("token");
    if (token) {
      // Add Authorization header with Bearer token (if token exists)
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
