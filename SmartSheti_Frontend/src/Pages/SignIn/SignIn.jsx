import React, { useState } from "react";
import styles from "./SignIn.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { auth } from "../../utils/api";

// Contract:
// - Inputs: mobile (string), password (string)
// - Outputs: on success set global auth and redirect to home
// - Errors: shows validation or network error messages

const SignIn = ({ title = "Sign in to your account", logoText = "SmartSheti" }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState('+91');
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!mobile.trim()) return "Please enter your mobile number";
    // combine country code and mobile for validation
    const combined = (countryCode + mobile).replace(/\D/g, "");
    if (combined.length < 10) return "Please enter a valid mobile number with country code";
    if (!password) return "Please enter your password";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
  // send mobile with selected country code
  const fullMobile = `${countryCode}${mobile}`;
  const data = await auth.login(fullMobile, password);

      // Store the JWT token
      if (data && data.token) localStorage.setItem('token', data.token);

      // Store remember me preference if checked
      if (remember) {
        localStorage.setItem("SmartSheti_remember", "1");
      }

      // Set the user data from the backend response
      if (data && data.user) login(data.user);

      // Try to fetch full profile and update
      try {
        const profileData = await auth.getProfile();
        if (profileData && profileData.user) login(profileData.user);
      } catch {
        // ignore profile fetch errors (user still logged in)
      }

      // redirect to home or dashboard
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginBox} onSubmit={handleSubmit} aria-labelledby="signin-title">
        <div className={styles.logo} aria-hidden>
          {logoText}
        </div>
        <h2 id="signin-title" className={styles.title}>
          {title}
        </h2>

        <label className={styles.label} htmlFor="mobile">Mobile number</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            aria-label="country code"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className={styles.inputBox}
            style={{ width: 120 }}
          >
            <option value="+91">India (+91)</option>
            <option value="+1">USA (+1)</option>
            <option value="+44">UK (+44)</option>
            <option value="+61">Australia (+61)</option>
          </select>
          <input
            id="mobile"
            name="mobile"
            inputMode="numeric"
            autoComplete="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            type="text"
            placeholder="Mobile No"
            className={styles.inputBox}
            style={{ flex: 1 }}
          />
        </div>

        <label className={styles.label} htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className={styles.inputBox}
        />

        <div className={styles.row}>
          <label className={styles.remember}><input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} /> Remember me</label>
          <Link to="/forgot-password" className={styles.footerLink}>Forgot Password</Link>
        </div>

        {error && <div className={styles.error} role="alert" aria-live="assertive">{error}</div>}

        <button className={styles.btn} type="submit" disabled={loading}>
          {loading ? (
            <>
              Logging in<span className={styles.spinner} aria-hidden></span>
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className={styles.footerText}>
          Don’t have an account? <Link to="/signup" className={styles.footerLink}>Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
