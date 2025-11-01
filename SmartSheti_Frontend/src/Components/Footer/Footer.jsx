import React from "react";
import styles from "./Footer.module.css";
import googlePlay from "../../assets/googleplay.jpg";
import appStore from "../../assets/appstore.jpg";
import sfBioActives from "../../assets/SmartSheti-2.png";

const SmartShetiFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h3>Contact us</h3>
          <p>
            <strong>SmartSheti</strong>
          </p>
          <p className={styles.subHeading}>Registered Office:</p>
          <p>
            Gat No 314/1, 314/2/1, A/p XXXX, XXXX ,
            <br />
            District Ahilyanagar, Maharashtra 4143XX, India
          </p>
          <p>
            <strong>CIN:</strong> UXXXXXMH16XXPLCXXXXXX
          </p>
          <p className={styles.subHeading}>Phone:</p>
          <p>1800 XXX XXX XXX</p>
          <p className={styles.subHeading}>Email:</p>
          <p>info@smartsheti.com</p>
        </div>

        <div className={styles.section}>
          <h3>Featured links</h3>
          <ul>
            <li>Our Story</li>
            <li>Meet our Chairman</li>
            <li>Food Safety Standards</li>
            <li>Careers</li>
            <li>Investors</li>
          </ul>
          <img
            src={sfBioActives}
            alt="SF BioActives"
            className={styles.bioLogo}
          />
        </div>

        {/* Help Section */}
        <div className={styles.section}>
          <h3>Help</h3>
          <ul>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
          </ul>
        </div>

        {/* Farmer App Section */}
        <div className={styles.section}>
          <h3>Farmer App</h3>
          <img src={googlePlay} alt="Google Play" className={styles.appImg} />
          <img src={appStore} alt="App Store" className={styles.appImg} />
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© SmartSheti</p>
        <p>@ All rights reserved.</p>
        <div className={styles.socials}></div>
      </div>
    </footer>
  );
};

export default SmartShetiFooter;
