// src/context/WalletContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(null);

  // connect via window.ethereum
  const connect = useCallback(async () => {
    if (!window.ethereum || !window.ethereum.request) {
      throw new Error("No injected wallet found");
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const acc = (accounts && accounts[0]) || "";
      setAddress(acc);
      const chain = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(chain);
      return { address: acc, chainId: chain };
    } catch (e) {
      throw e;
    }
  }, []);

  // simple disconnect (client-side only)
  const disconnect = useCallback(() => {
    setAddress("");
    setChainId(null);
  }, []);

  useEffect(() => {
    if (!window.ethereum || !window.ethereum.on) return;

    const handleAccounts = (accs) => {
      setAddress(accs && accs[0] ? accs[0] : "");
    };
    const handleChain = (c) => setChainId(c);

    window.ethereum.on("accountsChanged", handleAccounts);
    window.ethereum.on("chainChanged", handleChain);

    // initial if wallet already connected
    (async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts && accounts[0]) {
          setAddress(accounts[0]);
          const chain = await window.ethereum.request({ method: "eth_chainId" });
          setChainId(chain);
        }
      } catch (e) {
        // ignore
      }
    })();

    return () => {
      try {
        window.ethereum.removeListener("accountsChanged", handleAccounts);
        window.ethereum.removeListener("chainChanged", handleChain);
      } catch (e) {}
    };
  }, []);

  return (
    <WalletContext.Provider value={{ address, chainId, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
};
