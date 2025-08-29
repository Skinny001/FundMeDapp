"use client"

import type * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"

import { cn } from "@/lib/utils"

const getToggleClasses = (variant?: string, size?: string) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap"

  let variantClasses = ""
  switch (variant) {
    case "outline":
      variantClasses = "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground"
      break
    default:
      variantClasses = "bg-transparent"
  }

  let sizeClasses = ""
  switch (size) {
    case "sm":
      sizeClasses = "h-8 px-1.5 min-w-8"
      break
    case "lg":
      sizeClasses = "h-10 px-2.5 min-w-10"
      break
    default:
      sizeClasses = "h-9 px-2 min-w-9"
  }

  return `${baseClasses} ${variantClasses} ${sizeClasses}`
}

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}) {
  return (
    <TogglePrimitive.Root data-slot="toggle" className={cn(getToggleClasses(variant, size), className)} {...props} />
  )
}

export { Toggle }
