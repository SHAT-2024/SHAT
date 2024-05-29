import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import "./WelcomePage.scss";
import { appContext } from "../../../context";
import Mobile3D from "./Mobile3D";
import shatLogo from "../../../Assets/shat-logo.png";
import shatAnmation from "../../../Assets/shatAnmation.gif";
import shatAnmation2 from "../../../Assets/shatAnmation2.gif";
import linkedin from "../../../Assets/linkedin.png";
import GitHub from "../../../Assets/GitHub.png";
import email from "../../../Assets/email.png";
import WMNavBar from "./WPNavBar";

function WelcomePage() {
  
  const targetSectionRef = useRef(null);

  const scrollToSection = () => {
    if (targetSectionRef.current) {
      targetSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="wp-bk">
      <WMNavBar />
      <div className="welcome-page">
        <div>
          <header className="wpHeader">
            <div className="wpHeader-s1">
              <div className="header-elements-flex">
                <p>Welcome to</p>
                <img src={shatLogo} alt="logo"></img>
                <h2>
                  SHAT is a simple Chat app where you can chat with people..
                </h2>
              </div>
              <div class="bk-gradient-1"></div>
            </div>
            <div className="wpHeader-s2">
              <Mobile3D />
            </div>
            <div className="scroll-down" onClick={scrollToSection}>
              <p>&#10095;</p>
            </div>
          </header>

          <section
            className="getting-started"
            ref={targetSectionRef}
            id="targetSection"
          >
            <h3>You can start with very simple steps:</h3>
            <div className="gs-flex">
              <div className="gs-s1">
                <h4>1 Create an account</h4>
                <p>
                  To begin you must <Link to={"/registeration"}>Sign up</Link>{" "}
                  first, then you can search for uesrs and chat with them
                </p>
                <img src={shatAnmation} alt="no matches" />
              </div>
              <div className="gs-s2" style={{ marginTop: "0" }}>
                <h4>2 Start chatting</h4>
                <p>
                  Search for users by their uername, or browse the available
                  users
                </p>
                <img src={shatAnmation2} alt="no matches" />
              </div>
            </div>
          </section>

          <section className="about-section">
            <h3>About the creator</h3>
            <p>
            My name is Sham, I'm a Web developer with almost 2 years of experience. I build functional, user friendly and responsive websites and web applications. To find more about Shat <a className="about-link" href="https://sham-aj-portfolio.vercel.app/allprojects/Shat.1.0.1">click here</a>
            </p>

            <div className="acc-links">
              <a
                href="https://github.com/ShamAhmad2022"
                rel="noreferrer"
                target="_blank"
              >
                <img src={GitHub} alt="Email"></img>
              </a>

              <a href="mailto:shamahmadaljalam@gmail.com">
                <img src={email} alt="Linkedin"></img>
              </a>

              <a
                href="https://www.linkedin.com/in/sham-al-jalam/"
                rel="noreferrer"
                target="_blank"
              >
                <img img src={linkedin} alt="GitHub"></img>
              </a>
            </div>
          </section>
        </div>
      </div>
      <footer className="footer">
        <small>Shat.. Sham AL-Jalam &copy; 2024 </small>
      </footer>
    </div>
  );
}

export default WelcomePage;
