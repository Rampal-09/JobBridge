import applicationModel from "../models/applicationModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

import Job from "../models/jobModel.js";
import profileModel from "../models/profileModel.js";
import saveJobModel from "../models/saveJobModel.js";
import { upload } from "../middleware/upload.js";

const uploadBuffer = (buffer, folder, publicId, resourceType) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((skill) => String(skill).trim()).filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};

const parseSkills = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => item?.toString().trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseJsonArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  return [];
};

export const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      type,
      status,
      experienceLevel,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 10, 1);
    const sortOrder = order === "asc" ? 1 : -1;

    const filter = {};

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (location) filter.location = { $regex: location, $options: "i" };
    if (type) filter.jobType = type;
    if (status) filter.status = status;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    const jobs = await Job.find(filter)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ [sortBy]: sortOrder });

    const totalJobs = await Job.countDocuments(filter);

    res.status(200).json({
      jobs,
      totalJobs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalJobs / limitNumber),
    });
  } catch (err) {
    console.log("get job error", err);
    return res.status(500).json({ msg: "internal server error" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        msg: "Job not found",
      });
    }

    return res.status(200).json({
      job,
    });
  } catch (err) {
    console.log("Get job by id error:", err);

    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const postJob = async (req, res) => {
  try {
    const {
      title,
      location,
      salary,
      jobType,
      experienceLevel,
      skills,
      description,
      jobOpening,
    } = req.body;

    if (
      !title?.trim() ||
      !location?.trim() ||
      !salary ||
      !jobType?.trim() ||
      !experienceLevel?.trim() ||
      !skills ||
      !description?.trim() ||
      !jobOpening
    ) {
      return res.status(400).json({ msg: "fill all the field " });
    }

    const newSalary = Number(salary);
    const newjobopening = Number(jobOpening);

    if (isNaN(newSalary)) {
      return res.status(400).json({ msg: "salary must be a number" });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ msg: "atleast one skill require" });
    }

    if (isNaN(newjobopening || newjobopening < 0)) {
      return res
        .status(400)
        .json({ msg: "Job opening must be a positive number" });
    }

    const newJob = await Job.create({
      title,
      location,
      salary: newSalary,
      jobType,
      experienceLevel,
      skills,
      description,
      status: "open",
      jobOpening,
      postedBy: req.user.id,
    });

    return res.status(201).json({ msg: "job created succesfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "internal server error" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const {
      title,
      location,
      salary,
      jobType,
      experienceLevel,
      skills,
      description,

      jobOpening,
    } = req.body;

    if (
      !title?.trim() ||
      !location?.trim() ||
      !salary ||
      !jobType?.trim() ||
      !experienceLevel?.trim() ||
      !skills ||
      !description?.trim() ||
      !jobOpening
    ) {
      console.log("validate check");
      return res.status(400).json({ msg: "fill all the field " });
    }

    const newSalary = Number(salary);
    const newjobopening = Number(jobOpening);

    if (isNaN(newSalary)) {
      return res.status(400).json({ msg: "salary must be a number" });
    }

    if (isNaN(newjobopening) || newjobopening < 0) {
      return res
        .status(400)
        .json({ msg: "Job opening must be a positive number" });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ msg: "atleast one skill require" });
    }

    const updateJob = await Job.findOneAndUpdate(
      { _id: jobId, postedBy: req.user.id },
      req.body,
      { new: true },
    );

    if (!updateJob) {
      return res.status(404).json({
        msg: "Job not found or unauthorized",
      });
    }

    return res
      .status(200)
      .json({ msg: "job update successfully", job: updateJob });
  } catch (err) {
    console.log("job update error", err);
    return res.status(500).json({ msg: "internal server error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const deleteJob = await Job.findOneAndDelete({
      _id: jobId,
      postedBy: req.user.id,
    });

    if (!deleteJob) {
      return res.status(404).json({
        msg: "Job not found or unauthorized",
      });
    }
    return res.status(200).json({ msg: "job delete scussfully" });
  } catch (err) {
    console.log("delete job error", err);
    return res.status(500).json({ msg: "internal server error" });
  }
};

export const favoriteJob = async (req, res) => {
  console.log("req came to fav");
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const exist = await saveJobModel.findOne({
      candidateId: userId,
      favorite: jobId,
    });
    if (exist) {
      await saveJobModel.deleteOne({ _id: exist._id });
      return res.status(200).json({ msg: "favorite removed", removed: true });
    }

    const saved = await saveJobModel.create({
      candidateId: userId,
      favorite: jobId,
    });

    return res.status(200).json({ data: saved });
  } catch (err) {
    console.log("favorite job error", err);
    return res.status(500).json({ msg: "internal server error" });
  }
};

export const profile = async (req, res) => {
  if (req.method === "PATCH") {
    return updateProfile(req, res);
  }

  return createProfile(req, res);
};

