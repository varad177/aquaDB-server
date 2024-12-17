import multer from 'multer';
import { storage } from "../Config/Cloudinary" // Import storage config

const upload = multer({ storage });

// File upload controller
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl: file.path, // Cloudinary file URL
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error });
  }
};
