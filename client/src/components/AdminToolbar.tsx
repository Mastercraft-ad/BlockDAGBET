import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/hooks/useAdmin';
import { useMarkets } from '@/hooks/useMarkets';
import { Shield, Settings, Clock, TrendingUp, X, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function AdminToolbar() {
  const { isAdmin } = useAdmin();
  const { markets } = useMarkets();
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render anything if not admin
  if (!isAdmin) return null;

  // Calculate admin statistics
  const now = Math.floor(Date.now() / 1000);
  const pendingResolution = markets.filter(m => 
    m && !m.isResolved && m.deadline < now
  ).length;
  
  const totalMarkets = markets.filter(m => m).length;
  const resolvedMarkets = markets.filter(m => m && m.isResolved).length;

  const handleAdminAction = (action: string) => {
    switch (action) {
      case 'dashboard':
        window.location.href = '/admin';
        break;
      case 'pending':
        window.location.href = '/admin';
        // TODO: Scroll to pending markets section
        break;
      case 'analytics':
        window.location.href = '/admin';
        // TODO: Scroll to analytics section
        break;
      default:
        console.log(`Admin action: ${action}`);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded ? (
        <Card className="glass-card border-primary/20 bg-background/95 backdrop-blur p-4 w-72">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Admin Panel</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Admin Statistics */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{pendingResolution}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">{totalMarkets}</div>
              <div className="text-xs text-muted-foreground">Total Markets</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAdminAction('dashboard')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAdminAction('pending')}
              disabled={pendingResolution === 0}
            >
              <Clock className="w-4 h-4 mr-2" />
              Resolve Markets
              {pendingResolution > 0 && (
                <Badge variant="destructive" className="ml-auto text-xs">
                  {pendingResolution}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAdminAction('analytics')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Platform Analytics
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg relative"
        >
          <Shield className="w-6 h-6 text-primary-foreground" />
          {pendingResolution > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 text-xs min-w-[20px] h-5 p-0 flex items-center justify-center"
            >
              {pendingResolution}
            </Badge>
          )}
          <ChevronUp className="w-3 h-3 absolute bottom-1 text-primary-foreground/70" />
        </Button>
      )}
    </div>
  );
}