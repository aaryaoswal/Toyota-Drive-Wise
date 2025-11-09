import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Lightbulb, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  DollarSign,
  CreditCard,
  Shield,
  Calculator,
  Zap,
  BookOpen,
  Info,
  Car,
  FileText
} from "lucide-react";
import { Link } from "wouter";

interface FinancialProfile {
  annualIncome: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  creditScore: number;
  budgetMin: number;
  budgetMax: number;
  totalSavings: number;
}

export default function Insights() {
  const [activeTab, setActiveTab] = useState("insights");

  // Buy vs Lease calculator state
  const [vehiclePrice, setVehiclePrice] = useState("35000");
  const [downPayment, setDownPayment] = useState("7000");
  const [loanTerm, setLoanTerm] = useState("60");
  const [apr, setApr] = useState("5.5");
  const [leaseTerm, setLeaseTerm] = useState("36");
  const [leaseDownPayment, setLeaseDownPayment] = useState("3000");
  const [monthlyLeasePayment, setMonthlyLeasePayment] = useState("450");
  const [milesPerYear, setMilesPerYear] = useState("12000");

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const { data: financialProfile } = useQuery<FinancialProfile>({
    queryKey: ["/api/financial-profile"],
    enabled: !!user,
    retry: false,
  });

  // Calculate financial metrics
  const dti = financialProfile 
    ? ((financialProfile.monthlyExpenses / financialProfile.monthlyIncome) * 100).toFixed(1)
    : null;
  
  const savingsRate = financialProfile
    ? (((financialProfile.monthlyIncome - financialProfile.monthlyExpenses) / financialProfile.monthlyIncome) * 100).toFixed(1)
    : null;

  const getDTIStatus = (dti: number) => {
    if (dti <= 20) return { status: "excellent", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950", text: "Excellent" };
    if (dti <= 35) return { status: "good", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950", text: "Good" };
    if (dti <= 45) return { status: "fair", color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950", text: "Fair" };
    return { status: "poor", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950", text: "Poor" };
  };

  const getSavingsStatus = (rate: number) => {
    if (rate >= 20) return { status: "excellent", color: "text-green-600", icon: <CheckCircle2 className="w-5 h-5" /> };
    if (rate >= 10) return { status: "good", color: "text-blue-600", icon: <CheckCircle2 className="w-5 h-5" /> };
    return { status: "needs-improvement", color: "text-yellow-600", icon: <AlertTriangle className="w-5 h-5" /> };
  };

  const getCreditScoreStatus = (score: number) => {
    if (score >= 740) return { status: "excellent", color: "text-green-600", text: "Excellent" };
    if (score >= 670) return { status: "good", color: "text-blue-600", text: "Good" };
    if (score >= 580) return { status: "fair", color: "text-yellow-600", text: "Fair" };
    return { status: "poor", color: "text-red-600", text: "Needs Improvement" };
  };

  // Buy vs Lease calculations
  const calculateBuyVsLease = () => {
    const price = parseFloat(vehiclePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const term = parseInt(loanTerm) || 60;
    const aprValue = parseFloat(apr) || 0;
    const rate = aprValue / 100 / 12;
    
    // Calculate monthly loan payment
    const loanAmount = price - down;
    let monthlyBuyPayment;
    
    // Handle 0% APR case (no interest)
    if (aprValue === 0 || rate === 0) {
      monthlyBuyPayment = loanAmount / term;
    } else {
      monthlyBuyPayment = loanAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    }
    
    // Total cost to buy (over loan term)
    const totalBuyCost = down + (monthlyBuyPayment * term);
    
    // Calculate depreciation (Toyota vehicles typically retain 60-65% after 5 years)
    const yearsOwned = term / 12;
    const depreciationRate = 0.40; // 40% depreciation over 5 years
    const annualDepreciation = depreciationRate / 5;
    const totalDepreciation = price * (annualDepreciation * yearsOwned);
    const residualValue = price - totalDepreciation;
    
    // Net cost to buy (total cost - residual value)
    const netBuyCost = totalBuyCost - residualValue;
    
    // Lease calculations
    const leaseDown = parseFloat(leaseDownPayment) || 0;
    const monthlyLease = parseFloat(monthlyLeasePayment) || 0;
    const leaseMo = parseInt(leaseTerm) || 36;
    
    const totalLeaseCost = leaseDown + (monthlyLease * leaseMo);
    
    // Savings and recommendation
    const savings = totalLeaseCost - netBuyCost;
    const recommendation = savings > 0 ? "buy" : "lease";
    
    return {
      buy: {
        monthlyPayment: monthlyBuyPayment,
        totalCost: totalBuyCost,
        residualValue: residualValue,
        netCost: netBuyCost,
        downPayment: down,
      },
      lease: {
        monthlyPayment: monthlyLease,
        totalCost: totalLeaseCost,
        downPayment: leaseDown,
      },
      savings: Math.abs(savings),
      recommendation: recommendation,
    };
  };

  const comparison = calculateBuyVsLease();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section - matches Vehicles page */}
      <div className="w-full py-12 bg-sidebar border-b">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold font-[Lexend] mb-4">
            Financial Literacy Center
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn about car financing, compare buying vs leasing, and understand your financial health
          </p>
        </div>
      </div>

      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-6">

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="inline-flex w-auto mb-8">
              <TabsTrigger value="insights" data-testid="tab-insights">Your Insights</TabsTrigger>
              <TabsTrigger value="buyvslease" data-testid="tab-buyvslease">Buy vs Lease</TabsTrigger>
              <TabsTrigger value="learn" data-testid="tab-learn">Learn</TabsTrigger>
              <TabsTrigger value="tips" data-testid="tab-tips">Tips</TabsTrigger>
            </TabsList>

          {/* Your Insights Tab */}
          <TabsContent value="insights">
            {!user || !financialProfile ? (
              <Card className="p-8 text-center hover-elevate">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold font-[Lexend] mb-2">Get Personalized Insights</h2>
                <p className="text-muted-foreground mb-6">
                  Complete your financial profile to receive personalized advice
                </p>
                <Link href={user ? "/account-settings" : "/signup"}>
                  <Button size="lg" data-testid="button-get-started">
                    {user ? "Complete Profile" : "Get Started"}
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-8">
                {/* Personalized Advice */}
                <Card className="p-8 hover-elevate">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-[Lexend] mb-2">
                        Your Personalized Advice
                      </h3>
                      <p className="text-muted-foreground">
                        Based on your financial profile, here's what DriveWise recommends:
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold font-[Lexend] mb-1">Price Range</div>
                          <div className="text-sm text-muted-foreground">
                            ${financialProfile.budgetMin.toLocaleString()} - ${financialProfile.budgetMax.toLocaleString()} vehicles
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-start gap-3">
                        <Calculator className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold font-[Lexend] mb-1">Monthly Payment</div>
                          <div className="text-sm text-muted-foreground">
                            ${Math.round(financialProfile.monthlyIncome * 0.10)} or less (10% of income)
                          </div>
                        </div>
                      </div>
                    </div>

                    {parseFloat(dti!) > 35 && (
                      <div className="p-4 rounded-lg bg-yellow-500/10">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold font-[Lexend] mb-1">Priority Action</div>
                            <div className="text-sm text-muted-foreground">
                              Reduce DTI to 35% before new debt
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {financialProfile.creditScore < 740 && (
                      <div className="p-4 rounded-lg bg-blue-500/10">
                        <div className="flex items-start gap-3">
                          <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold font-[Lexend] mb-1">Credit Improvement</div>
                            <div className="text-sm text-muted-foreground">
                              Improve score to 740+ for better APR
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Financial Metrics */}
                <div className="grid md:grid-cols-3 gap-8">
                  {/* DTI Ratio */}
                  <Card className="p-8 hover-elevate">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm uppercase tracking-wide text-muted-foreground mb-1">
                          Debt-to-Income Ratio
                        </p>
                        <p className="text-xs text-muted-foreground">Current</p>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {getDTIStatus(parseFloat(dti!)).text}
                      </Badge>
                    </div>
                    <div className={`text-5xl font-bold font-[Lexend] ${getDTIStatus(parseFloat(dti!)).color} mb-2`}>
                      {dti}%
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Ideal: ≤ 35%
                    </div>
                    {parseFloat(dti!) > 35 && (
                      <div className="p-3 rounded-md bg-accent/50 text-sm">
                        <strong>Action:</strong> Reduce monthly expenses by ${
                          Math.round(financialProfile.monthlyExpenses - (financialProfile.monthlyIncome * 0.35))
                        } to reach ideal DTI
                      </div>
                    )}
                  </Card>

                  {/* Savings Rate */}
                  <Card className="p-8 hover-elevate">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm uppercase tracking-wide text-muted-foreground mb-1">
                          Savings Rate
                        </p>
                        <p className="text-xs text-muted-foreground">Current</p>
                      </div>
                      <div className={getSavingsStatus(parseFloat(savingsRate!)).color}>
                        {getSavingsStatus(parseFloat(savingsRate!)).icon}
                      </div>
                    </div>
                    <div className={`text-5xl font-bold font-[Lexend] ${getSavingsStatus(parseFloat(savingsRate!)).color} mb-2`}>
                      {savingsRate}%
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Ideal: ≥ 20%
                    </div>
                    {parseFloat(savingsRate!) < 20 && (
                      <div className="p-3 rounded-md bg-accent/50 text-sm">
                        You're saving {savingsRate}% of income, ahead of most Americans
                      </div>
                    )}
                  </Card>

                  {/* Credit Score */}
                  <Card className="p-8 hover-elevate">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm uppercase tracking-wide text-muted-foreground mb-1">
                          Credit Score
                        </p>
                        <p className="text-xs text-muted-foreground">Current</p>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {getCreditScoreStatus(financialProfile.creditScore).text}
                      </Badge>
                    </div>
                    <div className={`text-5xl font-bold font-[Lexend] ${getCreditScoreStatus(financialProfile.creditScore).color} mb-2`}>
                      {financialProfile.creditScore}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Ideal: ≥ 740
                    </div>
                    {financialProfile.creditScore < 740 && (
                      <div className="p-3 rounded-md bg-accent/50 text-sm">
                        <strong>Action:</strong> Pay down credit card balances and ensure all bills paid on time
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Buy vs Lease Tab */}
          <TabsContent value="buyvslease">
            <div className="space-y-8">
              {/* Calculator Inputs */}
              <Card className="p-8">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-[Lexend]">
                        Buy vs Lease Calculator
                      </h2>
                      <p className="text-muted-foreground">
                        Compare the true costs of buying versus leasing
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Buy Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold font-[Lexend]">Buy</h3>
                    </div>
                    
                    <div>
                      <Label htmlFor="vehicle-price">Vehicle Price</Label>
                      <Input
                        id="vehicle-price"
                        type="number"
                        value={vehiclePrice}
                        onChange={(e) => setVehiclePrice(e.target.value)}
                        data-testid="input-vehicle-price"
                      />
                    </div>

                    <div>
                      <Label htmlFor="down-payment">Down Payment</Label>
                      <Input
                        id="down-payment"
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        data-testid="input-down-payment"
                      />
                    </div>

                    <div>
                      <Label htmlFor="loan-term">Loan Term (months)</Label>
                      <Input
                        id="loan-term"
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                        data-testid="input-loan-term"
                      />
                    </div>

                    <div>
                      <Label htmlFor="apr">APR (%)</Label>
                      <Input
                        id="apr"
                        type="number"
                        step="0.1"
                        value={apr}
                        onChange={(e) => setApr(e.target.value)}
                        data-testid="input-apr"
                      />
                    </div>
                  </div>

                  {/* Lease Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-[Lexend] font-bold">Lease</h3>
                    </div>
                    
                    <div>
                      <Label htmlFor="lease-down">Down Payment</Label>
                      <Input
                        id="lease-down"
                        type="number"
                        value={leaseDownPayment}
                        onChange={(e) => setLeaseDownPayment(e.target.value)}
                        data-testid="input-lease-down"
                      />
                    </div>

                    <div>
                      <Label htmlFor="monthly-lease">Monthly Payment</Label>
                      <Input
                        id="monthly-lease"
                        type="number"
                        value={monthlyLeasePayment}
                        onChange={(e) => setMonthlyLeasePayment(e.target.value)}
                        data-testid="input-monthly-lease"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lease-term">Lease Term (months)</Label>
                      <Input
                        id="lease-term"
                        type="number"
                        value={leaseTerm}
                        onChange={(e) => setLeaseTerm(e.target.value)}
                        data-testid="input-lease-term"
                      />
                    </div>

                    <div>
                      <Label htmlFor="miles-per-year">Miles Per Year</Label>
                      <Input
                        id="miles-per-year"
                        type="number"
                        value={milesPerYear}
                        onChange={(e) => setMilesPerYear(e.target.value)}
                        data-testid="input-miles-per-year"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Comparison Results */}
              <Card className="p-8 hover-elevate">
                <div className="text-center mb-8">
                  <Badge className={`${comparison.recommendation === "buy" ? "bg-blue-600" : "bg-purple-600"} text-white px-6 py-2 text-base mb-4`}>
                    Recommendation: {comparison.recommendation === "buy" ? "Buy" : "Lease"}
                  </Badge>
                  <p className="text-lg font-semibold">
                    {comparison.recommendation === "buy" 
                      ? `You'll save $${comparison.savings.toLocaleString(undefined, {maximumFractionDigits: 0})} by buying` 
                      : `You'll save $${comparison.savings.toLocaleString(undefined, {maximumFractionDigits: 0})} by leasing`}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Buy Results */}
                  <div className="p-6 rounded-lg bg-accent/30">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold font-[Lexend]">Buy Analysis</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm text-muted-foreground">Monthly Payment</span>
                        <span className="font-bold" data-testid="text-buy-monthly">
                          ${comparison.buy.monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm text-muted-foreground">Down Payment</span>
                        <span className="font-bold">${comparison.buy.downPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm text-muted-foreground">Total Cost</span>
                        <span className="font-bold">${comparison.buy.totalCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm text-muted-foreground">Residual Value</span>
                        <span className="font-bold text-green-600">
                          ${comparison.buy.residualValue.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-semibold">Net Cost</span>
                        <span className="text-xl font-bold text-blue-600" data-testid="text-buy-net-cost">
                          ${comparison.buy.netCost.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lease Results */}
                  <div className="p-6 rounded-lg bg-accent/30">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-bold font-[Lexend]">Lease Analysis</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm text-muted-foreground">Monthly Payment</span>
                        <span className="font-bold" data-testid="text-lease-monthly">
                          ${comparison.lease.monthlyPayment.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm text-muted-foreground">Down Payment</span>
                        <span className="font-bold">${comparison.lease.downPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm text-muted-foreground">Residual Value</span>
                        <span className="font-bold text-muted-foreground">$0</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm text-muted-foreground">Equity at End</span>
                        <span className="font-bold text-muted-foreground">$0</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-semibold">Total Cost</span>
                        <span className="text-xl font-bold text-purple-600" data-testid="text-lease-total-cost">
                          ${comparison.lease.totalCost.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Considerations */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 hover-elevate">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold font-[Lexend] text-lg">Why Buy?</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Build equity and own the vehicle outright</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>No mileage restrictions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Lower long-term costs if keeping {">"}5 years</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Freedom to customize and modify</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-8 hover-elevate">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold font-[Lexend] text-lg">Why Lease?</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Lower monthly payments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Drive a new car every 2-3 years</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Usually covered by warranty</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>No trade-in or selling hassle</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn">
            <div className="space-y-8">
              {/* DTI Ratio */}
              <Card className="p-8 hover-elevate">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold font-[Lexend] mb-2">Debt-to-Income Ratio (DTI)</h2>
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground">What is it?</h3>
                    <p className="text-muted-foreground mb-4">
                      Your DTI is the percentage of your monthly income that goes toward debt payments. Lenders use this to determine if you can afford new debt.
                    </p>

                    <div className="p-4 rounded-lg bg-accent/30 mb-4">
                      <div className="font-mono text-sm mb-2">
                        DTI = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100
                      </div>
                      {financialProfile && (
                        <div className="text-sm text-muted-foreground">
                          Your DTI: (${financialProfile.monthlyExpenses} ÷ ${financialProfile.monthlyIncome}) × 100 = {dti}%
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold mb-3">Benchmarks</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Card className="p-3 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
                        <div className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">≤ 20%</div>
                        <div className="text-xs text-muted-foreground">Excellent</div>
                      </Card>
                      <Card className="p-3 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
                        <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">20-35%</div>
                        <div className="text-xs text-muted-foreground">Good</div>
                      </Card>
                      <Card className="p-3 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900">
                        <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-1">36-45%</div>
                        <div className="text-xs text-muted-foreground">Fair</div>
                      </Card>
                      <Card className="p-3 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900">
                        <div className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">{"> 45%"}</div>
                        <div className="text-xs text-muted-foreground">Poor</div>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Emergency Fund */}
              <Card className="p-8 hover-elevate">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold font-[Lexend] mb-2">Emergency Fund</h2>
                    <p className="text-muted-foreground mb-4">
                      Financial experts recommend having 3-6 months of expenses saved before taking on new debt like a car loan.
                    </p>

                    {financialProfile && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-md bg-accent/30">
                          <span className="text-sm font-medium">3 months expenses:</span>
                          <span className="font-bold">${(financialProfile.monthlyExpenses * 3).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-md bg-accent/30">
                          <span className="text-sm font-medium">6 months expenses:</span>
                          <span className="font-bold">${(financialProfile.monthlyExpenses * 6).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-md bg-primary/10">
                          <span className="text-sm font-medium">Your current savings:</span>
                          <span className="font-bold text-primary">${financialProfile.totalSavings?.toLocaleString() || "0"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Car Buying Tips Tab */}
          <TabsContent value="tips">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 hover-elevate">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold font-[Lexend] text-lg mb-2">The 20/4/10 Rule</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      20% down payment, 4-year loan max, total monthly car costs under 10% of gross income
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover-elevate">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold font-[Lexend] text-lg mb-2">Total Cost of Ownership</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Consider insurance, fuel, maintenance, and depreciation—not just the monthly payment
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover-elevate">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold font-[Lexend] text-lg mb-2">Value Retention Matters</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Toyota vehicles typically retain 60-80% of value after 5 years, protecting your investment
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover-elevate">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold font-[Lexend] text-lg mb-2">APR Shopping</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      A 1% difference in APR can save you $1,000+ over a 5-year loan. Shop around!
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover-elevate">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold font-[Lexend] text-lg mb-2">New vs Used</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      New cars lose 20% value in year one. Certified pre-owned can offer better value
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover-elevate">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold font-[Lexend] text-lg mb-2">Avoid Being "Upside Down"</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Never owe more than the car is worth. Put at least 10-20% down
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
