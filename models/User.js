// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user", "scientist"],
  },
  isVerifed: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    unique: true,
  },
  userType: {
    type: String,
    enum: [
      "fisherman",
      "industry-collaborators",
      "research_cruises",
      "research_institute",
      "scientist",
    ],
    required: function () {
      return this.role === "user";
    },
  },
  passwordChanged: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }], // New field for storing communities
});

export default mongoose.model("User", userSchema);
