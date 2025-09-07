import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { Plus, AlertTriangle } from 'lucide-react';

interface CreateMarketFormData {
  question: string;
  deadline: string;
  initialLiquidity: string;
}

export function CreateMarketForm({ onMarketCreated }: { onMarketCreated?: () => void }) {
  const { wallet } = useWallet();
  const { createMarket, txState } = useContract();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CreateMarketFormData>({
    question: '',
    deadline: '',
    initialLiquidity: '0.1',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to create a market.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.question.trim()) {
      toast({
        title: 'Invalid Question',
        description: 'Please enter a market question.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.deadline) {
      toast({
        title: 'Invalid Deadline',
        description: 'Please select a resolution deadline.',
        variant: 'destructive',
      });
      return;
    }

    const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);
    
    if (deadlineTimestamp <= now) {
      toast({
        title: 'Invalid Deadline',
        description: 'Deadline must be in the future.',
        variant: 'destructive',
      });
      return;
    }

    const liquidityAmount = parseFloat(formData.initialLiquidity);
    if (liquidityAmount < 0.01) {
      toast({
        title: 'Invalid Liquidity',
        description: 'Initial liquidity must be at least 0.01 ETH.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createMarket(formData.question, deadlineTimestamp, formData.initialLiquidity);
      
      // Reset form
      setFormData({
        question: '',
        deadline: '',
        initialLiquidity: '0.1',
      });
      
      onMarketCreated?.();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleInputChange = (field: keyof CreateMarketFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Set minimum date to today
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDateTime = today.toISOString().slice(0, 16);

  return (
    <Card className="glass-card border-border">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-2xl font-bold flex items-center">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-primary" />
          Create New Market
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <Label htmlFor="question" className="block text-sm font-medium text-foreground mb-2">
              Market Question
            </Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
              rows={3}
              placeholder="Will Bitcoin reach $100,000 by the end of 2024?"
              disabled={txState.loading}
              data-testid="input-market-question"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Be specific and clear. Markets resolve based on objective criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="deadline" className="block text-sm font-medium text-foreground mb-2">
                Resolution Deadline
              </Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                min={minDateTime}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                disabled={txState.loading}
                data-testid="input-market-deadline"
              />
            </div>
            <div>
              <Label htmlFor="liquidity" className="block text-sm font-medium text-foreground mb-2">
                Initial Liquidity (ETH)
              </Label>
              <Input
                id="liquidity"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.initialLiquidity}
                onChange={(e) => handleInputChange('initialLiquidity', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="1.0"
                disabled={txState.loading}
                data-testid="input-initial-liquidity"
              />
            </div>
          </div>

          <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-400">
              Market creation requires 0.1 ETH fee + gas costs + initial liquidity
            </p>
          </div>

          <Button
            type="submit"
            disabled={!wallet.isConnected || txState.loading}
            className="wallet-button w-full py-3 sm:py-4 rounded-lg text-primary-foreground font-semibold text-base sm:text-lg"
            data-testid="button-create-market"
          >
            {txState.loading ? (
              <div className="flex items-center space-x-2">
                <div className="loading-spinner w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                <span className="text-sm sm:text-base">Creating Market...</span>
              </div>
            ) : (
              'Create Market'
            )}
          </Button>
          
          {txState.hash && (
            <p className="text-sm text-muted-foreground text-center">
              Transaction: {txState.hash.slice(0, 10)}...
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
