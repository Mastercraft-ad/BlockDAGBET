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
      // Try to get markets from smart contract first
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
      // Fallback to local storage when contract isn't available
      console.warn('Smart contract not available, using local storage fallback:', err.message);
      
      try {
        const localMarkets = localStorage.getItem('prediction_markets');
        if (localMarkets) {
          const parsedMarkets = JSON.parse(localMarkets);
          setMarkets(parsedMarkets);
        } else {
          // Add sample markets for demo purposes
          const sampleMarkets = [
            {
              id: '1',
              question: 'Will Bitcoin reach $100,000 by the end of 2025?',
              deadline: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
              creator: 'demo-user',
              isResolved: false,
              outcome: false,
              totalYesBets: '2.5',
              totalNoBets: '1.8',
              yesPool: '2.5',
              noPool: '1.8', 
              createdAt: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
              resolvedAt: undefined,
            },
            {
              id: '2',
              question: 'Will Ethereum switch to proof-of-stake successfully in 2025?',
              deadline: Math.floor(Date.now() / 1000) + (45 * 24 * 60 * 60), // 45 days from now
              creator: 'demo-user',
              isResolved: false,
              outcome: false,
              totalYesBets: '5.2',
              totalNoBets: '3.1',
              yesPool: '5.2',
              noPool: '3.1',
              createdAt: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
              resolvedAt: undefined,
            }
          ];
          localStorage.setItem('prediction_markets', JSON.stringify(sampleMarkets));
          setMarkets(sampleMarkets);
        }
        setError(null);
      } catch (localErr) {
        setError('Failed to load markets from storage');
        console.error('Error loading from localStorage:', localErr);
        setMarkets([]);
      }
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
