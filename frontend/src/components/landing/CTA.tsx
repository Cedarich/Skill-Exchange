"use client";
import styles from "./CTA.module.css";

export default function CTA() {
  return (
    <section className={styles.section} id="cta" aria-label="Call to action">
      <div className="container">
        <div className={styles.card}>
          {/* Background elements */}
          <div className={styles.bgOrb1} aria-hidden="true" />
          <div className={styles.bgOrb2} aria-hidden="true" />
          <div className={styles.bgGrid} aria-hidden="true" />

          <div className={styles.content}>
            <div className={styles.badge}>
              <span>🚀</span>
              <span>Open Beta Live on Stellar Testnet</span>
            </div>

            <h2 className={styles.title}>
              Ready to start your{" "}
              <span className="gradient-text">teach-to-earn</span>{" "}
              journey?
            </h2>

            <p className={styles.subtitle}>
              Join thousands of students and teachers already earning SKILL tokens
              on the Stellar network. Connect your wallet and list your first skill in 60 seconds.
            </p>

            <div className={styles.actions}>
              <a href="#" className="btn-primary" id="cta-start-btn">
                <span>⚡</span>
                Start Teaching Today
              </a>
              <a href="#" className="btn-outline" id="cta-browse-btn">
                <span>🔍</span>
                Browse Skills
              </a>
            </div>

            {/* Wallet badges */}
            <div className={styles.wallets}>
              <span className={styles.walletsLabel}>Compatible wallets:</span>
              {[
                { name: "Freighter", icon: "🔷" },
                { name: "Lobstr", icon: "🦞" },
                { name: "Albedo", icon: "🌙" },
                { name: "XBULL", icon: "🐂" },
              ].map((wallet) => (
                <div key={wallet.name} className={styles.walletBadge}>
                  <span>{wallet.icon}</span>
                  <span>{wallet.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
