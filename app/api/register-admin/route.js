import Admins from "@/models/Admins"; // Adjust the path if needed
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Import bcryptjs

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

export async function POST(req) {
  await connectDB();

  try {
    const { name, email, password } = await req.json(); // Parse incoming JSON data

    // Check if the admin already exists
    const existingAdmin = await Admins.findOne({ email });
    if (existingAdmin) {
      return new Response(JSON.stringify({ error: "Admin already exists" }), { status: 400 });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Create a new admin with the hashed password
    const newAdmin = new Admins({ name, email, password: hashedPassword });
    await newAdmin.save();

    return new Response(JSON.stringify({ message: "Admin registered successfully" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to register admin" }), { status: 500 });
  }
}
