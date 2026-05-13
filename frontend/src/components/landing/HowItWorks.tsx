"use client";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    number: "01",
    icon: "🔗",
    title: "Connect Your Wallet",
    description:
      "Sign in with your Freighter, Lobstr, or Albedo Stellar wallet. Your Stellar address is your identity — no passwords needed.",
    color: "#6366f1",
  },
  {
    number: "02",
    icon: "📋",
    title: "List or Find a Skill",
    description:
      "Post what you can teach with your hourly rate in XLM or SKILL tokens. Or browse 150+ skill categories and book a session.",
    color: "#06b6d4",
  },
  {
    number: "03",
    icon: "🤝",
    title: "Book & Lock Funds",
    description:
      "Student books a session. Payment is instantly locked in a Soroban escrow smart contract — completely trustless.",
    color: "#a855f7",
  },
  {
    number: "04",
    icon: "🎓",
    title: "Teach the Session",
    description:
      "Connect via built-in video, chat, or choose your own platform. Teach, learn, collaborate — track progress in real time.",
    color: "#f59e0b",
  },
  {
    number: "05",
    icon: "✅",
    title: "Confirm & Get Paid",
    description:
      "Both parties confirm completion. The Soroban contract releases payment to the teacher instantly on the Stellar network.",
    color: "#22c55e",
  },
  {
    number: "06",
    icon: "🏆",
    title: "Level Up & Earn Rewards",
    description:
      "Earn XP, unlock badges, claim SKILL token bonuses. Mint your NFT certificate and climb the global leaderboard.",
    color: "#f43f5e",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works" aria-label="How SkillXchange works">
      <div className="container">
        <div className={styles.header}>
          <div className="section-tag">🗺️ How It Works</div>
          <h2 className={`section-title ${styles.title}`}>
            Six steps to your first{" "}
            <span className="gradient-text">skill session</span>
          </h2>
          <p className="section-subtitle">
            From wallet connect to payment — the entire flow is powered by
            Stellar&apos;s blockchain. Fast, transparent, borderless.
          </p>
        </div>

        <div className={styles.steps}>
          {/* Vertical line */}
          <div className={styles.line} aria-hidden="true" />

          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`${styles.step} ${i % 2 === 0 ? styles.stepLeft : styles.stepRight}`}
            >
              {/* Connector dot */}
              <div
                className={styles.dot}
                style={{ background: step.color, boxShadow: `0 0 20px ${step.color}60` }}
                aria-hidden="true"
              />

              <article
                className={styles.card}
                style={{ "--step-color": step.color } as React.CSSProperties}
              >
                <div className={styles.stepNum} style={{ color: step.color }}>
                  {step.number}
                </div>
                <div className={styles.stepIcon} role="img" aria-label={step.title}>
                  {step.icon}
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>

                {/* Bottom accent */}
                <div
                  className={styles.cardAccent}
                  style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }}
                  aria-hidden="true"
                />
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
