import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    // Connect to the first database (MONGODB_URI)
    if (mongoose.connections[0].readyState) {
      console.log("Already connected to the first database");
    } else {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to the first database");
    }

    // Connect to the second database (MONGODB_URI_ARTICLES)
    if (mongoose.connections[1] && mongoose.connections[1].readyState) {
      console.log("Already connected to the second database");
    } else {
      await mongoose.createConnection(process.env.MONGODB_URI_ARTICLES, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to the second database");
    }
  } catch (error) {
    console.log("Error connecting to the databases", error);
  }
};
