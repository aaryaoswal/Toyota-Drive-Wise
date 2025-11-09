import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Calculator, TrendingDown, Shield, Sparkles } from "lucide-react";

export default function Methodology() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        <section className="w-full py-24 bg-gradient-to-br from-primary/5 via-background to-accent/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold font-[Lexend] mb-6" data-testid="heading-methodology">
              Our Methodology
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              How we calculate affordability, forecast depreciation, and generate personalized recommendations
            </p>
          </div>
        </section>
        
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="space-y-12">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-[Lexend]">Affordability Scoring</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our affordability algorithm analyzes your financial profile using a multi-factor scoring system (0-100 scale):
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Net Income Calculation:</strong> Uses 2024 federal tax brackets to estimate your monthly take-home pay, accounting for employment subsidies and deductions.
                  </li>
                  <li>
                    <strong>Budget Ratio Analysis:</strong> Compares total monthly vehicle costs against your net income. We recommend keeping vehicle expenses below 20% of monthly income.
                  </li>
                  <li>
                    <strong>Credit Score Impact:</strong> Your credit score (300-850) affects APR calculation, with better scores securing lower interest rates.
                  </li>
                  <li>
                    <strong>Total Cost of Ownership:</strong> Includes monthly payment, insurance estimates, fuel costs based on MPG, maintenance, and taxes/fees.
                  </li>
                </ul>
                
                <p className="pt-4">
                  Scores above 80 indicate excellent affordability, 60-79 is good, 40-59 requires caution, and below 40 suggests considering more affordable options.
                </p>
              </div>
            </Card>
            
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <TrendingDown className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-[Lexend]">Depreciation Forecasting</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We employ a hedonic pricing model with time-series components trained on historical Toyota depreciation data (2015-2024):
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Base Depreciation Curves:</strong> Toyota vehicles typically retain 80% value after year 1, with 10-12% annual depreciation in years 2-5.
                  </li>
                  <li>
                    <strong>Mileage Adjustment:</strong> Annual mileage affects resale value. Lower-than-average mileage (under 12,000/year) increases retention.
                  </li>
                  <li>
                    <strong>Condition Factors:</strong> Vehicle maintenance, accident history, and overall condition impact long-term value.
                  </li>
                  <li>
                    <strong>Market Conditions:</strong> Supply/demand dynamics, gas prices, and economic indicators influence future values.
                  </li>
                  <li>
                    <strong>Confidence Intervals:</strong> We provide upper and lower bound estimates (±10%) to account for market uncertainty.
                  </li>
                </ul>
              </div>
            </Card>
            
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-[Lexend]">AI Recommendations</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our AI-powered recommendation engine uses Google Gemini to analyze your complete financial profile:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Multi-Factor Matching:</strong> Considers income, credit score, budget preferences, reliability requirements, and fuel efficiency needs.
                  </li>
                  <li>
                    <strong>Natural Language Insights:</strong> Generates personalized explanations for why specific vehicles match your profile.
                  </li>
                  <li>
                    <strong>Lifestyle Alignment:</strong> Accounts for seating needs, commute patterns, and long-term value retention goals.
                  </li>
                  <li>
                    <strong>Total Value Assessment:</strong> Balances upfront affordability with long-term ownership costs and resale value.
                  </li>
                </ul>
              </div>
            </Card>
            
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-[Lexend]">Data Sources & Accuracy</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  All projections are estimates based on historical data and current market conditions:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Toyota historical depreciation curves (2015-2024)</li>
                  <li>2024 federal tax brackets and standard deductions</li>
                  <li>Industry-standard insurance and maintenance estimates</li>
                  <li>EPA fuel economy ratings</li>
                  <li>Current market interest rates by credit tier</li>
                </ul>
                
                <p className="pt-4 text-sm">
                  <strong>Disclaimer:</strong> All financial projections are estimates. Actual values may vary based on individual circumstances, market conditions, and dealer pricing. Consult with Toyota Financial Services for personalized quotes.
                </p>
              </div>
            </Card>
          </div>
          
          <div className="text-center mt-16 bg-accent/20 rounded-2xl p-12">
            <h2 className="text-3xl font-bold font-[Lexend] mb-4">
              Try Our Analysis Tools
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience our methodology in action with personalized calculations for your situation.
            </p>
            <Button size="lg" asChild data-testid="button-try-calculator">
              <Link href="/">
                Try Calculator
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
