"use client";
import styles from "./StellarSection.module.css";

const STELLAR_FEATURES = [
  {
    icon: "💸",
    title: "Near-Zero Fees",
    value: "~$0.00001",
    desc: "Per transaction on Stellar — teach globally without fees eating your earnings.",
    color: "#22c55e",
  },
  {
    icon: "⚡",
    title: "5-Second Finality",
    value: "5 sec",
    desc: "Stellar settles transactions in ~5 seconds. Get paid the moment your session ends.",
    color: "#06b6d4",
  },
  {
    icon: "🌍",
    title: "Global Access",
    value: "190+ Countries",
    desc: "Anyone with a Stellar wallet can join — no bank account required.",
    color: "#a855f7",
  },
  {
    icon: "🔒",
    title: "Soroban Contracts",
    value: "Trustless",
    desc: "Smart contracts on Soroban handle escrow, tokens, and certificates — no middleman.",
    color: "#f59e0b",
  },
];

const TOKEN_INFO = [
  { label: "Token Name", value: "SKILL Token" },
  { label: "Network", value: "Stellar Mainnet" },
  { label: "Total Supply", value: "100,000,000 SKILL" },
  { label: "Standard", value: "SEP-0001" },
  { label: "Use Cases", value: "Payments, Governance, Staking" },
  { label: "Swap", value: "Stellar DEX (XLM ↔ SKILL)" },
];

export default function StellarSection() {
  return (
    <section className={styles.section} id="stellar" aria-label="Stellar blockchain integration">
      <div className="container">
        <div className={styles.header}>
          <div className="section-tag">✦ Stellar Network</div>
          <h2 className={`section-title ${styles.title}`}>
            Built on the world&apos;s fastest{" "}
            <span className="stellar-gradient-text">payment blockchain</span>
          </h2>
          <p className="section-subtitle">
            Stellar makes it possible to pay teachers anywhere in the world, instantly,
            for less than a fraction of a cent — enabling true financial inclusion in education.
          </p>
        </div>

        {/* 4 Stellar stats */}
        <div className={styles.stellarStats}>
          {STELLAR_FEATURES.map((feat) => (
            <div key={feat.title} className={styles.stellarCard}>
              <div
                className={styles.stellarIcon}
                style={{ background: `${feat.color}18`, borderColor: `${feat.color}35` }}
                role="img"
                aria-label={feat.title}
              >
                {feat.icon}
              </div>
              <div className={styles.stellarValue} style={{ color: feat.color }}>
                {feat.value}
              </div>
              <div className={styles.stellarTitle}>{feat.title}</div>
              <p className={styles.stellarDesc}>{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* SKILL Token section */}
        <div className={styles.tokenSection}>
          <div className={styles.tokenLeft}>
            {/* Animated token visual */}
            <div className={styles.tokenVisual} aria-hidden="true">
              <div className={styles.tokenRing1} />
              <div className={styles.tokenRing2} />
              <div className={styles.tokenRing3} />
              <div className={styles.tokenCore}>
                <span className={styles.tokenEmoji}>🪙</span>
                <span className={styles.tokenTicker}>SKILL</span>
              </div>
            </div>
          </div>

          <div className={styles.tokenRight}>
            <div className="section-tag">🪙 SKILL Token</div>
            <h3 className={styles.tokenTitle}>
              The native currency of <span className="gradient-text">SkillXchange</span>
            </h3>
            <p className={styles.tokenDesc}>
              SKILL is a custom Stellar asset that powers every transaction on the platform.
              Earn it by teaching, spend it to learn, stake it for verified status, and
              vote with it on platform governance.
            </p>

            <dl className={styles.tokenTable}>
              {TOKEN_INFO.map((item) => (
                <div key={item.label} className={styles.tokenRow}>
                  <dt className={styles.tokenLabel}>{item.label}</dt>
                  <dd className={styles.tokenValue}>{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.tokenActions}>
              <a href="#" className="btn-primary" id="token-get-skill-btn">
                <span>🪙</span> Get SKILL Tokens
              </a>
              <a href="#" className="btn-outline" id="token-whitepaper-btn">
                📄 Read Whitepaper
              </a>
            </div>
          </div>
        </div>

        {/* Flow diagram */}
        <div className={styles.flowSection}>
          <h3 className={styles.flowTitle}>Payment Flow on Stellar</h3>
          <div className={styles.flowDiagram}>
            {[
              { icon: "👨‍🎓", label: "Student", sub: "Initiates booking" },
              { icon: "🔒", label: "Soroban Escrow", sub: "Locks SKILL/XLM" },
              { icon: "🎓", label: "Session", sub: "Teach & learn" },
              { icon: "✅", label: "Confirm", sub: "Both parties agree" },
              { icon: "👨‍🏫", label: "Teacher", sub: "Receives payment" },
              { icon: "🏆", label: "XP + NFT", sub: "Rewards issued" },
            ].map((node, i, arr) => (
              <div key={node.label} className={styles.flowWrap}>
                <div className={styles.flowNode}>
                  <div className={styles.flowNodeIcon} role="img" aria-label={node.label}>{node.icon}</div>
                  <div className={styles.flowNodeLabel}>{node.label}</div>
                  <div className={styles.flowNodeSub}>{node.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className={styles.flowArrow} aria-hidden="true">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
