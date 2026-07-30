import { api } from "./baseUrl";
import { handleApiError } from "../utils/apiErrorHandler";

export const register = async (data) => {
  console.log("req came to signup api function");
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    console.log("axois signup error", err.response);
    throw handleApiError(err);
  }
};

export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getMe = async () => {
  try {
    const res = await api.get("/auth/getMe");
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const logout = async () => {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};
