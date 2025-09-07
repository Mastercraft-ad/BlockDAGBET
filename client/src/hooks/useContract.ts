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
    const contract = await Web3Utils.getContract();
    return executeTransaction(
      () => contract.createMarket(question, deadline, { 
        value: Web3Utils.parseEthAmount(value) 
      }),
      'Market created successfully!'
    );
  }, [executeTransaction]);

  const placeBet = useCallback(async (marketId: string, choice: boolean, amount: string) => {
    const contract = await Web3Utils.getContract();
    return executeTransaction(
      () => contract.placeBet(marketId, choice, { 
        value: Web3Utils.parseEthAmount(amount) 
      }),
      `Bet placed successfully! You bet ${choice ? 'YES' : 'NO'}`
    );
  }, [executeTransaction]);

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
        question: market.question,
        deadline: Number(market.deadline),
        creator: market.creator,
        isResolved: market.isResolved,
        outcome: market.outcome,
        totalYesBets: Web3Utils.formatEthAmount(market.totalYesBets),
        totalNoBets: Web3Utils.formatEthAmount(market.totalNoBets),
        yesPool: Web3Utils.formatEthAmount(market.yesPool),
        noPool: Web3Utils.formatEthAmount(market.noPool),
        createdAt: Number(market.createdAt),
        resolvedAt: market.resolvedAt ? Number(market.resolvedAt) : undefined,
      };
    } catch (error: any) {
      toast({
        title: 'Failed to Fetch Market',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
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
        yesBets: Web3Utils.formatEthAmount(bets.yesBets),
        noBets: Web3Utils.formatEthAmount(bets.noBets),
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
