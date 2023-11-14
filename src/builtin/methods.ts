import { ConnectionMethod, Eip1193Provider } from "../wallet";

export const browserWallet: ConnectionMethod | null =
    "ethereum" in window
        ? {
              name: "Browser Wallet",
              icon: () => document.createElementNS("http://www.w3.org/2000/svg", "svg"),
              ethereum: window.ethereum as Eip1193Provider,
          }
        : null;
