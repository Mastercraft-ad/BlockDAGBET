# Overview

DAGBet is a decentralized prediction market platform built for hackathon events, allowing users to create and bet on meme-themed markets. The application combines Web3 functionality with a modern React frontend to create an engaging prediction market experience on the BlockDAG Layer 1 blockchain.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a modern React stack with TypeScript, built on Vite for fast development and optimized builds. The UI is constructed with shadcn/ui components and Tailwind CSS for styling, providing a responsive and accessible interface. The frontend implements a client-side routing system using wouter for navigation between different views.

The component architecture follows a modular approach with dedicated components for market creation (`CreateMarketForm`), market display (`MarketCard`, `MarketList`), wallet integration (`WalletConnection`), and administrative functions (`ResolveMarket`, `RedeemWinnings`). State management is handled through React Query for server state and custom hooks for Web3 interactions.

## Backend Architecture
The backend is built with Express.js and follows a RESTful API pattern. The server uses TypeScript for type safety and implements middleware for request logging and error handling. The architecture supports both development and production environments with appropriate static file serving and Vite integration for hot module replacement during development.

Database operations are abstracted through a storage interface pattern, currently implementing an in-memory storage solution but designed to easily swap to PostgreSQL using Drizzle ORM. The storage layer handles user management and can be extended for market data persistence.

## Web3 Integration
The application integrates with Ethereum-compatible blockchains through ethers.js v6, supporting MetaMask wallet connections and smart contract interactions. The Web3 layer is abstracted through utility classes and custom hooks that handle wallet connection, transaction submission, and contract method calls.

Smart contract integration supports market creation, bet placement, market resolution, and winnings redemption. The system includes fallback mechanisms to local storage when blockchain connectivity is unavailable, ensuring the application remains functional during development and testing.

## Data Storage Strategy
The application implements a dual-storage approach: blockchain data for immutable market operations and local/database storage for user interface state and cached data. Market data is primarily stored on-chain but cached locally for improved performance and offline functionality.

The database schema uses Drizzle ORM with PostgreSQL support, defining user entities with username/password authentication. The storage layer is designed with an interface pattern allowing easy migration from in-memory to persistent database storage.

# External Dependencies

## Blockchain Infrastructure
- **ethers.js v6**: Ethereum blockchain interaction and wallet connectivity
- **MetaMask**: Primary wallet provider for user authentication and transaction signing
- **BlockDAG Layer 1**: Target blockchain network for smart contract deployment
- **Sepolia Testnet**: Development and testing environment

## UI Framework and Components
- **React 18**: Core frontend framework with modern hooks and concurrent features
- **shadcn/ui**: Pre-built accessible component library based on Radix UI primitives
- **Radix UI**: Low-level accessible component primitives for complex UI patterns
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library providing consistent iconography

## Development and Build Tools
- **Vite**: Fast build tool and development server with HMR support
- **TypeScript**: Static type checking for improved code quality and developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind integration

## State Management and Data Fetching
- **TanStack React Query**: Server state management with caching, synchronization, and error handling
- **React Hook Form**: Form state management with validation support
- **Wouter**: Lightweight client-side routing library

## Database and ORM
- **Drizzle ORM**: Type-safe SQL ORM for database operations
- **PostgreSQL**: Planned production database (currently using in-memory storage)
- **Neon Database**: Serverless PostgreSQL provider for production deployment

## Authentication and Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **express-session**: Session middleware for user authentication state

## Development Environment
- **Replit**: Cloud-based development environment with integrated tooling
- **Cross-env**: Cross-platform environment variable handling
- **tsx**: TypeScript execution for development server