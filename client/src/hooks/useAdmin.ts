import { useMemo } from 'react';
import { useWallet } from './useWallet';

// Admin wallet address
const ADMIN_ADDRESS = '0x3c17f3F514658fACa2D24DE1d29F542a836FD10A'; // Replace with your admin wallet address

export function useAdmin() {
  const { wallet } = useWallet();
  
  const isAdmin = useMemo(() => {
    if (!wallet.isConnected || !wallet.address) {
      return false;
    }
    
    // Case-insensitive comparison of wallet addresses
    return wallet.address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
  }, [wallet.isConnected, wallet.address]);

  return {
    isAdmin,
    adminAddress: ADMIN_ADDRESS,
    connectedAddress: wallet.address,
  };
}