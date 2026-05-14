#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, String,
};

// ─────────────────────────────────────────────
//  Data Types
// ─────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug)]
pub struct Review {
    pub reviewer: Address,
    pub reviewee: Address,
    pub session_id: String,
    pub rating: u32, // 1–5 stars (multiplied by 100 for precision, e.g. 450 = 4.5 stars)
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct ReputationScore {
    pub total_rating: u64, // cumulative rating points
    pub review_count: u64,
    pub session_count: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Score(Address),
    ReviewKey(String, Address), // (session_id, reviewer) → Review
}

// ─────────────────────────────────────────────
//  Contract
// ─────────────────────────────────────────────

#[contract]
pub struct ReputationContract;

#[contractimpl]
impl ReputationContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Submit a review for a teacher/student after session completion.
    pub fn submit_review(
        env: Env,
        session_id: String,
        reviewer: Address,
        reviewee: Address,
        rating: u32,
    ) {
        reviewer.require_auth();
        assert!(rating >= 100 && rating <= 500, "rating must be 100–500");

        let review_key = DataKey::ReviewKey(session_id.clone(), reviewer.clone());
        assert!(
            !env.storage().persistent().has(&review_key),
            "review already submitted"
        );

        let review = Review {
            reviewer: reviewer.clone(),
            reviewee: reviewee.clone(),
            session_id,
            rating,
            timestamp: env.ledger().timestamp(),
        };
        env.storage().persistent().set(&review_key, &review);

        // Update reviewee's reputation score
        let score_key = DataKey::Score(reviewee);
        let mut score: ReputationScore = env
            .storage()
            .persistent()
            .get(&score_key)
            .unwrap_or(ReputationScore {
                total_rating: 0,
                review_count: 0,
                session_count: 0,
            });

        score.total_rating += rating as u64;
        score.review_count += 1;
        env.storage().persistent().set(&score_key, &score);
    }

    /// Increment session count for a user (called by escrow contract on completion).
    pub fn increment_sessions(env: Env, user: Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set");
        admin.require_auth();

        let score_key = DataKey::Score(user);
        let mut score: ReputationScore = env
            .storage()
            .persistent()
            .get(&score_key)
            .unwrap_or(ReputationScore {
                total_rating: 0,
                review_count: 0,
                session_count: 0,
            });
        score.session_count += 1;
        env.storage().persistent().set(&score_key, &score);
    }

    /// Returns the weighted reputation score (average rating * 100, or 0 if no reviews).
    pub fn get_score(env: Env, user: Address) -> ReputationScore {
        env.storage()
            .persistent()
            .get(&DataKey::Score(user))
            .unwrap_or(ReputationScore {
                total_rating: 0,
                review_count: 0,
                session_count: 0,
            })
    }
}
