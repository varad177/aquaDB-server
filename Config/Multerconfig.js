import multer from 'multer';
import fs from 'fs';
import path from 'path';


// Directory for local file uploads
const uploadDirectory = "./uploads";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for validating file types
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = /.csv|.xlsx/;
//   const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedFileTypes.test(file.mimetype);

//   console.log('File Extension:', path.extname(file.originalname).toLowerCase());
//   console.log('File MIME Type:', file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Unsupported file type. Please upload only CSV or XLSX files."));
//   }
// };

// Multer instance for local uploads
const localUpload = multer({
  storage: localStorage,
  // fileFilter: fileFilter,
});

export default localUpload;
