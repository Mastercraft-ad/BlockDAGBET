import { useState, useEffect, useCallback } from 'react';
import { WalletState } from '@/types/wallet';
import { Web3Utils } from '@/utils/web3';
import { useToast } from '@/hooks/use-toast';

export function useWallet() {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    balance: '0',
    chainId: null,
    error: null,
  });

  const updateBalance = useCallback(async (address: string) => {
    try {
      const balance = await Web3Utils.getBalance(address);
      setWallet(prev => ({ ...prev, balance }));
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask Required',
        description: 'Please install MetaMask to use this application.',
        variant: 'destructive',
      });
      return;
    }

    setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const address = await Web3Utils.connectWallet();
      const chainId = await Web3Utils.getChainId();
      const balance = await Web3Utils.getBalance(address);

      if (!Web3Utils.isChainSupported(chainId)) {
        toast({
          title: 'Unsupported Network',
          description: 'Please switch to a supported network (Ethereum Mainnet or Sepolia Testnet).',
          variant: 'destructive',
        });
      }

      setWallet({
        address,
        isConnected: true,
        isConnecting: false,
        balance,
        chainId,
        error: null,
      });

      toast({
        title: 'Wallet Connected',
        description: `Connected to ${Web3Utils.formatAddress(address)}`,
      });
    } catch (error: any) {
      setWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message,
      }));
      
      toast({
        title: 'Connection Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const disconnectWallet = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      balance: '0',
      chainId: null,
      error: null,
    });
  }, []);

  const switchChain = useCallback(async (chainId: number) => {
    try {
      await Web3Utils.switchChain(chainId);
      setWallet(prev => ({ ...prev, chainId }));
    } catch (error: any) {
      toast({
        title: 'Network Switch Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const address = accounts[0];
          const chainId = await Web3Utils.getChainId();
          const balance = await Web3Utils.getBalance(address);

          setWallet({
            address,
            isConnected: true,
            isConnecting: false,
            balance,
            chainId,
            error: null,
          });
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    };

    checkConnection();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWallet(prev => ({ ...prev, address: accounts[0] }));
        updateBalance(accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      setWallet(prev => ({ ...prev, chainId: newChainId }));
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [disconnectWallet, updateBalance]);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    switchChain,
    updateBalance: () => wallet.address && updateBalance(wallet.address),
  };
}
