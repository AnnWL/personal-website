import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import { motion } from "framer-motion";

const sections = [
  {
    title: "About Me",
    to: "/about-me",
    text: `Hi, I’m Ann Wei Ling — a Singaporean currently on a 6-month sabbatical. 
           This space is where I share reflections from this chapter of my life and beyond— 
           from personal thoughts to book reviews and side projects.`,
  },
  {
    title: "Book Reviews",
    to: "/book-reviews",
    text: `I loved reading as a child and am now trying to get back into the hobby. 
           Books are borrowed experiences. This space is where I jot down thoughts on books 
           that moved me, gave me those aha moments, or simply kept me company for a while.`,
  },
  {
    title: "Personal Reflections",
    to: "/personal-reflections",
    text: `I believe our character is shaped not just by what we go through, 
           but by how we respond to those experiences. This is where I write down what I’m learning.`,
  },
  {
    title: "Work Journey",
    to: "/work-journey",
    text: `I didn’t start with a master plan — just a desire to do work that mattered. 
           This section traces my journey — with detours, pivots, and leaps of faith.`,
  },
];

const HomePage = () => {
  return (
    <div className="homepage-container">
      {sections.map((section, idx) => (
        <motion.section
          className="homepage-section"
          key={section.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
        >
          <h2>{section.title}</h2>
          <p>{section.text}</p>
          <Link to={section.to} className="read-more">
            Read more →
          </Link>
        </motion.section>
      ))}
    </div>
  );
};

export default HomePage;
