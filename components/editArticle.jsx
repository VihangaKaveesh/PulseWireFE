"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "./Admin-NavBar";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

const EditArticle = ({ articleId, navigate }) => {
  const [article, setArticle] = useState({
    title: "",
    content: "",
    author: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      BulletList,
      OrderedList,
    ],
    content: article.content,
    onUpdate: ({ editor }) => {
      setArticle((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;

      try {
        const response = await axios.get(`${backendUrl}/article/${articleId}`);
        const fetchedArticle = response.data;
        setArticle({
          title: fetchedArticle.title,
          content: fetchedArticle.content,
          author: fetchedArticle.author,
          image: null,
        });

        if (editor) editor.commands.setContent(fetchedArticle.content || "");
      } catch (err) {
        setError("Failed to fetch article data.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, backendUrl, editor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setArticle((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", article.title);
    formData.append("content", article.content);
    formData.append("author", article.author);
    if (article.image) formData.append("image", article.image);

    try {
      const response = await axios.put(`${backendUrl}/update/${articleId}`, formData);
      if (response.status === 200) {
        alert("Article updated successfully!");
        navigate("/dashboard");
      } else {
        throw new Error("Failed to update the article.");
      }
    } catch (err) {
      setError("An error occurred while updating the article.");
    } finally {
      setLoading(false);
    }
  };

  const renderEditorToolbar = () => (
    <div className="flex items-center gap-2 mb-2 bg-gray-100 p-2 rounded-md shadow">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "text-indigo-600" : ""}
      >
        <FaBold />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "text-indigo-600" : ""}
      >
        <FaItalic />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "text-indigo-600" : ""}
      >
        <FaUnderline />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "text-indigo-600" : ""}
      >
        <FaListUl />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "text-indigo-600" : ""}
      >
        <FaListOl />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "text-indigo-600" : ""}
      >
        <FaAlignLeft />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "text-indigo-600" : ""}
      >
        <FaAlignCenter />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "text-indigo-600" : ""}
      >
        <FaAlignRight />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <FaUndo />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <FaRedo />
      </button>
    </div>
  );
  

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center z-50">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
      </div>
    );
  }

  return (
    <>
      <AdminNavBar />
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50"  onSubmit={handleSubmit}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">
            Edit Article
          </h1>
          <form className="space-y-6">
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

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-900">
                Content
              </label>
              {renderEditorToolbar()}
              <div className="mt-2 border border-gray-300 rounded-md shadow-sm">
                <EditorContent editor={editor} className="p-3 min-h-[200px]" />
              </div>
            </div>

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

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-900">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="image"
                name="image"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md file:py-2 file:px-4 file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
              />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500"
              >
                Update Article
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditArticle;
