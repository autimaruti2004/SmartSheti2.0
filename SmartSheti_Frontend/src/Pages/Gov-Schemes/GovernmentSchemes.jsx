import React, { useMemo, useState, useEffect } from 'react';
import styles from './GovernmentSchemes.module.css';
import { schemes as schemesApi } from '../../utils/api';

const fallbackSchemes = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Scheme',
    description: 'Income support scheme providing financial assistance to land-holding farmer families across India.',
    eligibility: 'Small and marginal farmer families with cultivable land',
    benefit: 'Direct income support of ₹6000 per year in three equal installments',
    documents: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
    status: 'Active'
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Comprehensive crop insurance scheme to protect farmers from crop losses due to natural calamities.',
    eligibility: 'All farmers growing notified crops in notified areas',
    benefit: 'Insurance coverage and financial support in case of crop failure',
    documents: ['Land Records', 'Bank Account', 'Aadhaar Card'],
    status: 'Active'
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card Scheme',
    description: 'Provides farmers with timely access to credit for their agricultural needs.',
    eligibility: 'All farmers, sharecroppers, and agricultural laborers',
    benefit: 'Credit up to ₹3 lakh at low interest rates',
    documents: ['ID Proof', 'Land Records', 'Passport Size Photo'],
    status: 'Active'
  },
  {
    id: 'soil-health',
    name: 'Soil Health Card Scheme',
    description: 'Provides information to farmers on nutrient status of their soil and recommendation on fertilizer use.',
    eligibility: 'All farmers with agricultural land',
    benefit: 'Free soil testing and fertilizer recommendations',
    documents: ['Land ownership documents', 'Farmer ID'],
    status: 'Active'
  },
  {
    id: 'pmksy',
    name: 'Pradhan Mantri Krishi Sinchai Yojana',
    description: 'Ensures access to means of irrigation to all agricultural farms to improve productivity.',
    eligibility: 'Farmers needing irrigation facilities',
    benefit: 'Subsidies for irrigation equipment and infrastructure',
    documents: ['Land Documents', 'Bank Account', 'Aadhaar Card'],
    status: 'Active'
  },
  {
    id: 'nfsm',
    name: 'National Food Security Mission',
    description: 'Aims to increase production of rice, wheat, pulses, and other crops through area expansion and productivity enhancement.',
    eligibility: 'Farmers in selected districts growing target crops',
    benefit: 'Subsidies on seeds, machinery, and training support',
    documents: ['Farmer Registration Card', 'Land Documents'],
    status: 'Active'
  },
  {
    id: 'pkvy',
    name: 'Paramparagat Krishi Vikas Yojana',
    description: 'Promotes organic farming and helps farmers in certification and marketing of organic products.',
    eligibility: 'Farmers willing to adopt organic farming',
    benefit: 'Financial assistance of ₹50,000 per hectare for organic farming',
    documents: ['Land Records', 'Bank Account Details'],
    status: 'Active'
  },
  {
    id: 'agri-infra',
    name: 'Agriculture Infrastructure Fund',
    description: 'Provides medium to long term financing for agriculture infrastructure projects.',
    eligibility: 'Farmers, FPOs, Agri entrepreneurs, and rural entrepreneurs',
    benefit: 'Loans up to ₹2 crore with interest subvention',
    documents: ['Project Proposal', 'KYC Documents', 'Land Documents'],
    status: 'Active'
  },
  {
    id: 'e-nam',
    name: 'Electronic National Agriculture Market',
    description: 'Online trading platform for agricultural commodities to get better price discovery.',
    eligibility: 'All farmers can sell their produce on eNAM',
    benefit: 'Direct access to national market and better prices',
    documents: ['Identity Proof', 'Bank Account', 'Mobile Number'],
    status: 'Active'
  },
  {
    id: 'midh',
    name: 'Mission for Integrated Development of Horticulture',
    description: 'Promotes holistic growth of horticulture sector through area based regionally differentiated strategies.',
    eligibility: 'Farmers involved in horticulture cultivation',
    benefit: 'Subsidies for nursery development, cultivation, and post-harvest management',
    documents: ['Land Records', 'Bank Account', 'Identity Proof'],
    status: 'Active'
  }
];

