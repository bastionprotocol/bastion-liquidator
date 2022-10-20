# Liquidator Bot

Bastion Liquidator using flashswap from Trisolaris liquidity pool.

The implementation does not include a method for collecting user addresses, liquidatable amounts, and positions. Users need to create their own custom endpoint to scrape the blockchain for liquidation opportunities.

## Installation

1. `npm install`
2. comment out `import "./tasks"` from `hardhat.config.ts`
3. run `npm run build`
4. uncomment 2.

## Usage

1. Set `PRIVATE_KEY` in .env file
2. Deploy by running `npm run deploy`
3. Copy the address of deployed **Liquidator contract** and put in in `utils/config.ts`
4. Liquidate by calling **liquidate task** in hardhat

```
Usage: hardhat [GLOBAL OPTIONS] liquidate --address <STRING> --ctokenborrowed <STRING> --ctokencollateral <STRING>

OPTIONS:

  --address             The address of user with liquidatable position
  --ctokenborrowed      The address of borrowed ctoken
  --ctokencollateral    The address of collateral ctoken
```
