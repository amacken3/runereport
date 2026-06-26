import { Link } from "react-router-dom";

import styles from "./LandingPage.module.css";

function LandingPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Grand Exchange market tracking</p>

          <h1 className={styles.title}>RuneReport</h1>

          <p className={styles.subtitle}>
            Track OSRS Grand Exchange positions, monitor market movement, and
            review tax-aware item analysis before deciding what to hold, sell,
            or watch next.
          </p>

          <div className={styles.actions}>
            <Link to="/signup" className={styles.primaryButton}>
              Get Started
            </Link>

            <Link to="/login" className={styles.secondaryButton}>
              Log In
            </Link>
          </div>
        </div>

        <div className={styles.previewPanel} aria-label="Market analysis preview">
          <div className={styles.previewHeader}>
            <span>Market Report</span>
            <span className={styles.liveBadge}>Live API</span>
          </div>

          <div className={styles.itemRow}>
            <div>
              <h2>Basilisk jaw</h2>
              <p>Position analysis preview</p>
            </div>

            <span className={styles.itemIcon}>◆</span>
          </div>

          <div className={styles.statGrid}>
            <div className={styles.statCard}>
              <span>Latest Low</span>
              <strong>14.6m</strong>
            </div>

            <div className={styles.statCard}>
              <span>After Tax</span>
              <strong>14.3m</strong>
            </div>

            <div className={styles.statCard}>
              <span>Trend</span>
              <strong className={styles.negative}>Down</strong>
            </div>

            <div className={styles.statCard}>
              <span>Volatility</span>
              <strong>7.5%</strong>
            </div>
          </div>

          <div className={styles.noteBox}>
            <span>Includes GE tax estimates, position profit/loss, historical trend data, and market movement context.</span>
          </div>
        </div>
      </section>

      <section className={styles.featureGrid}>
        <article className={styles.featureCard}>
          <h2>Track Positions</h2>
          <p>
            Save items you bought, record quantity and buy price, then compare
            your position against current market data.
          </p>
        </article>

        <article className={styles.featureCard}>
          <h2>Analyze Market Data</h2>
          <p>
            Review latest prices, top movers, historical trends, support,
            resistance, volume, and volatility.
          </p>
        </article>

        <article className={styles.featureCard}>
          <h2>Estimate GE Tax</h2>
          <p>
            See raw sell value, estimated Grand Exchange tax, and after-tax
            profit or loss before making a decision.
          </p>
        </article>
      </section>
    </main>
  );
}

export default LandingPage;