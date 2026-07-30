import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Users",
    },
    phone: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    location: { type: String, trim: true, default: "" },
    profileImage: { type: String, default: "" },
    skills: { type: [String], default: [] },
    education: {
      type: [
        {
          degree: String,
          college: String,
          year: Number,
          percentage: Number,
        },
      ],
      default: [],
    },
    experience: {
      type: [
        {
          company: String,
          role: String,
          startDate: Date,
          endDate: Date,
          current: Boolean,
          description: String,
        },
      ],
      default: [],
    },
    resume: { type: String, default: "" },
    bio: { type: String, maxlength: 200, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Profile", profileSchema);
