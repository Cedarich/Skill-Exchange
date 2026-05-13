"use client";
import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

const FLOATING_SKILLS = [
  { icon: "💻", label: "Coding", delay: "0s", x: "10%", y: "20%" },
  { icon: "🎨", label: "Design", delay: "0.5s", x: "82%", y: "15%" },
  { icon: "📸", label: "Photography", delay: "1s", x: "88%", y: "60%" },
  { icon: "🎵", label: "Music", delay: "1.5s", x: "6%", y: "65%" },
  { icon: "📐", label: "Mathematics", delay: "0.8s", x: "50%", y: "5%" },
  { icon: "🎬", label: "Video Edit", delay: "1.2s", x: "18%", y: "80%" },
  { icon: "🌐", label: "Languages", delay: "0.3s", x: "74%", y: "80%" },
];

export default function Hero() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 30;
      const y = (clientY / innerHeight - 0.5) * 30;
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className={styles.hero} id="hero" aria-label="Hero section">
      {/* Ambient orbs */}
      <div className={styles.orbs} ref={orbRef} aria-hidden="true">
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      {/* Grid lines */}
      <div className={styles.grid} aria-hidden="true" />

      {/* Floating skill pills */}
      {FLOATING_SKILLS.map((skill) => (
        <div
          key={skill.label}
          className={styles.floatingPill}
          style={{ left: skill.x, top: skill.y, animationDelay: skill.delay }}
          aria-hidden="true"
        >
          <span>{skill.icon}</span>
          <span>{skill.label}</span>
        </div>
      ))}

      <div className={`container ${styles.content}`}>
        {/* Badge */}
        <div className={styles.heroBadge}>
          <span className={styles.stellarDot} aria-hidden="true" />
          <span>Powered by Stellar Network</span>
          <span className={styles.stellarIcon} aria-hidden="true">✦</span>
        </div>

        {/* Heading */}
        <h1 className={styles.heading}>
          <span className={styles.headingLine1}>Teach Skills.</span>
          <span className={styles.headingLine2}>
            Earn <span className="gradient-text">SKILL Tokens.</span>
          </span>
          <span className={styles.headingLine3}>Level Up. 🏆</span>
        </h1>

        <p className={styles.subheading}>
          The decentralized peer-to-peer marketplace where students teach each other —
          coding, design, music, photography & more — and get paid <strong>instantly</strong> in
          XLM or SKILL tokens on the Stellar Network.
        </p>

        {/* CTAs */}
        <div className={styles.ctas}>
          <a href="#" className="btn-primary" id="hero-start-teaching-btn">
            <span>🎓</span>
            Start Teaching
          </a>
          <a href="#" className="btn-outline" id="hero-explore-skills-btn">
            <span>🔍</span>
            Explore Skills
          </a>
        </div>

        {/* Trust indicators */}
        <div className={styles.trust}>
          <div className={styles.trustItem}>
            <span className={styles.trustStat}>$0.001</span>
            <span className={styles.trustLabel}>avg. tx fee</span>
          </div>
          <div className={styles.trustDivider} aria-hidden="true" />
          <div className={styles.trustItem}>
            <span className={styles.trustStat}>5 sec</span>
            <span className={styles.trustLabel}>settlement time</span>
          </div>
          <div className={styles.trustDivider} aria-hidden="true" />
          <div className={styles.trustItem}>
            <span className={styles.trustStat}>150+</span>
            <span className={styles.trustLabel}>skills available</span>
          </div>
          <div className={styles.trustDivider} aria-hidden="true" />
          <div className={styles.trustItem}>
            <span className={styles.trustStat}>Soroban</span>
            <span className={styles.trustLabel}>smart contracts</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollMouse}>
          <div className={styles.scrollDot} />
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
