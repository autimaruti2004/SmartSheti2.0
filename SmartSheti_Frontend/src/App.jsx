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
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import ForgotChoice from "./Pages/ForgotPassword/ForgotChoice";
import ForgotEmail from "./Pages/ForgotPassword/ForgotEmail";
import ForgotMobile from "./Pages/ForgotPassword/ForgotMobile";
import ForgotVerifyMobile from "./Pages/ForgotPassword/ForgotVerifyMobile";

const App = () => {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
          <Route path="/soilreport" element={<ProtectedRoute><SoilReport /></ProtectedRoute>} />
          <Route path="/cropadvice" element={<ProtectedRoute><CropAdvice /></ProtectedRoute>} />
          <Route path="/gov-schemes" element={<ProtectedRoute><GovernmentSchemes /></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
          <Route path="/market" element={<ProtectedRoute><MarketPrice /></ProtectedRoute>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotChoice />} />
          <Route path="/forgot-password/email" element={<ForgotEmail />} />
          <Route path="/forgot-password/mobile" element={<ForgotMobile />} />
          <Route path="/forgot-password/verify-mobile" element={<ForgotVerifyMobile />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default App;
