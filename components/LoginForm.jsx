"use client";

import Link from "next/link";
import HomeNavBar from "./Home-NavBar";
import { useState } from "react";
import { signIn } from "next-auth/react"; // Import signIn from NextAuth
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); 

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); 

        try {
            // signIn with callbackUrl to redirect after successful login
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result.error) {
              
                setError("Invalid login credentials. Please try again.");
                setIsLoading(false); 
                return;
            }

window.alert("Successfully logged in");
            router.replace("../dashboard"); // Redirect to dashboard on success
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    return (
        <>
            <HomeNavBar />

           
            {isLoading && (
                <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
                </div>
            )}

            {/* Main container */}
            <div className="flex min-h-screen items-center justify-center px-6 py-12">

                {/* The main form container */}
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    {/* The title */}
                    <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                        Login to your account
                    </h1>

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                Your Email
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
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
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Submit button */}
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                Login
                            </button>

                            {/* Error message */}
                            {error && (
                                <p className="block text-sm font-medium text-red-600" role="alert">
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
