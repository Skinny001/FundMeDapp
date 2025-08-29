import { ethers } from "ethers"

export const XDC_APOTHEM_CONFIG = {
  chainId: 51,
  chainName: "XDC Apothem Network",
  nativeCurrency: {
    name: "XDC",
    symbol: "XDC",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.apothem.network"],
  blockExplorerUrls: ["https://explorer.apothem.network"],
}

export const FUNDME_CONTRACT_ADDRESS = "0x27AfcC1b6C645acF64b67f19C98ed48641aC37A8"

export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum
  }
  return null
}

export const getSigner = async () => {
  const provider = getProvider()
  if (!provider) throw new Error("No wallet provider found")
  return provider
}

export const isCorrectNetwork = async () => {
  const provider = getProvider()
  if (!provider) return false

  try {
    const chainId = await (provider as { request: (args: any) => Promise<any> }).request({ method: "eth_chainId" })
    return Number.parseInt(chainId, 16) === XDC_APOTHEM_CONFIG.chainId
  } catch (error) {
    return false
  }
}

export const switchToXDCNetwork = async () => {
  if (!window.ethereum) throw new Error("No wallet provider found")

  try {
    await (window.ethereum as { request: (args: any) => Promise<any> }).request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${XDC_APOTHEM_CONFIG.chainId.toString(16)}` }],
    })
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await (window.ethereum as { request: (args: any) => Promise<any> }).request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${XDC_APOTHEM_CONFIG.chainId.toString(16)}`,
            chainName: XDC_APOTHEM_CONFIG.chainName,
            nativeCurrency: XDC_APOTHEM_CONFIG.nativeCurrency,
            rpcUrls: XDC_APOTHEM_CONFIG.rpcUrls,
            blockExplorerUrls: XDC_APOTHEM_CONFIG.blockExplorerUrls,
          },
        ],
      })
    } else {
      throw switchError
    }
  }
}

export const formatXDC = (amount: string | number) => {
  const value = typeof amount === "string" ? Number.parseFloat(amount) : amount
  return `${(value / 1e18).toFixed(4)} XDC`
}

export const parseXDC = (amount: string) => {
  // Use BigInt to avoid scientific notation and ensure integer string
  const value = BigInt(Math.floor(Number.parseFloat(amount) * 1e18))
  return value.toString()
}

export const FUNDME_ABI = [
  {"type":"function","name":"campaigns","inputs":[{"name":"","type":"uint256"}],"outputs":[{"name":"owner","type":"address"},{"name":"title","type":"string"},{"name":"description","type":"string"},{"name":"target","type":"uint256"},{"name":"deadline","type":"uint256"},{"name":"amountCollected","type":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"createCampaign","inputs":[{"name":"_title","type":"string"},{"name":"_description","type":"string"},{"name":"_target","type":"uint256"},{"name":"_deadline","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"nonpayable"},
  {"type":"function","name":"donateToCampaign","inputs":[{"name":"_id","type":"uint256"}],"outputs":[],"stateMutability":"payable"},
  {"type":"function","name":"getAllCampaigns","inputs":[],"outputs":[{"name":"","type":"address[]"},{"name":"","type":"string[]"},{"name":"","type":"string[]"},{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"}],"stateMutability":"view"},
  {"type":"function","name":"getCampaign","inputs":[{"name":"_id","type":"uint256"}],"outputs":[{"name":"owner","type":"address"},{"name":"title","type":"string"},{"name":"description","type":"string"},{"name":"target","type":"uint256"},{"name":"deadline","type":"uint256"},{"name":"amountCollected","type":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"getDonators","inputs":[{"name":"_id","type":"uint256"}],"outputs":[{"name":"","type":"address[]"},{"name":"","type":"uint256[]"}],"stateMutability":"view"},
  {"type":"function","name":"numberOfCampaigns","inputs":[],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"withdraw","inputs":[{"name":"_id","type":"uint256"}],"outputs":[],"stateMutability":"nonpayable"}
]

export const getFundMeContract = async () => {
  const provider = typeof window !== "undefined" && window.ethereum
    ? new ethers.BrowserProvider(window.ethereum as any)
    : new ethers.JsonRpcProvider(XDC_APOTHEM_CONFIG.rpcUrls[0])
  const signer = typeof window !== "undefined" && window.ethereum
    ? await provider.getSigner()
    : undefined
  const contract = new ethers.Contract(FUNDME_CONTRACT_ADDRESS, FUNDME_ABI, signer || provider)

  return {
    getAllCampaigns: async () => {
      return await contract.getAllCampaigns()
    },
    getCampaign: async (id: number) => {
      return await contract.getCampaign(id)
    },
    getDonators: async (id: number) => {
      return await contract.getDonators(id)
    },
    createCampaign: async (_title: string, _description: string, _target: string, _deadline: string) => {
      if (!signer) throw new Error("Wallet not connected")
      const tx = await contract.createCampaign(_title, _description, _target, _deadline)
      return await tx.wait()
    },
    donateToCampaign: async (_id: number, value: string) => {
      if (!signer) throw new Error("Wallet not connected")
      const tx = await contract.donateToCampaign(_id, { value })
      return await tx.wait()
    },
    withdraw: async (_id: number) => {
      if (!signer) throw new Error("Wallet not connected")
      const tx = await contract.withdraw(_id)
      return await tx.wait()
    },
    numberOfCampaigns: async () => {
      return await contract.numberOfCampaigns()
    },
  }
}
