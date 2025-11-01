import { useState } from 'react';
import { useGetMyEcoCoinBalance, useCreateRedemptionRequest, useGetMyRedemptionRequests } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Coins, TrendingUp, AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

type CryptoType = 'ETH' | 'BTC';

interface ExchangeRate {
  crypto: CryptoType;
  rate: number;
  icon: string;
  name: string;
}

const exchangeRates: ExchangeRate[] = [
  { crypto: 'ETH', rate: 0.0001, icon: '/assets/generated/ethereum-coin-transparent.dim_64x64.png', name: 'Ethereum' },
  { crypto: 'BTC', rate: 0.000005, icon: '/assets/generated/bitcoin-coin-transparent.dim_64x64.png', name: 'Bitcoin' },
];

export default function Redemption() {
  const { data: ecoCoinBalance } = useGetMyEcoCoinBalance();
  const { data: redemptionRequests, isLoading: requestsLoading } = useGetMyRedemptionRequests();
  const createRedemption = useCreateRedemptionRequest();

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('ETH');
  const [amount, setAmount] = useState<string>('');

  const balance = Number(ecoCoinBalance || 0);
  const selectedRate = exchangeRates.find(r => r.crypto === selectedCrypto);
  const cryptoAmount = amount ? (parseFloat(amount) * (selectedRate?.rate || 0)).toFixed(8) : '0';
  const minRedemption = 100;

  const handleRedeem = async () => {
    if (!amount || parseFloat(amount) < minRedemption) {
      return;
    }

    const amountBigInt = BigInt(Math.floor(parseFloat(amount)));
    
    await createRedemption.mutateAsync({
      amount: amountBigInt,
      cryptoType: selectedCrypto,
      exchangeRate: selectedRate?.rate || 0,
    });

    setAmount('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">Redeem EcoCoins</h1>
        <p className="text-muted-foreground text-lg">Convert your EcoCoins to cryptocurrency</p>
      </div>

      {/* Balance Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <img src="/assets/generated/ecocoin-token-transparent.dim_100x100.png" alt="EcoCoin" className="h-12 w-12" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold text-primary">{balance} EcoCoins</p>
              </div>
            </div>
            <TrendingUp className="h-12 w-12 text-primary/30" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Redemption Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Create Redemption Request
            </CardTitle>
            <CardDescription>Select cryptocurrency and amount to redeem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cryptocurrency Selection */}
            <div className="space-y-2">
              <Label>Select Cryptocurrency</Label>
              <Select value={selectedCrypto} onValueChange={(value) => setSelectedCrypto(value as CryptoType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exchangeRates.map(rate => (
                    <SelectItem key={rate.crypto} value={rate.crypto}>
                      <div className="flex items-center gap-2">
                        <img src={rate.icon} alt={rate.name} className="h-5 w-5" />
                        <span>{rate.name} ({rate.crypto})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exchange Rate Display */}
            {selectedRate && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="font-medium">1 EcoCoin = {selectedRate.rate} {selectedRate.crypto}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Minimum Redemption</span>
                  <span className="font-medium">{minRedemption} EcoCoins</span>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (EcoCoins)</Label>
              <Input
                id="amount"
                type="number"
                placeholder={`Min. ${minRedemption}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minRedemption}
                max={balance}
              />
              <p className="text-xs text-muted-foreground">
                Available: {balance} EcoCoins
              </p>
            </div>

            {/* Conversion Preview */}
            {amount && parseFloat(amount) >= minRedemption && (
              <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/assets/generated/ecocoin-token-transparent.dim_100x100.png" alt="EcoCoin" className="h-8 w-8" />
                    <span className="font-bold text-lg">{amount}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <img src={selectedRate?.icon} alt={selectedRate?.name} className="h-8 w-8" />
                    <span className="font-bold text-lg">{cryptoAmount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleRedeem}
              disabled={!amount || parseFloat(amount) < minRedemption || parseFloat(amount) > balance || createRedemption.isPending}
              className="w-full"
              size="lg"
            >
              {createRedemption.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Submit Redemption Request'
              )}
            </Button>

            {/* Info Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Redemption Process</AlertTitle>
              <AlertDescription className="text-xs space-y-1 mt-2">
                <p>• Redemption requests are processed manually by our team</p>
                <p>• Processing typically takes 1-3 business days</p>
                <p>• You'll receive your cryptocurrency at the wallet address on file</p>
                <p>• EcoCoins are deducted immediately upon request submission</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Exchange Rates & Info */}
        <div className="space-y-6">
          {/* Current Exchange Rates */}
          <Card>
            <CardHeader>
              <CardTitle>Current Exchange Rates</CardTitle>
              <CardDescription>Live conversion rates for supported cryptocurrencies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {exchangeRates.map(rate => (
                <div key={rate.crypto} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={rate.icon} alt={rate.name} className="h-10 w-10" />
                    <div>
                      <p className="font-semibold">{rate.name}</p>
                      <p className="text-sm text-muted-foreground">{rate.crypto}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{rate.rate}</p>
                    <p className="text-xs text-muted-foreground">per EcoCoin</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How Redemption Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-medium">Select Cryptocurrency</p>
                  <p className="text-sm text-muted-foreground">Choose between Ethereum or Bitcoin</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-medium">Enter Amount</p>
                  <p className="text-sm text-muted-foreground">Specify how many EcoCoins to redeem (min. {minRedemption})</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="font-medium">Submit Request</p>
                  <p className="text-sm text-muted-foreground">Your request is queued for manual processing</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                <div>
                  <p className="font-medium">Receive Crypto</p>
                  <p className="text-sm text-muted-foreground">Cryptocurrency sent to your registered wallet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Redemption History */}
      <Card>
        <CardHeader>
          <CardTitle>Redemption History</CardTitle>
          <CardDescription>Track your past redemption requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Loading history...</p>
            </div>
          ) : redemptionRequests && redemptionRequests.length > 0 ? (
            <div className="space-y-3">
              {redemptionRequests.map(request => (
                <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    <img 
                      src={exchangeRates.find(r => r.crypto === request.cryptoType)?.icon} 
                      alt={request.cryptoType} 
                      className="h-10 w-10" 
                    />
                    <div>
                      <p className="font-semibold">{Number(request.amount)} EcoCoins → {request.cryptoType}</p>
                      <p className="text-sm text-muted-foreground">
                        {(Number(request.amount) * request.exchangeRate).toFixed(8)} {request.cryptoType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(Number(request.timestamp) / 1000000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <img src="/assets/generated/crypto-exchange-interface.dim_600x400.png" alt="No redemptions" className="h-32 w-auto mx-auto opacity-50 mb-4" />
              <p className="text-muted-foreground">No redemption requests yet</p>
              <p className="text-sm text-muted-foreground">Start by creating your first redemption above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
