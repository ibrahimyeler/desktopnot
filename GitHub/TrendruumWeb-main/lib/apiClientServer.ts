import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

const apiClientServer: AxiosInstance = axios.create({
  baseURL: "https://api.trendruum.com/api",
  timeout: 3000, // SSR için timeout'u 3 saniyeye düşür
});

apiClientServer.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const cookieStore = await cookies(); // ✅ `cookies()` is synchronous
    const token = cookieStore.get("authToken")?.value; // ✅ Get the token correctly
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

apiClientServer.interceptors.response.use(
  (response) => response,
  async (error) => Promise.reject(error)
);

export default apiClientServer;
