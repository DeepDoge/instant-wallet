import { ethers } from "ethers";
import * as Utils from "./utils";
export * as Utils from "./utils";

export interface Eip1193Provider extends ethers.Eip1193Provider {
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
  once(event: string, listener: (...args: any[]) => void): void;
}

export interface ConnectMethod {
  name: string;
  icon: SVGElement;
  ethereum: Eip1193Provider;
  provider: ethers.BrowserProvider;
}

export interface NetworkInfo {
  chainId: bigint;
  name: string;
  icon?: SVGElement;
  color?: Utils.Color;
  rpcUrl: Utils.HttpUrl;
  blockExplorer?: Utils.HttpUrl;
  ensAddress?: Utils.Address;
}
