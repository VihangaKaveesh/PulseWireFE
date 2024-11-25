"use client";

import { useState } from "react";
import Link from "next/link";
import AdminNavBar from "./Admin-NavBar";

export default function RegisterAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Making a POST request 
      const res = await fetch("../api/register-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        window.alert("Admin Added successfully");
        window.location.href = "/dashboard"; 
      } else {
        
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to register admin.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <>
      <AdminNavBar />

      {/* Full-page loading spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
        </div>
      )}

      {/* Main container */}
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50 pt-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">Register New Admin</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Register Admin
              </button>

              {error && (
                <p className="text-sm font-medium text-red-600 mt-2" role="alert">
                  {error}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
