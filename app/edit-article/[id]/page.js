
"use client";

import { useParams, useRouter } from "next/navigation"; 
import EditArticle from "@/components/editArticle"; 


const EditArticlePage = () => {
  //  retrieve dynamic parameters 
  const params = useParams(); 
  // enable navigation 
  const router = useRouter();

  // Access the 'id' parameter 
  const id = params?.id;

  // Check if 'id' is present; 
  if (!id) {
    return <p>Invalid article ID.</p>; 
  }

  // pass the articleId and navigate function as props
  return <EditArticle articleId={id} navigate={router.push} />;
};

export default EditArticlePage;
