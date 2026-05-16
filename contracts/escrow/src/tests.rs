use soroban_sdk::{
    token, Address, BytesN, Env, String, Vec,
    testutils::{Address as _, AuthorizedFunction, Ledger},
};

use crate::{DataKey, Escrow, EscrowContract, EscrowState};

#[test]
fn test_happy_path() {
    let env = Env::default();
    env.mock_all_auths();

    // Initialize contract
    let admin = Address::generate(&env);
    let admin_fee_recipient = Address::generate(&env);
    let platform_fee_bps = 300u32; // 3%
    EscrowContract::initialize(&env, admin.clone(), admin_fee_recipient.clone(), platform_fee_bps);

    // Create test token
    let token = token::create_token_contract(&env);

    // Student locks funds
    let student = Address::generate(&env);
    let teacher = Address::generate(&env);
    let session_id = String::from("session123");
    let amount = 1000i128;
    let dispute_window_secs = 48 * 60 * 60; // 48 hours

    // Set up token balance for student
    let token_client = token::Client::new(&env, &token);
    token_client.mint(&admin, &student, &amount);

    // Lock funds
    EscrowContract::lock_funds(
        &env,
        session_id.clone(),
        student.clone(),
        teacher.clone(),
        token.clone(),
        amount,
        dispute_window_secs,
    );

    // Both student and teacher confirm completion
    EscrowContract::confirm_completion(&env, session_id.clone(), student.clone());
    EscrowContract::confirm_completion(&env, session_id.clone(), teacher.clone());

    // Release funds
    EscrowContract::release_funds(&env, session_id.clone(), student.clone());

    // Verify state
    let escrow = EscrowContract::get_escrow(&env, session_id.clone());
    assert_eq!(escrow.state, EscrowState::Completed);

    // Verify balances: teacher should get amount - fee, admin fee recipient should get fee
    let fee = (amount * platform_fee_bps as i128) / 10_000;
    let teacher_payout = amount - fee;
    assert_eq!(token_client.balance(&teacher), teacher_payout);
    assert_eq!(token_client.balance(&admin_fee_recipient), fee);
}

#[test]
fn test_refund_path() {
    let env = Env::default();
    env.mock_all_auths();

    // Initialize contract
    let admin = Address::generate(&env);
    let admin_fee_recipient = Address::generate(&env);
    let platform_fee_bps = 300u32; // 3%
    EscrowContract::initialize(&env, admin.clone(), admin_fee_recipient.clone(), platform_fee_bps);

    // Create test token
    let token = token::create_token_contract(&env);

    // Student locks funds
    let student = Address::generate(&env);
    let teacher = Address::generate(&env);
    let session_id = String::from("session456");
    let amount = 1000i128;
    let dispute_window_secs = 48 * 60 * 60; // 48 hours

    // Set up token balance for student
    let token_client = token::Client::new(&env, &token);
    token_client.mint(&admin, &student, &amount);

    // Lock funds
    EscrowContract::lock_funds(
        &env,
        session_id.clone(),
        student.clone(),
        teacher.clone(),
        token.clone(),
        amount,
        dispute_window_secs,
    );

    // Admin refunds
    EscrowContract::refund(&env, session_id.clone());

    // Verify state
    let escrow = EscrowContract::get_escrow(&env, session_id.clone());
    assert_eq!(escrow.state, EscrowState::Refunded);

    // Verify student balance
    assert_eq!(token_client.balance(&student), amount);
}

