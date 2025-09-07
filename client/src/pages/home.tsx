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
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-base sm:text-lg">DB</span>
                </div>
                <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  <span className="hidden sm:inline">DAGBET</span>
                  <span className="sm:hidden">PredictMarket</span>
                </h1>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="pulse-dot w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm text-muted-foreground">Mainnet</span>
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center space-x-6">
              <a href="#markets" className="text-foreground hover:text-primary transition-colors">Markets</a>
              <a href="#create" className="text-foreground hover:text-primary transition-colors">Create</a>
            </nav>

            <WalletConnection />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Hero Stats Section */}
        <section className="stats-card rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Decentralized Prediction Markets
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2">
              Create, bet on, and resolve prediction markets with complete transparency on the blockchain
            </p>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-center">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2" data-testid="stats-total-volume">
                {formatCurrency(totalVolume.toString())} BDAG
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Volume</div>
            </div>
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-center">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-emerald-400 mb-1 sm:mb-2" data-testid="stats-active-markets">
                {activeMarkets.length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Markets</div>
            </div>
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-center">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-amber-400 mb-1 sm:mb-2" data-testid="stats-total-users">
                {totalUsers}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Users</div>
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
      <footer className="border-t border-border bg-card/50 mt-12 sm:mt-16">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-7 h-7 sm:w-20 sm:h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-base sm:text-lg">DAGBET</span>
              </div>
              <span className="text-foreground font-semibold text-sm sm:text-base">
                <span className="hidden sm:inline">Decentralized Predictions</span>
                <span className="sm:hidden">DAGBETMarket</span>
              </span>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Docs</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">Discord</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            </div>
          </div>
          <div className="border-t border-border mt-4 sm:mt-6 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-muted-foreground">
            <p>© 2025 DAGEBET Predictions. Developed by EagleDevs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}