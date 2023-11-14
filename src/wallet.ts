import { ethers } from "ethers";
import * as Utils from "./utils";
export * as Utils from "./utils";

/* 
  This project should be simple and should only take one file space.
  Modal should be a HTML element that can be appended to anywhere by the user of this library.
  We will export 2 main things, the wallet, that lets you see the currently connected wallet and network. 
  send transaction/singing requests and do anything else, we can probably give access to the signer and provider
  and we should export the modal constructor. simple..
  this shouldnt requeire many dependencies. current dependencies are fine.
  it should get big.
  we should support few simple things, walletconnect protocol. and browser wallets.
  wallet connect should be wrapped with Eip1193Provider.
  users of the library should be able to add their own ConnectionMethods. and NetworkInfo.

  But basicaly both usage and the code in the library should be simple, and fit.
*/

export interface Eip1193Provider extends ethers.Eip1193Provider {
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
  once(event: string, listener: (...args: any[]) => void): void;
}

export interface ConnectMethod extends ConnectMethod.Init {
  provider: ethers.BrowserProvider;
}
export namespace ConnectMethod {
  export interface Init {
    name: string;
    icon: SVGElement;
    ethereum: Eip1193Provider;
  }
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
