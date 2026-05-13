"use client";
import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: "🎓",
    title: "Teach Anything",
    description:
      "List any skill you're good at. Set your own rate in XLM or SKILL tokens. Students book you directly — no middleman, no waiting.",
    tag: "For Teachers",
    tagColor: "#6366f1",
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.05))",
  },
  {
    icon: "⚡",
    title: "Instant Payments",
    description:
      "Get paid the second a session completes. Stellar settles in 5 seconds with near-zero fees. No banks, no delays, no borders.",
    tag: "Stellar Powered",
    tagColor: "#08b5e5",
    gradient: "linear-gradient(135deg, rgba(8,181,229,0.15), rgba(99,102,241,0.05))",
  },
  {
    icon: "🔒",
    title: "Escrow Protection",
    description:
      "Every session is backed by a Soroban smart contract. Funds are locked until both parties confirm completion — fully trustless.",
    tag: "Soroban Smart Contract",
    tagColor: "#a855f7",
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(6,182,212,0.05))",
  },
  {
    icon: "🏆",
    title: "Earn XP & Badges",
    description:
      "Level up every time you teach or learn. Unlock exclusive badges, climb leaderboards, and earn bonus SKILL token rewards.",
    tag: "Gamification",
    tagColor: "#f59e0b",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.05))",
  },
  {
    icon: "🪙",
    title: "SKILL Token Economy",
    description:
      "Earn SKILL tokens by teaching. Spend them to book sessions. Stake them for verified teacher status. Swap on Stellar DEX.",
    tag: "DeFi Integration",
    tagColor: "#22c55e",
    gradient: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(6,182,212,0.05))",
  },
  {
    icon: "🎖️",
    title: "NFT Certificates",
    description:
      "Earn on-chain completion certificates minted as Soroban NFTs. Verifiable, permanent proof of every skill you've mastered.",
    tag: "On-chain Credentials",
    tagColor: "#f43f5e",
    gradient: "linear-gradient(135deg, rgba(244,63,94,0.15), rgba(245,158,11,0.05))",
  },
];

export default function Features() {
  return (
    <section className={styles.features} id="features" aria-label="Platform features">
      <div className="container">
        <div className={styles.header}>
          <div className="section-tag">⚡ Platform Features</div>
          <h2 className={`section-title ${styles.title}`}>
            Everything you need to{" "}
            <span className="gradient-text">teach, learn & earn</span>
          </h2>
          <p className="section-subtitle">
            Built on Stellar&apos;s fast, cheap infrastructure — SkillXchange combines
            decentralized finance with social learning in one seamless experience.
          </p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((feat, i) => (
            <article
              key={feat.title}
              className={styles.card}
              style={{ animationDelay: `${i * 0.1}s`, "--card-bg": feat.gradient } as React.CSSProperties}
            >
              <div className={styles.cardBg} style={{ background: feat.gradient }} aria-hidden="true" />
              <div className={styles.iconBox}>
                <span role="img" aria-label={feat.title}>{feat.icon}</span>
              </div>
              <div
                className={styles.tag}
                style={{ color: feat.tagColor, borderColor: `${feat.tagColor}40`, background: `${feat.tagColor}12` }}
              >
                {feat.tag}
              </div>
              <h3 className={styles.cardTitle}>{feat.title}</h3>
              <p className={styles.cardDesc}>{feat.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
