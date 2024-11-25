
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; 
import { connectMongoDB } from "@/lib/mongodb"; 
import Admins from "@/models/Admins"; 
import bcrypt from "bcryptjs"; // To hash and compare passwords securely
import { signIn } from "next-auth/react"; 

// Define authentication options for NextAuth
export const authOptions = {
  // Configure the authentication providers (in this case, using credentials)
  providers: [
    CredentialsProvider({
      name: "credentials", 
      credentials: {}, 

      // authentication logic for custom credentials
      async authorize(credentials) {
        const { email, password } = credentials; //

        try {
          
          await connectMongoDB();

          // Find the user in the Admins collection based on the email provided
          const user = await Admins.findOne({ email });

          // If the user doesn't exist, return null 
          if (!user) {
            return null;
          }

          // Compare the hashed password from the database with the provided password
          const passwordsMatch = await bcrypt.compare(password, user.password);

          // If the passwords don't match, return null 
          if (!passwordsMatch) {
            return null;
          }

          // If authentication is successful, return the user object
          return user;
        } catch (error) {
          console.log("Error: ", error); 
        }
      },
    }),
  ],

  // Session configuration to handle how sessions are managed
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session management
    maxAge: 10 * 60, // Session expires after 10 minutes (600 seconds)
  },

  // JWT configuration to handle the token expiration time
  jwt: {
    maxAge: 10 * 60, // JWT expires after 10 minutes (600 seconds)
  },

  // Secret key used to sign JWT tokens (should be securely stored in environment variables)
  secret: process.env.NEXTAUTH_SECRET,

  // Custom sign-in page path
  pages: {
    signIn: "/login", // Redirect to this page if not authenticated
  },
};

// Initialize and export the NextAuth handler for GET and POST requests
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST methods
export { handler as GET, handler as POST };
