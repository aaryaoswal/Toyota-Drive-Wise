import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Loader2, Building2, CheckCircle2, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { insertUserProfileSchema, type UserProfile } from "@shared/schema";

const profileSchema = insertUserProfileSchema.extend({
  age: z.coerce.number().min(18).max(100).optional(),
  dailyCommuteOneWay: z.coerce.number().min(0).max(200).optional(),
  weekendDrivingPerWeek: z.coerce.number().min(0).max(500).optional(),
  estimatedAnnualMileage: z.coerce.number().min(0).max(50000).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankConnectionStatus, setBankConnectionStatus] = useState<"loading" | "connected" | "not_connected">("loading");

  const { data: userProfile, isLoading: userProfileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    retry: false,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
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

  useEffect(() => {
    if (userProfile) {
      form.reset({
        age: userProfile.age ?? 30,
        isStudent: userProfile.isStudent !== null ? userProfile.isStudent : false,
        isFirstCar: userProfile.isFirstCar !== null ? userProfile.isFirstCar : false,
        dailyCommuteOneWay: userProfile.dailyCommuteOneWay ?? 20,
        weekendDrivingPerWeek: userProfile.weekendDrivingPerWeek ?? 100,
        climateCondition: userProfile.climateCondition ?? "temperate",
        needsAWD: userProfile.needsAWD !== null ? userProfile.needsAWD : false,
        hasHomeCharging: userProfile.hasHomeCharging !== null ? userProfile.hasHomeCharging : false,
        hasWorkCharging: userProfile.hasWorkCharging !== null ? userProfile.hasWorkCharging : false,
        estimatedAnnualMileage: userProfile.estimatedAnnualMileage ?? 12000,
      });
    }
  }, [userProfile, form]);

  useEffect(() => {
    const fetchBankStatus = async () => {
      try {
        const response = await fetch("/api/bank-accounts");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0 && data[0].isConnected) {
            setBankConnectionStatus("connected");
          } else {
            setBankConnectionStatus("not_connected");
          }
        } else {
          setBankConnectionStatus("not_connected");
        }
      } catch (error) {
        setBankConnectionStatus("not_connected");
      }
    };
    fetchBankStatus();
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Update user profile (uses PATCH as defined in routes)
      await apiRequest("PATCH", "/api/profile", data);

      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });

      toast({
        title: "Profile updated successfully",
        description: "Your preferences have been saved.",
      });
    } catch (error: any) {
      const errorMessage = error?.error || "Failed to update profile";
      toast({
        title: "Update failed",
        description: Array.isArray(errorMessage) ? errorMessage[0].message : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userProfileLoading) {
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
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your personal information and driving preferences to get better vehicle recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              data-testid="input-age"
                            />
                          </FormControl>
                          <FormDescription>Your age helps us estimate insurance costs</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isStudent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Student Status</FormLabel>
                            <FormDescription>
                              Are you currently a student?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value ?? false}
                              onCheckedChange={field.onChange}
                              data-testid="switch-student-status"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFirstCar"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">First Car</FormLabel>
                            <FormDescription>
                              Is this your first car purchase?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value ?? false}
                              onCheckedChange={field.onChange}
                              data-testid="switch-first-car"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Driving Preferences */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Driving Preferences</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="dailyCommuteOneWay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Daily Commute (miles one-way)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              data-testid="input-daily-commute"
                            />
                          </FormControl>
                          <FormDescription>How many miles is your one-way commute?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weekendDrivingPerWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekend Driving (miles per week)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              data-testid="input-weekend-driving"
                            />
                          </FormControl>
                          <FormDescription>Average miles driven on weekends per week</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedAnnualMileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Annual Mileage</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              data-testid="input-annual-mileage"
                            />
                          </FormControl>
                          <FormDescription>Total miles you expect to drive per year</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="climateCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Climate</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value ?? "temperate"}>
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
                          <FormDescription>Your local weather conditions</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="needsAWD"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Need AWD/4WD</FormLabel>
                            <FormDescription>
                              Do you need all-wheel or four-wheel drive?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value ?? false}
                              onCheckedChange={field.onChange}
                              data-testid="switch-needs-awd"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasHomeCharging"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Home EV Charging</FormLabel>
                            <FormDescription>
                              Do you have access to EV charging at home?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value ?? false}
                              onCheckedChange={field.onChange}
                              data-testid="switch-home-charging"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasWorkCharging"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Work EV Charging</FormLabel>
                            <FormDescription>
                              Do you have access to EV charging at work?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value ?? false}
                              onCheckedChange={field.onChange}
                              data-testid="switch-work-charging"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-save-profile">
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

        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Bank Connection</CardTitle>
                <CardDescription>
                  Connect your Capital One account for personalized financing recommendations
                </CardDescription>
              </div>
              {bankConnectionStatus === "connected" && (
                <Badge variant="default" className="gap-1" data-testid="badge-bank-connected">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {bankConnectionStatus === "loading" ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : bankConnectionStatus === "connected" ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <Building2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Capital One Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Your account is connected and syncing your financial data for personalized vehicle recommendations.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setLocation("/bank-connection")}
                  data-testid="button-manage-bank"
                >
                  <LinkIcon className="w-4 h-4" />
                  Manage Bank Connection
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <Building2 className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Connect Capital One</h3>
                    <p className="text-sm text-muted-foreground">
                      Link your Capital One account to get AI-powered vehicle recommendations based on your real financial data.
                    </p>
                  </div>
                </div>
                <Button
                  variant="default"
                  className="w-full gap-2"
                  onClick={() => setLocation("/bank-connection")}
                  data-testid="button-connect-bank"
                >
                  <Building2 className="w-4 h-4" />
                  Connect Capital One Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
