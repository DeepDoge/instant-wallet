import { NetworkInfo } from "../wallet";

export const mainnet: NetworkInfo = {
    chainId: 1n,
    name: "Mainnet",
    color: "#ff8b9e",
    icon: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    rpcUrl: "https://mainnet.infura.io/v3/3c0b6a8b7a0a4f4d9f0d0b2b6f3a0b4b",
    blockExplorer: "https://etherscan.io/",
};
