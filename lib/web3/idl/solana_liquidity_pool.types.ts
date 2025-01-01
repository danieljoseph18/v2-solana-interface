/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_liquidity_pool.json`.
 */
export type SolanaLiquidityPool = {
  address: "3JhuFvHHTxCGeJviVMv4SYUWQ1qAb9tFNy7ZU8dxBhpq";
  metadata: {
    name: "solanaLiquidityPool";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  docs: [
    "The main vault program.",
    "It includes instructions for initialize, deposit, withdraw, admin deposit/withdraw, etc."
  ];
  instructions: [
    {
      name: "adminDeposit";
      docs: ["Admin function to deposit tokens (market making profits)"];
      discriminator: [210, 66, 65, 182, 102, 214, 176, 30];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "poolState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101];
              }
            ];
          };
        },
        {
          name: "adminTokenAccount";
          writable: true;
        },
        {
          name: "vaultAccount";
          writable: true;
        },
        {
          name: "chainlinkProgram";
          address: "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";
        },
        {
          name: "chainlinkFeed";
          address: "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "adminWithdraw";
      docs: ["Admin function to withdraw tokens (market making losses)"];
      discriminator: [160, 166, 147, 222, 46, 220, 75, 224];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "poolState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101];
              }
            ];
          };
        },
        {
          name: "vaultAccount";
          writable: true;
        },
        {
          name: "adminTokenAccount";
          writable: true;
        },
        {
          name: "chainlinkProgram";
          address: "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";
        },
        {
          name: "chainlinkFeed";
          address: "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "claimRewards";
      docs: ["Claim user rewards"];
      discriminator: [4, 144, 132, 71, 116, 23, 151, 80];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "poolState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101];
              }
            ];
          };
        },
        {
          name: "userState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114, 45, 115, 116, 97, 116, 101];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "usdcRewardVault";
          writable: true;
        },
        {
          name: "userUsdcAccount";
          writable: true;
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "lpTokenMint";
        }
      ];
      args: [];
    },
    {
      name: "closePool";
      docs: ["Close the pool (admin only)"];
      discriminator: [140, 189, 209, 23, 239, 62, 239, 11];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "poolState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101];
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "closeUserState";
      docs: ["Close the user state (user only)"];
      discriminator: [127, 206, 172, 187, 146, 179, 215, 194];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "poolState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101];
              }
            ];
          };
        },
        {
          name: "userState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114, 45, 115, 116, 97, 116, 101];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "deposit";
      docs: ["Deposit SOL or USDC into the pool"];
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "poolState";
          docs: ["Global PoolState"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101];
              }
            ];
          };
        },
        {
          name: "userTokenAccount";
          docs: ["The user's token account from which they are depositing"];
          writable: true;
        },
        {
          name: "vaultAccount";
          docs: ["Vault for either SOL (wrapped) or USDC"];
          writable: true;
        },
        {
          name: "userState";
          docs: ["The user's associated UserState"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114, 45, 115, 116, 97, 116, 101];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "lpTokenMint";
          docs: ["LP token mint"];
          writable: true;
        },
        {
          name: "userLpTokenAccount";
          docs: [
            "The user's LP token account (where minted LP tokens will go)"
          ];
          writable: true;
        },
        {
          name: "chainlinkProgram";
          address: "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";
        },
        {
          name: "chainlinkFeed";
          address: "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "tokenAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "initialize";
      docs: ["Initialize the liquidity pool"];
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "poolState";
          docs: ["The PoolState (PDA) to store global info about the pool"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101];
              }
            ];
          };
        },
        {
          name: "solVault";
          docs: [
            "SOL vault account (if using wrapped SOL, this would be a token account)",
            "Here, assume you've already created the vault outside or are about to"
          ];
          writable: true;
        },
        {
          name: "usdcVault";
          docs: ["USDC vault account"];
          writable: true;
        },
        {
          name: "usdcRewardVault";
          docs: ["Reward vault for USDC"];
          writable: true;
        },
        {
          name: "lpTokenMint";
          docs: ["LP token mint"];
          writable: true;
          signer: true;
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "rent";
          address: "SysvarRent111111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "initializeUser";
      docs: ["Initialize user state"];
      discriminator: [111, 17, 185, 250, 60, 122, 38, 254];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "userState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114, 45, 115, 116, 97, 116, 101];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "startRewards";
      docs: ["Admin function to start new reward distribution"];
      discriminator: [62, 183, 108, 14, 161, 145, 121, 115];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "poolState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101];
              }
            ];
          };
        },
        {
          name: "adminUsdcAccount";
          docs: ["Admin's USDC token account"];
          writable: true;
        },
        {
          name: "usdcRewardVault";
          docs: ["Program's USDC reward vault"];
          writable: true;
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [
        {
          name: "usdcAmount";
          type: "u64";
        },
        {
          name: "tokensPerInterval";
          type: "u64";
        }
      ];
    },
    {
      name: "withdraw";
      docs: ["Withdraw tokens from the pool"];
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "poolState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 111, 111, 108, 45, 115, 116, 97, 116, 101];
              }
            ];
          };
        },
        {
          name: "userState";
          docs: ["The user's associated UserState"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114, 45, 115, 116, 97, 116, 101];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "lpTokenMint";
          docs: ["LP token mint"];
          writable: true;
        },
        {
          name: "userLpTokenAccount";
          docs: ["User's LP token account to burn from"];
          writable: true;
        },
        {
          name: "vaultAccount";
          docs: ["Vault for either SOL (wrapped) or USDC"];
          writable: true;
        },
        {
          name: "userTokenAccount";
          docs: ["User's token account to receive withdrawn tokens"];
          writable: true;
        },
        {
          name: "chainlinkProgram";
          address: "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";
        },
        {
          name: "chainlinkFeed";
          address: "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [
        {
          name: "lpTokenAmount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "poolState";
      discriminator: [247, 237, 227, 245, 215, 195, 222, 70];
    },
    {
      name: "userState";
      discriminator: [72, 177, 85, 249, 76, 167, 186, 126];
    }
  ];
  events: [
    {
      name: "rewardsClaimed";
      discriminator: [75, 98, 88, 18, 219, 112, 88, 121];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "insufficientLpBalance";
      msg: "User has insufficient LP token balance.";
    },
    {
      code: 6001;
      name: "unauthorized";
      msg: "Only admin can call this function.";
    },
    {
      code: 6002;
      name: "mathError";
      msg: "Overflow or math error.";
    },
    {
      code: 6003;
      name: "rewardsEnded";
      msg: "Rewards have ended.";
    },
    {
      code: 6004;
      name: "invalidTokenMint";
      msg: "Invalid token mint provided.";
    },
    {
      code: 6005;
      name: "invalidOwner";
      msg: "Invalid owner.";
    },
    {
      code: 6006;
      name: "rewardsNotStarted";
      msg: "Rewards have not started yet.";
    },
    {
      code: 6007;
      name: "noLpTokens";
      msg: "No LP tokens found.";
    },
    {
      code: 6008;
      name: "insufficientRewardBalance";
      msg: "Insufficient reward balance.";
    }
  ];
  types: [
    {
      name: "poolState";
      docs: ["PoolState holds global info about the liquidity pool."];
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            docs: ["Admin authority who can withdraw funds and set rewards"];
            type: "pubkey";
          },
          {
            name: "solVault";
            docs: [
              "SOL vault account (token account for wrapped SOL or special handling)"
            ];
            type: "pubkey";
          },
          {
            name: "usdcVault";
            docs: [
              "USDC vault account (USDC uses 6 decimals, so 1 USDC = 1_000_000)"
            ];
            type: "pubkey";
          },
          {
            name: "lpTokenMint";
            docs: ["LP token mint"];
            type: "pubkey";
          },
          {
            name: "solDeposited";
            docs: [
              "How many SOL tokens are currently deposited in total (9 decimals, 1 SOL = 1_000_000_000)"
            ];
            type: "u64";
          },
          {
            name: "usdcDeposited";
            docs: [
              "How many USDC tokens are currently deposited in total (6 decimals, 1 USDC = 1_000_000)"
            ];
            type: "u64";
          },
          {
            name: "tokensPerInterval";
            docs: ["USDC earned per second per LP token (6 decimals)"];
            type: "u64";
          },
          {
            name: "rewardStartTime";
            docs: ["Timestamp when current reward distribution started"];
            type: "u64";
          },
          {
            name: "rewardEndTime";
            docs: ["Timestamp when rewards stop accruing (start + 604800)"];
            type: "u64";
          },
          {
            name: "usdcRewardVault";
            docs: ["Vault holding USDC rewards"];
            type: "pubkey";
          },
          {
            name: "solUsdPrice";
            docs: [
              "Current SOL/USD price from Chainlink (8 decimals from feed)"
            ];
            type: "i128";
          },
          {
            name: "totalRewardsDeposited";
            docs: [
              "How many USDC tokens the admin deposited for this reward period (6 decimals)"
            ];
            type: "u64";
          },
          {
            name: "totalRewardsClaimed";
            docs: [
              "How many USDC have actually been claimed by users so far (6 decimals)"
            ];
            type: "u64";
          },
          {
            name: "cumulativeRewardPerToken";
            type: "u128";
          },
          {
            name: "lastDistributionTime";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "rewardsClaimed";
      type: {
        kind: "struct";
        fields: [
          {
            name: "user";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "timestamp";
            type: "i64";
          },
          {
            name: "totalClaimed";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "userState";
      docs: [
        "UserState stores user-specific info (in practice often combined into a single PDA)."
      ];
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            docs: ["User pubkey"];
            type: "pubkey";
          },
          {
            name: "lpTokenBalance";
            docs: [
              "User's LP token balance (tracked within the program, not minted supply)"
            ];
            type: "u64";
          },
          {
            name: "lastClaimTimestamp";
            docs: ["Last time user claimed (or had rewards updated)"];
            type: "u64";
          },
          {
            name: "pendingRewards";
            docs: ["Accumulated USDC rewards that have not yet been claimed"];
            type: "u64";
          },
          {
            name: "previousCumulatedRewardPerToken";
            docs: ["Previous cumulative reward per token"];
            type: "u128";
          }
        ];
      };
    }
  ];
};
