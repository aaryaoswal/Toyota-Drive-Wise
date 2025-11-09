import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { insertUserProfileSchema, insertFinancialProfileSchema, type UserProfile, type FinancialProfile } from "@shared/schema";

const preprocessOptionalNumber = (val: any) => (val === '' || val === null || val === undefined) ? undefined : val;

const profileFormSchema = insertUserProfileSchema.extend({
  age: z.coerce.number().min(18).max(100).optional(),
  dailyCommuteOneWay: z.coerce.number().min(0).max(200).optional(),
  weekendDrivingPerWeek: z.coerce.number().min(0).max(500).optional(),
  estimatedAnnualMileage: z.coerce.number().min(0).max(50000).optional(),
});

const financialFormSchema = insertFinancialProfileSchema.extend({
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

type ProfileFormData = z.infer<typeof profileFormSchema>;
type FinancialFormData = z.infer<typeof financialFormSchema>;

export default function ApplyFinancing() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is authenticated
  const { data: currentUser, isLoading: userLoading, error: userError } = useQuery<{ id: number; email: string }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Redirect to signup if not authenticated
  useEffect(() => {
    if (!userLoading && (userError || !currentUser)) {
      toast({
        title: "Please sign up or log in",
        description: "You need to create an account to apply for financing",
      });
      navigate("/signup");
    }
  }, [currentUser, userError, userLoading, navigate, toast]);

  // Check if user already has profiles
  const { data: userProfile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    retry: false,
    enabled: !!currentUser,
  });

  const { data: financialProfile, isLoading: financialLoading } = useQuery<FinancialProfile>({
    queryKey: ["/api/financial-profile"],
    retry: false,
    enabled: !!currentUser,
  });

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      age: 30,
      isStudent: false,
      isFirstCar: false,
      dailyCommuteOneWay: 20,
      weekendDrivingPerWeek: 100,
      climateCondition: "temperate",
      needsAWD: false,
      hasHomeCharging: false,
      hasWorkCharging: false,
      estimatedAnnualMileage: 12000,
    },
  });

  // Financial form
  const financialForm = useForm<FinancialFormData>({
    resolver: zodResolver(financialFormSchema),
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

  // Load existing profile data into form
  useEffect(() => {
    if (userProfile && !profileLoading) {
      profileForm.reset({
        age: userProfile.age ?? 30,
        isStudent: userProfile.isStudent ?? false,
        isFirstCar: userProfile.isFirstCar ?? false,
        dailyCommuteOneWay: userProfile.dailyCommuteOneWay ?? 20,
        weekendDrivingPerWeek: userProfile.weekendDrivingPerWeek ?? 100,
        climateCondition: userProfile.climateCondition ?? "temperate",
        needsAWD: userProfile.needsAWD ?? false,
        hasHomeCharging: userProfile.hasHomeCharging ?? false,
        hasWorkCharging: userProfile.hasWorkCharging ?? false,
        estimatedAnnualMileage: userProfile.estimatedAnnualMileage ?? 12000,
      });
    }
  }, [userProfile, profileLoading, profileForm]);

  // Load existing financial data into form
  useEffect(() => {
    if (financialProfile && !financialLoading) {
      financialForm.reset({
        annualIncome: financialProfile.annualIncome ?? 50000,
        monthlyIncome: financialProfile.monthlyIncome ?? 4167,
        monthlyExpenses: financialProfile.monthlyExpenses ?? 2000,
        totalSavings: financialProfile.totalSavings ?? 10000,
        creditScore: financialProfile.creditScore ?? 700,
        employmentSubsidy: financialProfile.employmentSubsidy ?? 0,
        budgetMin: financialProfile.budgetMin ?? 20000,
        budgetMax: financialProfile.budgetMax ?? 40000,
        leaseTerm: financialProfile.leaseTerm ?? 60,
        cashflowStability: financialProfile.cashflowStability ?? "0.8",
        avgMonthlyCashflow: financialProfile.avgMonthlyCashflow ?? undefined,
        cashflowVolatility: financialProfile.cashflowVolatility ?? undefined,
      });
    }
  }, [financialProfile, financialLoading, financialForm]);

  // Skip to appropriate step based on existing data (after forms are reset)
  useEffect(() => {
    if (!profileLoading && !financialLoading) {
      if (userProfile && financialProfile) {
        setStep(3); // Skip to final review
      } else if (userProfile) {
        setStep(2); // Skip to financial profile
      } else {
        setStep(1); // Start from profile
      }
    }
  }, [userProfile, financialProfile, profileLoading, financialLoading]);

  const handleProfileSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await apiRequest(userProfile ? "PATCH" : "POST", "/api/profile", data);
      await queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      await queryClient.refetchQueries({ queryKey: ["/api/profile"] });
      setStep(2);
      toast({
        title: "Profile saved",
        description: "Moving to financial information",
      });
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error?.error || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinancialSubmit = async (data: FinancialFormData) => {
    setIsSubmitting(true);
    try {
      await apiRequest(financialProfile ? "PUT" : "POST", "/api/financial-profile", data);
      await queryClient.invalidateQueries({ queryKey: ["/api/financial-profile"] });
      await queryClient.refetchQueries({ queryKey: ["/api/financial-profile"] });
      setStep(3);
      toast({
        title: "Financial profile saved",
        description: "Review your application",
      });
    } catch (error: any) {
      toast({
        title: "Error saving financial profile",
        description: error?.error || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // In a real app, this would submit to a financing application endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      toast({
        title: "Application Submitted",
        description: "We'll review your application and contact you within 24 hours.",
      });
    } catch (error: any) {
      toast({
        title: "Error submitting application",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading || profileLoading || financialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render the form if user is not authenticated
  if (!currentUser) {
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Application Submitted!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for applying. A Toyota Financial Services representative will contact you within 24 hours.
          </p>
          <div className="flex gap-4 justify-center">
            {id && (
              <Button onClick={() => navigate(`/vehicles/${id}`)} variant="outline" data-testid="button-back-to-vehicle">
                Back to Vehicle
              </Button>
            )}
            <Button onClick={() => navigate("/vehicles")} data-testid="button-browse-vehicles">
              Browse More Vehicles
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {id && (
          <Button
            variant="ghost"
            onClick={() => navigate(`/vehicles/${id}`)}
            className="mb-6"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicle
          </Button>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Apply for Financing</h1>
          <p className="text-xl text-muted-foreground">
            Step {step} of 3: {step === 1 ? "Your Profile" : step === 2 ? "Financial Information" : "Review & Submit"}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm ${step >= 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}>Profile</span>
            <span className={`text-sm ${step >= 2 ? "text-primary font-semibold" : "text-muted-foreground"}`}>Financial</span>
            <span className={`text-sm ${step >= 3 ? "text-primary font-semibold" : "text-muted-foreground"}`}>Review</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Profile Form */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Tell us about yourself and your driving needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} data-testid="input-age" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="dailyCommuteOneWay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Daily Commute (miles one-way)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} data-testid="input-commute" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="isStudent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Student Status</FormLabel>
                            <FormDescription>Are you currently a student?</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value ?? false} onCheckedChange={field.onChange} data-testid="switch-student" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="isFirstCar"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>First Car</FormLabel>
                            <FormDescription>Is this your first car purchase?</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value ?? false} onCheckedChange={field.onChange} data-testid="switch-first-car" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="climateCondition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Climate</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                          <FormControl>
                            <SelectTrigger data-testid="select-climate">
                              <SelectValue placeholder="Select your climate" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hot">Hot</SelectItem>
                            <SelectItem value="cold">Cold</SelectItem>
                            <SelectItem value="temperate">Temperate</SelectItem>
                            <SelectItem value="variable">Variable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="needsAWD"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Need AWD/4WD</FormLabel>
                            <FormDescription>Do you need all-wheel drive?</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value ?? false} onCheckedChange={field.onChange} data-testid="switch-awd" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="hasHomeCharging"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Home EV Charging</FormLabel>
                            <FormDescription>Access to charging at home?</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value ?? false} onCheckedChange={field.onChange} data-testid="switch-home-charging" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-next-step">
                    {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Next: Financial Information"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Financial Form */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
              <CardDescription>
                Help us understand your financial situation for the best financing options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...financialForm}>
                <form onSubmit={financialForm.handleSubmit(handleFinancialSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={financialForm.control}
                      name="annualIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Income</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} data-testid="input-annual-income" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={financialForm.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} data-testid="input-monthly-income" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={financialForm.control}
                      name="monthlyExpenses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Expenses</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} data-testid="input-monthly-expenses" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={financialForm.control}
                      name="creditScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credit Score</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} data-testid="input-credit-score" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={financialForm.control}
                      name="budgetMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Budget</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} data-testid="input-budget-min" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={financialForm.control}
                      name="budgetMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Budget</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} data-testid="input-budget-max" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1" data-testid="button-back-step">
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting} data-testid="button-next-step">
                      {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Next: Review"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Application</CardTitle>
              <CardDescription>
                Please review your information before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Profile Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Age:</span> <span className="font-medium">{userProfile?.age || "Not set"}</span></div>
                    <div><span className="text-muted-foreground">Student:</span> <span className="font-medium">{userProfile?.isStudent ? "Yes" : "No"}</span></div>
                    <div><span className="text-muted-foreground">First Car:</span> <span className="font-medium">{userProfile?.isFirstCar ? "Yes" : "No"}</span></div>
                    <div><span className="text-muted-foreground">Daily Commute:</span> <span className="font-medium">{userProfile?.dailyCommuteOneWay || 0} miles</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Financial Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Annual Income:</span> <span className="font-medium">${financialProfile?.annualIncome?.toLocaleString() || "Not set"}</span></div>
                    <div><span className="text-muted-foreground">Credit Score:</span> <span className="font-medium">{financialProfile?.creditScore || "Not set"}</span></div>
                    <div><span className="text-muted-foreground">Budget Range:</span> <span className="font-medium">${financialProfile?.budgetMin?.toLocaleString()} - ${financialProfile?.budgetMax?.toLocaleString()}</span></div>
                    <div><span className="text-muted-foreground">Lease Term:</span> <span className="font-medium">{financialProfile?.leaseTerm || 60} months</span></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1" data-testid="button-back-step">
                  Back
                </Button>
                <Button onClick={handleFinalSubmit} className="flex-1" disabled={isSubmitting} data-testid="button-submit-application">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
