import React from "react";
import "./WorkJourney.css";

const WorkJourney = () => {
  return (
    <div className="work-container">
      <h1 className="section-heading">Work Journey</h1>

      <section>
        <h2>NUS Statistics (2006–2011)</h2>
        <p>
          I’ve always found comfort in numbers. There was something satisfying
          about how clear-cut it all was — as long as I put in the work to
          understand the concepts and practise, results would follow. This led
          me to read statistics in school. My final-year project involved
          projecting child mortality rates to identify countries at risk of
          missing the UN’s Millennium Development Goals. This experience sparked
          my interest in making meaningful contributions to society, which
          ultimately led me to pursue a career in the public sector.
        </p>
      </section>

      <section>
        <h2>
          Ministry of Trade and Industry — North East Asia Division (2011–2015)
        </h2>
        <p>
          I started off working on the Suzhou Industrial Park portfolio before
          moving on to help launch Singapore’s 3rd Government to Government
          Collaboration with China - the Chongqing Connectivity Initiative (CCI)
          project in 2013. Those years were intense — I still joke with
          ex-colleagues that I could never go back to the way we worked back
          then. Endless staffing, red-eye flights, and a particularly
          unforgettable meeting at China’s Ministry of Commerce (MOFCOM) that
          ran until 5am the next day.
          <br />
          Despite the long hours, the work was fulfilling and exciting — I got
          to witness the early stages of a key project from concept to launch,
          and had the privilege of being at the forefront of several high-level
          meetings. I still remember the moment our leaders signed the MOU to
          officially launch the CCI during Xi’s State Visit to Singapore in Nov
          2014 — it felt like everything we’d poured into the project had come
          full circle. That said, I was also feeling a tad consumed with work by
          then, and decided it was time for a break.
        </p>
      </section>

      <section>
        <h2>At the Five-Year Mark: Sabbatical (2H 2015)</h2>
        <p>
          At the end of the fifth year into the corporate world, I found myself
          asking: What is God’s calling for me? Am I truly living it out? I took
          my first sabbatical — a month in the U.S. with my aunt, a three-month
          ministry programme at Tung Ling Bible School, and a month in France
          visiting a friend.
          <br />
          During that time, I reflected on God’s calling. Through the programme
          and books I read, I was reminded that our primary calling as
          Christians is to love God and His people. Beyond that, I’ve come to
          believe that God honours our talents and desires, using our
          experiences to shape us for His purposes. Work still needs to be
          meaningful, but I now know it can’t be the be-all and end-all.
        </p>
      </section>

      <section>
        <h2>MTI Energy Division (2016–2019)</h2>
        <p>
          The numbers itch never quite went away, so I chose a posting in the
          Energy Division, hoping to take on more quantitative work. My main
          responsibilities included projecting Singapore’s energy demand and
          working on energy infrastructure financing — think LNG terminals and
          long-term supply planning.
          <br />
          Work-life balance was a lot better in ED (we were, after all, voted
          the happiest division in MTI in a HR survey one year 😛). Still, I
          found myself craving deeper quantitative work and wanted to sharpen my
          skills. So I took the plunge and enrolled in a full-time data science
          bootcamp to make a proper shift into a data-driven role.
        </p>
        <br />
        <p>Met my future husband here!</p>
      </section>

      <section>
        <h2>General Assembly – Data Science Immersive Bootcamp (2H 2019)</h2>
        <p>
          I enjoyed the pace and structure of learning again, though it came
          with its share of self-doubt — especially stepping into a new field in
          my early 30s. It was a season of intense hustle, shared with
          like-minded classmates equally determined to make the leap into data
          science.
        </p>
      </section>

      <section>
        <h2>GovTech – Data Science & AI Division (2020–2025)</h2>
        <p>
          Found myself wearing multiple hats, working across different domains
          including data science and AI, data management and sales person. My
          background in policy helped bridge technical work with real-world
          impact, especially when navigating stakeholder needs and defining
          success metrics.
          <br />
          Key areas included data governance, agile delivery (Scrum), and early
          adoption of large language models (LLMs). Across projects, the
          consistent focus was on delivering meaningful, measurable outcomes.
        </p>
      </section>

      <section>
        <h2>GA Software Engineering Immersive (1H 2025)</h2>
        <p>
          I decided to take up software engineering to round out my skill set —
          and I’m thankful for supportive bosses. I’m currently midway through
          the course and loving it. Our first project was a game, and it was
          wicked fun.
          <br />
          Compared to data science, software engineering feels more immediate —
          you can start building right away, without the initial overhead of
          finding and cleaning data. It’s a refreshing, creative change of pace.
          Who knows — maybe one day I’ll build my own indie Pokémon game. 😛
        </p>
      </section>

      <section className="card-section">
        <h3>Skills</h3>
        <div className="card-grid">
          {[
            "Python",
            "AWS",
            "JavaScript",
            "HTML",
            "CSS",
            "React",
            "Scrum",
            "MongoDB",
            "Figma",
            "Tableau",
            "Docker",
          ].map((skill) => (
            <div className="card" key={skill}>
              {skill}
            </div>
          ))}
        </div>

        <h3>Projects</h3>
        <div className="card-grid">
          <div className="card">DebbyGotcha!</div>
          {/* Add more projects here if needed */}
        </div>
      </section>
    </div>
  );
};

export default WorkJourney;
