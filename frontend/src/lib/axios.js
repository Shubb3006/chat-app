import axios from "axios";
export const axiosInstance = axios.create({
  baseURL:
    a
      ? "http://localhost:3000/api"
      : "/api",
  withCredentials: true,
});
