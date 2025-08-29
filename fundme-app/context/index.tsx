'use client'

import { wagmiAdapter, projectId, xdcApothem } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

const queryClient = new QueryClient()

const metadata = {
  name: 'Your App Name',
  description: 'Your App Description',
  url: 'https://yourapp.com',
  icons: [
    'https://yourapp.com/icon-192x192.png',
    'https://yourapp.com/icon-512x512.png'
  ]
}

const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId ?? '',
  networks: [xdcApothem],
  defaultNetwork: xdcApothem,
  metadata,
  features: { analytics: true }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export { modal }
export default ContextProvider