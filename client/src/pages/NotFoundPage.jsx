import { Link } from "react-router-dom";

import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Lost in the wilderness</p>

        <h1>404</h1>

        <p>
          Page not found. This route does not exist, or the market moved before
          we got there.
        </p>

        <Link className={styles.homeLink} to="/">
          Back to Home
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;