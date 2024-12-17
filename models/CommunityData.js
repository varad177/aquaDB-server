// models/CommunityData.js
import mongoose from "mongoose";
// Define the community data schema
const communityDataSchema = new mongoose.Schema(
  {
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    data: [],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    comments: [
      {
        commenter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Automatically include createdAt and updatedAt fields
  }
);

export default mongoose.model("CommunityData", communityDataSchema);
