import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.DB_URL_ATLAS)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log(`Failed to connect to DB ..... ${err}`);
    });
};

export default connectDB;
