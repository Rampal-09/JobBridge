import express from "express";
const router = express.Router();
import {
  getJobs,
  getJobById,
  postJob,
  updateJob,
  deleteJob,
  favoriteJob,
  getFavoriteJob,
  applications,
  profile,
  getMyProfile,
  updateProfileImage,
  updateProfileResume,
  addProfileEducation,
  updateProfileEducationById,
  deleteProfileEducation,
  addProfileExperience,
  updateProfileExperienceById,
  deleteProfileExperience,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/jobController.js";
import { auth, role } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

router.get("/", getJobs);
router.get("/favorite", auth, getFavoriteJob);
router.get("/apply", auth, getMyApplications);

router.get("/profile", auth, getMyProfile);
router.post(
  "/profile",
  auth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  profile,
);
router.patch(
  "/profile",
  auth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  profile,
);
router.patch(
  "/profile/profile-image",
  auth,
  upload.single("profileImage"),
  updateProfileImage,
);
router.patch(
  "/profile/resume",
  auth,
  upload.single("resume"),
  updateProfileResume,
);
router.post("/profile/education", auth, addProfileEducation);
router.patch("/profile/education/:id", auth, updateProfileEducationById);
router.delete("/profile/education/:id", auth, deleteProfileEducation);
router.post("/profile/experience", auth, addProfileExperience);
router.patch("/profile/experience/:id", auth, updateProfileExperienceById);
router.delete("/profile/experience/:id", auth, deleteProfileExperience);

router.get("/:id", getJobById);
router.post("/", auth, postJob);
router.put("/:id", auth, updateJob);
router.delete("/:id", auth, deleteJob);

router.post("/:id/favorite", auth, favoriteJob);
router.post("/:id/apply", auth, applications);

// Recruiter actions for applications
router.get("/:id/applications", auth, role("recruiter"), getJobApplications);
router.patch("/applications/:applicationId/status", auth, role("recruiter"), updateApplicationStatus);

export default router;
