import React, { useState, useEffect, useRef } from "react";

const TypingText = ({ text, speed = 50, tag = "p", className = "" }) => {
  const [index, setIndex] = useState(0);
  const [startTyping, setStartTyping] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartTyping(true);
          observer.disconnect(); // Only trigger once
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!startTyping) return; // Do nothing until startTyping is true
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, speed, text, startTyping]);

  const Tag = tag;

  return (
    <Tag className={className} ref={ref}>
      {text.slice(0, index)}
    </Tag>
  );
};

export default TypingText;
