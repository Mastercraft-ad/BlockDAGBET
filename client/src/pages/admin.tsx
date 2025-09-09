import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/hooks/useAdmin';
import { useMarkets } from '@/hooks/useMarkets';
import { useContract } from '@/hooks/useContract';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Clock, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle,
  AlertTriangle,
  Home
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { isAdmin, adminAddress, connectedAddress } = useAdmin();
  const { markets, loading } = useMarkets();
  const { resolveMarket, txState } = useContract();
  const { toast } = useToast();

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="glass-card border-destructive/20 w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This admin panel is restricted to authorized users only.
            </p>
            <div className="text-xs text-muted-foreground">
              <p>Connected: {connectedAddress || 'Not connected'}</p>
              <p>Required: {adminAddress}</p>
            </div>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const validMarkets = markets.filter(m => m);
    const now = Math.floor(Date.now() / 1000);
    
    const totalMarkets = validMarkets.length;
    const resolvedMarkets = validMarkets.filter(m => m.isResolved).length;
    const pendingResolution = validMarkets.filter(m => !m.isResolved && m.deadline < now).length;
    const activeMarkets = validMarkets.filter(m => !m.isResolved && m.deadline >= now).length;
    
    const totalVolume = validMarkets.reduce((sum, market) => {
      return sum + parseFloat(market.yesPool) + parseFloat(market.noPool);
    }, 0);
    
    const uniqueCreators = new Set(validMarkets.map(m => m.creator)).size;
    
    return {
      totalMarkets,
      resolvedMarkets,
      pendingResolution,
      activeMarkets,
      totalVolume,
      uniqueCreators
    };
  }, [markets]);

  const pendingMarkets = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    return markets.filter(m => m && !m.isResolved && m.deadline < now);
  }, [markets]);

  const handleResolveMarket = async (marketId: string, outcome: boolean) => {
    try {
      await resolveMarket(marketId, outcome);
      toast({
        title: 'Market Resolved',
        description: `Market resolved as ${outcome ? 'YES' : 'NO'}`,
      });
    } catch (error) {
      console.error('Failed to resolve market:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform management and analytics</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Home className="w-4 h-4 mr-2" />
            Return to Platform
          </Button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Markets</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalMarkets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-foreground">{stats.resolvedMarkets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-500/10 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Resolution</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingResolution}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalVolume.toFixed(2)} ETH</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Markets Pending Resolution */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span>Markets Pending Resolution ({stats.pendingResolution})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingMarkets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p className="text-lg font-medium">All markets are up to date!</p>
                <p className="text-sm">No markets require immediate resolution.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingMarkets.map((market) => (
                  <div key={market.id} className="border border-border rounded-lg p-4 bg-muted/30">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">{market.question}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>Deadline: {format(new Date(market.deadline * 1000), 'PPp')}</span>
                          <Badge variant="destructive" className="text-xs">Overdue</Badge>
                          <span>•</span>
                          <span>Pool: {(parseFloat(market.yesPool) + parseFloat(market.noPool)).toFixed(3)} ETH</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveMarket(market.id, true)}
                          disabled={txState.loading}
                          className="bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
                        >
                          Resolve YES
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveMarket(market.id, false)}
                          disabled={txState.loading}
                          className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                        >
                          Resolve NO
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Platform Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Unique Market Creators</span>
                <span className="font-medium">{stats.uniqueCreators}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Markets</span>
                <span className="font-medium">{stats.activeMarkets}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Resolution Rate</span>
                <span className="font-medium">
                  {stats.totalMarkets > 0 ? ((stats.resolvedMarkets / stats.totalMarkets) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span>Financial Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average Market Size</span>
                <span className="font-medium">
                  {stats.totalMarkets > 0 ? (stats.totalVolume / stats.totalMarkets).toFixed(3) : 0} ETH
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Platform Volume</span>
                <span className="font-medium">{stats.totalVolume.toFixed(2)} ETH</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Markets Requiring Action</span>
                <Badge variant={stats.pendingResolution > 0 ? "destructive" : "default"}>
                  {stats.pendingResolution}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}