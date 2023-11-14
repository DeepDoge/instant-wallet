import { ChainInfo } from "../wallet";

export const mainnet: ChainInfo = {
    chainId: 1n,
    name: "Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8",
    blockExplorer: "https://etherscan.io/",
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18n,
    },
    style: {
        color: "#ff8b9e",
        icon: () => document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    },
};
