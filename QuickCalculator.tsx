import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DollarSign, TrendingUp, Calculator } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { AffordabilityResponse } from "@shared/schema";

interface QuickCalculatorProps {
  onAffordabilityCalculated?: (data: AffordabilityResponse) => void;
  onCalculating?: (isCalculating: boolean) => void;
}

export default function QuickCalculator({ onAffordabilityCalculated, onCalculating }: QuickCalculatorProps) {
  const [income, setIncome] = useState(75000);
  const [creditScore, setCreditScore] = useState(720);
  const [affordability, setAffordability] = useState<AffordabilityResponse | null>(null);

  const calculateAffordability = useMutation({
    mutationFn: async (data: { annualIncome: number; creditScore: number }) => {
      console.log("Sending affordability request:", data);
      onCalculating?.(true);
      return apiRequest<AffordabilityResponse>("/api/affordability/calculate", "POST", {
        annualIncome: data.annualIncome,
        creditScore: data.creditScore,
        vehiclePrice: 35000,
        downPayment: 3500,
        mpgCombined: 30,
        reliability: 4.5,
        leaseTerm: 48,
        employmentSubsidy: 0
      });
    },
    onSuccess: (data: AffordabilityResponse) => {
      console.log("Affordability response:", data);
      setAffordability(data);
      onAffordabilityCalculated?.(data);
      onCalculating?.(false);
    },
    onError: (error: any) => {
      console.error("Affordability calculation error:", error);
      onCalculating?.(false);
    }
  });

  // Sync loading state
  useEffect(() => {
    onCalculating?.(calculateAffordability.isPending);
  }, [calculateAffordability.isPending, onCalculating]);

  const handleCalculate = () => {
    calculateAffordability.mutate({
      annualIncome: income,
      creditScore: creditScore
    });
  };

  const getAffordabilityColor = () => {
    if (!affordability) return "text-muted-foreground";
    if (affordability.score >= 70) return "text-green-600";
    if (affordability.score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getAffordabilityText = () => {
    if (!affordability) return "Unknown";
    if (affordability.score >= 70) return "Excellent";
    if (affordability.score >= 40) return "Good";
    return "Fair";
  };

  return (
    <div id="quick-calculator" className="w-full py-24 bg-accent/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Calculator className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-[Lexend] mb-4">
            Quick Affordability Check
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get an instant assessment of your vehicle buying power in seconds
          </p>
        </div>

        <Card className="p-8 max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="income" className="text-base mb-3 block">Annual Income</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="income"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="pl-10 h-12 text-lg"
                    data-testid="input-income"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="credit-score" className="text-base mb-3 block">
                  Credit Score: <span className="font-bold">{creditScore}</span>
                </Label>
                <Slider
                  id="credit-score"
                  min={300}
                  max={850}
                  step={10}
                  value={[creditScore]}
                  onValueChange={(values) => setCreditScore(values[0])}
                  className="py-4"
                  data-testid="slider-credit-score"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>300</span>
                  <span>850</span>
                </div>
              </div>

              <Button 
                onClick={handleCalculate} 
                className="w-full h-12 text-base"
                disabled={calculateAffordability.isPending}
                data-testid="button-calculate"
              >
                <TrendingUp className="mr-2 w-5 h-5" />
                {calculateAffordability.isPending ? "Calculating..." : "Calculate Affordability"}
              </Button>
            </div>

            <div className="flex flex-col justify-center items-center bg-accent/50 rounded-lg p-8">
              <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
                Affordability Score
              </p>
              {calculateAffordability.isPending ? (
                <div className="text-4xl font-bold text-muted-foreground">Calculating...</div>
              ) : affordability !== null ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <div className={`text-6xl font-bold font-[Lexend] ${getAffordabilityColor()}`} data-testid="text-affordability-score">
                      {affordability.score}
                    </div>
                    <span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                  <p className="text-lg font-medium mt-2" data-testid="text-affordability-rating">
                    {getAffordabilityText()}
                  </p>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Based on your income and credit profile
                  </p>
                </>
              ) : (
                <div className="text-lg text-muted-foreground text-center">
                  Enter your details and calculate to see your score
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
