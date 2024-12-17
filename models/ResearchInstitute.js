import mongoose from 'mongoose';

const researchInstituteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    institution_name: { type: String, required: true },
    institution_code: { type: String, required: true },
    contact_number: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String, required: true },
    research_focus: { type: String, required: true },
});

export default mongoose.model("ResearchInstitute", researchInstituteSchema);
