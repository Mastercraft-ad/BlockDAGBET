import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { Web3Utils } from '@/utils/web3';
import { ChevronDown, Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function WalletConnection() {
  const { wallet, connectWallet, disconnectWallet } = useWallet();

  if (!wallet.isConnected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={wallet.isConnecting}
        className="wallet-button px-3 sm:px-6 py-2 rounded-lg text-primary-foreground font-medium text-xs sm:text-sm"
        data-testid="button-connect-wallet"
      >
        {wallet.isConnecting ? (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="loading-spinner w-3 h-3 sm:w-4 sm:h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
            <span className="hidden sm:inline">Connecting...</span>
            <span className="sm:hidden">...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </div>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="wallet-button px-3 sm:px-6 py-2 rounded-lg text-primary-foreground font-medium border-transparent text-xs sm:text-sm"
          data-testid="button-wallet-menu"
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full pulse-dot" />
            <span className="max-w-[80px] sm:max-w-none truncate">{Web3Utils.formatAddress(wallet.address!)}</span>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-card border-border">
        <div className="p-3 border-b border-border">
          <div className="text-sm text-muted-foreground">Balance</div>
          <div className="text-lg font-semibold" data-testid="text-wallet-balance">
            {parseFloat(wallet.balance).toFixed(4)} ETH
          </div>
        </div>
        {wallet.chainId && !Web3Utils.isChainSupported(wallet.chainId) && (
          <div className="p-3 border-b border-border">
            <div className="text-sm text-destructive">
              Unsupported network. Please switch to Ethereum or Sepolia.
            </div>
          </div>
        )}
        <DropdownMenuItem
          onClick={disconnectWallet}
          className="text-destructive focus:text-destructive"
          data-testid="button-disconnect-wallet"
        >
          Disconnect Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
