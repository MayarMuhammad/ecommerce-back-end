import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
dotenv.config({ path: path.join(__dirname, "../../config/.env") });
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
  secure: true,
});

export default cloudinary;
