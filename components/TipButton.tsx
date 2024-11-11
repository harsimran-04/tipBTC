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
import { QRCodeSVG } from 'qrcode.react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner';

interface TipButtonProps {
  creatorId: string
  creatorName: string
  lightningAddress: string
}

export function TipButton({ creatorId, creatorName, lightningAddress }: TipButtonProps) {
  const [amount, setAmount] = useState('')
  const [supporterName, setSupporterName] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'completed' | 'error'>('idle')
  const [invoice, setInvoice] = useState<string | null>(null)
  const [qrValue, setQrValue] = useState<string | null>(null)

  const handleTip = async () => {
    if (!supporterName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true)
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: creatorId,
          amount: parseInt(amount),
          lightningAddress,
          supporterName: supporterName.trim(),
        }),
      })

      const data = await response.json()
      console.log('Payment response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment')
      }

      setQrValue(data.data.invoice.uri)
      setInvoice(data.data.invoice.request)
      setPaymentStatus('pending')

      let checkInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/payments/status/${data.id}`)
          const statusData = await statusResponse.json()

          if (statusData.status === 'completed') {
            clearInterval(checkInterval);
            setPaymentStatus('completed');
            toast.success('Payment successful!');
          } else if (statusData.status === 'expired') {
            clearInterval(checkInterval);
            setPaymentStatus('error');
            toast.error('Payment expired');
          }
        } catch (error) {
          console.error('Status check error:', error)
          clearInterval(checkInterval)
          setPaymentStatus('error')
          toast.error('Failed to check payment status')
        }
      }, 3000)

      setTimeout(() => {
        clearInterval(checkInterval);
        if (paymentStatus === 'pending') {
          setPaymentStatus('error');
          toast.error('Payment timed out');
        }
      }, 300000)

    } catch (error) {
      console.error('Error processing tip:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to process payment')
      setPaymentStatus('error')
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
            Choose an amount and enter your details to send a tip.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-8 py-4">
          {paymentStatus === 'pending' && invoice ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Scan QR Code or Copy Invoice</h3>
                <p className="text-sm text-muted-foreground">
                  Pay this invoice using your Lightning wallet
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-xl">
                  <QRCodeSVG 
                    value={qrValue || ''}
                    size={200}
                    level="L"
                    includeMargin
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-muted p-4 rounded-lg break-all font-mono text-sm">
                  {invoice}
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(invoice);
                    toast.success('Invoice copied to clipboard');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Copy Invoice
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Waiting for payment...
                <div className="mt-2 animate-spin rounded-full h-6 w-6 border-2 border-primary border-r-transparent mx-auto" />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <Input
                  placeholder="Enter your name"
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  This will be displayed in the supporters list
                </p>
              </div>

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

              <div className="space-y-2">
                <label className="text-sm font-medium">Or enter custom amount</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setSelectedPreset(null);
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
                disabled={loading || !amount || !lightningAddress}
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 