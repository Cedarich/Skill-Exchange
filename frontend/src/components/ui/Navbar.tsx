"use client";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`} role="navigation" aria-label="Main navigation">
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <a href="#" className={styles.logo} aria-label="SkillXchange Home">
          <span className={styles.logoIcon} aria-hidden="true">⚡</span>
          <span className={styles.logoText}>
            Skill<span className="gradient-text">Xchange</span>
          </span>
        </a>

        {/* Nav links */}
        <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`} role="list">
          {["Features", "How It Works", "Skills", "Gamification", "Stellar"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className={styles.link}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className={styles.actions}>
          <a href="#" className="btn-outline" id="nav-signin-btn">Sign In</a>
          <a href="#" className="btn-primary" id="nav-launch-btn">
            <span>🚀</span> Launch App
          </a>
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
