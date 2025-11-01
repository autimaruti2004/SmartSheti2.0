import React, { useMemo, useState, useEffect } from "react";
import { marketPrice as marketApi } from '../../utils/api';
import styles from "./MarketPrice.module.css";

function downloadCSV(rows) {
  const header = ["Crop", "Market", "Price", "Date"];
  const csv = [header.join(",")]
    .concat(
      rows.map((r) => [r.crop, r.market, `"${r.price}"`, r.date].join(","))
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `market-prices-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MarketPrice() {
  const [prices, setPrices] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchPrices() {
      try {
        setLoading(true);
        setError(null);

        // Fetch prices from backend
        const data = await marketApi.getPrices();
        setPrices(Array.isArray(data) ? data : data.prices || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, []);
  
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery;
    if (!q) return prices;
    return prices.filter(
      (p) =>
        p.crop.toLowerCase().includes(q) ||
        p.market.toLowerCase().includes(q) ||
        p.price.toLowerCase().includes(q)
    );
  }, [debouncedQuery, prices]);

  const lastUpdated = useMemo(() => {
    if (!prices.length) return null;
    return prices[0].date;
  }, [prices]);


  function highlight(text, q) {
    if (!q) return text;
    const parts = text.split(
      new RegExp(`(${q.replace(/[-\\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "ig")
    );
    return parts.map((part, i) =>
      part.toLowerCase() === q ? (
        <mark key={i} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  if (loading) return <div className={styles.container}>Loading data...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <h2 className={styles.heading}>SmartSheti - Market Prices (Maharashtra)</h2>

        <div className={styles.actions}>
          <input
            aria-label="Search prices"
            placeholder="Search — crop or market"
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className={styles.exportBtn}
            onClick={() => downloadCSV(filtered)}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Crop</th>
              <th>Market</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={idx}>
                <td>{highlight(item.crop, debouncedQuery)}</td>
                <td>{highlight(item.market, debouncedQuery)}</td>
                <td className={styles.price}>
                  {highlight(item.price, debouncedQuery)}
                </td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className={styles.noResults}>No results found.</div>
      )}

      <p className={styles.note}>
        Note: Prices may change daily. Last updated: {lastUpdated}
      </p>
    </div>
  );
}
