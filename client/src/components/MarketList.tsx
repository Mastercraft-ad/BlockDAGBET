import { useState } from 'react';
import { MarketCard } from './MarketCard';
import { useMarkets } from '@/hooks/useMarkets';
import { Market } from '@/types/market';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';

type FilterType = 'all' | 'active' | 'resolved' | 'expired';
type SortType = 'volume' | 'newest' | 'ending-soon';

export function MarketList() {
  const { markets, activeMarkets, resolvedMarkets, expiredMarkets, loading, refreshMarkets } = useMarkets();
  const [filter, setFilter] = useState<FilterType>('active');
  const [sortBy, setSortBy] = useState<SortType>('volume');

  const getFilteredMarkets = (): Market[] => {
    let filteredMarkets: Market[] = [];
    
    switch (filter) {
      case 'all':
        filteredMarkets = markets;
        break;
      case 'active':
        filteredMarkets = activeMarkets;
        break;
      case 'resolved':
        filteredMarkets = resolvedMarkets;
        break;
      case 'expired':
        filteredMarkets = expiredMarkets;
        break;
      default:
        filteredMarkets = activeMarkets;
    }

    // Sort markets
    return filteredMarkets.sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          const volumeA = parseFloat(a.yesPool) + parseFloat(a.noPool);
          const volumeB = parseFloat(b.yesPool) + parseFloat(b.noPool);
          return volumeB - volumeA;
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'ending-soon':
          return a.deadline - b.deadline;
        default:
          return 0;
      }
    });
  };

  const filteredMarkets = getFilteredMarkets();

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Markets</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-muted rounded mb-4" />
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-2 bg-muted rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="markets" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h3 className="text-xl sm:text-2xl font-bold">Markets</h3>
        
        {/* Mobile Layout */}
        <div className="flex flex-col sm:hidden space-y-3">
          <div className="flex items-center justify-between space-x-3">
            <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
              <SelectTrigger className="flex-1 bg-input border-border text-sm" data-testid="select-market-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-border">
                <SelectItem value="all">All Markets</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: SortType) => setSortBy(value)}>
              <SelectTrigger className="flex-1 bg-input border-border text-sm" data-testid="select-market-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-border">
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshMarkets}
            className="border-border w-full"
            data-testid="button-refresh-markets"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Markets
          </Button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshMarkets}
            className="border-border"
            data-testid="button-refresh-markets"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
            <SelectTrigger className="w-40 bg-input border-border" data-testid="select-market-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card border-border">
              <SelectItem value="all">All Markets</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={(value: SortType) => setSortBy(value)}>
              <SelectTrigger className="w-32 bg-input border-border" data-testid="select-market-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-border">
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredMarkets.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-muted-foreground text-lg">
            {filter === 'active' && 'No active markets found.'}
            {filter === 'resolved' && 'No resolved markets found.'}
            {filter === 'expired' && 'No expired markets found.'}
            {filter === 'all' && 'No markets found.'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {filter === 'active' && 'Create the first prediction market!'}
            {filter === 'resolved' && 'Check back later for resolved markets.'}
            {filter === 'expired' && 'Markets appear here after their deadline passes.'}
            {filter === 'all' && 'Be the first to create a market!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filteredMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onBetPlaced={refreshMarkets}
            />
          ))}
        </div>
      )}
    </section>
  );
}
