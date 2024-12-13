import mongoose from "mongoose";

export const connectDB = async (req, res) => {
    const mongoURI  = process.env.CONNECTMONGO
  try {
    const connect = await mongoose.connect(mongoURI);
    console.log(`Db Connect Successfully with ${connect.connection.name}`);
  } catch (error) {
    console.log(`Error while connecting DB ${error}`);
  }
};