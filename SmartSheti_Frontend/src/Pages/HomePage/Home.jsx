import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Footer from "../../Components/Footer/Footer";

import weatherImg from "../../assets/weatherbg.jpg";
import soilImg from "../../assets/soilreport.jpg";
import cropImg from "../../assets/cropadvice.jpg";
import schemeImg from "../../assets/gov-schemes.jpg";
import marketImg from "../../assets/Market1.png";
import maharashtraMap from "../../assets/maharashtra.svg";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Weather",
      desc: "Check current weather and rainfall forecasts.",
      variant: "weather",
      path: "/weather",
      img: weatherImg,
    },
    {
      title: "Soil Report",
      desc: "Get soil health and analysis reports.",
      variant: "soil",
      path: "/soilreport",
      img: soilImg,
    },
    {
      title: "Crop Advice",
      desc: "Find best crops to grow in your region.",
      variant: "crop",
      path: "/cropadvice",
      img: cropImg,
    },
    {
      title: "Gov. Schemes",
      desc: "Know about latest government schemes and subsidies.",
      variant: "scheme",
      path: "/gov-schemes",
      img: schemeImg,
    },
    {
      title: "Market Price",
      desc: "Check latest mandi and market prices for crops.",
      variant: "market",
      path: "/market",
      img: marketImg,
    },
  ];

  // Weather state (example using Open-Meteo - no API key required)
  const [weatherData, setWeatherData] = useState(null);
  useEffect(() => {
    // Default to Pune (lat/lon) as an example; you can replace with dynamic location
    const lat = 18.5204;
    const lon = 73.8567;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.current_weather) setWeatherData(data.current_weather);
      })
      .catch(() => {
        // ignore fetch errors for now; UI will show fallback
      });
  }, []);

  // Sample data for schemes and market (replace with API/data source as needed)
  const sampleSchemes = [
    { name: "PM-KISAN", desc: "Income support to farmers - ₹6000/year." },
    { name: "PMFBY", desc: "Crop insurance scheme for farmers." },
  ];

  const sampleMarket = [
    { crop: "Wheat", mandi: "Pune", price: "₹2200/qtl" },
    { crop: "Rice", mandi: "Nagpur", price: "₹2400/qtl" },
  ];

  return (
    <>
      {/* Hero map under navbar */}
      <div className={styles.hero} role="region" aria-label="Maharashtra map">
        <img src={maharashtraMap} alt="Maharashtra map" className={styles.mapImage} />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>SmartSheti — Maharashtra</h1>
          <p className={styles.heroSubtitle}>Local weather, soil reports, market prices and schemes — all in one place.</p>
          <div className={styles.heroCtas}>
            <button className={styles.primaryBtn} onClick={() => navigate('/soilreport')}>View Soil Report</button>
            <button className={styles.secondaryBtn} onClick={() => navigate('/gov-schemes')}>Explore Schemes</button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <h2 className={styles.title}>SmartSheti Dashboard</h2>
        <p className={styles.subtitle}>
          Explore features that help farmers grow smarter 🌱
        </p>

        <div className={styles.grid}>
          {features.map((item, index) => (
            <div
              key={index}
              className={`${styles.card} ${styles[`${item.variant}Card`] || ""}`}
              role="button"
              tabIndex={0}
              aria-label={`Open ${item.title}`}
              onClick={() => navigate(item.path)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(item.path);
                }
              }}
              style={{
                backgroundImage: `url(${item.img})`,
              }}
            >
              <div className={styles.cardOverlay}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                {/* Variant-specific preview content */}
                {item.variant === "weather" && (
                  <div>
                    {weatherData ? (
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 600 }}>
                          {weatherData.temperature}°C
                        </div>
                        <div style={{ fontSize: 13 }}>
                          Wind: {weatherData.windspeed} km/h • Wind dir: {weatherData.winddirection}°
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.9 }}>Updated: {weatherData.time}</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 14 }}>Loading weather...</div>
                    )}
                  </div>
                )}

                {item.variant === "soil" && (
                  <div>
                    <p className={styles.cardDesc}>
                      Typical soil test items: pH, NPK levels, organic carbon, and salinity.
                      Use balanced fertilizer based on results and add organic compost where needed.
                    </p>
                  </div>
                )}

                {item.variant === "crop" && (
                  <div>
                    <p className={styles.cardDesc}>
                      Monsoon (Kharif): Rice, Maize, Cotton. Rabi: Wheat, Gram, Mustard. Choose crops
                      based on water availability and soil type.
                    </p>
                  </div>
                )}

                {item.variant === "scheme" && (
                  <div>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>Scheme</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleSchemes.map((s, i) => (
                          <tr key={i}>
                            <td>{s.name}</td>
                            <td>{s.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {item.variant === "market" && (
                  <div>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>Crop</th>
                          <th>Mandi</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleMarket.map((m, i) => (
                          <tr key={i}>
                            <td>{m.crop}</td>
                            <td>{m.mandi}</td>
                            <td>{m.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
