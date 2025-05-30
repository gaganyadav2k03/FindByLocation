import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gaganyadav2k03:thegaganyadav840%40@pr01.78r3r.mongodb.net/locationDb"
    );
    console.log("database connected");
  } catch (error) {
    throw new Error(`something went wrong ${error}`);
  }
};
