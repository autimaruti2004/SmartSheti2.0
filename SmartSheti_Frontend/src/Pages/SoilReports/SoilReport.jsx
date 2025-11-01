import React from "react";
import styles from "./SoilReport.module.css";

const SoilReport = () => {
  // Sample report values matching the attached layout
  return (
    <div className={styles.page}>
      <div className={styles.reportCard}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.reportTitle}>Soil Test Report and Fertilizer Recommendations</h1>
            <div className={styles.metaRow}>
              <div><strong>Name:</strong> Producer</div>
              <div><strong>Sample Date:</strong> April 1, 2007</div>
            </div>
            <div className={styles.metaRow}>
              <div><strong>Lab Number:</strong> 12345</div>
              <div><strong>Your Sample Number:</strong> 1</div>
            </div>
            <div className={styles.metaRow}>
              <div><strong>Crop to be Grown:</strong> Spring Wheat</div>
              <div><strong>Previous Crop:</strong> Fallow</div>
            </div>
            <div className={styles.metaRow}>
              <div><strong>Sampling Depth:</strong> 0 to 24 inches</div>
              <div><strong>Yield Goal:</strong> 50 bu/acre</div>
            </div>
          </div>
        </header>

        <section className={styles.tableSection}>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Soil Test Results</th>
                <th>0-6 in</th>
                <th>6-24 in</th>
                <th>0-24 in</th>
                <th>Interpretation</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nitrate-N</td>
                <td>37 lb/acre</td>
                <td>36 lb/acre</td>
                <td>73 lb/acre</td>
                <td>Medium</td>
                <td>90 lb N/acre</td>
              </tr>
              <tr>
                <td>Olsen Phosphorus</td>
                <td>15 ppm</td>
                <td></td>
                <td></td>
                <td>Medium</td>
                <td>20 lb P2O5/acre</td>
              </tr>
              <tr>
                <td>Potassium</td>
                <td>192 ppm</td>
                <td></td>
                <td></td>
                <td>Medium</td>
                <td>40 lb K2O/acre</td>
              </tr>
              <tr>
                <td>Sulfate-S</td>
                <td>6 lb/acre</td>
                <td>54 lb/acre</td>
                <td>60 lb/acre</td>
                <td>High</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Boron</td>
                <td>0.5 ppm</td>
                <td></td>
                <td></td>
                <td>Medium</td>
                <td>1 lb B/acre</td>
              </tr>
              <tr>
                <td>Copper</td>
                <td>1.7 ppm</td>
                <td></td>
                <td></td>
                <td>Very High</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Iron</td>
                <td>47 ppm</td>
                <td></td>
                <td></td>
                <td>Very High</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Manganese</td>
                <td>10 ppm</td>
                <td></td>
                <td></td>
                <td>Very High</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Zinc</td>
                <td>1.3 ppm</td>
                <td></td>
                <td></td>
                <td>High</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Soluble Salts</td>
                <td>0.3</td>
                <td></td>
                <td></td>
                <td>Low</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Organic Matter</td>
                <td>3.4%</td>
                <td></td>
                <td></td>
                <td>Medium</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Soil pH</td>
                <td>7.7</td>
                <td></td>
                <td></td>
                <td>Medium/High</td>
                <td>—</td>
              </tr>
              <tr>
                <td>CEC</td>
                <td>17.8</td>
                <td></td>
                <td></td>
                <td>Medium</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Soil Texture</td>
                <td>Sandy Loam</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.notes}>
          <h3>Interpretation & Recommendations</h3>
          <p>
            Nitrate-N and available phosphorus are in the medium range. Apply recommended nitrogen and phosphorus
            according to the recommendation column. Organic matter is moderate; continue organic amendments to
            improve soil structure. Monitor pH and manage micronutrients if crop response indicates deficiency.
          </p>
        </section>
      </div>
    </div>
  );
};

export default SoilReport;
