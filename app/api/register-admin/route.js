
import Admins from "@/models/Admins"; 
import mongoose from "mongoose"; 
import bcrypt from "bcryptjs"; 

// Function to connect to MongoDB
async function connectDB() {
 
  if (mongoose.connections[0].readyState) {
    return; 
  }
  // Establish a new connection to MongoDB 
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

// POST function to handle registration requests
export async function POST(req) {
  // Connect to the MongoDB database
  await connectDB();

  try {
    // Parse the incoming JSON data from the request
    const { name, email, password } = await req.json();

    // Check if an admin already exists with the provided email
    const existingAdmin = await Admins.findOne({ email });
    if (existingAdmin) {
      // If an admin with the same email exists, return an error with
      return new Response(JSON.stringify({ error: "Admin already exists" }), { status: 400 });
    }

    // Hash the password 
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 

    // Create a new admin object 
    const newAdmin = new Admins({ name, email, password: hashedPassword });

    // Save the new admin object
    await newAdmin.save();

   
    return new Response(JSON.stringify({ message: "Admin registered successfully" }), { status: 201 });
  } catch (error) {

    return new Response(JSON.stringify({ error: "Failed to register admin" }), { status: 500 });
  }
}
