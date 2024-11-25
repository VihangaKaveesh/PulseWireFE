"use client"

import Dashboard from "@/components/Dashboard";
import EditArticle from "@/components/editArticle";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editArticle" element={<EditArticle/>} />
      </Routes>
    </Router>
  );
}

export default App;
