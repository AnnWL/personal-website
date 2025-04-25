import React from "react";
import "./AboutMe.css";

const AboutMe = () => {
  return (
    <div className="about-container">
      <h1 className="about-heading">Hi, I’m Ann Wei Ling</h1>
      <p>
        I’m a Singaporean data scientist working in the public sector. I’m
        currently on a 6-month sabbatical, taking time off to focus on
        undergoing IVF, while also picking up software engineering skills
        through a course.
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
        Outside of classes and medical appointments, I’ve been leaning into the
        things I love: reading, crocheting, and exploring anything handmade. I’m
        also carving out time to travel, relax, and journal.
        <br />
        <a href="/book-reviews">Browse my book reviews</a>
      </p>
      <p>
        Curious how I ended up as a data scientist in the public sector?
        <br />
        <a href="/work-journey">Read my work journey here</a>
      </p>
    </div>
  );
};

export default AboutMe;
