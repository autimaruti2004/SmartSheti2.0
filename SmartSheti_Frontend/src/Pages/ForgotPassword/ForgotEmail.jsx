import React, { useState } from 'react';
import { forgotPasswordEmail } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';

export default function ForgotEmail() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await forgotPasswordEmail(email);
      setMsg(res?.message || 'If the email exists, a reset link was sent.');
    } catch (err) {
      setMsg(err?.message || 'Failed to request reset. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>Reset via Email</h3>
        <form onSubmit={submit}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@domain.com" required />
          <div className={styles.actions}>
            <button type="submit" className={styles.btn} disabled={busy}>{busy ? 'Sending...' : 'Send reset link'}</button>
            <button type="button" onClick={() => navigate(-1)} className={styles.btnSecondary}>Cancel</button>
          </div>
        </form>
        {msg && <p className={styles.message}>{msg}</p>}
      </div>
    </div>
  );
}