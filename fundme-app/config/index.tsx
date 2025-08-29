import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// XDC Apothem network config
export const xdcApothem = {
  id: 51,
  name: 'XDC Apothem',
  nativeCurrency: { name: 'TXDC', symbol: 'TXDC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://erpc.apothem.network'] },
  },
  blockExplorers: {
    default: { name: 'XDC Explorer', url: 'https://explorer.apothem.network' },
  },
  testnet: true,
}

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [xdcApothem]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
