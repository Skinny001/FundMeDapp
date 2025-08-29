import { createAppKit } from "@reown/appkit"
import { EthersAdapter } from "@reown/appkit-adapter-ethers"
import { XDC_APOTHEM_CONFIG } from "./web3"

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!

if (!projectId) {
  throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not set")
}

// Define XDC Apothem network for AppKit
const xdcApothem = {
  chainId: XDC_APOTHEM_CONFIG.chainId,
  name: XDC_APOTHEM_CONFIG.chainName,
  currency: XDC_APOTHEM_CONFIG.nativeCurrency.symbol,
  explorerUrl: XDC_APOTHEM_CONFIG.blockExplorerUrls[0],
  rpcUrl: XDC_APOTHEM_CONFIG.rpcUrls[0],
}

// Create the AppKit instance
export const appKit = createAppKit({
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
})
