import React from "react";
import "./About.css";
import Image from "../../assets/profile.jpg";
import Resume from "../../assets/resume.pdf";
import AboutBox from "./AboutBox";

const About = () => {
  const downloadResume = async () => {
    window.open(Resume, "_blank");
  };

  return (
    <section className="about container section" id="about">
      <h2 className="section__title">About Me </h2>

      <div className="about__container grid">
        <img
          src={Image}
          alt=""
          className="about__img"
          style={{ borderRadius: "50%", width: "150px", height: "150px" }}
        />

        <div className="about__data grid">
          <div className="about__info">
            <p className="about__description">
              Hi! My name is Juan Eduardo and I live in Cali, Colombia. I study
              at the Universidad Autónoma de Occidente, where I am finishing my
              bachelor's degree in Computer Engineering. <br />
              <br />
              Today, I can honestly say that it has been a wonderful journey and
              I hope to continue growing as a software engineer. Currently, my
              goal is to expand my portfolio by creating more projects that I
              can add here.
              <br />
              <br />
              Here are a few technologies I’ve been working with recently:
            </p>
            <ul className="about__list">
              <li>JavaScript</li>
              <li>TypeScript</li>
              <li>React</li>
              <li>Node.js</li>
              <li>Firebase</li>
              <li>MongoDB</li>
            </ul>
            <button className="btn" onClick={downloadResume}>
              Download CV
            </button>
          </div>
          <br />
          <div className="about__skills grid">
            <div className="skills__data">
              <div className="skills__titles">
                <h3 className="skills__name">Development</h3>
                <span className="skills__number">75%</span>
              </div>

              <div className="skills__bar">
                <span className="skills__percentage development"></span>
              </div>
            </div>

            <div className="skills__data">
              <div className="skills__titles">
                <h3 className="skills__name">Frontend</h3>
                <span className="skills__number">80%</span>
              </div>

              <div className="skills__bar">
                <span className="skills__percentage frontend"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AboutBox />
    </section>
  );
};

export default About;
