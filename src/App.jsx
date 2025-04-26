import React from "react";
import { Route, Routes } from "react-router";
import { useState } from "react";

import NavBar from "./components/NavBar/NavBar";
import Homepage from "./components/Homepage/Homepage";
import AboutMe from "./components/AboutMe/AboutMe";
import WorkJourney from "./components/WorkJourney/WorkJourney";
import BookReviewsPage from "./components/BookReviews/BookReviewsPage";
import PersonalReflections from "./components/PersonalReflections/PersonalReflections";
import BookSearch from "./components/BookSearch/BookSearch";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/book-reviews" element={<BookReviewsPage />} />
        <Route path="/work-journey" element={<WorkJourney />} />
        {/* <Route path="/book-search" element={<BookSearch />} /> */}
        <Route path="/personal-reflections" element={<PersonalReflections />} />
        <Route path="*" element={<h2>Page Not Found!</h2>} />
      </Routes>
      <footer className="site-footer">
        <p>© 2025 Ann Wei Ling. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
