import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarkets } from '@/hooks/useMarkets';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/hooks/useWallet';
import { formatDate, formatCurrency } from '@/utils/formatting';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ResolveMarket() {
  const { wallet } = useWallet();
  const { expiredMarkets, refreshMarkets } = useMarkets();
  const { resolveMarket, txState } = useContract();
  const [resolvingMarketId, setResolvingMarketId] = useState<string | null>(null);

  const handleResolve = async (marketId: string, outcome: boolean) => {
    if (!wallet.isConnected) return;
    
    setResolvingMarketId(marketId);
    
    try {
      await resolveMarket(marketId, outcome);
      refreshMarkets();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setResolvingMarketId(null);
    }
  };

  const isLoading = txState.loading && resolvingMarketId !== null;

  return (
    <Card className="glass-card border-border">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-lg sm:text-2xl font-bold flex items-center">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-amber-400" />
            Market Resolution
          </CardTitle>
          <Badge variant="secondary" className="px-2 sm:px-3 py-1 bg-amber-500/20 text-amber-400 w-fit text-xs sm:text-sm">
            Oracle Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="text-amber-400 font-medium">Oracle Authorization Required</p>
              <p className="text-sm text-muted-foreground mt-1">
                Only authorized oracles can resolve markets. This ensures fair and accurate outcomes.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Markets Ready for Resolution</h4>
          
          {expiredMarkets.length === 0 ? (
            <div className="border border-border rounded-lg p-6 text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No markets ready for resolution.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Markets appear here after their deadline passes.
              </p>
            </div>
          ) : (
            expiredMarkets.map((market) => (
              <div key={market.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h5 className="font-semibold text-foreground" data-testid={`text-resolve-question-${market.id}`}>
                      {market.question}
                    </h5>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                      <span>Market ID: #{market.id}</span>
                      <span>Deadline Passed: {formatDate(market.deadline)}</span>
                      <span>Total Volume: {formatCurrency(
                        (parseFloat(market.yesPool) + parseFloat(market.noPool)).toString()
                      )} ETH</span>
                    </div>
                  </div>
                  <Badge variant="destructive" className="bg-red-500/20 text-red-400">
                    Expired
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button
                    onClick={() => handleResolve(market.id, true)}
                    disabled={!wallet.isConnected || (isLoading && resolvingMarketId === market.id)}
                    className="bet-button-yes px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-semibold text-sm sm:text-base"
                    data-testid={`button-resolve-yes-${market.id}`}
                  >
                    {isLoading && resolvingMarketId === market.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="loading-spinner w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span className="text-xs sm:text-sm">Resolving...</span>
                      </div>
                    ) : (
                      'Resolve as YES ✅'
                    )}
                  </Button>
                  <Button
                    onClick={() => handleResolve(market.id, false)}
                    disabled={!wallet.isConnected || (isLoading && resolvingMarketId === market.id)}
                    className="bet-button-no px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-semibold text-sm sm:text-base"
                    data-testid={`button-resolve-no-${market.id}`}
                  >
                    {isLoading && resolvingMarketId === market.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="loading-spinner w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span className="text-xs sm:text-sm">Resolving...</span>
                      </div>
                    ) : (
                      'Resolve as NO ❌'
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
