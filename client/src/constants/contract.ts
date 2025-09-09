// src/constants.ts
export const CONTRACT_ADDRESS = "0x5Af16F8aAE6810541b7445771D7757B526485342"; //"0x6deBB094344757d4aFB4729EEE4dfA4acef43c07";
// import.meta.env.VITE_CONTRACT_ADDRESS;

export const CONTRACT_ABI = [
  "function createMarket(string question, uint256 deadline, uint256 initialLiquidity) external payable returns (uint256)",
  "function placeBet(uint256 marketId, bool choice) external payable",
  "function resolveMarket(uint256 marketId, bool outcome) external",
  "function redeem(uint256 marketId) external",

  "function getMarket(uint256 marketId) external view returns (string question, uint256 deadline, address creator, bool isResolved, bool outcome, uint256 totalYesBets, uint256 totalNoBets, uint256 yesPool, uint256 noPool, uint256 createdAt, uint256 resolvedAt)",
  "function getMarketCount() external view returns (uint256)",

  "function getUserBets(address user, uint256 marketId) external view returns (uint256 yesBets, uint256 noBets)",
  "function canClaim(address user, uint256 marketId) external view returns (bool, uint256)",
  "event MarketCreated(uint256 indexed marketId, string question, uint256 deadline, address creator)",
  "event BetPlaced(uint256 indexed marketId, address indexed user, bool choice, uint256 amount)",
  "event MarketResolved(uint256 indexed marketId, bool outcome)",
  "event WinningsClaimed(uint256 indexed marketId, address indexed user, uint256 amount)",
];

export const SUPPORTED_CHAIN_IDS = [11155111]; // Sepolia
export const DEFAULT_CHAIN_ID = 11155111;
