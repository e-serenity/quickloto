use anchor_lang::prelude::*;

declare_id!("Uit4YPvpH41rggra2Ljt5u7jNWSAGQns61vYQhfYFUY");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_bets = 0;
    base_account.last_winner = String::from("First Round");
    Ok(())
  }

  // The function reference the user from the Context
  pub fn add_bet(ctx: Context<AddBet>, user_alias: String) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

	// Build the struct.
    let item = ItemStruct {
      user_alias: user_alias.to_string(),
      user_address: *user.to_account_info().key,
    };
		
	// Add it to the bet_list vector.
    base_account.bet_list.push(item);
    base_account.total_bets += 1;
    if base_account.total_bets > 9 {
        println!("Lottery complete !");
        base_account.total_bets = 0;
        base_account.last_winner = user_alias;
        base_account.bet_list.clear();
    };
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
  #[account(init, payer = user, space = 10000)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program <'info, System>,
}

#[derive(Accounts)]
pub struct AddBet<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub user_alias: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_bets: u64,
    pub last_winner: String,
    pub bet_list: Vec<ItemStruct>,
}