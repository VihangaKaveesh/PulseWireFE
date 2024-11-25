"use client";

//handle session management
import { SessionProvider } from "next-auth/react";


export const AuthProvider = ({ children }) => {
  return (
    // Wrap the children components 
    <SessionProvider>
      {children} 
    </SessionProvider>
  );
};