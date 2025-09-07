export function formatTimeRemaining(deadline: number): string {
  const now = Date.now() / 1000;
  const timeLeft = deadline - now;
  
  if (timeLeft <= 0) {
    return 'Expired';
  }
  
  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPercentage(part: string, total: string): number {
  const partNum = parseFloat(part);
  const totalNum = parseFloat(total);
  
  if (totalNum === 0) return 50; // Default to 50/50 if no bets
  
  return Math.round((partNum / totalNum) * 100);
}

export function calculateOdds(myPool: string, otherPool: string): number {
  const myAmount = parseFloat(myPool);
  const otherAmount = parseFloat(otherPool);
  
  if (myAmount === 0) return 1;
  
  return (myAmount + otherAmount) / myAmount;
}

export function formatCurrency(amount: string, decimals: number = 4): string {
  const num = parseFloat(amount);
  
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toFixed(decimals);
}
