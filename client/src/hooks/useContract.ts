import { useState, useCallback } from 'react';
import { Web3Utils } from '@/utils/web3';
import { useToast } from '@/hooks/use-toast';

interface TransactionState {
  loading: boolean;
  hash: string | null;
  error: string | null;
}

export function useContract() {
  const { toast } = useToast();
  const [txState, setTxState] = useState<TransactionState>({
    loading: false,
    hash: null,
    error: null,
  });

  const executeTransaction = useCallback(async (
    operation: () => Promise<any>,
    successMessage: string = 'Transaction successful'
  ) => {
    setTxState({ loading: true, hash: null, error: null });

    try {
      const tx = await operation();
      setTxState(prev => ({ ...prev, hash: tx.hash }));

      toast({
        title: 'Transaction Submitted',
        description: `Transaction hash: ${tx.hash.slice(0, 10)}...`,
      });

      const receipt = await tx.wait();

      setTxState({ loading: false, hash: receipt.hash, error: null });

      toast({
        title: 'Success',
        description: successMessage,
      });

      return receipt;
    } catch (error: any) {
      const errorMessage = error.reason || error.message || 'Transaction failed';
      setTxState({ loading: false, hash: null, error: errorMessage });

      toast({
        title: 'Transaction Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      throw error;
    }
  }, [toast]);

  const createMarket = useCallback(async (question: string, deadline: number, value: string) => {
    try {
      const contract = await Web3Utils.getContract();
      return executeTransaction(
        () => contract.createMarket(question, deadline, { 
          value: Web3Utils.parseEthAmount(value) 
        }),
        'Market created successfully!'
      );
    } catch (contractError: any) {
      console.warn('Smart contract not available, saving market to localStorage:', contractError.message);

      try {
        setTxState({ loading: true, hash: null, error: null });

        const existingMarkets = localStorage.getItem('prediction_markets');
        const markets = existingMarkets ? JSON.parse(existingMarkets) : [];

        const newMarket = {
          id: (markets.length + 1).toString(),
          question,
          deadline,
          creator: 'demo-user',
          isResolved: false,
          outcome: false,
          totalYesBets: '0',
          totalNoBets: '0', 
          yesPool: '0',
          noPool: '0',
          createdAt: Math.floor(Date.now() / 1000),
          resolvedAt: undefined,
        };

        markets.push(newMarket);
        localStorage.setItem('prediction_markets', JSON.stringify(markets));

        setTimeout(() => {
          setTxState({ loading: false, hash: 'demo-tx-hash', error: null });
          toast({
            title: 'Market Created (Demo)',
            description: 'Market saved locally for demonstration',
          });
        }, 1000);

        return { hash: 'demo-tx-hash' };
      } catch (storageError: any) {
        setTxState({ loading: false, hash: null, error: storageError.message });
        toast({
          title: 'Creation Failed',
          description: storageError.message,
          variant: 'destructive',
        });
        throw storageError;
      }
    }
  }, [executeTransaction, toast]);

  const placeBet = useCallback(async (marketId: string, choice: boolean, amount: string) => {
    try {
      const contract = await Web3Utils.getContract();
      return executeTransaction(
        () => contract.placeBet(marketId, choice, { 
          value: Web3Utils.parseEthAmount(amount) 
        }),
        `Bet placed successfully! You bet ${choice ? 'YES' : 'NO'}`
      );
    } catch (contractError: any) {
      console.warn('Smart contract not available, updating market in localStorage:', contractError.message);

      try {
        setTxState({ loading: true, hash: null, error: null });

        const existingMarkets = localStorage.getItem('prediction_markets');
        const markets = existingMarkets ? JSON.parse(existingMarkets) : [];

        const marketIndex = markets.findIndex((m: any) => m.id === marketId);
        if (marketIndex === -1) throw new Error('Market not found');

        const market = markets[marketIndex];
        const betAmount = parseFloat(amount);

        if (choice) {
          market.totalYesBets = (parseFloat(market.totalYesBets) + betAmount).toString();
          market.yesPool = (parseFloat(market.yesPool) + betAmount).toString();
        } else {
          market.totalNoBets = (parseFloat(market.totalNoBets) + betAmount).toString();
          market.noPool = (parseFloat(market.noPool) + betAmount).toString();
        }

        markets[marketIndex] = market;
        localStorage.setItem('prediction_markets', JSON.stringify(markets));

        setTimeout(() => {
          setTxState({ loading: false, hash: 'demo-bet-hash', error: null });
          toast({
            title: 'Bet Placed (Demo)',
            description: `You bet ${choice ? 'YES' : 'NO'} with ${amount} ETH`,
          });
        }, 1000);

        return { hash: 'demo-bet-hash' };
      } catch (storageError: any) {
        setTxState({ loading: false, hash: null, error: storageError.message });
        toast({
          title: 'Bet Failed',
          description: storageError.message,
          variant: 'destructive',
        });
        throw storageError;
      }
    }
  }, [executeTransaction, toast]);

  const resolveMarket = useCallback(async (marketId: string, outcome: boolean) => {
    const contract = await Web3Utils.getContract();
    return executeTransaction(
      () => contract.resolveMarket(marketId, outcome),
      `Market resolved as ${outcome ? 'YES' : 'NO'}`
    );
  }, [executeTransaction]);

  const redeemWinnings = useCallback(async (marketId: string) => {
    const contract = await Web3Utils.getContract();
    return executeTransaction(
      () => contract.redeem(marketId),
      'Winnings claimed successfully!'
    );
  }, [executeTransaction]);

  const getMarket = useCallback(async (marketId: string) => {
    try {
      const contract = await Web3Utils.getContract();
      const market = await contract.getMarket(marketId);

      return {
        id: marketId,
        question: market.question ?? market[0],
        deadline: Number(market.deadline ?? market[1]),
        creator: market.creator ?? market[2],
        isResolved: market.isResolved ?? market[3],
        outcome: market.outcome ?? market[4],
        totalYesBets: Web3Utils.formatEthAmount(market.totalYesBets ?? market[5]),
        totalNoBets: Web3Utils.formatEthAmount(market.totalNoBets ?? market[6]),
        yesPool: Web3Utils.formatEthAmount(market.yesPool ?? market[7]),
        noPool: Web3Utils.formatEthAmount(market.noPool ?? market[8]),
        createdAt: Number(market.createdAt ?? market[9]),
        resolvedAt: market.resolvedAt ? Number(market.resolvedAt ?? market[10]) : undefined,
      };
    } catch (error: any) {
      toast({
        title: 'Failed to Fetch Market',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const getMarketCount = useCallback(async () => {
    try {
      const contract = await Web3Utils.getContract();
      const count = await contract.getMarketCount();
      return Number(count);
    } catch (error: any) {
      console.error('Failed to get market count:', error);
      return 0;
    }
  }, []);

  const getUserBets = useCallback(async (userAddress: string, marketId: string) => {
    try {
      const contract = await Web3Utils.getContract();
      const bets = await contract.getUserBets(userAddress, marketId);
      return {
        yesBets: Web3Utils.formatEthAmount(bets.yesBets ?? bets[0]),
        noBets: Web3Utils.formatEthAmount(bets.noBets ?? bets[1]),
      };
    } catch (error: any) {
      console.error('Failed to get user bets:', error);
      return { yesBets: '0', noBets: '0' };
    }
  }, []);

  const canClaim = useCallback(async (userAddress: string, marketId: string) => {
    try {
      const contract = await Web3Utils.getContract();
      const result = await contract.canClaim(userAddress, marketId);
      return {
        canClaim: result[0],
        amount: Web3Utils.formatEthAmount(result[1]),
      };
    } catch (error: any) {
      console.error('Failed to check claim status:', error);
      return { canClaim: false, amount: '0' };
    }
  }, []);

  return {
    txState,
    createMarket,
    placeBet,
    resolveMarket,
    redeemWinnings,
    getMarket,
    getMarketCount,
    getUserBets,
    canClaim,
  };
}
