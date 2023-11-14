import { ethers } from "ethers";
import * as Utils from "./utils";
export * as Builtin from "./builtin";
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

export interface ConnectMethod {
    name: string;
    icon: SVGElement;
    ethereum: Eip1193Provider | { (): Promise<Eip1193Provider> };
}

export interface NetworkInfo {
    chainId: bigint;
    name: string;
    icon?: SVGElement;
    color?: string;
    rpcUrl: Utils.HttpUrl;
    blockExplorer?: Utils.HttpUrl;
    ensAddress?: Utils.Address;
}

export interface Base {}
export interface Connected extends Base {
    connected: true;
    method: ConnectMethod;
    provider: ethers.BrowserProvider;
    signer: ethers.JsonRpcSigner;
    getChainId(): Promise<bigint>;
    changeNetwork(network: NetworkInfo): Promise<boolean>;
}

export interface Disconnected extends Base {
    connected: false;
}

export async function connect(method: ConnectMethod, mode: "hard"): Promise<Connected>;
export async function connect(method: ConnectMethod, mode: "soft"): Promise<Connected | Disconnected>;
export async function connect(method: ConnectMethod, mode: "soft" | "hard"): Promise<Connected | Disconnected> {
    const provider = new ethers.BrowserProvider(
        typeof method.ethereum === "function" ? await method.ethereum() : method.ethereum,
    );
    const signer =
        (await provider.listAccounts().then((accounts) => accounts[0])) ?? mode === "hard"
            ? await provider.getSigner()
            : null;
    if (!signer) return { connected: false };

    return {
        connected: true,
        method,
        provider,
        signer,
        async getChainId() {
            return await provider.getNetwork().then((network) => network.chainId);
        },
        async changeNetwork(network) {
            await provider
                .send("wallet_switchEthereumChain", [{ chainId: ethers.toBeHex(network.chainId) }])
                .catch(() => {});
            return await provider.getNetwork().then((network) => network.chainId === network.chainId);
        },
    };
}
