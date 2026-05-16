#![no_std]

use core::clone::Clone;
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, String, Vec,
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
    pub admin_fee_recipient: Address,
    pub state: EscrowState,
    pub created_at: u64,
    pub dispute_window_secs: u64,
    pub confirmed_by: Vec<Address>,
}

#[contracttype]
pub enum DataKey {
    Escrow(String),    // session_id → Escrow
    Admin,
    AdminFeeRecipient,
    PlatformFeeBps,
}

// ─────────────────────────────────────────────
//  Contract
// ─────────────────────────────────────────────

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Initialize the contract with an admin address, admin fee recipient, and platform fee.
    pub fn initialize(env: Env, admin: Address, admin_fee_recipient: Address, platform_fee_bps: u32) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::AdminFeeRecipient, &admin_fee_recipient);
        env.storage().instance().set(&DataKey::PlatformFeeBps, &platform_fee_bps);
    }

    /// Update the admin address — callable only by current admin.
    pub fn update_admin(env: Env, new_admin: Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set");
        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &new_admin);
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

        let admin_fee_recipient: Address = env
            .storage()
            .instance()
            .get(&DataKey::AdminFeeRecipient)
            .expect("admin fee recipient not set");

        let platform_fee_bps: u32 = env
            .storage()
            .instance()
            .get(&DataKey::PlatformFeeBps)
            .expect("platform fee not set");

        let escrow = Escrow {
            session_id: session_id.clone(),
            student,
            teacher,
            token,
            amount,
            platform_fee_bps,
            admin_fee_recipient,
            state: EscrowState::Active,
            created_at: env.ledger().timestamp(),
            dispute_window_secs,
            confirmed_by: Vec::new(&env),
        };

        // Emit event
        env.events().publish(("escrow", "locked"), (session_id.clone(), amount));

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

        // Check if both student and teacher have confirmed
        let mut student_confirmed = false;
        let mut teacher_confirmed = false;
        for confirmed in escrow.confirmed_by.iter() {
            if *confirmed == escrow.student {
                student_confirmed = true;
            } else if *confirmed == escrow.teacher {
                teacher_confirmed = true;
            }
        }
        assert!(student_confirmed && teacher_confirmed, "both student and teacher must confirm completion before release");

        // Calculate platform fee
        let fee = (escrow.amount * escrow.platform_fee_bps as i128) / 10_000;
        let teacher_payout = escrow.amount - fee;

        let token_client = token::Client::new(&env, &escrow.token);

        token_client.transfer(
            &env.current_contract_address(),
            &escrow.teacher,
            &teacher_payout,
        );
        token_client.transfer(&env.current_contract_address(), &escrow.admin_fee_recipient, &fee);

        escrow.state = EscrowState::Completed;
        env.storage().persistent().set(&key, &escrow);

        // Emit event
        env.events().publish(("escrow", "released"), (session_id, teacher_payout));
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

        // Emit event
        env.events().publish(("escrow", "refunded"), (session_id, escrow.student.clone()));

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

        // Emit event
        env.events().publish(("escrow", "disputed"), (session_id, caller));

        escrow.state = EscrowState::Disputed;
        env.storage().persistent().set(&key, &escrow);
    }

    /// Confirm completion — both student AND teacher must call this before release_funds auto-triggers.
    pub fn confirm_completion(env: Env, session_id: String, caller: Address) {
        caller.require_auth();

        let key = DataKey::Escrow(session_id.clone());
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        assert!(escrow.state == EscrowState::Active, "invalid state for confirmation");
        assert!(
            caller == escrow.student || caller == escrow.teacher,
            "unauthorized"
        );

        // Check if already confirmed by this party
        let mut already_confirmed = false;
        for confirmed in escrow.confirmed_by.iter() {
            if *confirmed == caller {
                already_confirmed = true;
                break;
            }
        }
        assert!(!already_confirmed, "already confirmed by this party");

        // Add confirmation
        escrow.confirmed_by.push_back(caller.clone());

        // Emit event
        env.events().publish(("escrow", "confirmed"), (session_id, caller));

        env.storage().persistent().set(&key, &escrow);
    }

    /// Release funds after dispute window expires — callable by anyone once deadline passes and no dispute was raised.
    pub fn release_after_window(env: Env, session_id: String) {
        let key = DataKey::Escrow(session_id.clone());
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        assert!(escrow.state == EscrowState::Active, "invalid state for auto-release");

        let deadline = escrow.created_at + escrow.dispute_window_secs;
        assert!(
            env.ledger().timestamp() > deadline,
            "dispute window has not expired yet"
        );

        // Calculate platform fee
        let fee = (escrow.amount * escrow.platform_fee_bps as i128) / 10_000;
        let teacher_payout = escrow.amount - fee;

        let token_client = token::Client::new(&env, &escrow.token);

        token_client.transfer(
            &env.current_contract_address(),
            &escrow.teacher,
            &teacher_payout,
        );
        token_client.transfer(&env.current_contract_address(), &escrow.admin_fee_recipient, &fee);

        escrow.state = EscrowState::Completed;
        env.storage().persistent().set(&key, &escrow);

        // Emit event
        env.events().publish(("escrow", "released"), (session_id, teacher_payout));
    }

    /// View an escrow record.
    pub fn get_escrow(env: Env, session_id: String) -> Escrow {
        env.storage()
            .persistent()
            .get(&DataKey::Escrow(session_id))
            .expect("escrow not found")
    }
}
