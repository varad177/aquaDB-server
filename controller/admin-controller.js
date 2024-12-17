// adminRoutes.js

import User from "../models/User.js";
import Fisherman from "../models/Fisherman.js";
import IndustryCollaborator from "../models/IndustryCollaborator.js";
import ResearchCruise from "../models/ResearchCruise.js";
import ResearchInstitute from "../models/ResearchInstitute.js";
// import Log from "../models/logSchema.js";
import ValidatedCatch from "../models/ValidatedCatchData.js";
import { generateCredentials } from "../helper/helper.js";
import mongoose from "mongoose"; // Ensure you have mongoose imported

import bcrypt from "bcrypt";
import sendmail from "../Config/services.js";
import Catch from "../models/FishCatchData.js";
import Log from "../models/logSchema.js";
import Scientist from "../models/Scientist.js";

import CatchData from "../models/FishcatchDataNew.js";
// Get unverified users by userType
export const getUnverifiedUser = async (req, res) => {
  const { userType } = req.body; // Get userType from query parameters

  if (!userType) {
    return res.status(400).json({ message: "User type is required" });
  }

  try {
    // Fetch unverified users by userType 
    const users = await User.find({ userType, isVerifed: false });

    if (!users.length) {
      return res
        .status(404)
        .json({ message: `No unverified users found for ${userType}` });
    }

    // Fetch detailed user data based on userType
    let userDetails;
    switch (userType) {
      case "fisherman":
        userDetails = await Fisherman.find({
          userId: { $in: users.map((u) => u._id) },
        });
        break;
      case "industry-collaborators":
        userDetails = await IndustryCollaborator.find({
          userId: { $in: users.map((u) => u._id) },
        });
        break;
      case "research_cruises":
        userDetails = await ResearchCruise.find({
          userId: { $in: users.map((u) => u._id) },
        });
        break;
      case "research_institute":
        userDetails = await ResearchInstitute.find({
          userId: { $in: users.map((u) => u._id) },
        });
        break;
      case "scientist":
        userDetails = await ResearchInstitute.find({
          userId: { $in: users.map((u) => u._id) },
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid userType" });
    }

    // Combine user basic data and additional details
    const combinedData = users.map((user) => ({
      ...user.toObject(),
      additionalDetails: userDetails.find(
        (detail) => detail.userId.toString() === user._id.toString()
      ),
    }));

    res.status(200).json({ users: combinedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// adminRoutes.js

// API to verify a user by userId
export const verifyUser = async (req, res) => {
  const { id } = req.body; // Expect userId in the request body

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Generate random credentials
    const { username, password } = generateCredentials();

    // Update the user with the generated credentials and verify them
    const user = await User.findByIdAndUpdate(
      id,
      { isVerifed: true, username, password: password },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await sendmail(user.email, user.username, user.password);

    res
      .status(200)
      .json({ message: "User verified successfully and email sent", user });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Ensure you are getting the correct userId and converting it to ObjectId if needed

export const getDetailsData = async (req, res) => {
  const { userId, userType } = req.body; // Get userId and userType from the request body

  try {
    // Validate if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify userType matches the user's type
    if (user.userType !== userType) {
      return res.status(403).json({ error: "User type mismatch" });
    }

    // Now that we have a valid user, find the associated data
    let detaildata = {};
    console.log(`Fetching data for User ID: ${userId}, User Type: ${userType}`);

    console.log(user);

    if (userType == "research_cruises") {
      detaildata = await ResearchCruise.find({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } else if (userType === "industry-collaborators") {
      detaildata = await IndustryCollaborator.find({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } else if (userType === "research_institute") {
      detaildata = await ResearchInstitute.find({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } else if (userType === "scientist") {
      detaildata = await Scientist.find({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }

    console.log(detaildata); // Log the result

    // Send the fetched data back as response
    return res.status(200).json({ detail: detaildata });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
};

// export const getCatchDataGroupedByUser = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required." });
//     }

//     // Validate if userId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid User ID format." });
//     }

//     // Use ObjectId to query the database
//     const objectId = new mongoose.Types.ObjectId(userId);

//     // Aggregate query to filter by userId and group the data by userId
//     const catchData = await Catch.aggregate([
//       { $match: { userId: objectId } }, // Match the userId passed in the request
//       {
//         $group: {
//           _id: "$userId", // Group by userId
//           catches: { $push: "$$ROOT" }, // Push all catch data for the user
//         },
//       },
//     ]);

//     // Check if any data was found
//     if (catchData.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No catch data found for this user" });
//     }

//     // Return the grouped data
//     return res.status(200).json({
//       message: "Catch data fetched successfully",
//       data: catchData,
//     });
//   } catch (error) {
//     console.error("Error fetching catch data: ", error);
//     return res
//       .status(500)
//       .json({ message: "Error fetching catch data", error: error.message });
//   }
// };

const format = (data) => {
  return data.map(group => {
      return {
          ...group,
          catches: group.catches.map(catchEntry => {
              return {
                  ...catchEntry,
                  latitude: parseFloat(catchEntry.latitude),
                  longitude: parseFloat(catchEntry.longitude)
              };
          })
      };
  });
}

// Example usage:
// const processedCatches = format(catches);
// console.log(processedCatches);
export const getCatchDataGroupedByUser = async (req, res) => {
  try {
    const { userId,dataId } = req.body;
console.log(userId);
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }

    // Use ObjectId to query the database
    const objectId = new mongoose.Types.ObjectId(userId);

    // Aggregate query to filter by userId and group the data by userId
    const catchData = await Catch.aggregate([
      { $match: { userId: objectId, dataId } }, // Match the userId passed in the request
      {
        $group: {
          _id: "$userId", // Group by userId
          catches: { $push: "$$ROOT" }, // Push all catch data for the user
        },
      },
    ]);

    let data = format(catchData)
    

    // Check if any data was found
    if (catchData.length === 0) {
      return res
        .status(404)
        .json({ message: "No catch data found for this user" });
    }

    // Return the grouped data
    return res.status(200).json({
      message: "Catch data fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching catch data: ", error);
    return res
      .status(500)
      .json({ message: "Error fetching catch data", error: error.message });
  }
};

export const getdataUploaduser = async (req, res) => {
  try {
    // Fetch unique userIds from Catch collection
    const uniqueUserIds = await Catch.distinct("userId").exec();
    // const uniqueUserIds = await Catch.find().exec();
    console.log("USER ID", uniqueUserIds);

    if (uniqueUserIds.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found in the Catch collection." });
    }

    // Fetch user details based on unique userIds
    const users = await User.find({ _id: { $in: uniqueUserIds } })
      .select("userType email username")
      .exec();

    // If no users found
    if (users.length === 0) {
      return res.status(404).json({ message: "No matching users found." });
    }

    // Return the list of users with their information
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// correct code
export const updateCatchData = async (req, res) => {
  const { modifiedData } = req.body; // Extract modified data from the request body
  const { id: userId } = req.params; // Extract userId from the route parameters

  console.log("Received request to update catch data.");
  console.log("USER ID:", userId);
  console.log(
    "Modified Data in backend:",
    JSON.stringify(modifiedData, null, 2)
  );

  try {
    // Validate inputs
    if (!userId || !modifiedData || !Array.isArray(modifiedData)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid input. userId and an array of modifiedData are required.",
      });
    }

    // Find all catch documents for the given userId
    const catchDocuments = await Catch.find({ userId });
    if (catchDocuments.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `No catch data found for user ID: ${userId}`,
      });
    }

    // Process updates for each document in modifiedData
    const updatedDocuments = [];
    for (const modifiedObj of modifiedData) {
      const documentId = modifiedObj.id || modifiedObj._id; // Handle both `id` and `_id`
      const { species, ...fieldsToUpdate } = modifiedObj;
      console.log("DOCUMENT ID", documentId);
      if (!documentId) {
        console.warn("Skipped modifiedData object without an ID:", modifiedObj);
        continue; // Skip if document ID is missing
      }

      // Find the catch document by ID
      const catchDocument = catchDocuments.find(
        (doc) => doc._id.toString() === documentId.toString()
      );
      console.log("catchDocument", catchDocument);
      if (!catchDocument) {
        console.warn(
          `Catch document with ID ${documentId} not found for user ${userId}.`
        );
        continue; // Skip if the document doesn't exist in the user's data
      }

      // Update species if provided
      // let updatedSpecies = catchDocument.species;
      // console.log("updatedSpecies above", updatedSpecies);
      // if (species && Array.isArray(species)) {
      //   console.log("SPECIES", species);
      //   updatedSpecies = updatedSpecies.map((existingSpec) => {
      //     const modifiedSpec = species.find(
      //       (modSpec) => modSpec.id === existingSpec._id.toString()
      //     );
      //     console.log("modifiedSpec", modifiedSpec);
      //     return modifiedSpec
      //       ? { ...existingSpec.toObject(), ...modifiedSpec }
      //       : existingSpec;

      //   });

      // }

      // console.log("updatedSpecies below", updatedSpecies);

      // // Prepare the updated fields
      // const updatedFields = {
      //   ...fieldsToUpdate,
      //   species: updatedSpecies,
      // };

      // // Update the document in the database
      // const updatedCatch = await Catch.findOneAndUpdate(
      //   { _id: documentId },
      //   { $set: updatedFields },
      //   { new: true }
      // );

      let updatedSpecies = catchDocument.species; // Initial species array from the document
      console.log(
        "Initial Updated Species (from catchDocument):",
        updatedSpecies
      );

      if (species && Array.isArray(species)) {
        console.log("Input Species Array (from modifiedData):", species);

        updatedSpecies = updatedSpecies.map((existingSpec) => {
          // Match species based on `_id` field
          const modifiedSpec = species.find(
            (modSpec) => modSpec._id === existingSpec._id.toString()
          );

          console.log("Existing Spec:", existingSpec);
          console.log("Matching Modified Spec:", modifiedSpec);

          return modifiedSpec
            ? { ...existingSpec.toObject(), ...modifiedSpec }
            : existingSpec; // Update or retain the existing spec
        });

        console.log("Final Updated Species Array:", updatedSpecies);
      }

      // Update the database document with the new species array
      const updatedCatch = await Catch.findOneAndUpdate(
        { _id: catchDocument._id }, // Match by document ID
        { $set: { species: updatedSpecies, ...fieldsToUpdate } }, // Include species and other fields
        { new: true } // Return the updated document
      );

      console.log("Updated Catch Document:", updatedCatch);

      if (updatedCatch) {
        console.log(`Successfully updated document ID: ${documentId}`);
        updatedDocuments.push(updatedCatch);
      } else {
        console.error(`Failed to update document ID: ${documentId}`);
      }
    }

    // Send the response with all updated documents
    return res.status(200).json({
      status: "success",
      message: "Catch data updated successfully.",
      data: updatedDocuments,
    });
  } catch (error) {
    console.error("Error during catch data update:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error. Please try again later.",
    });
  }
};

// POST endpoint to validate and save catch data
// export const validateCatchData = async (req, res) => {
//   try {
//     // Extracting the validated data (which is in an array of arrays)
//     const { validatedData } = req.body;

//     // Flatten the validated data if it's an array of arrays
//     const flattenedData = validatedData.flat(); // This flattens the array by one level

//     // console.log("Flattened validated data:", flattenedData);

//     // Validate the input: check if it's an array and not empty
//     if (!Array.isArray(flattenedData) || flattenedData.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No validated catches provided." });
//     }

//     // Map through each validated catch object in the array
//     const processedValidatedCatches = flattenedData.map((catchData) => {
//       const {
//         _id, // Include the ID in the processed data
//         date,
//         latitude,
//         longitude,
//         depth,
//         species,
//         total_weight,
//         verified_date,
//         verifier_id,
//       } = catchData;

//       // Processing the species array to handle missing fields inside each species object
//       const processedSpecies =
//         species && Array.isArray(species)
//           ? species.map((specie) => ({
//               name: specie.name || null, // If species name is missing, set to null
//               catch_weight: specie.catch_weight || null, // If catch weight is missing, set to null
//             }))
//           : [];

//       // Returning the processed validated catch object
//       return {
//         _id, // Ensure the ID is included for uniqueness check
//         date: date || null, // If no date, set null
//         latitude: latitude || null, // If no latitude, set null
//         longitude: longitude || null, // If no longitude, set null
//         depth: depth || null, // If no depth, set null
//         species: processedSpecies, // Processed species array
//         total_weight: total_weight || 0, // If no total_weight, set to 0
//         verified_date: verified_date || null, // If no verified_date, set null
//         verifier_id: verifier_id || null, // If no verifier_id, set null
//       };
//     });

//     // console.log(
//     //   "Processed validated catches before DB insert:",
//     //   processedValidatedCatches
//     // );

//     // Check if any catch already exists in the database using the provided _id
//     const existingCatches = await ValidatedCatch.find({
//       _id: { $in: processedValidatedCatches.map((catchData) => catchData._id) },
//     });
//     // console.log("existingCatches", existingCatches);

//     // Filter out the already existing catches from the processed data
//     const newValidatedCatches = processedValidatedCatches.filter(
//       (catchData) =>
//         !existingCatches.some(
//           (existing) => existing._id.toString() === catchData._id.toString()
//         )
//     );

//     // Insert only the new validated catches
//     if (newValidatedCatches.length > 0) {
//       const createdValidatedCatches = await ValidatedCatch.insertMany(
//         newValidatedCatches
//       );
//       console.log(
//         "Successfully inserted validated catches:",
//         createdValidatedCatches
//       );

//       return res.status(201).json({
//         message: "Validated catches successfully created.",
//         data: createdValidatedCatches, // The array of created objects
//       });
//     } else {
//       return res
//         .status(200)
//         .json({ message: "No new validated catches to insert." });
//     }
//   } catch (error) {
//     console.error("Error creating validated catches:", error);
//     return res.status(500).json({
//       message: "An error occurred while creating validated catches.",
//       error: error.message,
//     });
//   }
// };

export const getUniqueSpeciesCount = async (req, res) => {
  try {
    // Function to fetch unique species count
    const fetchUniqueSpeciesCount = async () => {
      const result = await ValidatedCatch.aggregate([
        {
          $unwind: "$species", // Flatten the species array
        },
        {
          $group: {
            _id: "$species.name", // Group by species name
          },
        },
        {
          $count: "uniqueSpeciesCount", // Count unique species names
        },
      ]);

      // Return the count if found; otherwise, return 0
      return result.length > 0 ? result[0].uniqueSpeciesCount : 0;
    };

    const uniqueSpeciesCount = await fetchUniqueSpeciesCount();
    res.status(200).json({
      success: true,
      uniqueSpeciesCount, // Return the unique species count
    });
  } catch (error) {
    console.error("Error fetching unique species count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unique species count",
      error: error.message,
    });
  }
};

export const getUserTypeAndCount = async (req, res) => {
  try {
    // Aggregate users by userType and count the number of users for each type
    const userCounts = await User.aggregate([
      {
        $group: {
          _id: "$userType", // Group by userType
          totalUsers: { $sum: 1 }, // Count the number of users in each group
        },
      },
      {
        $project: {
          _id: 0, // Hide the _id field
          userType: "$_id", // Rename _id to userType
          totalUsers: 1, // Include totalUsers field
        },
      },
    ]);

    // Send the response
    res.json(userCounts);
  } catch (error) {
    console.error("Error fetching userType counts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLatestLogs = async (req, res) => {
  try {
    // Fetch the latest logs (adjust the number of logs you need, here it's set to 10)
    const logs = await Log.find({ fileType: { $ne: "manual" } })
      .sort({ uploadTimestamp: -1 }) // Sort by the latest uploadTimestamp
      .limit(10) // Limit to the latest 10 logs
      .populate({
        path: "userId", // Populate the userId field with user data
        select: "username", // Only select the username field from the User model
      });

    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: "No logs found." });
    }

    // Prepare response data with userId, username, fileType, and uploadTimestamp
    const logsWithUserData = logs.map((log) => ({
      userId: log.userId._id,
      username: log.userId.username,
      fileType: log.fileType,
      dataId: log.dataId,
      uploadTimestamp: log.uploadTimestamp,
    }));

    return res.status(200).json(logsWithUserData);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching logs", error: error.message });
  }
};

export const acceptDataLog = async (req, res) => {
  try {
    let { dataId, status } = req.body;

    // Find the log by dataId
    const log = await Log.findOne({ dataId: dataId });
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }
    // Update the log status
    log.dataStatus = status;
    await log.save();
    return res.status(200).json({ message: "Log status updated" });
  } catch (error) {
    console.error(error);
  }
};

export const rejectDataLog = async (req, res) => {
  try {
    let { dataId, status, reason } = req.body;

    // Find the log by dataId (use findOne if you're expecting a single document)
    const log = await Log.findOne({ dataId: dataId });

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    // Update the log status and reason
    log.dataStatus = status;
    log.reason = reason;

    // Save the updated log
    await log.save();

    return res.status(200).json({ message: "Log status and reason updated" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const getMostCommonSpecies = async (req, res) => {
  try {
    const mostCommonSpecies = await ValidatedCatch.aggregate([
      {
        $unwind: "$species", // Deconstruct the species array
      },
      {
        $group: {
          _id: "$species.name", // Group by species name
          count: { $sum: 1 }, // Count occurrences of each species
        },
      },
      {
        $sort: { count: -1 }, // Sort by count in descending order
      },
      {
        $limit: 1, // Limit to only the top 1 species
      },
    ]);

    if (mostCommonSpecies.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No species data found",
      });
    }

    res.status(200).json({
      success: true,
      data: mostCommonSpecies[0], // Return the most common species
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch the most common species",
      error: error.message,
    });
  }
};
