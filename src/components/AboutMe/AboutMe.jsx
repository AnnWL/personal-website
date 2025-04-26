import React, { useState, useEffect } from "react";
import "./AboutMe.css";
import profilePic from "../../assets/headshot.png";

const AboutMe = () => {
  const descriptors = [
    "a daughter.",
    "a data scientist.",
    "a wife.",
    "a public servant.",
    "a lifelong learner.",
    "an avid reader.",
    "a craft hobbyist.",
    "a friend.",
    "a data worker.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % descriptors.length);
    }, 1500);

    return () => clearInterval(intervalId);
  }, [descriptors.length]);

  return (
    <div className="about-wrapper">
      <div className="about-left">
        <h1 className="about-heading">
          Hi, I’m Ann Wei Ling,
          <br /> {descriptors[currentIndex]}
        </h1>
        <p>
          I’m a Singaporean data scientist working in the public sector. I’m
          currently on a 6-month sabbatical, taking time off to focus on
          undergoing IVF, while also picking up software engineering skills.
        </p>
        <p>
          My husband and I got married in 2021 and began our IVF journey in the
          second half of 2024. It’s been an emotional and physically demanding
          experience — but also a deeply meaningful one. I decided to use this
          space to document some of my thoughts and reflections during this
          sabbatical — otherwise, I know how easily time can slip away.
          <br />
          <a href="/personal-reflections">Read my personal reflections</a>
        </p>
        <p>
          Outside of classes and medical appointments, I’ve been leaning into
          the things I love: reading, crocheting, and exploring anything
          handmade. I’m also carving out time to travel, relax, and journal.
          <br />
          <a href="/book-reviews">Browse my book reviews</a>
        </p>
        <p>
          Curious how I ended up as a data scientist in the public sector?
          <br />
          <a href="/work-journey">Read my work journey here</a>
        </p>
      </div>
      <div className="about-right">
        <img src={profilePic} alt="Ann Wei Ling" className="profile-pic" />
      </div>
    </div>
  );
};

export default AboutMe;
