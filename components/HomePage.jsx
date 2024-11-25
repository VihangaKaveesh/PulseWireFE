"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import HomeNavBar from "./Home-NavBar";

export default function Dashboard() {
  const [userData, setUserData] = useState([]); // Store articles fetched from the backend
  const [modalData, setModalData] = useState(null); // Data for the modal
  const [isLoading, setIsLoading] = useState(true); // Loading state to manage the loading spinner

  // Fetch articles on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch articles from the backend
  const fetchData = async () => {
    try {
      // Replace with your deployed backend URL
      const result = await axios(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`);
      console.log(result.data);
      setUserData(result.data); // Store fetched articles
    } catch (error) {
      console.error("Something went wrong:", error);
    } finally {
      setIsLoading(false); // Stop loading once data is fetched
    }
  };

  // Open the modal and set the current article data
  const openModal = (article) => {
    setModalData(article);
    document.getElementById("article-modal").classList.remove("hidden");
  };

  // Close the modal and reset modal data
  const closeModal = () => {
    setModalData(null);
    document.getElementById("article-modal").classList.add("hidden");
  };

  return (
    <>
      <HomeNavBar />

      {/* Full-page loading animation */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
        </div>
      )}

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 pt-20">Articles</h1>
        
        {/* Show articles once loading is complete */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.map((article, index) => (
              <div
                key={article._id || index} 
                className="card bg-white shadow-md rounded-xl overflow-hidden flex flex-col border"
              >
                <figure
                  className="h-48 w-full relative cursor-pointer"
                  onClick={() => openModal(article)}
                >
                  <Image
                    src={article.image} 
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-xl"
                  />
                </figure>
                <div className="card-body p-4 rounded-b-xl">
                  <h2 className="text-2xl font-semibold">{article.title.toUpperCase()}</h2>
                  <div className="text-gray-500 text-xs mt-2">
                    <p>Author: {article.author}</p>
                    <p>Date: {new Date(article.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <div
        id="article-modal"
        className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full relative p-6">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          {modalData && (
            <>
              <h3 className="text-xl text-gray-600 font-bold mb-4">
                {modalData.title.toUpperCase()}
              </h3>
              <div
                className="text-black mb-4"
                dangerouslySetInnerHTML={{ __html: modalData.content }}
              ></div>
              <div className="text-gray-500 text-sm">
                <p>Author: {modalData.author}</p>
                <p>Date: {new Date(modalData.timestamp).toLocaleDateString()}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
