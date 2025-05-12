/* eslint-disable @typescript-eslint/no-explicit-any */
// src/global.d.ts
import { ExternalProvider } from "@ethersproject/providers";

declare global {
  interface Window {
    /**
     * A merged EIP-1193 / MetaMask provider type:
     * - `ExternalProvider` from ethers v5
     * - plus the `request` method and optional event listeners
     */
    ethereum?: ExternalProvider & {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

export {};
