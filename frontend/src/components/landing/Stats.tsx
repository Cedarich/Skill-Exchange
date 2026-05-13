"use client";
import styles from "./Stats.module.css";

const STATS = [
  { value: "12,400+", label: "Active Learners", icon: "👥", color: "#6366f1" },
  { value: "3,200+", label: "Skill Sessions", icon: "🎓", color: "#06b6d4" },
  { value: "850K+", label: "SKILL Tokens Earned", icon: "🪙", color: "#f59e0b" },
  { value: "98%", label: "Satisfaction Rate", icon: "⭐", color: "#22c55e" },
];

export default function Stats() {
  return (
    <section className={styles.stats} id="stats" aria-label="Platform statistics">
      <div className="container">
        <div className={styles.grid}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.card}>
              <div
                className={styles.iconWrap}
                style={{ "--stat-color": stat.color } as React.CSSProperties}
              >
                <span className={styles.icon} role="img" aria-label={stat.label}>{stat.icon}</span>
              </div>
              <div className={styles.value} style={{ color: stat.color }}>{stat.value}</div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
