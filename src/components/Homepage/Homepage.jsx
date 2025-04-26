import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import { motion } from "framer-motion";
import profilePic from "../../assets/headshot.png";

const sections = [
  {
    title: "About Me",
    to: "/about-me",
    text: `Hi, I’m Ann Wei Ling — a Singaporean currently on a 6-month sabbatical. 
    This space is where I share reflections from this chapter of my life and beyond— from personal thoughts to book reviews and side projects.`,
  },
  {
    title: "Book Reviews",
    to: "/book-reviews",
    text: `I loved reading as a child and am now trying to get back into the hobby. Books are borrowed experiences. 
    This space is where I jot down thoughts on books that moved me, gave me those aha moments, or simply kept me company for a while. 
    Not all reviews are deep dives — some are just notes to self, but they help me remember what I took away from each read.`,
  },
  {
    title: "Personal Reflections",
    to: "/personal-reflections",
    text: ` I believe our character is shaped not just by what we go through, but by how we respond to those experiences. 
    This space is where I pause, reflect, and write down what I’m learning — in the moment. 
    It’s my way of making sense of the journey, and of tracking how I grow and change over the years.`,
  },
  {
    title: "Work Journey",
    to: "/work-journey",
    text: `I didn’t start out with a master plan — just a desire to do work that mattered. 
    Over the years, I’ve found myself navigating different domains: from policy, diplomacy to data and programming. 
    This section traces that journey— with its detours, pivots, and leaps of faith. 
    I’ve come to appreciate that careers rarely move in straight lines — and that’s perfectly okay. 
    I’m thankful for my non-linear career path. `,
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

          {section.title === "About Me" && (
            <img
              src={profilePic}
              alt="Ann Wei Ling"
              className="profile-pic-homepage"
            />
          )}

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
