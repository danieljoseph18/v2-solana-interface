export const idl = {
  address: "3JhuFvHHTxCGeJviVMv4SYUWQ1qAb9tFNy7ZU8dxBhpq",
  metadata: {
    name: "solana_liquidity_pool",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  docs: [
    "The main vault program.",
    "It includes instructions for initialize, deposit, withdraw, admin deposit/withdraw, etc.",
  ],
  instructions: [
    {
      name: "admin_deposit",
      docs: ["Admin function to deposit tokens (market making profits)"],
      discriminator: [210, 66, 65, 182, 102, 214, 176, 30],
      accounts: [
        {
          name: "admin",
          writable: true,
          signer: true,
        },
        {
          name: "pool_state",
          writable: true,
        },
        {
          name: "admin_token_account",
          writable: true,
        },
        {
          name: "vault_account",
          writable: true,
        },
        {
          name: "chainlink_program",
        },
        {
          name: "chainlink_feed",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "admin_withdraw",
      docs: ["Admin function to withdraw tokens (market making losses)"],
      discriminator: [160, 166, 147, 222, 46, 220, 75, 224],
      accounts: [
        {
          name: "admin",
          writable: true,
          signer: true,
        },
        {
          name: "pool_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101],
              },
            ],
          },
        },
        {
          name: "vault_account",
          writable: true,
        },
        {
          name: "admin_token_account",
          writable: true,
        },
        {
          name: "chainlink_program",
        },
        {
          name: "chainlink_feed",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "claim_rewards",
      docs: ["Claim user rewards"],
      discriminator: [4, 144, 132, 71, 116, 23, 151, 80],
      accounts: [
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "pool_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101],
              },
            ],
          },
        },
        {
          name: "user_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [117, 115, 101, 114, 45, 115, 116, 97, 116, 101],
              },
              {
                kind: "account",
                path: "user",
              },
            ],
          },
        },
        {
          name: "usdc_reward_vault",
          writable: true,
        },
        {
          name: "user_usdc_account",
          writable: true,
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
      ],
      args: [],
    },
    {
      name: "close_pool",
      docs: ["Close the pool (admin only)"],
      discriminator: [140, 189, 209, 23, 239, 62, 239, 11],
      accounts: [
        {
          name: "admin",
          writable: true,
          signer: true,
        },
        {
          name: "pool_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101],
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "deposit",
      docs: ["Deposit SOL or USDC into the pool"],
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182],
      accounts: [
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "pool_state",
          docs: ["Global PoolState"],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101],
              },
            ],
          },
        },
        {
          name: "user_token_account",
          docs: ["The user's token account from which they are depositing"],
          writable: true,
        },
        {
          name: "vault_account",
          docs: ["Vault for either SOL (wrapped) or USDC"],
          writable: true,
        },
        {
          name: "user_state",
          docs: ["The user's associated UserState"],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [117, 115, 101, 114, 45, 115, 116, 97, 116, 101],
              },
              {
                kind: "account",
                path: "user",
              },
            ],
          },
        },
        {
          name: "lp_token_mint",
          docs: ["LP token mint"],
          writable: true,
        },
        {
          name: "user_lp_token_account",
          docs: [
            "The user's LP token account (where minted LP tokens will go)",
          ],
          writable: true,
        },
        {
          name: "chainlink_program",
        },
        {
          name: "chainlink_feed",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "token_amount",
          type: "u64",
        },
      ],
    },
    {
      name: "initialize",
      docs: ["Initialize the liquidity pool"],
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: "admin",
          writable: true,
          signer: true,
        },
        {
          name: "pool_state",
          docs: ["The PoolState (PDA) to store global info about the pool"],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101],
              },
            ],
          },
        },
        {
          name: "sol_vault",
          docs: [
            "SOL vault account (if using wrapped SOL, this would be a token account)",
            "Here, assume you've already created the vault outside or are about to",
          ],
          writable: true,
        },
        {
          name: "usdc_vault",
          docs: ["USDC vault account"],
          writable: true,
        },
        {
          name: "usdc_reward_vault",
          docs: ["Reward vault for USDC"],
          writable: true,
        },
        {
          name: "lp_token_mint",
          docs: ["LP token mint"],
          writable: true,
          signer: true,
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "rent",
          address: "SysvarRent111111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "start_rewards",
      docs: ["Admin function to start new reward distribution"],
      discriminator: [62, 183, 108, 14, 161, 145, 121, 115],
      accounts: [
        {
          name: "admin",
          writable: true,
          signer: true,
        },
        {
          name: "pool_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101],
              },
            ],
          },
        },
        {
          name: "admin_usdc_account",
          docs: ["Admin's USDC token account"],
          writable: true,
        },
        {
          name: "usdc_reward_vault",
          docs: ["Program's USDC reward vault"],
          writable: true,
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
      ],
      args: [
        {
          name: "usdc_amount",
          type: "u64",
        },
        {
          name: "tokens_per_interval",
          type: "u64",
        },
      ],
    },
    {
      name: "withdraw",
      docs: ["Withdraw tokens from the pool"],
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34],
      accounts: [
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "pool_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101],
              },
            ],
          },
        },
        {
          name: "user_state",
          docs: ["The user's associated UserState"],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [117, 115, 101, 114, 45, 115, 116, 97, 116, 101],
              },
              {
                kind: "account",
                path: "user",
              },
            ],
          },
        },
        {
          name: "lp_token_mint",
          docs: ["LP token mint"],
          writable: true,
        },
        {
          name: "user_lp_token_account",
          docs: [
            "User's LP token account (where they hold the LP tokens to burn)",
          ],
          writable: true,
        },
        {
          name: "vault_account",
          docs: ["Vault for SOL or USDC"],
          writable: true,
        },
        {
          name: "user_token_account",
          docs: ["User's token account to receive the withdrawn tokens"],
          writable: true,
        },
        {
          name: "chainlink_program",
        },
        {
          name: "chainlink_feed",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
      ],
      args: [
        {
          name: "lp_token_amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "PoolState",
      discriminator: [247, 237, 227, 245, 215, 195, 222, 70],
    },
    {
      name: "UserState",
      discriminator: [72, 177, 85, 249, 76, 167, 186, 126],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InsufficientLpBalance",
      msg: "User has insufficient LP token balance.",
    },
    {
      code: 6001,
      name: "Unauthorized",
      msg: "Only admin can call this function.",
    },
    {
      code: 6002,
      name: "MathError",
      msg: "Overflow or math error.",
    },
    {
      code: 6003,
      name: "RewardsEnded",
      msg: "Rewards have ended.",
    },
    {
      code: 6004,
      name: "InvalidTokenMint",
      msg: "Invalid token mint provided.",
    },
  ],
  types: [
    {
      name: "PoolState",
      docs: ["PoolState holds global info about the liquidity pool."],
      type: {
        kind: "struct",
        fields: [
          {
            name: "admin",
            docs: ["Admin authority who can withdraw funds and set rewards"],
            type: "pubkey",
          },
          {
            name: "sol_vault",
            docs: [
              "SOL vault account (token account for wrapped SOL or special handling)",
            ],
            type: "pubkey",
          },
          {
            name: "usdc_vault",
            docs: ["USDC vault account"],
            type: "pubkey",
          },
          {
            name: "lp_token_mint",
            docs: ["LP token mint"],
            type: "pubkey",
          },
          {
            name: "sol_deposited",
            docs: ["How many SOL tokens are currently deposited in total."],
            type: "u64",
          },
          {
            name: "usdc_deposited",
            docs: ["How many USDC tokens are currently deposited in total."],
            type: "u64",
          },
          {
            name: "tokens_per_interval",
            docs: ["USDC earned per second per LP token"],
            type: "u64",
          },
          {
            name: "reward_start_time",
            docs: ["Timestamp when current reward distribution started"],
            type: "u64",
          },
          {
            name: "reward_end_time",
            docs: ["Timestamp when rewards stop accruing (start + 604800)"],
            type: "u64",
          },
          {
            name: "usdc_reward_vault",
            docs: ["Vault holding USDC rewards"],
            type: "pubkey",
          },
          {
            name: "sol_usd_price",
            docs: ["Current SOL/USD price from Chainlink"],
            type: "i128",
          },
          {
            name: "total_rewards_deposited",
            docs: [
              "How many USDC tokens the admin deposited for this reward period",
            ],
            type: "u64",
          },
          {
            name: "total_rewards_claimed",
            docs: ["How many USDC have actually been claimed by users so far"],
            type: "u64",
          },
        ],
      },
    },
    {
      name: "UserState",
      docs: [
        "UserState stores user-specific info (in practice often combined into a single PDA).",
      ],
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            docs: ["User pubkey"],
            type: "pubkey",
          },
          {
            name: "lp_token_balance",
            docs: [
              "User's LP token balance (tracked within the program, not minted supply)",
            ],
            type: "u64",
          },
          {
            name: "last_claim_timestamp",
            docs: ["Last time user claimed (or had rewards updated)"],
            type: "u64",
          },
          {
            name: "pending_rewards",
            docs: ["Accumulated USDC rewards that have not yet been claimed"],
            type: "u64",
          },
        ],
      },
    },
  ],
};
