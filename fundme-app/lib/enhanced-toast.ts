import { toast } from "sonner"

interface TransactionToastProps {
  title: string
  description: string
  transactionHash?: string
  variant?: "default" | "destructive"
}

export const showTransactionToast = ({
  title,
  description,
  transactionHash,
  variant = "default",
}: TransactionToastProps) => {
  const explorerUrl = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "https://explorer.apothem.network"

  if (variant === "destructive") {
    toast.error(title, {
      description,
    })
  } else {
    toast.success(title, {
      description: transactionHash
        ? `${description} View on explorer: ${explorerUrl}/tx/${transactionHash}`
        : description,
    })
  }
}
