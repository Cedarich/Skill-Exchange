"use client";
import { useState } from "react";
import styles from "./SkillsShowcase.module.css";

const CATEGORIES = ["All", "Tech", "Design", "Music", "Science", "Language", "Business"];

const SKILLS = [
  {
    icon: "💻",
    name: "Full-Stack Development",
    teacher: "Alex K.",
    level: "Expert",
    rate: "50 XLM",
    rating: 4.9,
    sessions: 142,
    category: "Tech",
    badge: "🏆 Top Rated",
  },
  {
    icon: "🎨",
    name: "UI/UX Design",
    teacher: "Priya M.",
    level: "Expert",
    rate: "35 XLM",
    rating: 4.8,
    sessions: 89,
    category: "Design",
    badge: "⚡ Trending",
  },
  {
    icon: "📸",
    name: "Portrait Photography",
    teacher: "James O.",
    level: "Master",
    rate: "30 XLM",
    rating: 5.0,
    sessions: 201,
    category: "Design",
    badge: "🌟 Legend",
  },
  {
    icon: "🎵",
    name: "Music Production",
    teacher: "Sarah L.",
    level: "Expert",
    rate: "45 XLM",
    rating: 4.7,
    sessions: 67,
    category: "Music",
    badge: "🔥 Hot",
  },
  {
    icon: "📐",
    name: "Calculus & Linear Algebra",
    teacher: "Dr. Chen",
    level: "Master",
    rate: "40 XLM",
    rating: 4.9,
    sessions: 315,
    category: "Science",
    badge: "💎 Premium",
  },
  {
    icon: "🤖",
    name: "Machine Learning",
    teacher: "Fatima A.",
    level: "Expert",
    rate: "55 XLM",
    rating: 4.8,
    sessions: 78,
    category: "Tech",
    badge: "⚡ Trending",
  },
  {
    icon: "🎸",
    name: "Electric Guitar",
    teacher: "Miguel R.",
    level: "Practitioner",
    rate: "25 XLM",
    rating: 4.6,
    sessions: 44,
    category: "Music",
    badge: "🌱 New",
  },
  {
    icon: "🌐",
    name: "Spanish for Beginners",
    teacher: "Ana V.",
    level: "Expert",
    rate: "20 XLM",
    rating: 4.9,
    sessions: 182,
    category: "Language",
    badge: "🏆 Top Rated",
  },
  {
    icon: "📊",
    name: "Data Analytics",
    teacher: "Tom W.",
    level: "Expert",
    rate: "48 XLM",
    rating: 4.7,
    sessions: 56,
    category: "Business",
    badge: "🔥 Hot",
  },
];

const LEVEL_COLORS: Record<string, string> = {
  Seedling: "#22c55e",
  Apprentice: "#06b6d4",
  Practitioner: "#6366f1",
  Expert: "#a855f7",
  Master: "#f59e0b",
  Legend: "#f43f5e",
};

export default function SkillsShowcase() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeCategory);

  return (
    <section className={styles.section} id="skills" aria-label="Skills showcase">
      <div className="container">
        <div className={styles.header}>
          <div className="section-tag">🎯 Skill Marketplace</div>
          <h2 className={`section-title ${styles.title}`}>
            Explore top skills{" "}
            <span className="gradient-text">taught by peers</span>
          </h2>
          <p className="section-subtitle">
            From coding to music production — every session is peer-verified, blockchain-backed,
            and instantly payable in XLM or SKILL tokens.
          </p>
        </div>

        {/* Category filter */}
        <div className={styles.filters} role="tablist" aria-label="Skill categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ""}`}
              onClick={() => setActiveCategory(cat)}
              id={`skills-filter-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill cards grid */}
        <div className={styles.grid}>
          {filtered.map((skill) => (
            <article key={skill.name} className={styles.card}>
              {/* Header */}
              <div className={styles.cardHead}>
                <div className={styles.skillIcon} role="img" aria-label={skill.name}>
                  {skill.icon}
                </div>
                <span className={styles.badge}>{skill.badge}</span>
              </div>

              <h3 className={styles.skillName}>{skill.name}</h3>

              {/* Teacher info */}
              <div className={styles.teacher}>
                <div className={styles.avatar}>
                  {skill.teacher.charAt(0)}
                </div>
                <div>
                  <div className={styles.teacherName}>{skill.teacher}</div>
                  <div
                    className={styles.level}
                    style={{ color: LEVEL_COLORS[skill.level] || "#94a3b8" }}
                  >
                    {skill.level}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>⭐</span>
                  <span className={styles.statValue}>{skill.rating}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>📅</span>
                  <span className={styles.statValue}>{skill.sessions} sessions</span>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.cardFoot}>
                <div className={styles.rate}>
                  <span className={styles.ratePer}>per hour</span>
                  <span className={styles.rateValue}>{skill.rate}</span>
                </div>
                <button className={styles.bookBtn} id={`book-${skill.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  Book Now
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.viewAll}>
          <a href="#" className="btn-outline" id="skills-view-all-btn">
            View All 150+ Skills →
          </a>
        </div>
      </div>
    </section>
  );
}
