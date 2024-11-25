"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaAlignLeft, FaAlignCenter, FaAlignRight, FaUndo, FaRedo } from "react-icons/fa";
import AdminNavBar from "./Admin-NavBar";

export default function AddArticle() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);  // Set loading to true initially

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: true,
        orderedList: true,
      }),
      Underline, // Enable underline functionality
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      BulletList, // Explicitly add bullet list support
      OrderedList, // Explicitly add ordered list support
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Simulate page loading, set loading to false after 2 seconds
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);  // End loading after 2 seconds
    }, 2000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please upload an image.");
      return;
    }

    setIsLoading(true); // Start loading animation during form submission

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("author", author);
      formData.append("image", image);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/create`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Article added successfully!");
        window.location.href = "/dashboard";
        setTitle("");
        setContent("");
        setAuthor("");
        setImage(null);
        setError("");
        editor?.commands.clearContent();
      } else {
        const response = await res.json();
        console.error("Error during submission:", response);
        setError("An error occurred while adding the article.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // Stop loading animation after submission
    }
  };

  return (
    <>
      {/* Loading Page when the component is first called */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
        </div>
      )}

      <AdminNavBar />
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
        <Link
          href={"/"}
          className="absolute top-4 left-4 px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white text-sm sm:text-base font-medium rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Go Back
        </Link>

        <div
          className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-lg shadow-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">
            Add a New Article
          </h1>

          <form className="space-y-6" method="POST">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                Title
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Tiptap Editor with Advanced Toolbar */}
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
                <EditorContent editor={editor} className="p-3 min-h-[200px]" />
              </div>
            </div>

            {/* Other Input Fields */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-900">
                Author
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setAuthor(e.target.value)}
                  id="author"
                  name="author"
                  type="text"
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-900">
                Upload Image
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  id="image"
                  name="image"
                  required
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500"
              >
                Publish Article
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}