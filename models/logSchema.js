import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dataType:{
      type: String,
      required: true, // Corrected to include "type"
      
    },
    dataId: { type: String },
    fileType: { type: String, required: true }, // Store the file type (e.g., CSV, Excel)
    uploadTimestamp: { type: Date, default: Date.now }, // Store the timestamp of upload
    dataStatus: { type: String, default: "pending" }, // Corrected to include "type"
    reason: { type: String },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", logSchema);

export default Log;


