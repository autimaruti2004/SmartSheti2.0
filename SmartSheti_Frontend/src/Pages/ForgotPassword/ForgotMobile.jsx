import React, { useState } from 'react';
import { forgotPasswordMobile } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';

export default function ForgotMobile() {
  const [mobile, setMobile] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await forgotPasswordMobile(mobile);
      const otp = res?.otp; // dev fallback may return OTP
      setMsg('OTP requested. Proceed to verify.');
      navigate('/forgot-password/verify-mobile', { state: { mobile, otp } });
    } catch (err) {
      setMsg(err?.message || 'Failed to request OTP.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>Reset via Mobile (OTP)</h3>
        <form onSubmit={submit}>
          <label className={styles.label}>Mobile (include country code, e.g. +9198...)</label>
          <input className={styles.input} value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+9198xxxxxxx" required />
          <div className={styles.actions}>
            <button type="submit" className={styles.btn} disabled={busy}>{busy ? 'Requesting...' : 'Request OTP'}</button>
            <button type="button" onClick={() => navigate(-1)} className={styles.btnSecondary}>Cancel</button>
          </div>
        </form>
        {msg && <p className={styles.message}>{msg}</p>}
      </div>
    </div>
  );
}