#[test]
fn test_dispute_path() {
    let env = Env::default();
    env.mock_all_auths();

    // Initialize contract
    let admin = Address::generate(&env);
    let admin_fee_recipient = Address::generate(&env);
    let platform_fee_bps = 300u32; // 3%
    EscrowContract::initialize(&env, admin.clone(), admin_fee_recipient.clone(), platform_fee_bps);

    // Create test token
    let token = token::create_token_contract(&env);

    // Student locks funds
    let student = Address::generate(&env);
    let teacher = Address::generate(&env);
    let session_id = String::from("session789");
    let amount = 1000i128;
    let dispute_window_secs = 48 * 60 * 60; // 48 hours

    // Set up token balance for student
    let token_client = token::Client::new(&env, &token);
    token_client.mint(&admin, &student, &amount);

    // Lock funds
    EscrowContract::lock_funds(
        &env,
        session_id.clone(),
        student.clone(),
        teacher.clone(),
        token.clone(),
        amount,
        dispute_window_secs,
    );

    // Student opens dispute
    EscrowContract::open_dispute(&env, session_id.clone(), student.clone());

    // Verify state
    let escrow = EscrowContract::get_escrow(&env, session_id.clone());
    assert_eq!(escrow.state, EscrowState::Disputed);

    // Admin refunds
    EscrowContract::refund(&env, session_id.clone());

    // Verify state
    let escrow = EscrowContract::get_escrow(&env, session_id.clone());
    assert_eq!(escrow.state, EscrowState::Refunded);

    // Verify student balance
    assert_eq!(token_client.balance(&student), amount);
}

#[test]
fn test_auto_release_path() {
    let env = Env::default();
    env.mock_all_auths();

    // Initialize contract
    let admin = Address::generate(&env);
    let admin_fee_recipient = Address::generate(&env);
    let platform_fee_bps = 300u32; // 3%
    EscrowContract::initialize(&env, admin.clone(), admin_fee_recipient.clone(), platform_fee_bps);

    // Create test token
    let token = token::create_token_contract(&env);

    // Student locks funds
    let student = Address::generate(&env);
    let teacher = Address::generate(&env);
    let session_id = String::from("session999");
    let amount = 1000i128;
    let dispute_window_secs = 48 * 60 * 60; // 48 hours

    // Set up token balance for student
    let token_client = token::Client::new(&env, &token);
    token_client.mint(&admin, &student, &amount);

    // Lock funds
    EscrowContract::lock_funds(
        &env,
        session_id.clone(),
        student.clone(),
        teacher.clone(),
        token.clone(),
        amount,
        dispute_window_secs,
    );

    // Advance time past dispute window
    env.ledger().set_timestamp(env.ledger().timestamp() + dispute_window_secs + 1);

    // Anyone can release after window expires
    let anyone = Address::generate(&env);
    EscrowContract::release_after_window(&env, session_id.clone());

    // Verify state
    let escrow = EscrowContract::get_escrow(&env, session_id.clone());
    assert_eq!(escrow.state, EscrowState::Completed);

    // Verify balances: teacher should get amount - fee, admin fee recipient should get fee
    let fee = (amount * platform_fee_bps as i128) / 10_000;
    let teacher_payout = amount - fee;
    assert_eq!(token_client.balance(&teacher), teacher_payout);
    assert_eq!(token_client.balance(&admin_fee_recipient), fee);
}

#[test]
fn test_double_lock_same_session_id() {
    let env = Env::default();
    env.mock_all_auths();

    // Initialize contract
    let admin = Address::generate(&env);
    let admin_fee_recipient = Address::generate(&env);
    let platform_fee_bps = 300u32; // 3%
    EscrowContract::initialize(&env, admin.clone(), admin_fee_recipient.clone(), platform_fee_bps);

    // Create test token
    let token = token::create_token_contract(&env);

    // Student locks funds
    let student = Address::generate(&env);
    let teacher = Address::generate(&env);
    let session_id = String::from("session111");
    let amount = 1000i128;
    let dispute_window_secs = 48 * 60 * 60; // 48 hours

    // Set up token balance for student
    let token_client = token::Client::new(&env, &token);
    token_client.mint(&admin, &student, &amount);

    // First lock should succeed
    EscrowContract::lock_funds(
        &env,
        session_id.clone(),
        student.clone(),
        teacher.clone(),
        token.clone(),
        amount,
        dispute_window_secs,
    );

    // Second lock with same session ID should panic
    let result = std::panic::catch_unwind(|| {
        EscrowContract::lock_funds(
            &env,
            session_id.clone(),
            student.clone(),
            teacher.clone(),
            token.clone(),
            amount,
            dispute_window_secs,
        );
    });

    assert!(result.is_err());
}

