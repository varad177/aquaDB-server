// models/Community.js
import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  purpose: { type: String, required: true },
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Members of the community
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Community", communitySchema);
