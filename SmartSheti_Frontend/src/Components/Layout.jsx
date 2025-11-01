import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import styles from "./Layout.module.css";

const Layout = () => {
  return (
    <div className={styles.appContainer}>
      <main className={styles.mainContent}>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
