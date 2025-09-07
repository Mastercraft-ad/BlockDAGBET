import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Market } from '@/types/market';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/hooks/useWallet';
import { formatTimeRemaining, formatPercentage, calculateOdds, formatCurrency } from '@/utils/formatting';
import { Clock, TrendingUp, Heart } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  onBetPlaced?: () => void;
}

export function MarketCard({ market, onBetPlaced }: MarketCardProps) {
  const { wallet } = useWallet();
  const { placeBet, txState } = useContract();
  const [betAmount, setBetAmount] = useState('0.1');

  const totalVolume = parseFloat(market.yesPool) + parseFloat(market.noPool);
  const yesPercentage = formatPercentage(market.yesPool, (totalVolume).toString());
  const noPercentage = 100 - yesPercentage;
  
  const yesOdds = calculateOdds(market.yesPool, market.noPool);
  const noOdds = calculateOdds(market.noPool, market.yesPool);

  const timeRemaining = formatTimeRemaining(market.deadline);
  const isExpired = timeRemaining === 'Expired';
  const isActive = !market.isResolved && !isExpired;

  const handleBet = async (choice: boolean) => {
    if (!wallet.isConnected) return;
    
    const amount = parseFloat(betAmount);
    if (amount < 0.01) return;

    try {
      await placeBet(market.id, choice, betAmount);
      onBetPlaced?.();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getStatusBadge = () => {
    if (market.isResolved) {
      return (
        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
          Resolved: {market.outcome ? 'YES' : 'NO'}
        </Badge>
      );
    } else if (isExpired) {
      return (
        <Badge variant="destructive" className="bg-red-500/20 text-red-400">
          Expired
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
          Active
        </Badge>
      );
    }
  };

  const potentialReturn = parseFloat(betAmount) * (yesOdds > noOdds ? yesOdds : noOdds);

  return (
    <Card className="glass-card border-border hover:bg-opacity-10 transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2" data-testid={`text-market-question-${market.id}`}>
                  {market.question}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {isExpired ? 'Expired' : `Ends ${timeRemaining}`}
                  </span>
                  <span className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Volume: {formatCurrency(totalVolume.toString())} ETH
                  </span>
                  {getStatusBadge()}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Market Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-emerald-400">YES {yesPercentage}%</span>
                <span className="text-red-400">NO {noPercentage}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="market-progress h-full rounded-full"
                  style={{ '--yes-percentage': `${yesPercentage}%` } as React.CSSProperties}
                  data-testid={`progress-market-${market.id}`}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>YES: {formatCurrency(market.yesPool)} ETH</span>
                <span>NO: {formatCurrency(market.noPool)} ETH</span>
              </div>
            </div>
          </div>

          {/* Betting Interface */}
          {isActive && (
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-0 lg:space-y-3 xl:space-y-0 xl:space-x-4 lg:w-80">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.1 ETH"
                    disabled={txState.loading}
                    data-testid={`input-bet-amount-${market.id}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(wallet.balance)}
                    className="text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded border border-border"
                    disabled={txState.loading}
                    data-testid={`button-max-bet-${market.id}`}
                  >
                    MAX
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleBet(true)}
                    disabled={!wallet.isConnected || txState.loading || parseFloat(betAmount) < 0.01}
                    className="bet-button-yes px-4 py-3 rounded-lg text-white font-semibold text-sm"
                    data-testid={`button-bet-yes-${market.id}`}
                  >
                    YES ✅ @{yesOdds.toFixed(2)}
                  </Button>
                  <Button
                    onClick={() => handleBet(false)}
                    disabled={!wallet.isConnected || txState.loading || parseFloat(betAmount) < 0.01}
                    className="bet-button-no px-4 py-3 rounded-lg text-white font-semibold text-sm"
                    data-testid={`button-bet-no-${market.id}`}
                  >
                    NO ❌ @{noOdds.toFixed(2)}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Potential return: <span className="text-foreground font-medium">
                    {formatCurrency(potentialReturn.toString())} ETH
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
