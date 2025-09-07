import { useState, useEffect, useCallback } from 'react';
import { Market } from '@/types/market';
import { useContract } from './useContract';

export function useMarkets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getMarket, getMarketCount } = useContract();

  const fetchMarkets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const count = await getMarketCount();
      const marketPromises = [];

      for (let i = 1; i <= count; i++) {
        marketPromises.push(getMarket(i.toString()));
      }

      const fetchedMarkets = await Promise.all(marketPromises);
      
      // Sort by creation date, newest first
      const sortedMarkets = fetchedMarkets.sort((a, b) => b.createdAt - a.createdAt);
      
      setMarkets(sortedMarkets);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch markets');
      console.error('Error fetching markets:', err);
    } finally {
      setLoading(false);
    }
  }, [getMarket, getMarketCount]);

  const getActiveMarkets = useCallback(() => {
    const now = Date.now() / 1000;
    return markets.filter(market => !market.isResolved && market.deadline > now);
  }, [markets]);

  const getResolvedMarkets = useCallback(() => {
    return markets.filter(market => market.isResolved);
  }, [markets]);

  const getExpiredMarkets = useCallback(() => {
    const now = Date.now() / 1000;
    return markets.filter(market => !market.isResolved && market.deadline <= now);
  }, [markets]);

  const refreshMarkets = useCallback(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  useEffect(() => {
    fetchMarkets();
  }, []);

  return {
    markets,
    loading,
    error,
    activeMarkets: getActiveMarkets(),
    resolvedMarkets: getResolvedMarkets(),
    expiredMarkets: getExpiredMarkets(),
    refreshMarkets,
  };
}
