// controllers/dataController.js
import CatchData from "../models/FishcatchDataNew.js";
import ValidatedCatchData from "../models/ValidatedCatchData.js";
// Fetch distinct users grouped by tag
export const getUsersByTag = async (req, res) => {
  const { tag } = req.params;
  console.log("tag in getUsersByTag", tag);
  try {
    const users = await CatchData.aggregate([
      { $match: { tag: tag } }, // Filter by tag
      {
        $group: {
          _id: "$userId", // Group by userId
          earliestTimestamp: { $min: "$timestamp" }, // Get the earliest timestamp for each user
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for User
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Flatten the userDetails array
      },
      {
        $project: {
          userId: "$_id",
          userDetails: 1, // Include all fields in userDetails
          uploadTime: "$earliestTimestamp", // Include the earliest timestamp
        },
      },
      {
        $project: {
          "userDetails.password": 0, // Exclude the password field
          "userDetails.passwordChanged": 0, // Exclude the passwordChanged field
        },
      },
    ]);

    console.log("Populated Users:", users);

    // console.log("Users:", users);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch data by userId and tag
export const getDataByUserAndTag = async (req, res) => {
  const { userId, tag } = req.params;
  try {
    const data = await CatchData.find({ userId, tag });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all users who uploaded data (optional for overview)
export const getAllUsers = async (req, res) => {
  try {
    const users = await CatchData.find()
      .distinct("userId")
      .populate("userId", "name email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


