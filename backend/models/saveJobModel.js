import mongoose from "mongoose";

const savedJobSchema = mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Jobs",
    },
  },

  { timestamps: true },
);

export default mongoose.model("SavedJobs", savedJobSchema);
