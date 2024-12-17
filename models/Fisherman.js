import mongoose from 'mongoose';

const fishermanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    fishingLicenseNumber: { type: String, required: true },
    fishingRegion: { type: String, required: true },
    contactNumber: { type: String, required: true },
    fishermanIdPhoto: { type: String, required: true }, // Assuming it's a URL or base64 encoded image
    fishingType: { 
        type: String, 
        enum: ["commercial", "subsistence", "recreational"], 
        required: true 
    },
    vesselRegistrationNumber: { type: String, required: true },
    vesselSize: { type: String, required: true }, // E.g. small, medium, large
});

export default mongoose.model("Fisherman", fishermanSchema);
