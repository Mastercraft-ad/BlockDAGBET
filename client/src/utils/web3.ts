import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, SUPPORTED_CHAIN_IDS } from '@/constants/contract';

export class Web3Utils {
  private static provider: BrowserProvider | null = null;
  private static contract: Contract | null = null;

  static async getProvider(): Promise<BrowserProvider> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    if (!this.provider) {
      this.provider = new BrowserProvider(window.ethereum);
    }

    return this.provider;
  }

  static async getContract(): Promise<Contract> {
    if (!this.contract) {
      const provider = await this.getProvider();
      const signer = await provider.getSigner();
      this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }

    return this.contract;
  }

  static async connectWallet(): Promise<string> {
    const provider = await this.getProvider();
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    return accounts[0];
  }

  static async getBalance(address: string): Promise<string> {
    const provider = await this.getProvider();
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  }

  static async getChainId(): Promise<number> {
    const provider = await this.getProvider();
    const network = await provider.getNetwork();
    return Number(network.chainId);
  }

  static async switchChain(chainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  }

  static isChainSupported(chainId: number): boolean {
    return SUPPORTED_CHAIN_IDS.includes(chainId);
  }

  static formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  static parseEthAmount(amount: string): bigint {
    return parseEther(amount);
  }

  static formatEthAmount(amount: bigint): string {
    return formatEther(amount);
  }
}
