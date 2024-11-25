import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import HomePage from "@/components/HomePage";


export default async function Home() {
  // Fetch the current session 
  const session = await getServerSession(authOptions);

//  If the user is authenticated redirect them to the dashboard :
//  so that when logged in we cant type home url and visit that site
  
  if (session) {
    redirect("/dashboard");
  }

  // If no session is found redirect to homepage
  return (
    <main>
      {/* Render the HomePage component */}
      <HomePage />
    </main>
  );
}
