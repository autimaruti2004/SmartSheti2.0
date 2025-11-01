import React, { useState } from 'react';
import styles from './ChangePassword.module.css';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!currentPwd || !newPwd || !confirmPwd) { setError('All fields are required'); return; }
    if (newPwd.length < 4) { setError('New password must be at least 4 characters'); return; }
    if (newPwd !== confirmPwd) { setError('New password and confirm do not match'); return; }

    setLoading(true);
    try {
      // TODO: Replace with API call to change password using auth token
      await new Promise(res => setTimeout(res, 700));
      setSuccess('Password changed successfully');
      // Optionally sign out after password change
      setTimeout(()=>{ navigate('/signin'); }, 900);
    } catch {
      setError('Failed to change password');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Change Password</h2>
        <p>Account: {user ? user.mobile : '—'}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="password" placeholder="Current password" value={currentPwd} onChange={e=>setCurrentPwd(e.target.value)} />
          <input type="password" placeholder="New password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} />
          <input type="password" placeholder="Confirm new password" value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} />
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
          <button type="submit" className={styles.btn} disabled={loading}>{loading ? 'Saving...' : 'Change Password'}</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
