# SkillXchange 🎓⚡
> **Peer-to-Peer Skill Exchange Platform powered by the Stellar Network**

[![Stellar](https://img.shields.io/badge/Stellar-Blockchain-blue?logo=stellar)](https://stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-purple)](https://soroban.stellar.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🧠 What is SkillXchange?

**SkillXchange** is a decentralized, gamified peer-to-peer skill-sharing marketplace built on the **Stellar Network**. Students and creators teach each other real-world skills — coding, graphic design, photography, mathematics, music production, and more — and get paid in **SKILL tokens** (a Stellar-based custom asset) or XLM instantly.

Think of it as a fusion of:
- 🎮 **Social gaming** (XP, badges, leaderboards, streaks)
- 🏫 **EdTech** (skill sessions, reviews, certifications)
- 💸 **DeFi** (Stellar micropayments, escrow smart contracts)
- 🌐 **Web3 social network** (profiles, followers, feeds)

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🎓 Teach & Earn | List any skill, set your rate in XLM/SKILL tokens, get paid instantly |
| 🤝 Peer Sessions | 1-on-1 or group skill sessions with escrow-backed payment |
| 🏆 Gamification | XP points, badges, skill streaks, weekly leaderboards |
| 👥 Social Network | Follow teachers, share achievements, activity feed |
| 💱 Stellar Payments | Near-zero fee micropayments via Stellar network |
| 🔒 Soroban Escrow | Smart contract holds funds until session is completed |
| ⭐ Reputation System | On-chain reviews and reputation scores |
| 🎖️ NFT Certificates | Soroban-minted completion certificates as NFTs |
| 🪙 SKILL Token | Native platform token for governance, rewards, and payments |
| 📊 Analytics Dashboard | Earnings, sessions, skill growth metrics |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Next.js 15  │  │  Mobile PWA  │  │  Freighter / Lobstr      │  │
│  │  (App Router)│  │  (Responsive)│  │  Wallet Integration      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────────┘  │
└─────────┼────────────────-┼──────────────────────┼─────────────────┘
          │                 │                       │
          └─────────────────▼───────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                        API GATEWAY LAYER                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Next.js API Routes (REST + WebSocket)           │    │
│  │  /api/auth  /api/skills  /api/sessions  /api/payments        │    │
│  │  /api/users /api/leaderboard /api/notifications              │    │
│  └──────────────────────────┬──────────────────────────────────┘    │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
          ┌───────────────────┼────────────────────┐
          │                   │                    │
┌─────────▼──────┐  ┌─────────▼──────┐  ┌─────────▼──────────────────┐
│  CORE BACKEND  │  │  STELLAR SDK   │  │   REAL-TIME SERVICES       │
│  ┌───────────┐ │  │  ┌──────────┐  │  │  ┌──────────┐             │
│  │ Auth Svc  │ │  │  │Horizon   │  │  │  │ WebSocket│             │
│  │ (JWT+SIWS)│ │  │  │  API     │  │  │  │  Server  │             │
│  └───────────┘ │  │  └──────────┘  │  │  └──────────┘             │
│  ┌───────────┐ │  │  ┌──────────┐  │  │  ┌──────────┐             │
│  │ Skill Svc │ │  │  │Soroban   │  │  │  │  Redis   │             │
│  │ Session   │ │  │  │Contracts │  │  │  │  PubSub  │             │
│  └───────────┘ │  │  └──────────┘  │  │  └──────────┘             │
│  ┌───────────┐ │  │  ┌──────────┐  │  └────────────────────────────┘
│  │ Payment   │ │  │  │ Stellar  │  │
│  │ Service   │ │  │  │ Testnet/ │  │
│  └───────────┘ │  │  │ Mainnet  │  │
│  ┌───────────┐ │  │  └──────────┘  │
│  │ Gamify    │ │  └────────────────┘
│  │ Engine    │ │
│  └───────────┘ │
└────────────────┘
          │
┌─────────▼────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                   │
│  ┌───────────────┐  ┌─────────────┐  ┌──────────────┐  ┌─────────┐  │
│  │  PostgreSQL   │  │    Redis    │  │     IPFS     │  │ Stellar │  │
│  │  (Primary DB) │  │  (Cache +   │  │  (Avatars,   │  │ Horizon │  │
│  │               │  │   Sessions) │  │  Cert Media) │  │  Index  │  │
│  └───────────────┘  └─────────────┘  └──────────────┘  └─────────┘  │
└──────────────────────────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────────────────────┐
│                    STELLAR BLOCKCHAIN LAYER                           │
│                                                                       │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────┐  │
│  │  SKILL Token    │  │  Escrow Contract │  │ Certificate NFT    │  │
│  │  (Custom Asset) │  │  (Soroban Wasm)  │  │ Contract (Soroban) │  │
│  │                 │  │                  │  │                    │  │
│  │ Issuer Account  │  │ - Lock Funds     │  │ - Mint on complete │  │
│  │ Distribution    │  │ - Release on     │  │ - Store metadata   │  │
│  │ Account         │  │   completion     │  │   on-chain         │  │
│  └─────────────────┘  │ - Refund on      │  └────────────────────┘  │
│                       │   dispute        │                           │
│  ┌─────────────────┐  └──────────────────┘  ┌────────────────────┐  │
│  │ Reputation      │                         │  DEX Integration   │  │
│  │ Contract        │                         │  (SKILL ↔ XLM)    │  │
│  │ (On-chain score)│                         │  Stellar DEX       │  │
│  └─────────────────┘                         └────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
skill-exchange/
├── frontend/                      # Next.js 15 App (App Router)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── signup/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── profile/[username]/page.tsx
│   │   │   │   ├── skills/page.tsx
│   │   │   │   ├── sessions/page.tsx
│   │   │   │   ├── wallet/page.tsx
│   │   │   │   └── leaderboard/page.tsx
│   │   │   ├── api/
│   │   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   │   ├── skills/route.ts
│   │   │   │   ├── sessions/route.ts
│   │   │   │   ├── payments/route.ts
│   │   │   │   └── stellar/route.ts
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Landing page
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Features.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── SkillsShowcase.tsx
│   │   │   │   ├── Gamification.tsx
│   │   │   │   ├── Stats.tsx
│   │   │   │   └── CTA.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   ├── wallet/
│   │   │   │   ├── WalletConnect.tsx
│   │   │   │   └── PaymentModal.tsx
│   │   │   └── sessions/
│   │   │       ├── SessionCard.tsx
│   │   │       └── BookingFlow.tsx
│   │   ├── lib/
│   │   │   ├── stellar/
│   │   │   │   ├── client.ts         # Stellar SDK client
│   │   │   │   ├── soroban.ts        # Soroban contract calls
│   │   │   │   ├── payments.ts       # Payment utilities
│   │   │   │   └── token.ts          # SKILL token operations
│   │   │   ├── hooks/
│   │   │   │   ├── useStellarWallet.ts
│   │   │   │   ├── useSession.ts
│   │   │   │   └── useGamification.ts
│   │   │   └── utils/
│   │   │       ├── xp.ts             # XP calculation logic
│   │   │       └── formatters.ts
│   │   └── types/
│   │       ├── stellar.ts
│   │       ├── skill.ts
│   │       └── user.ts
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
│
├── contracts/                      # Soroban Smart Contracts (Rust)
│   ├── escrow/
│   │   ├── src/
│   │   │   └── lib.rs              # Escrow contract
│   │   └── Cargo.toml
│   ├── skill-token/
│   │   ├── src/
│   │   │   └── lib.rs              # SKILL token contract
│   │   └── Cargo.toml
│   ├── reputation/
│   │   ├── src/
│   │   │   └── lib.rs              # Reputation/review contract
│   │   └── Cargo.toml
│   └── certificates/
│       ├── src/
│       │   └── lib.rs              # NFT certificate contract
│       └── Cargo.toml
│
├── backend/                        # Optional standalone backend
│   ├── src/
│   │   ├── services/
│   │   │   ├── stellar.service.ts
│   │   │   ├── gamification.service.ts
│   │   │   └── notification.service.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── skill.model.ts
│   │   │   └── session.model.ts
│   │   └── index.ts
│   └── package.json
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── STELLAR_SETUP.md
│   ├── CONTRACTS.md
│   └── API.md
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔗 Stellar Integration Details

### SKILL Token (Custom Stellar Asset)
```
Asset Code:   SKILL
Asset Type:   Stellar Custom Asset (SEP-0001 compliant)
Issuer:       G... (SkillXchange issuer account)
Total Supply: 100,000,000 SKILL
Distribution: 
  - 40% Platform rewards
  - 30% User incentives  
  - 20% Team & development
  - 10% Reserve
```

### Soroban Smart Contracts

#### 1. Escrow Contract
Locks payment when a student books a session. Releases funds to the teacher after the session is marked complete by both parties or after a dispute window (48h).

```rust
// Escrow states
enum EscrowState {
    Pending,
    Active,
    Completed,
    Disputed,
    Refunded,
}
```

#### 2. Reputation Contract
Stores on-chain reputation scores, weighted by session count and review ratings.

#### 3. Certificate NFT Contract
Mints non-fungible tokens (NFTs) as skill completion certificates on Soroban. Certificate metadata stored on IPFS.

#### 4. SKILL Token Contract
SEP-1 compatible fungible token with:
- Staking for teacher verification
- Governance voting weights
- Reward distribution logic

### Stellar Horizon API Usage
- **Accounts**: Create & manage user Stellar accounts
- **Transactions**: Submit payment & smart contract invocations
- **DEX**: SKILL ↔ XLM swap via Stellar DEX
- **Streaming**: Real-time payment event streaming

---

## 🎮 Gamification System

```
XP Sources:
├── Complete a teaching session    → +150 XP
├── Complete a learning session    → +50 XP
├── Receive 5-star review          → +100 XP
├── Daily login streak (7 days)    → +200 XP bonus
├── Refer a new user               → +500 XP
├── First session ever             → +1000 XP (newcomer bonus)
└── Publish a skill listing        → +25 XP

Levels & Badges:
├── 🌱 Seedling      (0–500 XP)
├── 📚 Apprentice    (500–2000 XP)
├── ⚡ Practitioner  (2000–5000 XP)
├── 🏆 Expert        (5000–15000 XP)
├── 💎 Master        (15000–50000 XP)
└── 🌟 Legend        (50000+ XP)

Leaderboards:
├── Weekly Top Teachers (by sessions + rating)
├── Top Earners (SKILL tokens earned this month)
├── Rising Stars (fastest XP growth)
└── Skill-specific boards (e.g., Top Coders, Top Designers)
```

---

## 🔐 Authentication Flow

```
1. User clicks "Connect Wallet"
2. Freighter/Lobstr wallet signs a challenge message (SIWS - Sign In With Stellar)
3. Backend verifies the signature against the Stellar public key
4. JWT issued with the Stellar address as the user identifier
5. Traditional email/password also supported (account linked to Stellar address later)
```

---

## 💳 Payment Flow

```
Student books session:
  1. Student approves SKILL/XLM amount in wallet
  2. Soroban escrow contract locks funds
  3. Teacher accepts session booking
  4. Session takes place (video/chat/in-person)
  5. Both parties confirm completion
  6. Escrow releases payment to teacher (minus platform fee: 3%)
  7. XP awarded to both parties
  8. Certificate NFT minted for student (if applicable)

Dispute Flow:
  - Either party opens dispute within 48h
  - SkillXchange admin or DAO votes on outcome
  - Funds released or refunded based on decision
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, TypeScript, Vanilla CSS |
| **Blockchain** | Stellar Network (Testnet → Mainnet) |
| **Smart Contracts** | Soroban (Rust) |
| **Stellar SDK** | @stellar/stellar-sdk |
| **Wallet** | Freighter API, Lobstr, Albedo |
| **Database** | PostgreSQL (Neon / Supabase) |
| **Cache** | Redis (Upstash) |
| **File Storage** | IPFS (Pinata) |
| **Auth** | SIWS (Sign In With Stellar) + NextAuth |
| **Video Sessions** | Daily.co / LiveKit (WebRTC) |
| **Real-time** | WebSockets / Server-Sent Events |
| **Email** | Resend / SendGrid |
| **Deployment** | Vercel (frontend) + Railway (backend) |
| **Monitoring** | Sentry + Stellar Expert |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / pnpm
- Rust + Cargo (for Soroban contracts)
- Stellar CLI (`stellar --version`)
- Freighter wallet browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/skill-exchange.git
cd skill-exchange

# Install frontend dependencies
cd frontend
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Stellar Network
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Contract Addresses (after deployment)
NEXT_PUBLIC_ESCROW_CONTRACT_ID=C...
NEXT_PUBLIC_SKILL_TOKEN_CONTRACT_ID=C...
NEXT_PUBLIC_REPUTATION_CONTRACT_ID=C...
NEXT_PUBLIC_CERTIFICATE_CONTRACT_ID=C...

# SKILL Token
NEXT_PUBLIC_SKILL_ASSET_CODE=SKILL
NEXT_PUBLIC_SKILL_ISSUER=G...

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Auth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Storage
PINATA_API_KEY=...
PINATA_SECRET_KEY=...

# Video
DAILY_API_KEY=...
```

### Run Development Server

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

### Deploy Soroban Contracts

```bash
# Install Stellar CLI
cargo install --locked stellar-cli

# Build contracts
cd contracts/escrow
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/escrow.wasm \
  --source your-account \
  --network testnet
```

---

## 🗺️ Roadmap

### Phase 1 — Foundation (MVP) 
- [ ] Landing page & user auth (Stellar wallet + email)
- [ ] Skill listing & search
- [ ] Basic session booking
- [ ] XLM payment integration
- [ ] User profiles & reviews

### Phase 2 — Blockchain Core
- [ ] SKILL token creation & distribution
- [ ] Soroban escrow contract deployment
- [ ] Reputation contract
- [ ] SKILL/XLM DEX swap UI

### Phase 3 — Gamification
- [ ] XP & leveling system
- [ ] Badge system
- [ ] Leaderboards
- [ ] Social feed & notifications
- [ ] Streak tracking

### Phase 4 — Advanced Features
- [ ] NFT certificates (Soroban)
- [ ] DAO governance (SKILL token voting)
- [ ] Group sessions / cohorts
- [ ] Mobile PWA
- [ ] Multi-language support

### Phase 5 — Growth
- [ ] Stellar anchor integration (fiat on/off ramp)
- [ ] Institutional partnerships
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md).

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, then push
git push origin feature/your-feature-name

# Open a Pull Request
```

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🌐 Links

- 🌍 [Website](https://skillxchange.app) *(coming soon)*
- 📖 [Documentation](https://docs.skillxchange.app) *(coming soon)*
- 🐦 [Twitter/X](https://twitter.com/skillxchange)
- 💬 [Discord](https://discord.gg/skillxchange)
- ⭐ [Stellar Expert](https://stellar.expert)

---

<div align="center">
  <strong>Built with ❤️ on the Stellar Network</strong><br/>
  <sub>Fast · Cheap · Borderless · Decentralized</sub>
</div>
