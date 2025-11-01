// Weather.jsx
import React, { useEffect, useState } from "react";
import { weather as weatherApi } from '../../utils/api';
import styles from "./Weather.module.css";

const DEFAULT_CITY = "Pune";

export default function Weather() {
  // const [city, setCity] = useState(DEFAULT_CITY);
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [farmerCrop, setFarmerCrop] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [advisory, setAdvisory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationInput, setLocationInput] = useState("");
  const [locations, setLocations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ss_locations") || "[]");
    } catch {
      return [];
    }
  });
  const [locationsData, setLocationsData] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    fetchWeather(DEFAULT_CITY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchWeather(searchCity) {
    try {
      setLoading(true);
      setError(null);

      // Fetch via backend API (backend should proxy to OpenWeather)
      const payload = await weatherApi.getCurrent(searchCity);
      const mapped = {
        city: payload.name,
        country: payload.sys?.country,
        coords: payload.coord,
        temperature: Math.round(payload.main?.temp),
        feels_like: Math.round(payload.main?.feels_like),
        temp_min: Math.round(payload.main?.temp_min),
        temp_max: Math.round(payload.main?.temp_max),
        humidity: payload.main?.humidity,
        pressure: payload.main?.pressure,
        wind_speed: payload.wind?.speed,
        description:
          payload.weather && payload.weather.length
            ? payload.weather[0].description
            : "",
        icon:
          payload.weather && payload.weather.length
            ? payload.weather[0].icon
            : null,
        timestamp: payload.dt,
      };

      setData(mapped);
  // generate a baseline advisory when new data arrives
  setAdvisory(generateAdvisory(mapped, "", ""));
    } catch (err) {
      console.error(err);
      // If backend returned a helpful message, display it
      const msg = (err && err.message) || (err && err.response && err.response.data && err.response.data.message);
      if (msg && msg.toLowerCase().includes('not configured')) {
        setError(msg);
      } else if (err && err.response && err.response.status === 404) {
        setError("City not found. Try another city name.");
      } else {
        setError(msg || "Failed to fetch weather data");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLocationWeather(name) {
    const payload = await weatherApi.getCurrent(name);
    return {
      name: name,
      city: payload.name,
      temperature: Math.round(payload.main?.temp),
      description:
        payload.weather && payload.weather.length ? payload.weather[0].description : "",
      icon: payload.weather && payload.weather.length ? payload.weather[0].icon : null,
      timestamp: payload.dt,
    };
  }

  async function fetchAllLocationsWeather() {
    if (!locations || locations.length === 0) return;
    setLoadingLocations(true);
    try {
      const promises = locations.map((loc) =>
        fetchLocationWeather(loc).catch((err) => ({ name: loc, error: err.message }))
      );
      const results = await Promise.all(promises);
      setLocationsData(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLocations(false);
    }
  }

  function handleAddLocation(e) {
    e && e.preventDefault();
    const v = locationInput.trim();
    if (!v) return;
    if (!locations.includes(v)) {
      const next = [...locations, v];
      setLocations(next);
      try {
        localStorage.setItem("ss_locations", JSON.stringify(next));
      } catch (err) {
        console.warn("localStorage set error", err);
      }
    }
    setLocationInput("");
  }

  function handleRemoveLocation(name) {
    const next = locations.filter((l) => l !== name);
    setLocations(next);
    try {
      localStorage.setItem("ss_locations", JSON.stringify(next));
    } catch (err) {
      console.warn("localStorage set error", err);
    }
    setLocationsData((prev) => prev.filter((p) => p.name !== name));
  }

  function generateAdvisory(weather, crop = "", area = "") {
    if (!weather) return [];
    const adv = [];
    const t = weather.temperature;
    const h = weather.humidity;
    const w = weather.wind_speed || 0;
    const desc = (weather.description || "").toLowerCase();

    // Temperature-based advice
    if (t <= 5) adv.push("Frost risk: protect sensitive crops during night and use mulches or covers.");
    else if (t <= 15) adv.push("Cool temperatures: delay sowing heat-loving crops; protect seedlings.");
    else if (t >= 35) adv.push("Heat stress risk: irrigate early morning or late evening to reduce plant stress.");
    else adv.push("Temperature looks moderate — good for most field activities.");

    // Humidity-based advice
    if (h >= 80) adv.push("High humidity: increased risk of fungal diseases — inspect crops and consider preventive measures.");

    // Wind-based advice
    if (w >= 10) adv.push("Strong winds: avoid spraying pesticides/fertilizers; secure light structures.");

    // Rain-related
    if (desc.includes("rain") || desc.includes("shower") || desc.includes("drizzle")) {
      adv.push("Rain expected: postpone irrigation and heavy field operations until after rainfall.");
    }

    // Tailored quick hints
    if (crop) adv.push(`Crop note (${crop}): consider variety-appropriate disease checks.`);
    if (area) adv.push(`Farm size noted (${area} ha): plan irrigation and labour accordingly.`);

    // Always add a reminder
    adv.push("Check local agri-extension or helpline for pesticide/disease-specific guidance before taking action.");

    return adv;
  }

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // setCity(q);
    fetchWeather(q);
    setQuery("");
  }

  function handleGetAdvisory(e) {
    e && e.preventDefault();
    if (!data) {
      setAdvisory(["Weather data not available — try again later."]);
      return;
    }
    const adv = generateAdvisory(data, farmerCrop.trim(), farmSize.trim());
    setAdvisory(adv);
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Backend currently exposes location by city name; try reverse geocoding on client or call backend by lat/lon if implemented
          // For now, attempt to call backend with lat,lon if backend supports it
          const loc = `${latitude},${longitude}`;
          const payload = await weatherApi.getCurrent(loc);
          const mapped = {
            city: payload.name,
            country: payload.sys?.country,
            coords: payload.coord,
            temperature: Math.round(payload.main?.temp),
            feels_like: Math.round(payload.main?.feels_like),
            temp_min: Math.round(payload.main?.temp_min),
            temp_max: Math.round(payload.main?.temp_max),
            humidity: payload.main?.humidity,
            pressure: payload.main?.pressure,
            wind_speed: payload.wind?.speed,
            description:
              payload.weather && payload.weather.length
                ? payload.weather[0].description
                : "",
            icon:
              payload.weather && payload.weather.length
                ? payload.weather[0].icon
                : null,
            timestamp: payload.dt,
          };
          setData(mapped);
          setError(null);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch weather by location");
          setData(null);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Permission denied or unable to get location.");
        setLoading(false);
      }
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Weather</h1>

      <form className={styles.searchBar} onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city (e.g. Mumbai)"
          className={styles.input}
          aria-label="Search city"
        />
        <button type="submit" className={styles.btn}>
          Search
        </button>
        <button
          type="button"
          onClick={handleUseMyLocation}
          className={styles.btnOutline}
        >
          Use My Location
        </button>
      </form>

      {loading && <div className={styles.message}>Loading...</div>}
      {error && <div className={styles.error}>Error: {error}</div>}

      {data && (
        <div className={styles.card}>
          <div className={styles.left}>
            <div className={styles.city}>
              {data.city}
              {data.country ? <span className={styles.country}> , {data.country}</span> : null}
            </div>
            <div className={styles.desc}>
              {data.description[0]?.toUpperCase() + data.description.slice(1)}
            </div>

            <div className={styles.temps}>
              <div className={styles.tempMain}>
                {data.temperature}°C
                <div className={styles.feels}>Feels like {data.feels_like}°C</div>
              </div>

              <div className={styles.range}>
                <span>Min: {data.temp_min}°C</span>
                <span>Max: {data.temp_max}°C</span>
              </div>
            </div>
          </div>

          <div className={styles.right}>
            {data.icon ? (
              <img
                alt={data.description}
                className={styles.icon}
                src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
              />
            ) : null}

            <div className={styles.extra}>
              <div>Humidity: {data.humidity}%</div>
              <div>Pressure: {data.pressure} hPa</div>
              <div>Wind: {data.wind_speed} m/s</div>
            </div>
          </div>
        </div>
      )}

      {/* Nearby villages temperatures */}
      <div className={styles.locationsSection}>
        <h2 className={styles.advisoryTitle}>Nearby villages temperatures</h2>

        <form className={styles.advisoryForm} onSubmit={handleAddLocation}>
          <input
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Add village (e.g. Khedgaon)"
            className={styles.inputSmall}
            aria-label="Village"
          />
          <button type="submit" className={styles.btnOutline}>
            Add
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={fetchAllLocationsWeather}
          >
            {loadingLocations ? "Loading..." : "Fetch all"}
          </button>
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setLocations([]);
              setLocationsData([]);
              try {
                localStorage.removeItem("ss_locations");
              } catch (err) {
                console.warn("localStorage remove error", err);
              }
            }}
          >
            Clear
          </button>
        </form>

        <div className={styles.locationList}>
          {locations.length === 0 && (
            <div className={styles.noResults}>No villages added. Add village names to view temperatures.</div>
          )}

          {locations.map((loc, idx) => {
            const item = locationsData.find((d) => d.name === loc) || {};
            return (
              <div className={styles.locationItem} key={loc + idx}>
                <div className={styles.locationName}>{loc}</div>
                {item.error ? (
                  <div className={styles.error}>Error: {item.error}</div>
                ) : item.temperature !== undefined ? (
                  <div className={styles.locationInfo}>
                    <div className={styles.tempMainSmall}>{item.temperature}°C</div>
                    <div className={styles.descSmall}>{item.description}</div>
                    {item.icon ? (
                      <img
                        src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                        alt={item.description}
                        className={styles.iconSmall}
                      />
                    ) : null}
                  </div>
                ) : (
                  <div className={styles.noResults}>Not fetched</div>
                )}

                <button className={styles.clearBtn} onClick={() => handleRemoveLocation(loc)}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Farmer advisory partition */}
      <div className={styles.advisorySection}>
        <h2 className={styles.advisoryTitle}>Farmer Advisory</h2>

        <form className={styles.advisoryForm} onSubmit={handleGetAdvisory}>
          <input
            value={farmerCrop}
            onChange={(e) => setFarmerCrop(e.target.value)}
            placeholder="Your crop (optional, e.g. Sugarcane)"
            className={styles.inputSmall}
            aria-label="Crop"
          />
          <input
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            placeholder="Farm size (ha) (optional)"
            className={styles.inputSmall}
            aria-label="Farm size"
          />
          <button type="submit" className={styles.btn}>Get Advisory</button>
        </form>

        <div className={styles.advisoryCard}>
          <h3 className={styles.advisoryCardTitle}>Quick recommendations</h3>
          {advisory && advisory.length ? (
            <ul className={styles.advisoryList}>
              {advisory.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          ) : (
            <div className={styles.noResults}>No advisory yet — click "Get Advisory" or wait for weather data.</div>
          )}

          <div className={styles.helpline}>
            Local Agri-Helpline: <strong>1800-XXX-XXXX</strong> • For crop disease help, contact your nearest extension office.
          </div>
        </div>
      </div>

      <div className={styles.note}>
        Tip: If city names return 404, try using the city plus country code (e.g. "London,uk").
      </div>
    </div>
  );
}
