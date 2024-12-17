import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name:"dlse1yaur",
      api_key: "699243622421676",
      api_secret: "yjVL02bfLePWYT3yJFU9oRW3nU8",
    });
    console.log("Connected to Cloudinary successfully.");
  } catch (error) {
    console.error("Error while connecting to Cloudinary: ", error);
  }
};



// CLOUDINARY_CLOUD_NAME=dlse1yaur
// CLOUDINARY_API_KEY=699243622421676
// CLOUDINARY_API_SECRET=yjVL02bfLePWYT3yJFU9oRW3nU8
// Folder_Name="StudyNotionFolder"



// Cloudinary storage setup
export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'StudyNotionFolder',
    resource_type: 'raw',
    format: async (req, file) => file.originalname.split('.').pop(),
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});
