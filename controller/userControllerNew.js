import xlsx from "xlsx";
import fs from "fs";
import csv from "csv-parser";
import { getDistance } from "geolib";

import CatchData from "../models/FishcatchDataNew.js";
import Log from "../models/logSchema.js";

const stateBoundaries = {
  Gujarat: { latitude: 22.2587, longitude: 71.1924 },
  Maharashtra: { latitude: 19.7515, longitude: 75.7139 },
  Goa: { latitude: 15.2993, longitude: 74.124 },
  Karnataka: { latitude: 15.3173, longitude: 75.7139 },
  Kerala: { latitude: 10.8505, longitude: 76.2711 },
  TamilNadu: { latitude: 11.1271, longitude: 78.6569 },
  AndhraPradesh: { latitude: 15.9129, longitude: 79.74 },
  Odisha: { latitude: 20.9517, longitude: 85.0985 },
  WestBengal: { latitude: 22.9868, longitude: 87.855 },
  Lakshadweep: { latitude: 10.5667, longitude: 72.6417 },
};

// Helper function to clean and normalize data
const categorizeLocation = (latitude, longitude) => {
  let sea = "Unknown Region";

  // Determine the sea region
  if (latitude >= 8 && latitude <= 23 && longitude >= 68 && longitude <= 75) {
    sea = "Arabian Sea";
  } else if (
    latitude >= 10 &&
    latitude <= 23 &&
    longitude >= 80 &&
    longitude <= 90
  ) {
    sea = "Bay of Bengal";
  } else if (latitude < 8) {
    sea = "Indian Ocean";
  }

  // Determine the closest state
  let closestState = "Unknown State";
  let shortestDistance = Infinity;

  for (const [state, coordinates] of Object.entries(stateBoundaries)) {
    const distance = getDistance({ latitude, longitude }, coordinates);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestState = state;
    }
  }

  return { sea, state: closestState };
};

// Function to handle Excel date serial numbers
const parseExcelDate = (excelDate) => {
  const excelStartDate = new Date(1900, 0, 1); // January 1, 1900
  const dateOffset = excelDate - 1; // Excel starts from 1, JS starts from 0
  return new Date(
    excelStartDate.setDate(excelStartDate.getDate() + dateOffset)
  );
};

const cleanData = (data, userId, id, tag) => {
  console.log("data", data);
  console.log("userId", userId);
  console.log("id", id);
  console.log("tag", tag);

  return data.map((item) => {
    const species = [];

    // Check if MAJOR_SPECIES exists and process it
    if (item.MAJOR_SPECIES) {
      const speciesData = item.MAJOR_SPECIES.split(","); // Split by commas
      speciesData.forEach((s) => {
        const match = s.match(/([A-Za-z\s]+)\((\d+)\)/); // Regex to extract name and weight
        if (match) {
          species.push({
            name: match[1].trim().toLowerCase(),
            catch_weight: parseInt(match[2].trim()),
          });
        } else {
          species.push({
            name: s.trim().toLowerCase(),
            catch_weight: null,
          });
        }
      });
    }

    // Normalize depth values by removing non-numeric characters
    const depth = item.DEPTH
      ? parseFloat(item.DEPTH.split("-")[0].trim()) // Take the first part before the "-"
      : null;

    // Categorize by sea and state
    const latitude = parseFloat(item.SHOOT_LAT);
    const longitude = parseFloat(item.SHOOT_LONG);
    const { sea, state } = categorizeLocation(latitude, longitude);

    // Convert Excel date or handle as string date
    const dateValue = item["FISHING Date"];
    const date =
      typeof dateValue === "number"
        ? parseExcelDate(dateValue) // Excel serial number
        : new Date(dateValue); // Regular date string

    return {
      date, // Use the parsed date
      latitude,
      longitude,
      depth,
      species,
      sea,
      state,
      userId,
      dataId: id,
      verified: false, // Default verified to false
      total_weight: parseFloat(item.TOTAL_CATCH), // Total catch weight
      tag, // Set the tag field here
      location: `${latitude}, ${longitude}`, // Set the location as a string (latitude, longitude)
    };
  });
};

function generateRandomId() {
  const date = new Date();
  const timestamp = date.getTime(); // Get the current timestamp in milliseconds
  const randomNumber = Math.floor(Math.random() * 100000); // Generate a random number
  const randomId = `ID-${timestamp}-${randomNumber}`; // Combine the timestamp and random number
  return randomId;
}

//upload csv
export const uploadCSV2 = async (req, res) => {
  try {
    const { userId, fileType } = req.body; // Extract fileType from body
    const file = req.file;
    console.log(file);

    const filePath = file.path;
    console.log(filePath);
    let data = [];
    let finalData = [];
    let id = generateRandomId();

    const logData = {
      userId,
      fileType,
      dataId: id, // Include fileType here
    };

    // Determine the tag based on the file type
    let tag;
    if (fileType === "abundance" || fileType === "occurrence") {
      tag = fileType; // Use the fileType as the tag
    } else {
      return res.status(400).json({
        message: "Invalid file type. Must be 'abundance' or 'occurrence'.",
      });
    }

    // Check file type
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // Parse Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Assuming first sheet
      const sheet = workbook.Sheets[sheetName];
      const rawData = xlsx.utils.sheet_to_json(sheet);

      // Clean and normalize data
      data = cleanData(rawData, userId, id, tag); // Pass tag here
    } else if (file.mimetype === "text/csv") {
      // Parse CSV file
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          results.push(row);
        })
        .on("end", async () => {
          data = cleanData(results, userId, id, tag); // Pass tag here

          // Log data to console
          console.log("Parsed Data:", data);

          // Comment out database insertion for debugging or re-enable as needed
          try {
            await CatchData.insertMany(data); // Insert cleaned data
            await Log.create(logData); // Log the file upload
            return res.status(200).json({
              message:
                "File uploaded successfully. Data logged for verification.",
            });
          } catch (dbError) {
            return res.status(500).json({
              message: "Error inserting data into database",
              error: dbError.message,
            });
          }
        });
      return; // Ensure response is sent inside the CSV processing callback
    } else {
      return res.status(400).json({
        message: "Invalid file type. Please upload an Excel or CSV file.",
      });
    }

    // Comment out database insertion for debugging or re-enable as needed
    try {
      await CatchData.insertMany(data); // Insert cleaned data
      await Log.create(logData); // Log the file upload
      res.status(200).json({
        message: "File uploaded successfully. Data logged for verification.",
      });
    } catch (dbError) {
      res.status(500).json({
        message: "Error inserting data into database",
        error: dbError.message,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
};

export const getLogsByUserIdWithUser = async (req, res) => {
  try {
    const { userid } = req.body;
    console.log(userid);

    // Fetch logs sorted by `createdAt` in ascending order
    const logs = await Log.find({ userId: userid }).sort({ createdAt: 1 });

    res.status(200).json({ data: logs });
  } catch (error) {
    console.error("Error fetching logs with user data:", error);
    res.status(500).json({ message: "Failed to fetch logs", error });
  }
};
