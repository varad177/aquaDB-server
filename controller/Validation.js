import Joi from 'joi';

// Fisherman validation schema
const fishermanValidation = Joi.object({
  name: Joi.string().required(),
  fishingLicenseNumber: Joi.string().required(),
  fishingRegion: Joi.string().required(),
  contactNumber: Joi.string().required(),
  fishermanIdPhoto: Joi.string().required(),  // URL or base64 encoded image
  fishingType: Joi.string().valid("commercial", "subsistence", "recreational").required(),
  vesselRegistrationNumber: Joi.string().required(),
  vesselSize: Joi.string().valid("small", "medium", "large").required(),
});

// Industry Collaborator validation schema
const industryCollaboratorValidation = Joi.object({
  organisation_name: Joi.string().required(),
  organisation_type: Joi.string().required(),
  organisation_contact_number: Joi.string().required(),
  registration_number: Joi.string().required(),
  contact_person: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    contact: Joi.string().required(),
  }).required(),
  data_contribution_type: Joi.string().required(),
  geographical_focus_area: Joi.string().required(),
});

// Cruise validation schema
const cruiseValidation = Joi.object({
  cruise_name: Joi.string().required(),
  cruise_id: Joi.string().required(),
  research_institution: Joi.string().required(),
  cruise_area: Joi.string().required(),
  objective_of_cruise: Joi.string().required(),
  contact_number: Joi.string().required(),
  email: Joi.string().email().required(),
});

// Institute validation schema
const instituteValidation = Joi.object({
  institution_name: Joi.string().required(),
  institution_code: Joi.string().required(),
  contact_number: Joi.string().required(),
  email: Joi.string().email().required(),
  website: Joi.string().uri().required(),
  country: Joi.string().required(),
  region: Joi.string().required(),
  research_focus: Joi.string().required(),
});

export {
  fishermanValidation,
  industryCollaboratorValidation,
  cruiseValidation,
  instituteValidation,
};




