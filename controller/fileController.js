// import path from 'path';
// import fs from 'fs';

// // Function to handle file download based on type
// export const downloadFile = (req, res) => {
//   const { type } = req.params;

//   let filePath;

//   // Check for the file type and define the file path
//   if (type === 'abundance') {
//     filePath = path.join(__dirname, '..', 'Files', 'Abundance.xlsx'); // Adjust path accordingly
//   } else if (type === 'occurrence') {
//     filePath = path.join(__dirname, '..', 'Files', 'Occurrence.xlsx'); // Adjust path accordingly
//   } else {
//     return res.status(404).send('File not found');
//   }

//   // Check if the file exists and send the file, else return an error
//   if (fs.existsSync(filePath)) {
//     res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     return res.sendFile(filePath);
//   } else {
//     return res.status(404).send('File not found');
//   }
// };

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Resolve the __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to handle file download based on type
export const downloadFile = (req, res) => {
  const { type } = req.params;
  console.log("type", type);
  let filePath;

  // Check for the file type and define the file path
  if (type === "AbuOcu") {
    filePath = path.join(__dirname, "..", "Files", "Abundance.xlsx"); // Adjust path accordingly
  } else if (type === "pfz") {
    filePath = path.join(__dirname, "..", "Files", "Pfz.xlsx"); // Adjust path accordingly
  }else if (type === "Landing-Village") {
    filePath = path.join(__dirname, "..", "Files", "LandingVillage.xlsx"); // Adjust path accordingly
  }else if (type === "GEO-REF") {
    filePath = path.join(__dirname, "..", "Files", "GeoReference.xlsx"); // Adjust path accordingly
  } else {
    return res.status(404).send("File not found");
  }

  // Check if the file exists and send the file, else return an error
  if (fs.existsSync(filePath)) {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${path.basename(filePath)}`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.sendFile(filePath);
  } else {
    return res.status(404).send("File not found");
  }
};
