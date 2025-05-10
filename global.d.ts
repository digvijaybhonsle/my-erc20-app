interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string }) => Promise<unknown>;
}

interface Window {
  ethereum?: EthereumProvider;
}

// Extend the Window interface instead of redeclaring 'window'
