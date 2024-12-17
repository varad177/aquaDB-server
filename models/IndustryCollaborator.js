import mongoose from 'mongoose';

const industryCollaboratorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organisation_name: { type: String, required: true },
    organisation_type: { type: String, required: true },
    organisation_contact_number: { type: String, required: true },
    registration_number: { type: String, required: true },
    contact_person: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true },
    },
    data_contribution_type: { type: String, required: true },
    geographical_focus_area: { type: String, required: true },
});

export default mongoose.model("IndustryCollaborator", industryCollaboratorSchema);
