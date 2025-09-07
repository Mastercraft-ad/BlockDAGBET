import { CreateMarketForm } from '@/components/CreateMarketForm';
import { MarketList } from '@/components/MarketList';
import { ResolveMarket } from '@/components/ResolveMarket';
import { RedeemWinnings } from '@/components/RedeemWinnings';
import { WalletConnection } from '@/components/WalletConnection';
import { useMarkets } from '@/hooks/useMarkets';
import { formatCurrency } from '@/utils/formatting';

export default function Home() {
  const { markets, activeMarkets } = useMarkets();

  const totalVolume = markets.reduce((sum, market) => {
    return sum + parseFloat(market.yesPool) + parseFloat(market.noPool);
  }, 0);

  const totalUsers = new Set(markets.map(m => m.creator)).size;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">P</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  DecentralizedPredictions
                </h1>
              </div>
              <div className="pulse-dot w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-sm text-muted-foreground">Mainnet</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#markets" className="text-foreground hover:text-primary transition-colors">Markets</a>
              <a href="#create" className="text-foreground hover:text-primary transition-colors">Create</a>
              <a href="#analytics" className="text-foreground hover:text-primary transition-colors">Analytics</a>
            </nav>

            <WalletConnection />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Stats Section */}
        <section className="stats-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Decentralized Prediction Markets
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create, bet on, and resolve prediction markets with complete transparency on the blockchain
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stats-total-volume">
                {formatCurrency(totalVolume.toString())} ETH
              </div>
              <div className="text-muted-foreground">Total Volume</div>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2" data-testid="stats-active-markets">
                {activeMarkets.length}
              </div>
              <div className="text-muted-foreground">Active Markets</div>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2" data-testid="stats-total-users">
                {totalUsers}
              </div>
              <div className="text-muted-foreground">Total Users</div>
            </div>
          </div>
        </section>

        {/* Create Market Form */}
        <section id="create">
          <CreateMarketForm onMarketCreated={() => window.location.reload()} />
        </section>

        {/* Market List */}
        <MarketList />

        {/* Resolve Market */}
        <ResolveMarket />

        {/* Redeem Winnings */}
        <RedeemWinnings />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="text-foreground font-semibold">DecentralizedPredictions</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">Discord</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            </div>
          </div>
          <div className="border-t border-border mt-6 pt-6 text-center text-sm text-muted-foreground">
            <p>© 2024 DecentralizedPredictions. Built on Ethereum. Powered by Web3.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
