import styles from "./Footer.module.css";

const LINKS = {
  Platform: ["Features", "How It Works", "Skills Marketplace", "Leaderboard", "NFT Certificates"],
  Stellar: ["SKILL Token", "Soroban Contracts", "Stellar DEX", "Wallet Guide", "Testnet"],
  Company: ["About Us", "Blog", "Careers", "Press Kit", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"],
};

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon} aria-hidden="true">⚡</span>
              <span className={styles.logoText}>Skill<span className={styles.logoAccent}>Xchange</span></span>
            </div>
            <p className={styles.brandDesc}>
              The decentralized peer-to-peer skill marketplace powered by the Stellar Network.
              Teach what you know. Learn what you need. Earn SKILL tokens.
            </p>
            <div className={styles.socials}>
              {[
                { icon: "𝕏", label: "Twitter/X", id: "footer-twitter" },
                { icon: "💬", label: "Discord", id: "footer-discord" },
                { icon: "📦", label: "GitHub", id: "footer-github" },
                { icon: "✈️", label: "Telegram", id: "footer-telegram" },
              ].map((s) => (
                <a key={s.id} href="#" className={styles.socialBtn} id={s.id} aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Stellar badge */}
            <div className={styles.stellarBadge}>
              <span className={styles.stellarDot} aria-hidden="true" />
              <span>Powered by Stellar Network</span>
            </div>
          </div>

          {/* Links */}
          <div className={styles.linksGrid}>
            {Object.entries(LINKS).map(([category, items]) => (
              <div key={category} className={styles.linkGroup}>
                <h3 className={styles.linkGroupTitle}>{category}</h3>
                <ul className={styles.linkList} role="list">
                  {items.map((item) => (
                    <li key={item}>
                      <a href="#" className={styles.link}>{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2026 SkillXchange. All rights reserved. Built with ❤️ on Stellar.
          </p>
          <div className={styles.bottomRight}>
            <span className={styles.networkTag}>
              <span className={styles.networkDot} aria-hidden="true" />
              Stellar Testnet Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
