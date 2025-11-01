import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages//HomePage/Home";
import Weather from "./Pages/Weather/Weather";
import SoilReport from "./Pages/SoilReports/SoilReport";
import CropAdvice from "./Pages/CropAdvice/CropAdvice";
import GovernmentSchemes from "./Pages/Gov-Schemes/GovernmentSchemes";
import MyApplications from "./Pages/Gov-Schemes/MyApplications";
import MarketPrice from "./Pages/MarketPrice/MarketPrice";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import Profile from "./Pages/Profile/Profile";
import ChangePassword from "./Pages/Profile/ChangePassword";
import Footer from "./Components/Footer/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/soilreport" element={<SoilReport />} />
          <Route path="/cropadvice" element={<CropAdvice />} />
          <Route path="/gov-schemes" element={<GovernmentSchemes />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/market" element={<MarketPrice />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default App;
