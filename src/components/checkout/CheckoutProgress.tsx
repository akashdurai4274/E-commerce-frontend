import { motion } from 'framer-motion'
import { Check, MapPin, ClipboardList, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 'shipping' | 'confirm' | 'payment'

const steps: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: 'shipping', label: 'Shipping', icon: MapPin },
  { key: 'confirm', label: 'Confirm', icon: ClipboardList },
  { key: 'payment', label: 'Payment', icon: CreditCard },
]

interface CheckoutProgressProps {
  currentStep: Step
  className?: string
}

export function CheckoutProgress({ currentStep, className }: CheckoutProgressProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep)

  return (
    <div className={cn('w-full max-w-2xl mx-auto mb-8', className)}>
      <div className="relative flex items-center justify-between">
        {/* Progress Line Background */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-muted" />

        {/* Progress Line Fill */}
        <motion.div
          className="absolute left-0 top-5 h-0.5 bg-primary"
          initial={{ width: '0%' }}
          animate={{
            width: currentIndex === 0 ? '0%' : currentIndex === 1 ? '50%' : '100%',
          }}
          transition={{ duration: 0.5 }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const Icon = step.icon

          return (
            <div
              key={step.key}
              className="relative flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={cn(
                  'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                  isCompleted && 'bg-primary border-primary',
                  isCurrent && 'bg-background border-primary',
                  !isCompleted && !isCurrent && 'bg-background border-muted'
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.4 }}
                  >
                    <Check className="h-5 w-5 text-primary-foreground" />
                  </motion.div>
                ) : (
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      isCurrent ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                )}
              </motion.div>

              <span
                className={cn(
                  'mt-2 text-sm font-medium',
                  isCompleted && 'text-primary',
                  isCurrent && 'text-foreground',
                  !isCompleted && !isCurrent && 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
