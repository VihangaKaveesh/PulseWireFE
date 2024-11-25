"use client";

import AdminNavBar from "./Admin-NavBar";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import axios from "axios";
import Image from "next/image";

export default function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      setIsLoading(true); // Start loading
      const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`);
      console.log(result.data);
      setUserData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    console.log(`Editing article with id: ${id}`);
    window.location.href = `/editArticle?id=${id}`;
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this article?");

    if (confirmDelete) {
      try {
        console.log(`Deleting article with id: ${id}`);
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete/${id}`);
        setUserData((prevData) => prevData.filter((article) => article._id !== id));
        alert("Article deleted successfully!");
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("Failed to delete the article.");
      }
    }
  };

  return (
    <>
      <AdminNavBar />
      
      {/* Full-page loading animation */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
        </div>
      )}

      <div className="p-4">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4 border-t border-gray-300 pt-20">Articles</h1>

          {/* Show articles once loading is complete */}
          {!isLoading && (
            <div className="overflow-x-auto">
              <table className="table w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="bg-gray-100 p-4">Image</th>
                    <th className="bg-gray-100 p-4">Title</th>
                    <th className="bg-gray-100 p-4">Content</th>
                    <th className="bg-gray-100 p-4">Author</th>
                    <th className="bg-gray-100 p-4">Date</th>
                    <th className="bg-gray-100 p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((article, index) => (
                    <tr key={article._id || index} className="border-b">
                      <td className="p-4">
                        {article.image ? (
                          <Image
                            src={article.image} // Directly use the Cloudinary image URL
                            width={100}
                            height={100}
                            alt={`Image of ${article.title}`}
                            className="rounded-md"
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </td>
                      <td className="p-4 font-bold">{article.title}</td>
                      <td className="p-4 max-w-[300px] break-words">
                        {article.content.substring(0, 100)}...
                      </td>
                      <td className="p-4">{article.author}</td>
                      <td className="p-4">{new Date(article.timestamp).toLocaleDateString()}</td>
                      <td className="p-4 flex gap-3">
                        <button
                          aria-label="Edit Article"
                          className="btn btn-sm btn-outline btn-info"
                          onClick={() => handleEdit(article._id)}
                        >
                          <PencilIcon className="w-7 h-7" />
                        </button>
                        <button
                          aria-label="Delete Article"
                          className="btn btn-sm btn-outline btn-error"
                          onClick={() => handleDelete(article._id)}
                        >
                          <TrashIcon className="w-7 h-7" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}