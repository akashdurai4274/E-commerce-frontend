import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}

export function Loader({ size = "md", className }: LoaderProps) {
  return (
    <Loader2
      className={cn("animate-spin text-primary", sizeMap[size], className)}
    />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader size="lg" />
    </div>
  )
}
