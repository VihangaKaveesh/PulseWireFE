"use client";

import { useParams, useRouter } from "next/navigation";
import EditArticle from "@/components/editArticle";

const EditArticlePage = () => {
  const params = useParams(); // Retrieve dynamic route parameters
  const router = useRouter();

  const id = params?.id; // Access the 'id' parameter from the dynamic route

  if (!id) {
    return <p>Invalid article ID.</p>; // Handle missing ID gracefully
  }

  return <EditArticle articleId={id} navigate={router.push} />;
};

export default EditArticlePage;
