import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMarkets } from '@/hooks/useMarkets';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/hooks/useWallet';
import { formatCurrency } from '@/utils/formatting';
import { DollarSign, Zap } from 'lucide-react';

interface ClaimableWinning {
  marketId: string;
  question: string;
  position: boolean;
  betAmount: string;
  claimAmount: string;
  canClaim: boolean;
}

export function RedeemWinnings() {
  const { wallet } = useWallet();
  const { resolvedMarkets, refreshMarkets } = useMarkets();
  const { redeemWinnings, canClaim, getUserBets, txState } = useContract();
  const [claimableWinnings, setClaimableWinnings] = useState<ClaimableWinning[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimingMarketId, setClaimingMarketId] = useState<string | null>(null);

  const fetchClaimableWinnings = async () => {
    if (!wallet.address || resolvedMarkets.length === 0) {
      setClaimableWinnings([]);
      return;
    }

    setLoading(true);
    const winnings: ClaimableWinning[] = [];

    try {
      for (const market of resolvedMarkets) {
        const [claimInfo, userBets] = await Promise.all([
          canClaim(wallet.address, market.id),
          getUserBets(wallet.address, market.id)
        ]);

        if (claimInfo.canClaim) {
          const yesBetAmount = parseFloat(userBets.yesBets);
          const noBetAmount = parseFloat(userBets.noBets);
          
          // Determine which position won
          const wonPosition = market.outcome === true ? yesBetAmount > 0 : noBetAmount > 0;
          
          if (wonPosition) {
            winnings.push({
              marketId: market.id,
              question: market.question,
              position: market.outcome!,
              betAmount: market.outcome ? userBets.yesBets : userBets.noBets,
              claimAmount: claimInfo.amount,
              canClaim: true,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch claimable winnings:', error);
    } finally {
      setLoading(false);
    }

    setClaimableWinnings(winnings);
  };

  const handleClaim = async (marketId: string) => {
    if (!wallet.isConnected) return;
    
    setClaimingMarketId(marketId);
    
    try {
      await redeemWinnings(marketId);
      await fetchClaimableWinnings(); // Refresh after successful claim
      refreshMarkets();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setClaimingMarketId(null);
    }
  };

  const handleClaimAll = async () => {
    if (!wallet.isConnected || claimableWinnings.length === 0) return;
    
    // For batch claiming, we'd need to loop through all markets
    // This is a simplified version - in production, you might want a batch claim function
    for (const winning of claimableWinnings) {
      try {
        await handleClaim(winning.marketId);
      } catch (error) {
        // Continue with next claim even if one fails
        console.error(`Failed to claim for market ${winning.marketId}:`, error);
      }
    }
  };

  useEffect(() => {
    if (wallet.address && resolvedMarkets.length > 0) {
      fetchClaimableWinnings();
    } else {
      setClaimableWinnings([]);
    }
  }, [wallet.address, resolvedMarkets.length]);

  const totalClaimable = claimableWinnings.reduce(
    (sum, winning) => sum + parseFloat(winning.claimAmount),
    0
  );

  const isClaimLoading = txState.loading && claimingMarketId !== null;

  return (
    <Card className="glass-card border-border">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-2xl font-bold flex items-center">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-emerald-400" />
          Claim Winnings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Card */}
        <div className="stats-card rounded-xl p-4 sm:p-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-emerald-400 mb-1" data-testid="text-total-claimable">
                {formatCurrency(totalClaimable.toString())} BDAG
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">Total Claimable</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-amber-400 mb-1" data-testid="text-markets-won">
                {claimableWinnings.length}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">Markets Won</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-primary mb-1">
                {totalClaimable > 0 ? '+' : ''}
                {totalClaimable > 0 ? Math.round(((totalClaimable - claimableWinnings.reduce((sum, w) => sum + parseFloat(w.betAmount), 0)) / claimableWinnings.reduce((sum, w) => sum + parseFloat(w.betAmount), 0)) * 100) : 0}%
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">Total Return</div>
            </div>
          </div>
        </div>

        {/* Claimable Markets */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Your Winning Positions</h4>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-lg p-4 animate-pulse">
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : claimableWinnings.length === 0 ? (
            <div className="border border-border rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No winnings to claim.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Win prediction markets to claim rewards here.
              </p>
            </div>
          ) : (
            <>
              {claimableWinnings.map((winning) => (
                <div key={winning.marketId} className="border border-emerald-500/20 bg-emerald-500/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-foreground" data-testid={`text-winning-question-${winning.marketId}`}>
                        {winning.question}
                      </h5>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span>
                          Your Position: <span className={`font-medium ${winning.position ? 'text-emerald-400' : 'text-red-400'}`}>
                            {winning.position ? 'YES' : 'NO'}
                          </span>
                        </span>
                        <span>Bet Amount: {formatCurrency(winning.betAmount)} ETH</span>
                        <span>Return: {formatCurrency((parseFloat(winning.claimAmount) / parseFloat(winning.betAmount)).toString())}x</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400" data-testid={`text-claim-amount-${winning.marketId}`}>
                        {formatCurrency(winning.claimAmount)} ETH
                      </div>
                      <div className="text-sm text-muted-foreground">Claimable</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleClaim(winning.marketId)}
                    disabled={!wallet.isConnected || (isClaimLoading && claimingMarketId === winning.marketId)}
                    className="wallet-button w-full py-3 rounded-lg text-primary-foreground font-semibold"
                    data-testid={`button-claim-${winning.marketId}`}
                  >
                    {isClaimLoading && claimingMarketId === winning.marketId ? (
                      <div className="flex items-center space-x-2">
                        <div className="loading-spinner w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                        <span>Claiming...</span>
                      </div>
                    ) : (
                      `Claim ${formatCurrency(winning.claimAmount)} ETH`
                    )}
                  </Button>
                </div>
              ))}

              {/* Batch Claim Button */}
              {claimableWinnings.length > 1 && (
                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={handleClaimAll}
                    disabled={!wallet.isConnected || isClaimLoading}
                    className="wallet-button w-full py-4 rounded-lg text-primary-foreground font-bold text-lg"
                    data-testid="button-claim-all"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Claim All Winnings ({formatCurrency(totalClaimable.toString())} ETH)
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Batch claiming saves gas fees. Estimated cost: ~$12
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
