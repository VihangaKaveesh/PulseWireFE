"use client"; 

import Link from "next/link";
import { useState } from "react"; 
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function AdminNavBar() {

  const {data: session}= useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  // Function to handle the logout click
  const handleLogout = (e) => {
    e.preventDefault(); // Prevent the default action (link click) to handle custom logic

    // Show confirmation box
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    // If confirmed, redirect to the home page
    if (confirmLogout) {
      signOut({
        redirect: true, // Automatically redirects after sign out
        callbackUrl: '/' // Redirect to the home page after sign out
      });
    }
  };

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 shadow-md">
      
      <div className="flex justify-between items-center px-6 py-4">
        {/* Admin Section */}
        <Link
  href="/dashboard"
  className="text-indigo-600 dark:text-indigo-400 text-xl font-bold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
>
  {session?.user?.name?.toUpperCase()}
</Link>


        {/* Hamburger menu for mobile */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Buttons Section for desktop */}
        <div className="hidden sm:flex sm:flex-row gap-2 sm:gap-4">
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Add Admin
          </Link>

          <Link
            href="/addArticle"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Add Article
          </Link>

          {/* Logout Button with Confirmation */}
          <a
            href="../home"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            onClick={handleLogout}  
          >
            Logout
          </a>
        </div>
      </div>

      {/* Mobile menu (shown when isMenuOpen is true) */}
      <div
        className={`sm:hidden ${isMenuOpen ? "block" : "hidden"}`}
      >
        <div className="flex flex-col items-center px-6 py-4 space-y-4">
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Add Admin
          </Link>

          <Link
            href="/addArticle"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Add Article
          </Link>

          {/* Logout Button with Confirmation */}
          <button
            // onClick={()=>signOut()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            onClick={handleLogout} 
          >
            Logout</button>
        
        </div>
      </div>
    </nav>
  );
}
