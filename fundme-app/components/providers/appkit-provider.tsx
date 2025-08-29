"use client"

import type React from "react"
import { createAppKit } from "@reown/appkit"
import { EthersAdapter } from "@reown/appkit-adapter-ethers"
import { XDC_APOTHEM_CONFIG } from "@/lib/web3"

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!

if (!projectId) {
  throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not set")
}

const xdcApothem = {
  id: XDC_APOTHEM_CONFIG.chainId,
  name: XDC_APOTHEM_CONFIG.chainName,
  nativeCurrency: XDC_APOTHEM_CONFIG.nativeCurrency,
  rpcUrls: {
    default: { http: [XDC_APOTHEM_CONFIG.rpcUrls[0]] },
    public: { http: [XDC_APOTHEM_CONFIG.rpcUrls[0]] },
  },
  blockExplorers: {
    default: {
      name: "XDC Explorer",
      url: XDC_APOTHEM_CONFIG.blockExplorerUrls[0],
    },
  },
  testnet: true,
}

const modal = createAppKit({
  adapters: [new EthersAdapter()],
  projectId,
  networks: [xdcApothem],
  defaultNetwork: xdcApothem,
  metadata: {
    name: "FundMe",
    description: "Decentralized Crowdfunding Platform",
    url: typeof window !== "undefined" ? window.location.origin : "",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
  features: {
    analytics: true,
    email: false,
    socials: [],
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-z-index": "9999",
    "--w3m-backdrop-filter": "blur(4px)",
  },
})

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
