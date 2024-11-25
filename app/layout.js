import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "./Providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "PulseWire",
  description: "PulseWire",
  icons: {
    icon: "https://flowbite.com/docs/images/logo.svg" // URL to the favicon
  },
};



// this wraps the entire application
export default function RootLayout({ children }) {
  return (
   
    <html lang="en"> 
      <body className={inter.className}> 
        
        {/* Wrap the children components inside the AuthProvider component */}
        <AuthProvider>{children}</AuthProvider>

        {/* The AuthProvider component handles authentication context for the app, 
            making authentication available to all child components */}
      </body>
    </html>
  );
}
