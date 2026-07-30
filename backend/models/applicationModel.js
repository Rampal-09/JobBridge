import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "rejected", "hired"],
      default: "applied",
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    // coverLetter: {
    //   type: String,
    //   trim: true,
    //   maxlength: 2000,
    // },
  },
  { timestamps: true },
);

export default mongoose.model("Applications", applicationSchema);
