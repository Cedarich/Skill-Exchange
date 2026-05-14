#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, String,
};

// ─────────────────────────────────────────────
//  Data Types
// ─────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum EscrowState {
    Pending,
    Active,
    Completed,
    Disputed,
    Refunded,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Escrow {
    pub session_id: String,
    pub student: Address,
    pub teacher: Address,
    pub token: Address,
    pub amount: i128,
    pub platform_fee_bps: u32, // basis points, e.g. 300 = 3%
    pub state: EscrowState,
    pub created_at: u64,
    pub dispute_window_secs: u64,
}

#[contracttype]
pub enum DataKey {
    Escrow(String),    // session_id → Escrow
    Admin,
}

// ─────────────────────────────────────────────
//  Contract
// ─────────────────────────────────────────────

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Initialize the contract with an admin address.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Student locks funds into escrow when booking a session.
    pub fn lock_funds(
        env: Env,
        session_id: String,
        student: Address,
        teacher: Address,
        token: Address,
        amount: i128,
        dispute_window_secs: u64,
    ) {
        student.require_auth();
        assert!(amount > 0, "amount must be positive");
        assert!(
            !env.storage().persistent().has(&DataKey::Escrow(session_id.clone())),
            "session escrow already exists"
        );

        // Transfer tokens from student to this contract
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&student, &env.current_contract_address(), &amount);

        let escrow = Escrow {
            session_id: session_id.clone(),
            student,
            teacher,
            token,
            amount,
            platform_fee_bps: 300, // 3% platform fee
            state: EscrowState::Active,
            created_at: env.ledger().timestamp(),
            dispute_window_secs,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Escrow(session_id), &escrow);
    }

    /// Release funds to the teacher after both parties confirm completion.
    pub fn release_funds(env: Env, session_id: String, caller: Address) {
        caller.require_auth();

        let key = DataKey::Escrow(session_id.clone());
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        assert!(escrow.state == EscrowState::Active, "invalid state");
        assert!(
            caller == escrow.student || caller == escrow.teacher,
            "unauthorized"
        );

        // Calculate platform fee
        let fee = (escrow.amount * escrow.platform_fee_bps as i128) / 10_000;
        let teacher_payout = escrow.amount - fee;

        let token_client = token::Client::new(&env, &escrow.token);
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set");

        token_client.transfer(
            &env.current_contract_address(),
            &escrow.teacher,
            &teacher_payout,
        );
        token_client.transfer(&env.current_contract_address(), &admin, &fee);

        escrow.state = EscrowState::Completed;
        env.storage().persistent().set(&key, &escrow);
    }

    /// Refund the student — called by admin or after dispute resolution.
    pub fn refund(env: Env, session_id: String) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set");
        admin.require_auth();

        let key = DataKey::Escrow(session_id.clone());
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        assert!(
            escrow.state == EscrowState::Active || escrow.state == EscrowState::Disputed,
            "invalid state for refund"
        );

        let token_client = token::Client::new(&env, &escrow.token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow.student,
            &escrow.amount,
        );

        escrow.state = EscrowState::Refunded;
        env.storage().persistent().set(&key, &escrow);
    }

    /// Open a dispute — callable by student or teacher within the dispute window.
    pub fn open_dispute(env: Env, session_id: String, caller: Address) {
        caller.require_auth();

        let key = DataKey::Escrow(session_id.clone());
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        assert!(escrow.state == EscrowState::Active, "invalid state");
        assert!(
            caller == escrow.student || caller == escrow.teacher,
            "unauthorized"
        );

        let deadline = escrow.created_at + escrow.dispute_window_secs;
        assert!(
            env.ledger().timestamp() <= deadline,
            "dispute window has passed"
        );

        escrow.state = EscrowState::Disputed;
        env.storage().persistent().set(&key, &escrow);
    }

    /// View an escrow record.
    pub fn get_escrow(env: Env, session_id: String) -> Escrow {
        env.storage()
            .persistent()
            .get(&DataKey::Escrow(session_id))
            .expect("escrow not found")
    }
}
