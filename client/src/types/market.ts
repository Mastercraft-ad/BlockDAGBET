export interface Market {
  id: string;
  question: string;
  deadline: number;
  creator: string;
  isResolved: boolean;
  outcome: boolean | null;
  totalYesBets: string;
  totalNoBets: string;
  yesPool: string;
  noPool: string;
  createdAt: number;
  resolvedAt?: number;
}

export interface UserBet {
  marketId: string;
  choice: boolean;
  amount: string;
  timestamp: number;
  claimed: boolean;
}

export interface MarketStats {
  totalVolume: string;
  activeMarkets: number;
  totalUsers: number;
}

export interface CreateMarketForm {
  question: string;
  deadline: string;
  initialLiquidity: string;
}

export interface PlaceBetForm {
  amount: string;
}
