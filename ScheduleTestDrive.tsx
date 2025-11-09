import { useState } from "react";
import { useParams, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ScheduleTestDrive() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Test Drive Scheduled",
      description: "You'll receive a confirmation email shortly with all the details.",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Test Drive Scheduled!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            We've sent a confirmation email with your test drive details. We look forward to seeing you!
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate(`/vehicles/${id}`)} variant="outline">
              Back to Vehicle
            </Button>
            <Button onClick={() => navigate("/vehicles")}>
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
      
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(`/vehicles/${id}`)}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vehicle
        </Button>

        <h1 className="text-4xl font-bold mb-2">Schedule Test Drive</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Experience this Toyota vehicle in person at your local dealership
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Test Drive Information</CardTitle>
            <CardDescription>
              Choose your preferred date and time for the test drive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required data-testid="input-first-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required data-testid="input-last-name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required data-testid="input-email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" required data-testid="input-phone" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input id="date" type="date" required data-testid="input-date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input id="time" type="time" required data-testid="input-time" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dealership">Preferred Dealership</Label>
                <select
                  id="dealership"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                  data-testid="select-dealership"
                >
                  <option value="">Select a dealership...</option>
                  <option value="downtown">Toyota Downtown</option>
                  <option value="north">Toyota North</option>
                  <option value="south">Toyota South</option>
                  <option value="west">Toyota West</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <Button type="submit" className="flex-1" data-testid="button-submit-schedule">
                  Schedule Test Drive
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/vehicles/${id}`)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
