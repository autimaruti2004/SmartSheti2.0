import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { auth } from "../../utils/api";

const SignUp = ({ title = "Create Your Account", logoText = "SmartSheti" }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobile: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    if (!formData.name.trim()) return "Please enter your name";
    if (!formData.address.trim()) return "Please enter your address";
    if (!formData.mobile.trim()) return "Please enter your mobile number";
    const digits = formData.mobile.replace(/\D/g, "");
    if (digits.length < 10) return "Please enter a valid 10-digit mobile number";
    if (!formData.password) return "Please enter a password";
    if (formData.password.length < 6) return "Password must be at least 6 characters long";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const data = await auth.register({
        name: formData.name,
        address: formData.address,
        mobile: formData.mobile,
        email: formData.email || undefined,
        gender: formData.gender || undefined,
        password: formData.password
      });

      // Store the JWT token
      localStorage.setItem('token', data.token);
      
      // Set success message
      setSuccessMsg("Account created successfully! Redirecting to login page...");
      
      // Clear form
      setFormData({
        name: "",
        address: "",
        mobile: "",
        email: "",
        gender: "",
        password: "",
        confirmPassword: ""
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
      
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form className={styles.signupBox} onSubmit={handleSubmit}>
        <div className={styles.logo}>{logoText}</div>

        <h2 className={styles.title}>{title}</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className={styles.inputBox}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className={styles.inputBox}
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          className={styles.inputBox}
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email (Optional)"
          className={styles.inputBox}
          value={formData.email}
          onChange={handleChange}
        />

        <select
          name="gender"
          className={styles.inputBox}
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          className={styles.inputBox}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className={styles.inputBox}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <div className={styles.error} role="alert">{error}</div>}
        {successMsg && <div className={styles.success} role="alert">{successMsg}</div>}

        <button className={styles.btn} type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link to="/signin" className={styles.footerLink}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
