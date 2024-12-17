
import Fisherman from "../models/Fisherman.js";
import IndustryCollaborator from "../models/IndustryCollaborator.js";
import ResearchCruise from "../models/ResearchCruise.js";
import ResearchInstitute from "../models/ResearchInstitute.js";
import {
  fishermanValidation,
  industryCollaboratorValidation,
  cruiseValidation,
  instituteValidation,
} from "./Validation.js";

// Function to update the user data based on user type
const updateUser = async (req, res) => {
  try {
    const { userType, userId } = req.params;
    const updateData = req.body;
    console.log("USER ID", userId);
    console.log("USER TYPE", userType);

    // Define the appropriate validation schema based on the userType
    let validationSchema;
    switch (userType) {
      case "fisherman":
        validationSchema = fishermanValidation;
        break;
      case "industryCollaborator":
        validationSchema = industryCollaboratorValidation;
        break;
      case "researchCruise":
        validationSchema = cruiseValidation;
        break;
      case "researchInstitute":
        validationSchema = instituteValidation;
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    // Validate the incoming data
    const { error,success } = validationSchema.validate(updateData);
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.details });
    }


    console.log("success",success);
    // Define the appropriate model based on the userType
    let models;
    switch (userType) {
      case "fisherman":
        models = Fisherman;
        break;
      case "industryCollaborator":
        models = IndustryCollaborator;
        break;
      case "researchCruise":
        models = ResearchCruise;
        break;
      case "researchInstitute":
        models = ResearchInstitute;
        break;
    }

    // Update the user data, excluding the referenced fields (userId)
    const updatedUser = await models.findByIdAndUpdate(
      { _id: userId },
      updateData,
      {
        new: true,
      }
    );
    console.log("Update USer", updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { updateUser };