#[test]
fn test_unauthorized_caller_to_release_funds() {
    let env = Env::default();
    env.mock_all_auths();

    // Initialize contract
    let admin = Address::generate(&env);
    let admin_fee_recipient = Address::generate(&env);
    let platform_fee_bps = 300u32; // 3%
    EscrowContract::initialize(&env, admin.clone(), admin_fee_recipient.clone(), platform_fee_bps);

    // Create test token
    let token = token::create_token_contract(&env);

    // Student locks funds
    let student = Address::generate(&env);
    let teacher = Address::generate(&env);
    let session_id = String::from("session222");
    let amount = 1000i128;
    let dispute_window_secs = 48 * 60 * 60; // 48 hours

    // Set up token balance for student
    let token_client = token::Client::new(&env, &token);
    token_client.mint(&admin, &student, &amount);

    // Lock funds
    EscrowContract::lock_funds(
        &env,
        session_id.clone(),
        student.clone(),
        teacher.clone(),
        token.clone(),
        amount,
        dispute_window_secs,
    );

    // Unauthorized caller should panic
    let unauthorized = Address::generate(&env);
    let result = std::panic::catch_unwind(|| {
        EscrowContract::release_funds(&env, session_id.clone(), unauthorized.clone());
    });

    assert!(result.is_err());
}

#[test]
fn test_dispute_after_window() {
    let env = Env::default();
    env.mock_all_auths();

    // Initialize contract
    let admin = Address::generate(&env);
    let admin_fee_recipient = Address::generate(&env);
    let platform_fee_bps = 300u32; // 3%
    EscrowContract::initialize(&env, admin.clone(), admin_fee_recipient.clone(), platform_fee_bps);

    // Create test token
    let token = token::create_token_contract(&env);

    // Student locks funds
    let student = Address::generate(&env);
    let teacher = Address::generate(&env);
    let session_id = String::from("session333");
    let amount = 1000i128;
    let dispute_window_secs = 48 * 60 * 60; // 48 hours

    // Set up token balance for student
    let token_client = token::Client::new(&env, &token);
    token_client.mint(&admin, &student, &amount);

    // Lock funds
    EscrowContract::lock_funds(
        &env,
        session_id.clone(),
        student.clone(),
        teacher.clone(),
        token.clone(),
        amount,
        dispute_window_secs,
    );

    // Advance time past dispute window
    env.ledger().set_timestamp(env.ledger().timestamp() + dispute_window_secs + 1);

    // Dispute after window should panic
    let result = std::panic::catch_unwind(|| {
        EscrowContract::open_dispute(&env, session_id.clone(), student.clone());
    });

    assert!(result.is_err());
}

#[test]
fn test_confirm_after_completion() {
    let env = Env::default();
    env.mock_all_auths();

    // Initialize contract
    let admin = Address::generate(&env);
    let admin_fee_recipient = Address::generate(&env);
    let platform_fee_bps = 300u32; // 3%
    EscrowContract::initialize(&env, admin.clone(), admin_fee_recipient.clone(), platform_fee_bps);

    // Create test token
    let token = token::create_token_contract(&env);

    // Student locks funds
    let student = Address::generate(&env);
    let teacher = Address::generate(&env);
    let session_id = String::from("session444");
    let amount = 1000i128;
    let dispute_window_secs = 48 * 60 * 60; // 48 hours

    // Set up token balance for student
    let token_client = token::Client::new(&env, &token);
    token_client.mint(&admin, &student, &amount);

    // Lock funds
    EscrowContract::lock_funds(
        &env,
        session_id.clone(),
        student.clone(),
        teacher.clone(),
        token.clone(),
        amount,
        dispute_window_secs,
    );

    // Both confirm
    EscrowContract::confirm_completion(&env, session_id.clone(), student.clone());
    EscrowContract::confirm_completion(&env, session_id.clone(), teacher.clone());

    // Release funds
    EscrowContract::release_funds(&env, session_id.clone(), student.clone());

    // Confirm after completion should panic
    let result = std::panic::catch_unwind(|| {
        EscrowContract::confirm_completion(&env, session_id.clone(), student.clone());
    });

    assert!(result.is_err());
}