export const getMyProfile = async (req, res) => {
  try {
    const profile = await profileModel.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    return res.status(200).json({ data: profile });
  } catch (err) {
    console.log("get my profile error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const createProfile = async (req, res) => {
  try {
    const existingProfile = await profileModel.findOne({ userId: req.user.id });

    if (existingProfile) {
      return res.status(400).json({ msg: "Profile already exists" });
    }

    const profileData = {
      userId: req.user.id,
    };

    if (req.body.phone?.trim()) {
      profileData.phone = req.body.phone.trim();
    }

    if (req.body.location?.trim()) {
      profileData.location = req.body.location.trim();
    }

    if (req.body.bio?.trim()) {
      profileData.bio = req.body.bio.trim();
    }

    const skills = parseSkills(req.body.skills);
    if (skills.length > 0) {
      profileData.skills = skills;
    }

    const education = parseJsonArray(req.body.education);
    if (education.length > 0) {
      profileData.education = education;
    }

    const experience = parseJsonArray(req.body.experience);
    if (experience.length > 0) {
      profileData.experience = experience;
    }

    if (req.files?.profileImage?.[0]) {
      const imageResult = await uploadBuffer(
        req.files.profileImage[0].buffer,
        "profiles",
        `profile_${Date.now()}`,
        "image",
      );
      profileData.profileImage = imageResult.secure_url;
    }

    if (req.files?.resume?.[0]) {
      const resumeResult = await uploadBuffer(
        req.files.resume[0].buffer,
        "resumes",
        `resume_${Date.now()}`,
        "image",
      );
      profileData.resume = resumeResult.secure_url;
    }

    const newProfile = await profileModel.create(profileData);
    return res.status(201).json({ data: newProfile });
  } catch (err) {
    console.log("create profile error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profileData = {};

    if (req.body.phone?.trim()) {
      profileData.phone = req.body.phone.trim();
    }

    if (req.body.location?.trim()) {
      profileData.location = req.body.location.trim();
    }

    if (req.body.bio?.trim()) {
      profileData.bio = req.body.bio.trim();
    }

    const skills = parseSkills(req.body.skills);
    if (skills.length > 0) {
      profileData.skills = skills;
    }

    const education = parseJsonArray(req.body.education);
    if (education.length > 0) {
      profileData.education = education;
    }

    const experience = parseJsonArray(req.body.experience);
    if (experience.length > 0) {
      profileData.experience = experience;
    }

    if (req.files?.profileImage?.[0]) {
      const imageResult = await uploadBuffer(
        req.files.profileImage[0].buffer,
        "profiles",
        `profile_${Date.now()}`,
        "image",
      );
      profileData.profileImage = imageResult.secure_url;
    }

    if (req.files?.resume?.[0]) {
      const resumeResult = await uploadBuffer(
        req.files.resume[0].buffer,
        "resumes",
        `resume_${Date.now()}`,
        "image",
      );
      profileData.resume = resumeResult.secure_url;
    }

    if (Object.keys(profileData).length === 0) {
      return res
        .status(400)
        .json({ msg: "Provide at least one field to update" });
    }

    const updatedProfile = await profileModel.findOneAndUpdate(
      { userId: req.user.id },
      { $set: profileData },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ data: updatedProfile });
  } catch (err) {
    console.log("update profile error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ msg: "Please select a file" });
    }

    const imageResult = await uploadBuffer(
      req.file.buffer,
      "profiles",
      `profile_${Date.now()}`,
      "image",
    );

    const updatedProfile = await profileModel.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { profileImage: imageResult.secure_url } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ data: updatedProfile });
  } catch (err) {
    console.log("update profile image error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateProfileResume = async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ msg: "Please select a file" });
    }

    const resumeResult = await uploadBuffer(
      req.file.buffer,
      "resumes",
      `resume_${Date.now()}`,
      "image",
    );

    const updatedProfile = await profileModel.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { resume: resumeResult.secure_url } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ data: updatedProfile });
  } catch (err) {
    console.log("update resume error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const addProfileEducation = async (req, res) => {
  console.log("req came");
  try {
    const educationItem = req.body.education || req.body;
    console.log("educationItem", educationItem);

    if (!educationItem || typeof educationItem !== "object") {
      return res.status(400).json({ msg: "Education data is required" });
    }

    const profile = await profileModel.findOne({ userId: req.user.id });

    if (!profile) {
      const created = await profileModel.create({
        userId: req.user.id,
        education: [...educationItem],
      });
      return res.status(201).json({ data: created });
    }

    profile.education.push(...educationItem);
    await profile.save();
    console.log("profile", profile);

    return res.status(201).json({ data: profile });
  } catch (err) {
    console.log("add education error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateProfileEducation = async (req, res) => {
  try {
    const education = parseJsonArray(req.body.education);

    if (!Array.isArray(education)) {
      return res.status(400).json({ msg: "Education must be an array" });
    }

    const updatedProfile = await profileModel.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { education } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ data: updatedProfile });
  } catch (err) {
    console.log("update education error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateProfileEducationById = async (req, res) => {
  try {
    const profile = await profileModel.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    const educationItem = profile.education.id(req.params.id);

    if (!educationItem) {
      return res.status(404).json({ msg: "Education item not found" });
    }

    Object.assign(educationItem, req.body);
    await profile.save();

    return res.status(200).json({ data: profile });
  } catch (err) {
    console.log("update education item error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const deleteProfileEducation = async (req, res) => {
  try {
    const profile = await profileModel.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    profile.education = profile.education.filter(
      (item) => item._id.toString() !== req.params.id,
    );
    await profile.save();

    return res.status(200).json({ data: profile });
  } catch (err) {
    console.log("delete education error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const addProfileExperience = async (req, res) => {
  try {
    const experienceItem = req.body.experience || req.body;

    if (!experienceItem || typeof experienceItem !== "object") {
      return res.status(400).json({ msg: "Experience data is required" });
    }

    const profile = await profileModel.findOne({ userId: req.user.id });

    if (!profile) {
      const created = await profileModel.create({
        userId: req.user.id,
        experience: [...experienceItem],
      });
      return res.status(201).json({ data: created });
    }

    profile.experience.push(...experienceItem);
    await profile.save();

    return res.status(201).json({ data: profile });
  } catch (err) {
    console.log("add experience error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateProfileExperience = async (req, res) => {
  try {
    const experience = parseJsonArray(req.body.experience);

    if (!Array.isArray(experience)) {
      return res.status(400).json({ msg: "Experience must be an array" });
    }

    const updatedProfile = await profileModel.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { experience } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ data: updatedProfile });
  } catch (err) {
    console.log("update experience error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateProfileExperienceById = async (req, res) => {
  try {
    const profile = await profileModel.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    const experienceItem = profile.experience.id(req.params.id);

    if (!experienceItem) {
      return res.status(404).json({ msg: "Experience item not found" });
    }

    Object.assign(experienceItem, req.body);
    await profile.save();

    return res.status(200).json({ data: profile });
  } catch (err) {
    console.log("update experience item error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const deleteProfileExperience = async (req, res) => {
  try {
    const profile = await profileModel.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    profile.experience = profile.experience.filter(
      (item) => item._id.toString() !== req.params.id,
    );
    await profile.save();

    return res.status(200).json({ data: profile });
  } catch (err) {
    console.log("delete experience error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const applications = async (req, res) => {
  console.log("req came to applications", req?.user?.id);
  try {
    const apply = await applicationModel.findOne({
      candidateId: req.user.id,
      jobId: req.params.id,
    });

    if (apply) {
      return res.status(400).json({ msg: "you already applied for this job" });
    }

    const profile = await profileModel.findOne({ userId: req.user.id });
    console.log(profile);
    if (!profile) {
      return res.status(404).json({ msg: "profile not found" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        msg: "Job not found",
      });
    }

    const application = await applicationModel.create({
      candidateId: req.user.id,
      jobId: req.params.id,
      status: "applied",
      resumeUrl: profile.resume,
      // coverLetter: req.body.coverLetter,
    });
    return res
      .status(201)
      .json({ msg: "apply successfully", data: application });
  } catch (err) {
    console.log("profile controller error", err);
    return res.status(500).json({ msg: " internal server error" });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await applicationModel
      .find({ candidateId: req.user.id })
      .populate("jobId");

    return res.status(200).json({
      msg: "Applications fetched successfully",
      data: applications,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};
export const getFavoriteJob = async (req, res) => {
  try {
    const getfavoriateJob = await saveJobModel
      .find({
        candidateId: req.user.id,
      })
      .populate("favorite");
    return res
      .status(200)
      .json({ msg: "fetch job successfully", data: getfavoriateJob });
  } catch (err) {
    console.log("favoraite controller error", err);
    return res.status(500).json({ msg: " internal server error" });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "unauthorized access to applications" });
    }

    const applications = await applicationModel
      .find({ jobId })
      .populate("candidateId", "name email");

    return res.status(200).json({
      msg: "Applications fetched successfully",
      data: applications,
    });
  } catch (err) {
    console.log("getJobApplications error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ["applied", "shortlisted", "interview", "rejected", "hired"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const application = await applicationModel.findById(applicationId);
    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }

    const job = await Job.findById(application.jobId);
    if (!job) {
      return res.status(404).json({ msg: "Associated job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "unauthorized status update" });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      msg: "Status updated successfully",
      data: application,
    });
  } catch (err) {
    console.log("updateApplicationStatus error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

