import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';

export default function ForgotChoice() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Forgot Password</h2>
        <p>Choose a method to reset your password</p>
        <div className={styles.actions} style={{ marginTop: 6 }}>
          <button onClick={() => navigate('/forgot-password/email')} className={styles.btn}>
            By Email
          </button>
          <button onClick={() => navigate('/forgot-password/mobile')} className={styles.btnSecondary}>
            By Mobile (OTP)
          </button>
        </div>
      </div>
    </div>
  );
}