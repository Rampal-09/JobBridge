import { handleApiError } from "../utils/apiErrorHandler";
import { api } from "./baseUrl";

export const createJob = async (data) => {
  try {
    console.log("req came from createjob function");
    const res = await api.post("/jobs/", data);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getJobs = async (params = {}) => {
  try {
    const res = await api.get("/jobs", { params });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const updateJob = async (data, id) => {
  console.log("req came to api update function");
  try {
    const res = await api.put(`/jobs/${id}`, data);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const deleteJob = async (id) => {
  try {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const favorite = async (id) => {
  try {
    const res = await api.post(`/jobs/${id}/favorite`);
    console.log(res);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};
export const getFavorite = async () => {
  try {
    const res = await api.get(`/jobs/favorite`);

    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getAppliedJob = async () => {
  try {
    const res = await api.get("/jobs/apply");
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getJobById = async (id) => {
  try {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const apply = async (id) => {
  try {
    console.log("req came to apply function");
    const res = await api.post(`/jobs/${id}/apply`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getMyProfile = async () => {
  try {
    const res = await api.get(`/jobs/profile`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await api.patch(`/jobs/profile`, data);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const addProfileEducation = async (data) => {
  try {
    const res = await api.post(`/jobs/profile/education`, data);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const addProfileExperience = async (data) => {
  try {
    const res = await api.post(`/jobs/profile/experience`, data);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const deleteProfileEducation = async (id) => {
  try {
    const res = await api.delete(`/jobs/profile/education/${id}`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const deleteProfileExperience = async (id) => {
  try {
    const res = await api.delete(`/jobs/profile/experience/${id}`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getJobApplications = async (jobId) => {
  try {
    const res = await api.get(`/jobs/${jobId}/applications`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const res = await api.patch(`/jobs/applications/${applicationId}/status`, {
      status,
    });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};
