export const messages = {
  please_connect: "Please connect your wallet to the Polygon network to use UniversalCoffeeDAO.",
  please_connect_wallet: "Please connect your wallet.",
  try_mint_more: (value: string) => `You're trying to mint more than the maximum payout available! The maximum mint payout is ${value} CALM.`,
  before_minting: "Before minting, enter a value.",
  existing_mint:
    "You have an existing bond. Bonding will reset your vesting period and forfeit any pending claimable rewards. We recommend claiming rewards first or using a fresh wallet. Do you still wish to proceed?",
  before_stake: "Before staking, enter a value.",
  before_unstake: "Before un staking, enter a value.",
  tx_successfully_send: "Your transaction was successfully sent",
  tx_successfully_send_approve: "Your transaction was successfully sent. Please refresh your browser in a few seconds :)",
  your_balance_updated: "Done! Please refresh your browser in a few seconds :)",
  nothing_to_claim: "You have nothing to claim",
  something_wrong: "Something went wrong",
  switch_to_polygon: "Switch to the Polygon network?",
  slippage_too_small: "Slippage too small",
  slippage_too_big: "Slippage too big",
  your_balance_update_soon: "Your balance will update soon",
  before_wrap: "Before wrapping, enter a value.",
  before_unwrap: "Before un wrapping, enter a value.",

  before_buying: "Before buying, enter a value.",
  before_swapping: "Before swapping, enter a value.",
};
