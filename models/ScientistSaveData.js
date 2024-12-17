// models/CommunityData.js
import mongoose from "mongoose";
// Define the community data schema
const scientistSaveData = new mongoose.Schema(
  {
    data: [],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
    filters: { type: Map, of: String },
    name: {
      type: String
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically include createdAt and updatedAt fields
  }
);

export default mongoose.model("scientistSaveData", scientistSaveData);
