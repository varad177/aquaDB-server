// models/Invitation.js
import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Scientist', required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  sentAt: { type: Date, default: Date.now },
  respondedAt: { type: Date },
});

export default mongoose.model("Invitation", invitationSchema);
