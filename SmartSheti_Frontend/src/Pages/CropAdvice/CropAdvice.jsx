import React, { useState } from "react";
import styles from "./CropAdvice.module.css";

const CropAdvice = () => {
  const [selectedCrop, setSelectedCrop] = useState("Wheat");

  const advice = {
    Wheat: {
      season: "Rabi (Nov–Dec)",
      irrigation: "Adequate irrigation required every 15 days.",
      fertilizer: "Use NPK 4:2:1 (100 kg/ha).",
      pests: "Monitor for rust and aphids.",
      tip: "Ensure good seed quality and proper soil aeration."
    },
    Cotton: {
      season: "Kharif (May–June)",
      irrigation: "Moderate irrigation, avoid waterlogging.",
      fertilizer: "NPK 5:10:10 and organic manure.",
      pests: "Watch for bollworm and whitefly.",
      tip: "Use pest-resistant hybrid varieties."
    },
    Maize: {
      season: "Kharif (June–July)",
      irrigation: "Light irrigation every 7–10 days.",
      fertilizer: "Use Urea and DAP as per soil test report.",
      pests: "Control stem borer using neem extract.",
      tip: "Maintain row spacing of 60 cm × 25 cm."
    },
    Soybean: {
      season: "Kharif (June–July)",
      irrigation: "Rainfed, supplementary irrigation if dry.",
      fertilizer: "NPK 3:4:2 with Rhizobium inoculation.",
      pests: "Look out for leaf roller and stem fly.",
      tip: "Harvest when 90% pods are mature."
    },
  };

  const current = advice[selectedCrop];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Crop Advice</h2>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className={styles.dropdown}
        >
          {Object.keys(advice).map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>

        <div className={styles.details}>
          <p><strong>Season:</strong> {current.season}</p>
          <p><strong>Irrigation:</strong> {current.irrigation}</p>
          <p><strong>Fertilizer:</strong> {current.fertilizer}</p>
          <p><strong>Pest Management:</strong> {current.pests}</p>
          <p><strong>Expert Tip:</strong> {current.tip}</p>
        </div>
      </div>
    </div>
  );
};

export default CropAdvice;
