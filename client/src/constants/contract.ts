// Replace with your deployed contract address
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x1234567890123456789012345678901234567890";

// Replace with your contract ABI
export const CONTRACT_ABI = [
  // Market creation
  "function createMarket(string memory question, uint256 deadline) external payable returns (uint256)",
  
  // Betting
  "function placeBet(uint256 marketId, bool choice) external payable",
  
  // Market resolution (admin only)
  "function resolveMarket(uint256 marketId, bool outcome) external",
  
  // Claim winnings
  "function redeem(uint256 marketId) external",
  
  // View functions
  "function getMarket(uint256 marketId) external view returns (tuple(string question, uint256 deadline, address creator, bool isResolved, bool outcome, uint256 totalYesBets, uint256 totalNoBets, uint256 yesPool, uint256 noPool, uint256 createdAt, uint256 resolvedAt))",
  "function getMarketCount() external view returns (uint256)",
  "function getUserBets(address user, uint256 marketId) external view returns (uint256 yesBets, uint256 noBets)",
  "function canClaim(address user, uint256 marketId) external view returns (bool, uint256)",
  
  // Events
  "event MarketCreated(uint256 indexed marketId, string question, uint256 deadline, address creator)",
  "event BetPlaced(uint256 indexed marketId, address indexed user, bool choice, uint256 amount)",
  "event MarketResolved(uint256 indexed marketId, bool outcome)",
  "event WinningsClaimed(uint256 indexed marketId, address indexed user, uint256 amount)"
];

export const SUPPORTED_CHAIN_IDS = [1, 5, 11155111]; // Mainnet, Goerli, Sepolia
export const DEFAULT_CHAIN_ID = 11155111; // Sepolia testnet
