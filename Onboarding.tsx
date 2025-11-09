import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle } from "lucide-react";

interface OnboardingData {
  annualIncome: number;
  monthlyExpenses: number;
  creditScore: number;
  downPayment: number;
  dailyCommute: number;
  weekendDriving: string;
  climate: string;
  needsAWD: boolean;
  needsEVCharging: boolean;
  isStudent: boolean;
  age: number;
}

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    annualIncome: 60000,
    monthlyExpenses: 2500,
    creditScore: 700,
    downPayment: 5000,
    dailyCommute: 10,
    weekendDriving: "occasional",
    climate: "moderate",
    needsAWD: false,
    needsEVCharging: false,
    isStudent: false,
    age: 30,
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const monthlyIncome = formData.annualIncome / 12;
      const monthlyBudget = monthlyIncome - formData.monthlyExpenses;

      const financialProfileResponse = await fetch("/api/financial-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          annualIncome: formData.annualIncome,
          monthlyIncome,
          monthlyExpenses: formData.monthlyExpenses,
          monthlySavings: Math.max(0, monthlyBudget * 0.2),
          creditScore: formData.creditScore,
          downPayment: formData.downPayment,
          monthlyBudget,
          cashflowStability: "stable",
        }),
      });

      if (financialProfileResponse.status === 401) {
        toast({
          title: "Please log in first",
          description: "You need to create an account to save your profile",
          variant: "destructive",
        });
        navigate("/signup");
        return;
      }

      if (!financialProfileResponse.ok) {
        const errorData = await financialProfileResponse.json();
        const errorMsg = errorData.error || errorData.message || "Failed to save financial profile";
        throw new Error(Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg);
      }

      const userProfileResponse = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: formData.age,
          isStudent: formData.isStudent,
          dailyCommute: formData.dailyCommute,
          weekendDriving: formData.weekendDriving,
          climate: formData.climate,
          needsAWD: formData.needsAWD,
          needsEVCharging: formData.needsEVCharging,
        }),
      });

      if (userProfileResponse.status === 401) {
        toast({
          title: "Please log in first",
          description: "You need to create an account to save your profile",
          variant: "destructive",
        });
        navigate("/signup");
        return;
      }

      if (!userProfileResponse.ok) {
        const errorData = await userProfileResponse.json();
        const errorMsg = errorData.error || errorData.message || "Failed to save user profile";
        throw new Error(Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg);
      }

      toast({
        title: "Profile Complete!",
        description: "Finding your perfect vehicle matches...",
      });
      
      setTimeout(() => {
        navigate("/vehicles");
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            Quick Start
          </h1>
          <p className="text-xl text-muted-foreground">
            Let's find your perfect Toyota in just 3 steps
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="shadow-lg">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Financial Profile</CardTitle>
                <CardDescription>
                  Help us understand your budget to recommend affordable vehicles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="annualIncome">Annual Income: ${formData.annualIncome.toLocaleString()}</Label>
                  <Slider
                    id="annualIncome"
                    min={20000}
                    max={200000}
                    step={5000}
                    value={[formData.annualIncome]}
                    onValueChange={(value) => setFormData({ ...formData, annualIncome: value[0] })}
                    data-testid="slider-annual-income"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="monthlyExpenses">Monthly Expenses: ${formData.monthlyExpenses.toLocaleString()}</Label>
                  <Slider
                    id="monthlyExpenses"
                    min={500}
                    max={10000}
                    step={100}
                    value={[formData.monthlyExpenses]}
                    onValueChange={(value) => setFormData({ ...formData, monthlyExpenses: value[0] })}
                    data-testid="slider-monthly-expenses"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="creditScore">Credit Score: {formData.creditScore}</Label>
                  <Slider
                    id="creditScore"
                    min={300}
                    max={850}
                    step={10}
                    value={[formData.creditScore]}
                    onValueChange={(value) => setFormData({ ...formData, creditScore: value[0] })}
                    data-testid="slider-credit-score"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="downPayment">Down Payment: ${formData.downPayment.toLocaleString()}</Label>
                  <Slider
                    id="downPayment"
                    min={0}
                    max={25000}
                    step={500}
                    value={[formData.downPayment]}
                    onValueChange={(value) => setFormData({ ...formData, downPayment: value[0] })}
                    data-testid="slider-down-payment"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min={16}
                    max={100}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 30 })}
                    data-testid="input-age"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isStudent"
                    checked={formData.isStudent}
                    onChange={(e) => setFormData({ ...formData, isStudent: e.target.checked })}
                    className="w-4 h-4 rounded border-input"
                    data-testid="checkbox-student"
                  />
                  <Label htmlFor="isStudent" className="cursor-pointer">I am a student</Label>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Driving Habits</CardTitle>
                <CardDescription>
                  Tell us how you'll use your vehicle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="dailyCommute">Daily Commute: {formData.dailyCommute} miles</Label>
                  <Slider
                    id="dailyCommute"
                    min={0}
                    max={100}
                    step={5}
                    value={[formData.dailyCommute]}
                    onValueChange={(value) => setFormData({ ...formData, dailyCommute: value[0] })}
                    data-testid="slider-daily-commute"
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.dailyCommute === 0 ? "Work from home" : 
                     formData.dailyCommute < 20 ? "Short commute - great for hybrids or EVs" :
                     formData.dailyCommute < 50 ? "Moderate commute - fuel efficiency matters" :
                     "Long commute - we'll prioritize fuel-efficient vehicles"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weekendDriving">Weekend Driving</Label>
                  <select
                    id="weekendDriving"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={formData.weekendDriving}
                    onChange={(e) => setFormData({ ...formData, weekendDriving: e.target.value })}
                    data-testid="select-weekend-driving"
                  >
                    <option value="none">Rarely drive on weekends</option>
                    <option value="occasional">Occasional trips</option>
                    <option value="frequent">Frequent long trips</option>
                    <option value="adventure">Adventure/off-road trips</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="climate">Climate Where You Live</Label>
                  <select
                    id="climate"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={formData.climate}
                    onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                    data-testid="select-climate"
                  >
                    <option value="warm">Warm/Sunny most of the year</option>
                    <option value="moderate">Moderate with some rain</option>
                    <option value="cold">Cold with snow/ice</option>
                    <option value="extreme">Extreme weather conditions</option>
                  </select>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Vehicle Preferences</CardTitle>
                <CardDescription>
                  Final touches to find your ideal match
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 border rounded-lg hover-elevate">
                    <input
                      type="checkbox"
                      id="needsAWD"
                      checked={formData.needsAWD}
                      onChange={(e) => setFormData({ ...formData, needsAWD: e.target.checked })}
                      className="w-5 h-5 mt-0.5 rounded border-input"
                      data-testid="checkbox-awd"
                    />
                    <div className="flex-1">
                      <Label htmlFor="needsAWD" className="cursor-pointer font-semibold">All-Wheel Drive (AWD)</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Essential for snow, ice, or off-road conditions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 border rounded-lg hover-elevate">
                    <input
                      type="checkbox"
                      id="needsEVCharging"
                      checked={formData.needsEVCharging}
                      onChange={(e) => setFormData({ ...formData, needsEVCharging: e.target.checked })}
                      className="w-5 h-5 mt-0.5 rounded border-input"
                      data-testid="checkbox-ev-charging"
                    />
                    <div className="flex-1">
                      <Label htmlFor="needsEVCharging" className="cursor-pointer font-semibold">EV Charging Access</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        I have access to home/work charging for electric or hybrid vehicles
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-6 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Your Profile Summary
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Annual Income</p>
                      <p className="font-semibold">${formData.annualIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monthly Budget</p>
                      <p className="font-semibold">
                        ${Math.floor((formData.annualIncome / 12) - formData.monthlyExpenses).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Down Payment</p>
                      <p className="font-semibold">${formData.downPayment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Daily Commute</p>
                      <p className="font-semibold">{formData.dailyCommute} miles</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          <div className="flex gap-3 p-6 pt-0">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="gap-2"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 gap-2"
              data-testid="button-next"
            >
              {step === totalSteps ? (
                <>
                  Find My Matches
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/vehicles")}
            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            data-testid="link-skip"
          >
            Skip for now and browse all vehicles
          </button>
        </div>
      </div>
    </div>
  );
}
