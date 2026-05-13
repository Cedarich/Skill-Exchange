"use client";
import styles from "./Gamification.module.css";

const LEVELS = [
  { name: "Seedling", icon: "🌱", xp: "0–500", color: "#22c55e", desc: "Just getting started" },
  { name: "Apprentice", icon: "📚", xp: "500–2K", color: "#06b6d4", desc: "Building momentum" },
  { name: "Practitioner", icon: "⚡", xp: "2K–5K", color: "#6366f1", desc: "Getting serious" },
  { name: "Expert", icon: "🏆", xp: "5K–15K", color: "#a855f7", desc: "Highly respected" },
  { name: "Master", icon: "💎", xp: "15K–50K", color: "#f59e0b", desc: "Elite teacher" },
  { name: "Legend", icon: "🌟", xp: "50K+", color: "#f43f5e", desc: "Hall of fame" },
];

const BADGES = [
  { icon: "🚀", name: "First Session", desc: "Complete your first session", color: "#6366f1" },
  { icon: "🔥", name: "7-Day Streak", desc: "Login 7 days in a row", color: "#f59e0b" },
  { icon: "💯", name: "Perfect Rating", desc: "Receive a 5-star review", color: "#22c55e" },
  { icon: "👑", name: "Top Earner", desc: "Top 10 earners this week", color: "#a855f7" },
  { icon: "🌍", name: "Global Reach", desc: "Teach in 5+ countries", color: "#06b6d4" },
  { icon: "⚡", name: "Speed Demon", desc: "10 sessions in 7 days", color: "#f43f5e" },
];

const LEADERBOARD = [
  { rank: 1, name: "Alex K.", score: "48,200 XP", sessions: 142, country: "🇺🇸", level: "Master", color: "#f59e0b" },
  { rank: 2, name: "Priya M.", score: "41,800 XP", sessions: 98, country: "🇮🇳", level: "Master", color: "#94a3b8" },
  { rank: 3, name: "James O.", score: "38,500 XP", sessions: 201, country: "🇳🇬", level: "Expert", color: "#cd7f32" },
  { rank: 4, name: "Sarah L.", score: "31,200 XP", sessions: 67, country: "🇬🇧", level: "Expert", color: "#64748b" },
  { rank: 5, name: "Dr. Chen", score: "28,900 XP", sessions: 315, country: "🇨🇳", level: "Expert", color: "#64748b" },
];

export default function Gamification() {
  return (
    <section className={styles.section} id="gamification" aria-label="Gamification system">
      <div className="container">
        <div className={styles.header}>
          <div className="section-tag">🎮 Gamification</div>
          <h2 className={`section-title ${styles.title}`}>
            Learning is more fun when you{" "}
            <span className="gradient-text">level up</span>
          </h2>
          <p className="section-subtitle">
            Every session earns XP. Every XP unlocks new levels, badges, and SKILL token rewards.
            The more you teach and learn, the higher you climb.
          </p>
        </div>

        <div className={styles.mainGrid}>
          {/* Levels panel */}
          <div className={styles.levelsPanel}>
            <h3 className={styles.panelTitle}>
              <span>⚡</span> Level System
            </h3>
            <div className={styles.levelsList}>
              {LEVELS.map((lv, i) => (
                <div
                  key={lv.name}
                  className={styles.levelRow}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div
                    className={styles.levelBadge}
                    style={{ background: `${lv.color}20`, borderColor: `${lv.color}40` }}
                  >
                    <span role="img" aria-label={lv.name}>{lv.icon}</span>
                  </div>
                  <div className={styles.levelInfo}>
                    <div className={styles.levelName} style={{ color: lv.color }}>{lv.name}</div>
                    <div className={styles.levelDesc}>{lv.desc}</div>
                  </div>
                  <div className={styles.levelXp}>{lv.xp} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard panel */}
          <div className={styles.leaderboardPanel}>
            <h3 className={styles.panelTitle}>
              <span>🏆</span> Weekly Leaderboard
            </h3>
            <div className={styles.lbList}>
              {LEADERBOARD.map((entry) => (
                <div key={entry.rank} className={styles.lbRow}>
                  <div
                    className={styles.lbRank}
                    style={{ color: entry.color }}
                  >
                    {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                  </div>
                  <div className={styles.lbAvatar}>
                    {entry.name.charAt(0)}
                  </div>
                  <div className={styles.lbInfo}>
                    <div className={styles.lbName}>
                      {entry.name} {entry.country}
                    </div>
                    <div className={styles.lbSessions}>{entry.sessions} sessions</div>
                  </div>
                  <div className={styles.lbScore}>{entry.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges grid */}
        <div className={styles.badgesSection}>
          <h3 className={styles.badgesSectionTitle}>Unlock Achievement Badges</h3>
          <div className={styles.badgesGrid}>
            {BADGES.map((badge) => (
              <div
                key={badge.name}
                className={styles.badgeCard}
                style={{ "--badge-color": badge.color } as React.CSSProperties}
              >
                <div
                  className={styles.badgeIcon}
                  style={{
                    background: `${badge.color}18`,
                    borderColor: `${badge.color}35`,
                    boxShadow: `0 0 20px ${badge.color}20`,
                  }}
                  role="img"
                  aria-label={badge.name}
                >
                  {badge.icon}
                </div>
                <div className={styles.badgeName}>{badge.name}</div>
                <div className={styles.badgeDesc}>{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
