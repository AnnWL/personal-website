import React from "react";
import { Route, Routes } from "react-router";

import NavBar from "./components/NavBar/NavBar";
import Homepage from "./components/Homepage/Homepage";
import AboutMe from "./components/AboutMe/AboutMe";
import WorkJourney from "./components/WorkJourney/WorkJourney";
import BookReviewsMeta from "./components/BookReviewsMeta/BookReviewsMeta";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ReviewDetail from "./components/BookReviewDetails/BookReviewDetails";
import AdminPanel from "./components/Admin/AdminPage";
import BookEditor from "./components/BookEditor/BookEditor";
// import PersonalReflections from "./components/PersonalReflections/PersonalReflections";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/work-journey" element={<WorkJourney />} />
        {/* <Route path="/personal-reflections" element={<PersonalReflections />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-reviews" element={<BookReviewsMeta />} />
        <Route path="/book-editor" element={<BookEditor />} />
        <Route path="/book-reviews/:id" element={<ReviewDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<h2>Page Not Found!</h2>} />
      </Routes>
      <footer className="site-footer">
        <p>© 2025 Ann Wei Ling. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
