import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getMarketAnalysis, getMarketTimeseriesAnalysis } from "../api/marketApi";
import { getPositionAnalysis } from "../api/positionsApi";
import useAuth from "../hooks/useAuth";

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

  if (loading) {
    return (
      <main className="page">
        <h1>Position Analysis</h1>
        <p>Loading analysis...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <h1>Position Analysis</h1>
        <p>{error}</p>
        <Link to="/positions">Back to Positions</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to="/positions">Back to Positions</Link>

      <section>
        {positionAnalysis.icon_url && (
          <img
            src={positionAnalysis.icon_url}
            alt={positionAnalysis.item_name}
            width="54"
            height="54"
          />
        )}

        <h1>{positionAnalysis.item_name} Analysis</h1>

        <p>
          Quantity: {positionAnalysis.quantity?.toLocaleString()} | Buy price:{" "}
          {positionAnalysis.buy_price?.toLocaleString()} gp
        </p>
      </section>

      <section>
        <h2>Current Position Value</h2>

        <p>
          Current sell price: {positionAnalysis.raw_sell_price?.toLocaleString()} gp
        </p>

        <p>
          Estimated GE tax:{" "}
          {positionAnalysis.estimated_ge_tax_per_item?.toLocaleString()} gp per
          item
        </p>

        <p>
          {getProfitLabel(positionAnalysis.estimated_profit_after_tax)}:{" "}
          {positionAnalysis.estimated_profit_after_tax?.toLocaleString()} gp
        </p>
      </section>

      <section>
        <h2>Market Movement</h2>

        <p>{getMarketSummary(marketAnalysis)}</p>

        {marketAnalysis && (
          <>
            <p>
              Current price: {marketAnalysis.current_price?.toLocaleString()} gp
            </p>

            <p>
              One-hour change:{" "}
              {marketAnalysis.one_hour_price_change?.toLocaleString()} gp (
              {marketAnalysis.one_hour_percent_change}%)
            </p>

            <p>
              Daily change: {marketAnalysis.daily_price_change?.toLocaleString()}{" "}
              gp ({marketAnalysis.daily_percent_change}%)
            </p>
          </>
        )}
      </section>

      {timeseriesAnalysis && (
        <section>
          <h2>Long-Term Trend</h2>

          <p>
            Trend direction:{" "}
            {capitalizeText(timeseriesAnalysis.trend_direction)}
          </p>

          <p>
            Price change: {timeseriesAnalysis.price_change?.toLocaleString()} gp (
            {timeseriesAnalysis.percent_change}%)
          </p>

          <p>
            Support price: {timeseriesAnalysis.support_price?.toLocaleString()} gp
          </p>

          <p>
            Resistance price:{" "}
            {timeseriesAnalysis.resistance_price?.toLocaleString()} gp
          </p>

          <p>Volatility: {timeseriesAnalysis.volatility_percent}%</p>
        </section>
      )}

      <section>
        <h2>AI Analysis</h2>

        <p>
          Generate a plain-English summary using this position, current market
          prices, GE tax, and recent trend data.
        </p>

        <button type="button" disabled>
          Generate AI Analysis
        </button>

        <p>AI analysis will be connected after the backend route is added.</p>
      </section>
    </main>
  );
}

export default PositionAnalysisPage;