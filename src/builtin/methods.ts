import { ConnectMethod } from "../wallet";

export const browserWallet: ConnectMethod | null =
    "ethereum" in window
        ? {
              name: "Browser Wallet",
              icon: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
              ethereum: window.ethereum as never,
          }
        : null;
