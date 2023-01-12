use anchor_lang::prelude::*;

declare_id!("8TjeZEGGfFcs5z7NKJNz6MuEdH3xrCSybaa5SxQ2ZD9m");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_bets = 0;
    base_account.last_winner = "First Round";
    Ok(())
  }

  // The function reference the user from the Context
  pub fn add_gif(ctx: Context<AddBet>, user_alias: String) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

	// Build the struct.
    let item = ItemStruct {
      user_alias: user_alias.to_string(),
      user_address: *user.to_account_info().key,
    };
		
	// Add it to the users_list vector.
    base_account.users_list.push(item);
    base_account.total_bets += 1;
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
  #[account(init, payer = user, space = 9000)]
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
    pub users_list: Vec<ItemStruct>,
}