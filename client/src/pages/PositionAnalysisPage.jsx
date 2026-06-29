import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getMarketAnalysis, getMarketTimeseriesAnalysis } from "../api/marketApi";
import {
  generatePositionAiAnalysis,
  getPositionAnalysis,
} from "../api/positionsApi";
import useAuth from "../hooks/useAuth";
import styles from "./PositionAnalysisPage.module.css";

function getProfitLabel(value) {
  if (value > 0) {
    return "Estimated profit after tax";
  }

  if (value < 0) {
    return "Estimated loss after tax";
  }

  return "Estimated break-even after tax";
}

function capitalizeText(text) {
  if (!text) {
    return "Unknown";
  }

  return text[0].toUpperCase() + text.slice(1);
}

function getMarketSummary(marketAnalysis) {
  if (!marketAnalysis) {
    return "";
  }

  const oneHourChange = marketAnalysis.one_hour_percent_change;
  const dailyChange = marketAnalysis.daily_percent_change;

  const oneHourText =
    oneHourChange > 0
      ? `Up ${Math.abs(oneHourChange)}% over the last hour`
      : `Down ${Math.abs(oneHourChange)}% over the last hour`;

  const dailyText =
    dailyChange > 0
      ? `Up ${Math.abs(dailyChange)}% compared to the daily average`
      : `Down ${Math.abs(dailyChange)}% compared to the daily average`;

  return `This item is currently ${oneHourText} and ${dailyText}.`;
}

function PositionAnalysisPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [positionAnalysis, setPositionAnalysis] = useState(null);
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const [timeseriesAnalysis, setTimeseriesAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    async function loadAnalysis() {
      try {
        const positionData = await getPositionAnalysis(token, id);
        setPositionAnalysis(positionData);

        const [marketData, timeseriesData] = await Promise.all([
          getMarketAnalysis(positionData.item_id),
          getMarketTimeseriesAnalysis(positionData.item_id, "24h"),
        ]);

        setMarketAnalysis(marketData);
        setTimeseriesAnalysis(timeseriesData);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [id, token]);

  async function handleGenerateAiAnalysis() {
    setAiLoading(true);
    setAiError("");

    try {
      const data = await generatePositionAiAnalysis(token, id);
      setAiAnalysis(data.ai_analysis);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <section className={styles.statusCard}>
          <h1>Position Analysis</h1>
          <p>Loading analysis...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <section className={styles.statusCard}>
          <h1>Position Analysis</h1>
          <p className={styles.errorMessage}>{error}</p>
          <Link className={styles.backLink} to="/positions">
            Back to Positions
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} to="/positions">
        ← Back to Positions
      </Link>

      <section className={styles.hero}>
        <div className={styles.itemIntro}>
          {positionAnalysis.icon_url && (
            <div className={styles.iconWrap}>
              <img
                src={positionAnalysis.icon_url}
                alt={positionAnalysis.item_name}
                width="54"
                height="54"
              />
            </div>
          )}

          <div>
            <p className={styles.eyebrow}>Position report</p>
            <h1>{positionAnalysis.item_name} Analysis</h1>

            <p>
              Quantity: {positionAnalysis.quantity?.toLocaleString()} | Buy price:{" "}
              {positionAnalysis.buy_price?.toLocaleString()} gp
            </p>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.sectionHeader}>
          <h2>Current Position Value</h2>
          <p>Estimated value if you sold this position now.</p>
        </div>

        <div className={styles.statGrid}>
          <article className={styles.statCard}>
            <span>Current sell price</span>
            <strong>{positionAnalysis.raw_sell_price?.toLocaleString()} gp</strong>
          </article>

          <article className={styles.statCard}>
            <span>Estimated GE tax</span>
            <strong>
              {positionAnalysis.estimated_ge_tax_per_item?.toLocaleString()} gp
            </strong>
            <small>per item</small>
          </article>

          <article
            className={
              positionAnalysis.estimated_profit_after_tax >= 0
                ? styles.positiveCard
                : styles.negativeCard
            }
          >
            <span>{getProfitLabel(positionAnalysis.estimated_profit_after_tax)}</span>
            <strong>
              {positionAnalysis.estimated_profit_after_tax?.toLocaleString()} gp
            </strong>
          </article>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.sectionHeader}>
          <h2>Market Movement</h2>
          <p>{getMarketSummary(marketAnalysis)}</p>
        </div>

        {marketAnalysis && (
          <div className={styles.statGrid}>
            <article className={styles.statCard}>
              <span>Current price</span>
              <strong>{marketAnalysis.current_price?.toLocaleString()} gp</strong>
            </article>

            <article
              className={
                marketAnalysis.one_hour_price_change >= 0
                  ? styles.positiveCard
                  : styles.negativeCard
              }
            >
              <span>One-hour change</span>
              <strong>
                {marketAnalysis.one_hour_price_change?.toLocaleString()} gp
              </strong>
              <small>{marketAnalysis.one_hour_percent_change}%</small>
            </article>

            <article
              className={
                marketAnalysis.daily_price_change >= 0
                  ? styles.positiveCard
                  : styles.negativeCard
              }
            >
              <span>Daily change</span>
              <strong>{marketAnalysis.daily_price_change?.toLocaleString()} gp</strong>
              <small>{marketAnalysis.daily_percent_change}%</small>
            </article>
          </div>
        )}
      </section>

      {timeseriesAnalysis && (
        <section className={styles.panel}>
          <div className={styles.sectionHeader}>
            <h2>Long-Term Trend</h2>
            <p>365 day time period.</p>
          </div>

          <div className={styles.statGrid}>
            <article className={styles.statCard}>
              <span>Trend direction</span>
              <strong>{capitalizeText(timeseriesAnalysis.trend_direction)}</strong>
            </article>

            <article
              className={
                timeseriesAnalysis.price_change >= 0
                  ? styles.positiveCard
                  : styles.negativeCard
              }
            >
              <span>Price change</span>
              <strong>{timeseriesAnalysis.price_change?.toLocaleString()} gp</strong>
              <small>{timeseriesAnalysis.percent_change}%</small>
            </article>

            <article className={styles.statCard}>
              <span>Support price</span>
              <strong>{timeseriesAnalysis.support_price?.toLocaleString()} gp</strong>
            </article>

            <article className={styles.statCard}>
              <span>Resistance price</span>
              <strong>
                {timeseriesAnalysis.resistance_price?.toLocaleString()} gp
              </strong>
            </article>

            <article className={styles.statCard}>
              <span>Volatility</span>
              <strong>{timeseriesAnalysis.volatility_percent}%</strong>
            </article>
          </div>
        </section>
      )}

      <section className={styles.panel}>
        <div className={styles.sectionHeader}>
          <h2>AI Analysis</h2>
          <p>
            Generate a plain-English summary using this position, current market
            prices, GE tax, short-term movement, and long-term trend data.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateAiAnalysis}
          disabled={aiLoading}
        >
          {aiLoading ? "Generating..." : "Generate AI Analysis"}
        </button>

        {aiError && <p className={styles.errorMessage}>{aiError}</p>}

        {aiAnalysis && (
          <section className={styles.aiSummary}>
            <h3>Generated Summary</h3>
            <pre>{String(aiAnalysis)}</pre>
          </section>
        )}
      </section>
    </main>
  );
}

export default PositionAnalysisPage;