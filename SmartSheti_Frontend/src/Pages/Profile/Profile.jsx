import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Profile</h2>
        {user ? (
          <div className={styles.info}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
          </div>
        ) : (
          <p>No user data. Please sign in.</p>
        )}

        <div className={styles.actions}>
          <button onClick={() => navigate('/change-password')} className={styles.btn}>Change Password</button>
          <button onClick={handleLogout} className={styles.btnOutline}>Sign out</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
