import React from "react";
import "./Home.css";
import Me from "../../assets/profile.jpg";
import HeaderSocials from "./HeaderSocials";
import Shapes from "./Shapes";

const Home = () => {
  return (
    <section className="home container" id="home">
      <div className="intro">
        <img
          src={Me}
          alt=""
          className="home__img"
          width="120"
          style={{ borderRadius: "50%" }}
        />
        <h1 className="home__name">Juan Eduardo Jaramillo</h1>
        <span className="home__education">I'm a Software Engineer</span>

        <HeaderSocials />

        <a href="#contact" className="btn" style={{ backgroundColor: "cyan", color: "black" }}>
          {" "}
          Contact Me
        </a>

      </div>

      <Shapes />
    </section>
  );
};

export default Home;
