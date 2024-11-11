'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Zap, Bitcoin, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TipButtonProps {
  creatorId: string
  creatorName: string
}

export function TipButton({ creatorId, creatorName }: TipButtonProps) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)

  const handleTip = async () => {
    setLoading(true)
    try {
      // TODO: Implement ZBD payment logic here
      console.log(`Tipping ${amount} sats to ${creatorId}`)
    } catch (error) {
      console.error('Error processing tip:', error)
    } finally {
      setLoading(false)
    }
  }

  const presetAmounts = [
    { value: 1000, label: '1K', description: 'Quick tip' },
    { value: 5000, label: '5K', description: 'Show support' },
    { value: 10000, label: '10K', description: 'Big thanks' },
    { value: 50000, label: '50K', description: 'Huge fan!' },
  ]

  const handlePresetClick = (value: number) => {
    setSelectedPreset(value)
    setAmount(value.toString())
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-14 text-lg gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          Send Tip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Bitcoin className="w-6 h-6 text-orange-500" />
            Support {creatorName}
          </DialogTitle>
          <DialogDescription>
            Choose an amount to send as a tip. All tips are processed instantly via Bitcoin Lightning Network.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-8 py-4">
          {/* Preset amounts */}
          <div className="grid grid-cols-2 gap-4">
            {presetAmounts.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                className={cn(
                  "relative group p-4 rounded-xl border-2 transition-all duration-300",
                  selectedPreset === preset.value
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-border hover:border-orange-500/50"
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold">
                    {preset.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {preset.description}
                  </span>
                </div>
                {selectedPreset === preset.value && (
                  <Sparkles className="absolute top-2 right-2 w-4 h-4 text-orange-500" />
                )}
              </button>
            ))}
          </div>

          {/* Custom amount input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Or enter custom amount</label>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  setSelectedPreset(null)
                }}
                className="h-12 text-lg pl-12 pr-16 font-mono"
                placeholder="0"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ⚡
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                sats
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              1 sat = 0.00000001 BTC
            </p>
          </div>

          <Button 
            onClick={handleTip} 
            disabled={loading || !amount}
            className="w-full h-12 text-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-r-transparent" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Send {parseInt(amount).toLocaleString()} sats
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 