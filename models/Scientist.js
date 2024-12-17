import mongoose from "mongoose";

// Schema for Scientist
const scientistSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  contactNumber: { 
    type: String, 
    required: true 
  },
  organization: { 
    type: String, 
    required: true 
  },
  designation: { 
    type: String, 
    required: true 
  },
  scientistId: { 
    type: String, 
    unique: true, 
    required: true 
  },
  idPhoto: { 
    type: String, // You can store the path to the photo or a URL for the image
    required: true 
  },
  areasOfResearch: {
    type: [String], // Array of research areas (e.g., ["Marine Biology", "Fisheries Science"])
    required: true
  },
  geographicalFocus: {
    type: String, // Area of geographical interest for research
    required: true
  },
  dateOfJoining: {
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model("Scientist", scientistSchema);
