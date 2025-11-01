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
    countryCode: '+91',
    mobile: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });

  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  // fetch districts from backend on mount
  React.useEffect(() => {
    let mounted = true;
    import('../../utils/api').then(({ locations }) => {
      locations.getDistricts().then(d => {
        if (!mounted) return;
        setDistricts(d.districts || []);
      }).catch(err => {
        console.warn('Failed to load districts', err);
      });
    });
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    handleChange(e); // update formData.district
    // fetch subdistricts from backend
    if (district) {
      import('../../utils/api').then(({ locations }) => {
        locations.getSubdistricts(district).then(res => {
          const subs = res.subdistricts || [];
          setSubdistricts(subs);
          setVillages([]);
          setFormData(prev => ({ ...prev, subDistrict: '', village: '' }));
        }).catch(err => {
          console.warn('Failed to fetch subdistricts', err);
          setSubdistricts([]);
          setVillages([]);
        });
      });
    } else {
      setSubdistricts([]);
      setVillages([]);
    }
  };

  const handleSubdistrictChange = (e) => {
    const sub = e.target.value;
    handleChange(e);
    const district = formData.district;
    if (district && sub) {
      import('../../utils/api').then(({ locations }) => {
        locations.getVillages(district, sub).then(res => {
          setVillages(res.villages || []);
          setFormData(prev => ({ ...prev, village: '' }));
        }).catch(err => {
          console.warn('Failed to fetch villages', err);
          setVillages([]);
        });
      });
    } else {
      setVillages([]);
    }
  };

  const validate = () => {
    if (!formData.name.trim()) return "Please enter your name";
    if (!formData.address.trim()) return "Please enter your address";
    if (!formData.mobile.trim()) return "Please enter your mobile number";
    const digits = (formData.countryCode + formData.mobile).replace(/\D/g, "");
    if (digits.length < 10) return "Please enter a valid mobile number with country code";
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
        mobile: `${formData.countryCode}${formData.mobile}`,
        email: formData.email || undefined,
        gender: formData.gender || undefined,
        district: formData.district || undefined,
        subDistrict: formData.subDistrict || undefined,
        village: formData.village || undefined,
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
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
            className={styles.inputBox}
            style={{ width: 140 }}
          >
            <option value="+91">India (+91)</option>
            <option value="+1">USA (+1)</option>
            <option value="+44">UK (+44)</option>
            <option value="+61">Australia (+61)</option>
          </select>
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            className={styles.inputBox}
            value={formData.mobile}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
        </div>
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

        {/* Location selectors */}
        <select
          name="district"
          className={styles.inputBox}
          value={formData.district || ''}
          onChange={handleDistrictChange}
        >
          <option value="">Select District</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          name="subDistrict"
          className={styles.inputBox}
          value={formData.subDistrict || ''}
          onChange={handleSubdistrictChange}
          disabled={subdistricts.length === 0}
        >
          <option value="">Select Sub-district</option>
          {subdistricts.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          name="village"
          className={styles.inputBox}
          value={formData.village || ''}
          onChange={handleChange}
          disabled={villages.length === 0}
        >
          <option value="">Select Village</option>
          {villages.map(v => <option key={v} value={v}>{v}</option>)}
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
