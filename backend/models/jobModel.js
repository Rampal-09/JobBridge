import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 2 },
    location: { type: String, required: true },
    salary: { type: Number, required: true },
    jobType: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "Internship", "remote", "contract"],
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ["entry", "mid", "senior", "lead"],
    },
    skills: { type: [String], required: true },
    description: { type: String, required: true, minlength: 20 },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    jobOpening: { type: Number, min: 1 },
  },

  { timestamps: true },
);

export default mongoose.model("Jobs", jobSchema);
