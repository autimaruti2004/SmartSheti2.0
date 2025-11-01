import React, { useEffect, useState } from 'react';
import styles from './GovernmentSchemes.module.css';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch('http://localhost:3001/api/applications');
        if (!resp.ok) throw new Error('Failed to fetch applications');
        const data = await resp.json();
        if (mounted) setApplications(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load applications');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Applications</h2>
      {loading && <div>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && !error && applications.length === 0 && (
        <div className={styles.noResults}>No applications submitted yet.</div>
      )}

      <div className={styles.gridCards}>
        {applications.map((app) => (
          <article key={app._id} className={styles.card}>
            <h3 className={styles.schemeName}>{app.schemeName || app.schemeId}</h3>
            <p className={styles.small}><strong>Applicant:</strong> {app.fullName} • {app.phoneNumber} • {app.applicantEmail || app.email}</p>
            <p className={styles.small}><strong>Submitted:</strong> {new Date(app.createdAt).toLocaleString()}</p>
            <p className={styles.small}><strong>Status:</strong> {app.status}</p>
            <p className={styles.small}><strong>Documents:</strong></p>
            <ul className={styles.docsList}>
              {(app.documents || []).map((doc, i) => (
                <li key={i}>
                  <a href={doc.path} target="_blank" rel="noreferrer">{doc.originalName || doc.fileName}</a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
