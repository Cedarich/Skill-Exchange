import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillXchange — Teach, Learn & Earn on Stellar",
  description:
    "The decentralized peer-to-peer skill exchange platform powered by the Stellar Network. Teach what you know, learn what you need, earn SKILL tokens.",
  keywords: [
    "skill exchange", "stellar network", "learn to earn", "teach to earn",
    "soroban", "blockchain education", "peer to peer learning", "skill tokens",
    "crypto education", "decentralized learning"
  ],
  authors: [{ name: "SkillXchange Team" }],
  openGraph: {
    title: "SkillXchange — Teach, Learn & Earn on Stellar",
    description: "The decentralized peer-to-peer skill exchange platform powered by the Stellar Network.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillXchange — Teach, Learn & Earn on Stellar",
    description: "Teach skills. Earn SKILL tokens. Powered by Stellar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
