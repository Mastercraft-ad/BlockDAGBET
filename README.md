
DAGBet – Hackathon Meme Prediction Market  

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) 
[![Build with BlockDAG](https://img.shields.io/badge/Built%20On-BlockDAG-blue)](#) 
[![Made with Solidity](https://img.shields.io/badge/Smart%20Contracts-Solidity-black)](#) 
[![React](https://img.shields.io/badge/Frontend-React-blue)](#) 
[![Hackathon Project](https://img.shields.io/badge/Hackathon-2025-orange)](#)  

> **DAGBet** is a fun, decentralized prediction market built on **BlockDAG Layer 1**.  
> Participants bet on **meme-themed hackathon markets**, making events more interactive, transparent, and entertaining. 🎭  


## 📑 Table of Contents  
- [Overview](#overview)
- [User Preferences](#user-preferences)
- [System Architecture](#System-Architecture)
- [Backend Architecture](#Backend-Architecture)
- [Smart Contract Integration](#Smart-Contract-Integration)
- [Blockchain Infrastructure](#Blockchain-Infrastructure)
- [Problem Statement](#problem-statement)  
- [Our Solution](#our-solution)  
- [How It Works](#how-it-works)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Setup Instructions](#setup-instructions)  
- [Demo Flow](#demo-flow)  
- [Why DAGBet Can Win](#why-dagbet-can-win)   
- [Contributing](#contributing)  
- [License](#-license)  

## Overview  

This is a decentralized prediction market application built with React, Express.js, and Web3 technology. The application allows users to create prediction markets, place bets on outcomes, and claim winnings in a blockchain-based environment. The system operates as a full-stack web application with smart contract integration for handling market creation, betting mechanics, and outcome resolution.

Example Meme Markets:  
- 🏆 *“Will our team place top 3?”*  
- 🕒 *“Will the hackathon finish on time?”*  

By putting predictions **on-chain**, DAGBet keeps **judges, participants, and the audience engaged** in real time.  

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using React with TypeScript and follows a modern component-based architecture:
- *UI Framework*: React 18 with TypeScript, using Vite as the build tool
- *Styling*: Tailwind CSS with shadcn/ui component library for consistent design
- *State Management*: TanStack Query (React Query) for server state management and caching
- *Routing*: Wouter for lightweight client-side routing
- *Web3 Integration*: Ethers.js for blockchain interactions and wallet connectivity

## Backend Architecture  
The server implements a RESTful API using Express.js:
- *Runtime*: Node.js with TypeScript and ESM modules
- *API Framework*: Express.js with middleware for logging and error handling
- *Storage Interface*: Abstracted storage layer with both in-memory and database implementations
- *Development*: Hot reload support with Vite integration in development mode

## Smart Contract Integration
Blockchain functionality is handled through Web3 infrastructure:
- *Contract Interaction*: Ethers.js provider and contract abstraction
- *Wallet Support*: MetaMask integration with automatic network detection
- *Network Support*: Multi-network compatibility (Ethereum mainnet, Sepolia testnet)
- *Transaction Management*: Comprehensive transaction state tracking with user feedback

## Blockchain Infrastructure
- *Ethers.js*: Web3 library for Ethereum blockchain interactions
- *MetaMask*: Browser wallet integration for user authentication and transaction signing
- *Smart Contracts*: Custom prediction market contracts deployed on Ethereum networks

## Problem Statement  
- Hackathons lack **fun engagement tools** for participants & spectators.  
- Centralized betting platforms don’t fit the hackathon vibe.  
- No simple way to **gamify hackathon participation** using blockchain.  

## Our Solution  

**DAGBet provides:**  
- **Meme Markets** → Hackathon-themed, lighthearted predictions.  
-  **On-Chain Transparency** → Smart contracts manage bets & payouts.  
- **Gamification** → Keeps participants entertained between sessions.  
- **Decentralized Oracles** → Judges/admins resolve outcomes fairly.  

## How It Works  

mermaid
graph TD;
    A[Admin Creates Market] --> B[Users Place YES/NO Bets];
    B --> C[Market Resolution by Admin];
    C --> D[Winners Redeem Winnings];

1. **Create Market** → Admin sets up a hackathon question.
2. **Place Bet** → Users bet **YES/NO** using crypto.
3. **Resolve Market** → Admin declares the outcome.
4. **Redeem Winnings** → Winners claim their share.

## Tech Stack

* **Smart Contract** → Solidity (`DAGBet.sol`) on **BlockDAG L1**.
* **Frontend** → React + Ethers.js.
* **Wallet** → MetaMask / BlockDAG Wallet.


## Project Structure

<details>
<summary>Click to expand</summary>


dagbet-frontend/
│── src/
│   ├── pages/
│   │   ├── Home.js           # List meme markets
│   │   ├── MarketDetails.js  # Bet on YES/NO
│   │   ├── MyBets.js         # User’s active bets
│   │   └── Admin.js          # Resolve markets
│   ├── components/
│   │   ├── MarketCard.js
│   │   └── BetForm.js
│   ├── DAGBet.json           # ABI from smart contract
│   └── App.js
│── contracts/
│   └── DAGBet.sol            # Smart contract


</details>



## Setup Instructions

bash
# 1. Clone Repo
git clone https://github.com/Mastercraft-ad/BlockDAGBET.git
cd dagbet-frontend

# 2. Install Dependencies
npm install

# 3. Start React App
npm start

# 4. Deploy Smart Contract (BlockDAG IDE)
#    - Compile & deploy DAGBet.sol
#   - Copy contract address into Home.js:

js
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_ADDRESS";

## Demo Flow

1.  Connect wallet
2.  View meme markets
3.  Place YES/NO bet
4.  Admin resolves outcome
5.  Winners redeem payout

---

## Why DAGBet Can Win

*  **Fun + Engaging** → Judges & hackers actually participate.
*  **On-Theme** → Built 100% on BlockDAG.
*  **Interactive Demo** → Live betting & redeeming in front of judges.

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch:

  bash
   git checkout -b feature-branch
   
3. Commit changes:

   bash
   git commit -m "Add new feature"
   
5. Push branch & open PR


##License

This project is licensed under the [MIT License](LICENSE).


*DAGBet makes hackathons more fun, transparent, and engaging — one meme market at a time!*
