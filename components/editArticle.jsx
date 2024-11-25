"use client";

import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "./Admin-NavBar";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaAlignLeft, FaAlignCenter, FaAlignRight, FaUndo, FaRedo } from "react-icons/fa";

const EditArticle = () => {
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("id");

  const [article, setArticle] = useState({
    title: "",
    content: "",
    author: "",
    image: null,
  });
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const [loading, setLoading] = useState(false); // Set loading state to false initially
  const [error, setError] = useState(null);

  // Initialize Tiptap editor only on the client side
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    // This ensures the editor initializes only in the browser (client-side)
    if (typeof window !== "undefined") {
      setEditorReady(true);
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: true,
        orderedList: true,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      BulletList,
      OrderedList,
    ],
    content: article.content, // Initially set content to the article content
    onUpdate: ({ editor }) => {
      setArticle((prevArticle) => ({
        ...prevArticle,
        content: editor.getHTML(),
      }));
    },
  });

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true); // Set loading to true while fetching the article
      try {
        const response = await axios.get(`${backendUrl}/article/${articleId}`);
        const fetchedArticle = response.data;
        setArticle(fetchedArticle);
        setLoading(false); // Set loading to false once data is fetched

        // Set the editor content when the article data is fetched
        if (editor && fetchedArticle.content) {
          editor.commands.setContent(fetchedArticle.content); // Populate content
        }
      } catch (err) {
        setError("Failed to fetch the article.");
        setLoading(false); // Set loading to false in case of an error
      }
    };

    if (articleId) fetchArticle();
  }, [articleId, backendUrl, editor]); // Added backendUrl to dependencies

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setArticle((prevArticle) => ({
      ...prevArticle,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true during form submission

    const formData = new FormData();
    formData.append("title", article.title);
    formData.append("content", article.content);
    formData.append("author", article.author);

    if (article.image) {
      formData.append("image", article.image);
    }

    try {
      const response = await axios.put(`${backendUrl}/update/${articleId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Article updated successfully!");
        window.location.href = "/dashboard";
        const updatedArticle = response.data;
        setArticle(updatedArticle);
      } else {
        throw new Error("Failed to update the article.");
      }
    } catch (err) {
      console.error("Error updating article:", err);
      alert("Failed to update the article.");
    } finally {
      setLoading(false); // Set loading to false after submission is complete
    }
  };

  // Show a loading spinner when data is being fetched or submitted
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center z-50">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
      </div>
    );
  }

  // Handle errors
  if (error) return <p>{error}</p>;

  return (
    <>
      <AdminNavBar />
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">
            Edit Article
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                Title
              </label>
              <input
                value={article.title}
                onChange={handleInputChange}
                id="title"
                name="title"
                type="text"
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Tiptap Editor */}
            {editorReady && (
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-900">
                  Content
                </label>
                <div className="mt-2 border border-gray-300 rounded-md shadow-sm">
                  {/* Toolbar */}
                  {editor && (
                    <div className="toolbar flex flex-wrap space-x-2 bg-gray-100 p-2 rounded-t-md shadow">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded ${editor.isActive("bold") ? "bg-indigo-500 text-white" : "text-gray-800 hover:bg-gray-200"}`}
                      >
                        <FaBold />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded ${editor.isActive("italic") ? "bg-indigo-500 text-white" : "text-gray-800 hover:bg-gray-200"}`}
                      >
                        <FaItalic />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-2 rounded ${editor.isActive("underline") ? "bg-indigo-500 text-white" : "text-gray-800 hover:bg-gray-200"}`}
                      >
                        <FaUnderline />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        className={`p-2 rounded ${editor.isActive({ textAlign: "left" }) ? "bg-indigo-500 text-white" : "text-gray-800 hover:bg-gray-200"}`}
                      >
                        <FaAlignLeft />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        className={`p-2 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-indigo-500 text-white" : "text-gray-800 hover:bg-gray-200"}`}
                      >
                        <FaAlignCenter />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        className={`p-2 rounded ${editor.isActive({ textAlign: "right" }) ? "bg-indigo-500 text-white" : "text-gray-800 hover:bg-gray-200"}`}
                      >
                        <FaAlignRight />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        className="p-2 rounded text-gray-800 hover:bg-gray-200"
                      >
                        <FaUndo />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        className="p-2 rounded text-gray-800 hover:bg-gray-200"
                      >
                        <FaRedo />
                      </button>
                    </div>
                  )}

                  {/* Editor content */}
                  {editorReady && (
                    <EditorContent editor={editor} />
                  )}
                </div>
              </div>
            )}

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-900">
                Author
              </label>
              <input
                value={article.author}
                onChange={handleInputChange}
                id="author"
                name="author"
                type="text"
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-900">
                Upload Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-center items-center space-x-4 mt-4">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditArticle;