export default function GovernmentSchemes() {
  const [query, setQuery] = useState('');
  const [schemes, setSchemes] = useState(fallbackSchemes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    landArea: '',
    aadharNumber: '',
    bankAccountNumber: '',
    ifscCode: '',
    documents: []
  });

  const handleApply = (scheme) => {
    setSelectedScheme(scheme);
    setShowApplicationModal(true);
  };

  const handleCloseModal = () => {
    setShowApplicationModal(false);
    setSelectedScheme(null);
    setApplicationForm({
      fullName: '',
      email: '',
      phoneNumber: '',
      address: '',
      landArea: '',
      aadharNumber: '',
      bankAccountNumber: '',
      ifscCode: '',
      documents: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setApplicationForm(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    // Here you would typically send the application to your backend
    try {
      // Create a FormData object to send files
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(applicationForm).forEach(key => {
        if (key !== 'documents') {
          formData.append(key, applicationForm[key]);
        }
      });
      
      // Add documents
      applicationForm.documents.forEach((file, index) => {
        formData.append(`document_${index}`, file);
      });
      
      // Add scheme ID
      formData.append('schemeId', selectedScheme.id || selectedScheme.name);
      formData.append('schemeName', selectedScheme.name);

      // POST to backend
      const resp = await fetch('http://localhost:3001/api/applications', {
        method: 'POST',
        body: formData
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to submit application');
      }

      const result = await resp.json();
      // On success, close modal and optionally redirect to applications page
      alert('Application submitted successfully!');
      handleCloseModal();
      // navigate to My Applications (user can view their submissions)
      if (window && window.location) window.location.href = '/my-applications';
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(`Failed to submit application. ${error?.message || ''}`);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await schemesApi.getSchemes();
        if (mounted && data) {
          const arr = Array.isArray(data) ? data : data.value || data.schemes || [];
          setSchemes(arr);
        }
      } catch (err) {
        console.warn('Failed to fetch schemes from backend, using fallback', err);
        // store actual error message to help debugging
        setError(err?.message || 'Unable to load schemes from server');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const reloadSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await schemesApi.getSchemes();
      const arr = Array.isArray(data) ? data : data.value || data.schemes || [];
      setSchemes(arr);
    } catch (err) {
      console.error('Retry failed:', err);
      setError(err?.message || 'Unable to load schemes from server');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return schemes;
    return schemes.filter(s =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q) ||
      (s.eligibility || '').toLowerCase().includes(q)
    );
  }, [query, schemes]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Available Schemes for Farmers</h2>

      <div className={styles.controls}>
        <input
          aria-label="Search schemes"
          placeholder="Search by scheme name, description, or eligibility"
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.count}>{filtered.length} Results</div>
      </div>

      {loading && <div className={styles.loading}>Loading schemes...</div>}
      {error && (
        <div className={styles.error}>
          <div>Error: {error}</div>
          <div style={{ marginTop: 8 }}>
            <button className={styles.applyBtn} onClick={reloadSchemes}>Retry</button>
          </div>
        </div>
      )}

      <div className={styles.gridCards}>
        {filtered.map((scheme, idx) => (
          <article key={idx} className={styles.card} aria-labelledby={`scheme-${idx}`}>
            <h3 id={`scheme-${idx}`} className={styles.schemeName}>{scheme.name}</h3>
            <p className={styles.small}><strong>Description:</strong> {scheme.description}</p>
            <p className={styles.small}><strong>Eligibility:</strong> {scheme.eligibility}</p>
            <p className={styles.small}><strong>Benefits:</strong> {scheme.benefit}</p>
            <p className={styles.small}><strong>Required Documents:</strong></p>
            <ul className={styles.docsList}>
              {(scheme.documents || []).map((doc, j) => <li key={j}>{doc}</li>)}
            </ul>

            <div className={styles.cardFooter}>
              <button
                className={styles.applyBtn}
                onClick={() => handleApply(scheme)}
                aria-disabled={scheme.status !== 'Active'}
                disabled={scheme.status !== 'Active'}
              >
                📝 Apply Now
              </button>

              <span className={`${styles.status} ${scheme.status === 'Active' ? styles.statusActive : styles.statusNone}`}>
                {scheme.status || 'Not Available'}
              </span>
            </div>
          </article>
        ))}
      </div>
      
      {showApplicationModal && selectedScheme && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Apply for {selectedScheme.name}</h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmitApplication} className={styles.applicationForm}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={applicationForm.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={applicationForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={applicationForm.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="address">Address:</label>
                <textarea
                  id="address"
                  name="address"
                  value={applicationForm.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="landArea">Land Area (in acres):</label>
                <input
                  type="number"
                  id="landArea"
                  name="landArea"
                  value={applicationForm.landArea}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="aadharNumber">Aadhar Number:</label>
                <input
                  type="text"
                  id="aadharNumber"
                  name="aadharNumber"
                  value={applicationForm.aadharNumber}
                  onChange={handleInputChange}
                  pattern="[0-9]{12}"
                  title="Please enter a valid 12-digit Aadhar number"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="bankAccountNumber">Bank Account Number:</label>
                <input
                  type="text"
                  id="bankAccountNumber"
                  name="bankAccountNumber"
                  value={applicationForm.bankAccountNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="ifscCode">IFSC Code:</label>
                <input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  value={applicationForm.ifscCode}
                  onChange={handleInputChange}
                  pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                  title="Please enter a valid IFSC code"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Required Documents:</label>
                <ul className={styles.documentList}>
                  {selectedScheme.documents.map((doc, index) => (
                    <li key={index}>
                      <span>{doc}</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        required
                      />
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
