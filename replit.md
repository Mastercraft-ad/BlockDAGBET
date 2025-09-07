# Replit Configuration

## Overview

This is a decentralized prediction market application built with React, Express.js, and Web3 technology. The application allows users to create prediction markets, place bets on outcomes, and claim winnings in a blockchain-based environment. The system operates as a full-stack web application with smart contract integration for handling market creation, betting mechanics, and outcome resolution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using React with TypeScript and follows a modern component-based architecture:
- **UI Framework**: React 18 with TypeScript, using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Web3 Integration**: Ethers.js for blockchain interactions and wallet connectivity

### Backend Architecture  
The server implements a RESTful API using Express.js:
- **Runtime**: Node.js with TypeScript and ESM modules
- **API Framework**: Express.js with middleware for logging and error handling
- **Storage Interface**: Abstracted storage layer with both in-memory and database implementations
- **Development**: Hot reload support with Vite integration in development mode

### Data Storage Solutions
The application uses a dual storage approach:
- **Development**: In-memory storage using Map data structures for rapid prototyping
- **Production**: PostgreSQL database with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL) for scalable cloud hosting
- **Migration Management**: Drizzle Kit for schema migrations and database management

### Smart Contract Integration
Blockchain functionality is handled through Web3 infrastructure:
- **Contract Interaction**: Ethers.js provider and contract abstraction
- **Wallet Support**: MetaMask integration with automatic network detection
- **Network Support**: Multi-network compatibility (Ethereum mainnet, Sepolia testnet)
- **Transaction Management**: Comprehensive transaction state tracking with user feedback

### Component Architecture
The frontend follows a modular component structure:
- **Core Components**: Market creation, market listing, betting interface, wallet connection
- **Utility Components**: Formatted data display, time calculations, Web3 utilities  
- **UI Components**: Complete shadcn/ui implementation for consistent interface elements
- **Hooks**: Custom React hooks for wallet state, contract interactions, and market data

## External Dependencies

### Blockchain Infrastructure
- **Ethers.js**: Web3 library for Ethereum blockchain interactions
- **MetaMask**: Browser wallet integration for user authentication and transaction signing
- **Smart Contracts**: Custom prediction market contracts deployed on Ethereum networks

### Database and ORM
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database queries and schema management
- **Drizzle Kit**: Database migration and introspection tooling

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Headless UI components for accessibility and interaction patterns  
- **shadcn/ui**: Pre-built component library with consistent design tokens
- **Lucide React**: Modern icon library for user interface elements

### Development Tools
- **Vite**: Fast build tool and development server with HMR support
- **TypeScript**: Static type checking for both frontend and backend code
- **TanStack Query**: Data fetching and caching for optimal user experience
- **Replit Integration**: Development environment optimization with runtime error handling

### Utility Libraries
- **Date-fns**: Date manipulation and formatting utilities
- **Zod**: Runtime type validation and schema parsing
- **Nanoid**: Unique identifier generation for sessions and data
- **Class Variance Authority**: Utility for managing component variants and styling