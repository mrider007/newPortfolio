

import axios from 'axios';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';

// Function to upload image to Cloudinary
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  const response = await axios.post(CLOUDINARY_URL, formData);
  return response.data.secure_url; // The URL of the uploaded image
};
