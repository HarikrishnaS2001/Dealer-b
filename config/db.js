const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Atlas successfully!");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB Atlas:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB Atlas.");
});

module.exports = connectDB;
