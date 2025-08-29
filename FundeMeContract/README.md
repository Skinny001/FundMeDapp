# FundMe Smart Contract

## Overview

FundMe is a crowdfunding smart contract deployed on the XDC Apothem testnet. It allows users to create fundraising campaigns, donate to campaigns, view campaign details, and withdraw funds when campaign goals are met.

## Features

- **Create Campaign:** Anyone can start a campaign with a title, description, target amount, and deadline.
- **Donate:** Anyone can donate ETH/XDC to active campaigns.
- **View Campaigns:** List all campaigns and view details, including donators and amounts.
- **Withdraw:** Campaign owners can withdraw funds after the deadline if the target is reached.

## Contract Address

`0x27AfcC1b6C645acF64b67f19C98ed48641aC37A8` (XDC Apothem testnet)

## Main Functions

- `createCampaign(string _title, string _description, uint256 _target, uint256 _deadline)`: Create a new campaign.
- `donateToCampaign(uint256 _id)`: Donate to a campaign (payable).
- `getCampaign(uint256 _id)`: Get details of a campaign.
- `getAllCampaigns()`: List all campaigns.
- `getDonators(uint256 _id)`: Get all donators and their donations for a campaign.
- `withdraw(uint256 _id)`: Withdraw funds (owner only, after deadline, if target met).

## Deployment

- **Network:** XDC Apothem testnet
- **RPC:** `https://rpc.apothem.network`
- **Chain ID:** `51`
- **Tool:** Foundry

## ABI

See `out/FundMe.sol/FundMe.json` for the full ABI.

## Usage

You can interact with the contract using web3/ethers.js, Foundry, or XDC tools.  
For frontend integration, use the contract address and ABI.

## Security

- Only campaign owners can withdraw funds.
- Withdrawals only possible after deadline and if target is reached.
- All inputs are validated.

## License

MIT

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
