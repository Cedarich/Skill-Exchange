#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, String,
};

// ─────────────────────────────────────────────
//  Data Types
// ─────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug)]
pub struct Certificate {
    pub token_id: u64,
    pub owner: Address,
    pub skill_name: String,
    pub teacher: Address,
    pub session_id: String,
    pub ipfs_cid: String, // metadata stored on IPFS
    pub issued_at: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    NextTokenId,
    Certificate(u64),        // token_id → Certificate
    OwnerCerts(Address),     // owner → Vec<u64> (list of token IDs)
}

// ─────────────────────────────────────────────
//  Contract
// ─────────────────────────────────────────────

#[contract]
pub struct CertificateContract;

#[contractimpl]
impl CertificateContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::NextTokenId, &0u64);
    }

    /// Mint a new certificate NFT for a student upon session completion.
    /// Only callable by admin (or escrow contract in production).
    pub fn mint(
        env: Env,
        student: Address,
        skill_name: String,
        teacher: Address,
        session_id: String,
        ipfs_cid: String,
    ) -> u64 {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set");
        admin.require_auth();

        let token_id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::NextTokenId)
            .unwrap_or(0);

        let cert = Certificate {
            token_id,
            owner: student.clone(),
            skill_name,
            teacher,
            session_id,
            ipfs_cid,
            issued_at: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&DataKey::Certificate(token_id), &cert);

        // Update next token ID
        env.storage()
            .instance()
            .set(&DataKey::NextTokenId, &(token_id + 1));

        token_id
    }

    /// Fetch a certificate by token ID.
    pub fn get_certificate(env: Env, token_id: u64) -> Certificate {
        env.storage()
            .persistent()
            .get(&DataKey::Certificate(token_id))
            .expect("certificate not found")
    }

    /// Return total certificates minted.
    pub fn total_supply(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::NextTokenId)
            .unwrap_or(0)
    }
}
