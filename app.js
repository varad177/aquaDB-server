import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import aws from "aws-sdk";
import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
const __dirname = path.resolve();

import { getSpeciesDataByUserId, uploadSpeciesData, villagefilter } from "./controller/userController.js";

// Controllers
import {
  getusername,
  login,
  signUp,
  changePassword,
} from "./controller/authController.js";
// import admin from "firebase-admin";
// import { assert } from "console";
// import serviceAccountKey from "./medium-clone-2b0eb-firebase-adminsdk-4m109-6a21350bd0.json" assert { type: "json" };

//charts controller//
import {
  getChartData,
  getFilteredDashboard,
} from "./controller/ChartsController.js";
import { downloadFile } from "./controller/fileController.js";
import {
  getCatchDataGroupedByUser,
  getdataUploaduser,
  getDetailsData,
  getUnverifiedUser,
  verifyUser,
  updateCatchData,
  // validateCatchData,
  getUniqueSpeciesCount,
  getUserTypeAndCount,
  getLatestLogs,
  acceptDataLog,
  rejectDataLog,
  getMostCommonSpecies,
} from "./controller/admin-controller.js";

import {
  getDataByDataId,
  getLogsByDataType,
  getLogsByUserIdWithUser,
  getUniqueSpeciesNames,
  otherDataUpload,
  uploadCSV,
  getDataStatus,
} from "./controller/userController.js";

import {
  autoCheckData,
  saveValidatedData,
} from "./controller/DataValidationData.js";

import {
  getAllUsers,
  getDataByUserAndTag,
  getUsersByTag,
} from "./controller/admin-get-dataNew.js";

import { updateUser } from "./controller/userUpdate.js";
import {
  acceptInvitation,
  addCommunityData,
  createCommunity,
  fetchAllScientists,
  fetchCommunityShareData,
  fetchCommunityWithData,
  fetchInvitation,
  getCommunitiesByCreator,
  getFilteredCatches,
  getFilteredSpeciesData,
  getScientistSaveDataByUser,
  getUnique,
  graphdata,
  saveScientistData,
  sendEmailWithExcel,
  sendInvitation,
} from "./controller/scientist-controller.js";
import {
  getSpeciesData,
  getCatchCountBySpeciesPerMonth,
  getCatchDataForBubbleChart,
  getCatchWeightBySea,
  getCatchWeightByState,
  getCatchWeightForEachSpeciesPerMonth,
  getCatchWeightVsDepth,
  getLocationDataForBubbleChart,
  getNumberOfCatchesPerMonth,
  getSpeciesDistribution,
  getTotalCatchWeightPerMonth,
  totalCatchWeightByDataType,
  totalCatchWeightByDate,
  totalCatchWeightByDepth,
  totalCatchWeightBySea,
  totalCatchWeightBySpecies,
  totalCatchWeightByState,
  getCatchTypeData,
  getSeaData,
  getStateData,
  getDateTotalWeightData,
  getLatitudeDepthData,
} from "./controller/graphs.controller.js";
import { getFishermanData, uploadAppData } from "./controller/fisherman-controller.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(
    // "mongodb+srv://varad:varad6862@cluster0.0suvvd6.mongodb.net/SIH"
    "mongodb+srv://deshmusn:sneha2812@cluster0.x960yiu.mongodb.net/SIH"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// AWS S3 Configuration
const s3 = new aws.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRETE_KEY,
});

// Utilities
const generateUploadUrl = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
  return s3.getSignedUrlPromise("putObject", {
    Bucket: "medium-blog-clone",
    Key: imageName,
    Expires: 11000,
    ContentType: "image/jpeg",
  });
};

const uploadDirectory = "./uploads";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const fishImage = "./fishImages";
if (!fs.existsSync(fishImage)) {
  fs.mkdirSync(fishImage);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});


// Create multer instance with the storage configuration
const upload = multer({ storage: storage });

// Routes

// Setup file upload configuration for species
const memoryStorage = multer.memoryStorage();
const SpeciesUpload = multer({ storage: memoryStorage }).single("file");





// Route to handle file upload
// User Authentication Routes
app.post("/signup", signUp);
app.post("/login", login);

// Admin Routes
app.post("/admin/getUnverifiesUsers", getUnverifiedUser);
app.post("/admin/verifyUser", verifyUser);
app.post("/admin/get-detail-data", getDetailsData);
app.post("/admin/get-fish-data", getCatchDataGroupedByUser);
app.get("/admin/get-data-upload-users", getdataUploaduser);
app.put("/admin/update-catch-data/:id", updateCatchData);
app.get("/admin/usernames", getusername);
// app.post("/admin/validate-catch", validateCatchData);
app.get("/admin/get-unique-fish-count", getUniqueSpeciesCount);
app.get("/admin/get-userType-Count", getUserTypeAndCount);
app.get("/admin/get-latest-logs", getLatestLogs);
app.post("/admin/reject-log-data", rejectDataLog);
app.post("/admin/accept-log-data", acceptDataLog);
app.post("/admin/autoCheck-fishing-data", autoCheckData);
app.post("/admin/saveValidatedData", saveValidatedData);
app.post("/admin/get-other-log", getLogsByDataType);
app.post("/admin/get-manual-data-by-id", getDataByDataId);
app.post("/admin/getFishermanData", getFishermanData);
// User Update Details Routes
app.put("/user-update/:userType/:userId", updateUser);
app.get("/download/:type", downloadFile);
app.post("/user/get-log-data-by-id", getLogsByUserIdWithUser);
app.get("/user/getUserLogs", getDataStatus);

