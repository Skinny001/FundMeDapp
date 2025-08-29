export interface Campaign {
  id: number
  owner: string
  title: string
  description: string
  target: string
  deadline: string
  amountCollected: string
  image?: string
}

export interface Donation {
  donor: string
  amount: string
}

export interface WalletState {
  address: string | null
  balance: string | null
  isConnected: boolean
  isCorrectNetwork: boolean
}
