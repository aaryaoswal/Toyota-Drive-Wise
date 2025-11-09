import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Loader2, DollarSign } from "lucide-react";
import { insertFinancialProfileSchema, type FinancialProfile } from "@shared/schema";

const preprocessOptionalNumber = (val: any) => (val === '' || val === null || val === undefined) ? undefined : val;

const financialSchema = insertFinancialProfileSchema.extend({
  annualIncome: z.coerce.number().min(10000).max(1000000),
  monthlyIncome: z.coerce.number().min(833).max(100000),
  monthlyExpenses: z.coerce.number().min(0).max(50000),
  totalSavings: z.coerce.number().min(0).max(1000000),
  creditScore: z.coerce.number().min(300).max(850),
  employmentSubsidy: z.preprocess(preprocessOptionalNumber, z.coerce.number().min(0).max(10000).optional()),
  budgetMin: z.coerce.number().min(0).max(100000),
  budgetMax: z.coerce.number().min(0).max(200000),
  leaseTerm: z.coerce.number().min(12).max(84),
  cashflowStability: z.preprocess(preprocessOptionalNumber, z.coerce.number().min(0).max(1).optional().transform(val => val?.toString())),
  avgMonthlyCashflow: z.preprocess(preprocessOptionalNumber, z.coerce.number().optional()),
  cashflowVolatility: z.preprocess(preprocessOptionalNumber, z.coerce.number().optional().transform(val => val?.toString())),
});

type FinancialFormData = z.infer<typeof financialSchema>;

export default function AccountSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: financialProfile, isLoading } = useQuery<FinancialProfile>({
    queryKey: ["/api/financial-profile"],
  });

  const form = useForm<FinancialFormData>({
    resolver: zodResolver(financialSchema),
    defaultValues: {
      annualIncome: 50000,
      monthlyIncome: 4167,
      monthlyExpenses: 2000,
      totalSavings: 10000,
      creditScore: 700,
      employmentSubsidy: 0,
      budgetMin: 20000,
      budgetMax: 40000,
      leaseTerm: 60,
      cashflowStability: "0.8",
      avgMonthlyCashflow: undefined,
      cashflowVolatility: undefined,
    },
  });

  useEffect(() => {
    if (financialProfile) {
      form.reset({
        annualIncome: financialProfile.annualIncome,
        monthlyIncome: financialProfile.monthlyIncome,
        monthlyExpenses: financialProfile.monthlyExpenses,
        totalSavings: financialProfile.totalSavings,
        creditScore: financialProfile.creditScore,
        employmentSubsidy: financialProfile.employmentSubsidy ?? 0,
        budgetMin: financialProfile.budgetMin,
        budgetMax: financialProfile.budgetMax,
        leaseTerm: financialProfile.leaseTerm,
        cashflowStability: financialProfile.cashflowStability ?? "0.8",
        avgMonthlyCashflow: financialProfile.avgMonthlyCashflow ?? undefined,
        cashflowVolatility: financialProfile.cashflowVolatility ?? undefined,
      });
    }
  }, [financialProfile, form]);

  const onSubmit = async (data: FinancialFormData) => {
    setIsSubmitting(true);
    try {
      await apiRequest("PUT", "/api/financial-profile", data);

      queryClient.invalidateQueries({ queryKey: ["/api/financial-profile"] });

      toast({
        title: "Financial profile updated",
        description: "Your financial information has been saved.",
      });
    } catch (error: any) {
      const errorMessage = error?.error || "Failed to update financial profile";
      toast({
        title: "Update failed",
        description: Array.isArray(errorMessage) ? errorMessage[0].message : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your financial information to get accurate affordability calculations and vehicle recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Information
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="annualIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Income</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              
                              data-testid="input-annual-income"
                            />
                          </FormControl>
                          <FormDescription>Your total annual gross income</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              
                              data-testid="input-monthly-income"
                            />
                          </FormControl>
                          <FormDescription>Your monthly gross income</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="monthlyExpenses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Expenses</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              
                              data-testid="input-monthly-expenses"
                            />
                          </FormControl>
                          <FormDescription>Your average monthly expenses (rent, utilities, etc.)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="creditScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credit Score</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              
                              data-testid="input-credit-score"
                            />
                          </FormControl>
                          <FormDescription>Your FICO credit score (300-850)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totalSavings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Savings</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              
                              data-testid="input-total-savings"
                            />
                          </FormControl>
                          <FormDescription>Your total savings available</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employmentSubsidy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Subsidy</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              
                              data-testid="input-employment-subsidy"
                            />
                          </FormControl>
                          <FormDescription>Any additional employment benefits (transportation allowance, etc.)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budgetMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Budget</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              
                              data-testid="input-budget-min"
                            />
                          </FormControl>
                          <FormDescription>Minimum vehicle price you're considering</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budgetMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Budget</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              
                              data-testid="input-budget-max"
                            />
                          </FormControl>
                          <FormDescription>Maximum vehicle price you're considering</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaseTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lease Term (months)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              
                              data-testid="input-lease-term"
                            />
                          </FormControl>
                          <FormDescription>Preferred loan term length (12-84 months)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cashflowStability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cashflow Stability (0-1)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="1"
                              {...field}
                              
                              data-testid="input-cashflow-stability"
                            />
                          </FormControl>
                          <FormDescription>Rate your income stability (0=volatile, 1=very stable)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-save-financial">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