// Password Update Route
app.put("/user/Password-update", changePassword);
app.post("/user/other-data-upload", otherDataUpload);
app.post("/user/getUniqueSpeciesNames", getUniqueSpeciesNames);

// Scientist Routes
app.get("/scientist/unique-species", getUnique);
app.post("/scientist/filter-data", getFilteredCatches);
app.post("/scientist/filter-data-by-species", getFilteredSpeciesData);
app.post("/scientist/create-community", createCommunity);
app.post("/scientist/fetch-communities", getCommunitiesByCreator);
app.post("/scientist/fetch-scientists", fetchAllScientists);
app.post("/scientist/send-invitation", sendInvitation);
app.post("/scientist/accept-or-reject-invitation", acceptInvitation);
app.post("/scientist/fetch-invitations", fetchInvitation);
app.post("/scientist/insert-community-data", addCommunityData);
app.post("/scientist/fetch-community-with-data", fetchCommunityWithData);
app.post("/scientist/fetch-community-share-data", fetchCommunityShareData);
app.post("/scientist/saveScientistData", saveScientistData);
app.post("/scientist/getScientistSaveDataByUser", getScientistSaveDataByUser);
app.post("/graph", graphdata);

///Data Visulaization
app.post("/scientist/visualize", getChartData);
app.post("/scientist/get-chart-url", getFilteredDashboard);

// Upload Routes
app.get("/get-upload-url", async (req, res) => {
  try {
    const uploadUrl = await generateUploadUrl();
    res.status(200).json({ uploadUrl });
  } catch (err) {
    console.error("Error generating upload URL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// CSV Upload Route
app.post("/upload", upload.single("file"), uploadCSV);
app.post("/scientist/sendEmail", upload.single("file"), sendEmailWithExcel);
app.post("/uploadSpecies", SpeciesUpload, uploadSpeciesData);
app.post("/getSpeciesDataByUserId", getSpeciesDataByUserId);
app.post("/villagefilter", villagefilter);

///new code aaded from here wjil other codes are preserved
//new upload csv routes
// app.post("/upload", upload.single("file"), uploadCSV2);

app.post("/uploadAppData", uploadAppData)
// app.post("/uploadAppData", uploadAppData)

// Route to fetch users by tag
app.get("/admin/users-by-tag/:tag", getUsersByTag);

// Route to fetch data by userId and tag
app.get("/admin/data/:userId/:tag", getDataByUserAndTag);

// Optional: Route to fetch all users who uploaded any data
app.get("/admin/all-users", getAllUsers);
app.get("/admin/getMostCommonSpecies", getMostCommonSpecies);

//bar chart

app.post("/total-catch-weight-by-date", totalCatchWeightByDate);
app.post("/total-catch-weight-by-species", totalCatchWeightBySpecies);
app.post("/total-catch-weight-by-sea", totalCatchWeightBySea);
app.post("/total-catch-weight-by-state", totalCatchWeightByState);
app.post("/total-catch-weight-by-depth", totalCatchWeightByDepth);
app.post("/total-catch-weight-by-data-type", totalCatchWeightByDataType);

// bubble chart
app.post("/getCatchDataForBubbleChart", getCatchDataForBubbleChart);
app.post("/getCatchWeightVsDepth", getCatchWeightVsDepth);
app.post("/getLocationDataForBubbleChart", getLocationDataForBubbleChart);

// DoughnutChart

app.post("/getSpeciesDistribution", getSpeciesDistribution);
app.post("/getCatchWeightBySea", getCatchWeightBySea);
app.post("/getCatchWeightByState", getCatchWeightByState);

// line chart
app.post("/getTotalCatchWeightPerMonth", getTotalCatchWeightPerMonth);
app.post("/getNumberOfCatchesPerMonth", getNumberOfCatchesPerMonth);

app.post("/getCatchCountBySpeciesPerMonth", getCatchCountBySpeciesPerMonth);
app.post(
  "/getCatchWeightForEachSpeciesPerMonth",
  getCatchWeightForEachSpeciesPerMonth
);

// pir chart

app.post("/getSpeciesData", getSpeciesData);
app.post("/getCatchTypeData", getCatchTypeData);
app.post("/getSeaData", getSeaData);
app.post("/getStateData", getStateData);

// scattor plot

app.post("/getDateTotalWeightData", getDateTotalWeightData);
app.post("/getLatitudeDepthData", getLatitudeDepthData);

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
