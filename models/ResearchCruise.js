import mongoose from 'mongoose';

const researchCruiseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cruise_name: { type: String, required: true },
    cruise_id: { type: String, required: true },
    research_institution: { type: String, required: true },
    cruise_area: { type: String, required: true },
    objective_of_cruise: { type: String, required: true },
    contact_number: { type: String, required: true },
    email: { type: String, required: true },
});

export default mongoose.model("ResearchCruise", researchCruiseSchema);
