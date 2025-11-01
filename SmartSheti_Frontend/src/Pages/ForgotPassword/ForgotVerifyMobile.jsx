import React, { useState } from 'react';
import { verifyMobileOTP } from '../../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';

export default function ForgotVerifyMobile() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { mobile, otp: devOtp } = location.state || {};

  if (!mobile) {
    navigate('/forgot-password');
    return null;
  }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await verifyMobileOTP(mobile, otp, newPassword);
      setMsg('Password successfully reset!');
      setTimeout(() => navigate('/signin'), 1500);
    } catch (err) {
      setMsg(err?.message || 'Failed to verify OTP.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>Verify Mobile OTP</h3>
        {devOtp && <p className={styles.devNote}>Dev mode OTP: {devOtp}</p>}
        <form onSubmit={submit}>
          <div>
            <label className={styles.label}>Enter 6-digit OTP sent to {mobile}</label>
            <input className={styles.input} value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} required placeholder="123456" />
          </div>
          <div className={styles.actions}>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>New Password</label>
              <input className={styles.input} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
          </div>
          <div className={styles.actions} style={{ marginTop: 12 }}>
            <button type="submit" className={styles.btn} disabled={busy}>{busy ? 'Verifying...' : 'Verify & Reset'}</button>
            <button type="button" onClick={() => navigate(-1)} className={styles.btnSecondary}>Back</button>
          </div>
        </form>
        {msg && <p className={styles.message}>{msg}</p>}
      </div>
    </div>
  );
}