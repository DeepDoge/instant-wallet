import * as ethers from "ethers";
import { Signal, signal } from "master-ts";
import * as Utils from "./utils";

export * as Builtin from "./builtin";
export * as Modal from "./modal";
export * as Utils from "./utils";

export interface Eip1193Provider extends ethers.Eip1193Provider {
    on(event: string, listener: (...args: any[]) => void): void;
    off(event: string, listener: (...args: any[]) => void): void;
    once(event: string, listener: (...args: any[]) => void): void;
}

export interface ConnectionMethod {
    name: string;
    icon(): SVGElement;
    ethereum: Eip1193Provider;
}

export interface ChainInfo {
    chainId: bigint;
    name: string;
    rpcUrl: Utils.HttpUrl;
    blockExplorer: Utils.HttpUrl;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: bigint;
    };
    style?: {
        icon(): SVGElement;
        color: string;
    };
}

export interface Connection {
    chainId: bigint;
    provider: ethers.BrowserProvider;
    signers: Signal<ethers.JsonRpcSigner[]>;
}

async function createConnection(method: ConnectionMethod): Promise<Connection> {
    const provider = new ethers.BrowserProvider(method.ethereum);
    const chainId = await provider.getNetwork().then((network) => network.chainId);
    const signers = signal<ethers.JsonRpcSigner[]>(await provider.listAccounts());
    provider.on("accountsChanged", async () => {
        signers.ref = await provider.listAccounts();
    });

    return { chainId, provider, signers };
}

export async function connect(method: ConnectionMethod): Promise<Signal<Connection | null>> {
    return signal<Connection | null>(await createConnection(method), (set) => {
        let active = true;

        async function updateConnection() {
            const connection = await createConnection(method);
            if (active) set(connection);
        }

        method.ethereum.on("chainChanged", updateConnection);

        return () => {
            active = false;
            method.ethereum.off("chainChanged", updateConnection);
        };
    }).asImmutable();
}

export async function changeChain(connection: Connection, chain: ChainInfo): Promise<void> {
    await connection.provider
        .send("wallet_switchEthereumChain", [
            {
                chainId: `0x${chain.chainId.toString(16)}`,
            },
        ])
        .catch(() =>
            connection.provider.send("wallet_addEthereumChain", [
                {
                    chainId: `0x${1n.toString(16)}`,
                    chainName: chain.name,
                    rpcUrls: [chain.rpcUrl],
                    nativeCurrency: chain.nativeCurrency,
                    blockExplorerUrls: [chain.blockExplorer],
                },
            ]),
        );
}
