import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Fisherman from "../models/Fisherman.js";
import IndustryCollaborator from "../models/IndustryCollaborator.js";
import ResearchCruise from "../models/ResearchCruise.js";
import ResearchInstitute from "../models/ResearchInstitute.js";
import Scientist from "../models/Scientist.js";

export const signUp = async (req, res) => {
  const { email, role, userType, additionalDetails } = req.body;

  // Validate the request body
  if (!email || !role) {
    return res
      .status(400)
      .json({ message: "Email, password, and role are required" });
  }

  // If role is 'user', validate userType-specific details
  if (role === "user") {
    if (!userType) {
      return res
        .status(400)
        .json({ message: "User type is required for user role" });
    }
    if (!additionalDetails) {
      return res.status(400).json({
        message: "Additional details are required for the selected user type",
      });
    }
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create the user
    const newUser = new User({
      email,
      role,
      isVerifed: false,
      userType,
    });

    console.log("newUser", newUser);

    // Save the user
    await newUser.save();

    // Create user-specific details
    let userDetails;
    switch (userType) {
      case "fisherman":
        userDetails = new Fisherman({
          userId: newUser._id,
          ...additionalDetails, // Fisherman-specific details
        });
        await userDetails.save();
        break;
      case "industry-collaborators":
        userDetails = new IndustryCollaborator({
          userId: newUser._id,
          ...additionalDetails, // Industry-collaborator-specific details
        });
        await userDetails.save();
        break;
      case "research_cruises":
        userDetails = new ResearchCruise({
          userId: newUser._id,
          ...additionalDetails, // Research-cruise-specific details
        });
        await userDetails.save();
        break;
      case "scientist":
        userDetails = new Scientist({
          userId: newUser._id,
          ...additionalDetails, // Research-institute-specific details
        });
        await userDetails.save();
        break;
      default:
        break;
    }

    // // Generate a JWT token
    // const token = jwt.sign(
    //   { userId: newUser._id, role: newUser.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1h" }
    // );

    // Send response
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login API - validates user credentials and generates JWT token
export const login = async (req, res) => {
  const { username, password } = req.body; // Get the username and password from the request body
  const SECRET_KEY = "vard177";
  console.log(username , password);
  
  // Check if the username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
        userType: user.userType,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Return the response with the token and user details
    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
      userType: user.userType,
      userid: user._id,
      passwordChanged: user.passwordChanged,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//change password
export const changePassword = async (req, res) => {
  try {
    const { newPassword, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //todo
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, {
      password: newPassword,
      passwordChanged: true,
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getusername = async (req, res) => {
  try {
    console.log("Fetching usernames...");

    // Fetch users and project only the `username` field
    const users = await User.find({}, { username: 1, _id: 0 });
    console.log(users);

    // Extract usernames as an array
    const usernames = users.map((user) => user.username);

    res.json(usernames); // Respond with the array of usernames
  } catch (error) {
    console.error("Error fetching usernames:", error);
    res.status(500).json({ message: "Failed to fetch usernames." });
  }
};
