import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp,
  DollarSign,
  Shield,
  ArrowRight
} from "lucide-react";

export default function BankConnection() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mockAccountData = {
    checking: 8500,
    savings: 12000,
    monthlyIncome: 5800,
    avgMonthlySpending: 4200,
  };

  useEffect(() => {
    const fetchBankConnection = async () => {
      try {
        const response = await fetch("/api/bank-accounts");
        
        if (response.status === 401) {
          toast({
            title: "Please log in",
            description: "You need to log in to manage bank connections",
          });
          setIsLoading(false);
          navigate("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0 && data[0].isConnected) {
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch bank connection status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankConnection();
  }, [navigate, toast]);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch("/api/bank-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "capital_one",
          accountType: "checking",
          balance: mockAccountData.checking + mockAccountData.savings,
          isConnected: true,
          lastSynced: new Date().toISOString(),
        }),
      });

      if (response.status === 401) {
        toast({
          title: "Please log in first",
          description: "You need to create an account to connect your bank",
          variant: "destructive",
        });
        navigate("/signup");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error || errorData.message || "Failed to connect bank account";
        throw new Error(Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg);
      }

      setIsConnected(true);
      toast({
        title: "Bank Account Connected!",
        description: "Capital One account linked successfully. DriveWise can now provide personalized recommendations.",
      });
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch("/api/bank-accounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 401) {
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error || errorData.message || "Failed to disconnect bank account";
        throw new Error(Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg);
      }

      setIsConnected(false);
      toast({
        title: "Bank Account Disconnected",
        description: "Your Capital One account has been unlinked.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect account",
        variant: "destructive",
      });
    }
  };

  const recommendedDownPayment = isConnected 
    ? Math.floor(mockAccountData.savings * 0.25) 
    : 0;

  const monthlyBudget = isConnected
    ? mockAccountData.monthlyIncome - mockAccountData.avgMonthlySpending
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Bank Connection</h1>
          <p className="text-xl text-muted-foreground">
            Connect your Capital One account for personalized financing recommendations
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading connection status...</p>
            </CardContent>
          </Card>
        ) : !isConnected ? (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Connect Capital One</CardTitle>
              </div>
              <CardDescription className="text-base">
                Securely link your Capital One account to get personalized vehicle recommendations based on your real financial data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Bank-Level Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is encrypted and never stored
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Smart Recommendations</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-powered suggestions based on your finances
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Real-Time Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Dynamic affordability based on your account
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-lg">What we'll access:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Account balances (checking and savings)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Monthly income patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Average spending to calculate available budget
                  </li>
                </ul>
              </div>

              <Button 
                size="lg" 
                className="w-full"
                onClick={handleConnect}
                disabled={isConnecting}
                data-testid="button-connect-bank"
              >
                {isConnecting ? (
                  "Connecting to Capital One..."
                ) : (
                  <>
                    <Building2 className="w-5 h-5 mr-2" />
                    Connect Capital One Account
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By connecting, you agree to DriveWise's data sharing policy. You can disconnect anytime.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Capital One Account
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Connected
                        </Badge>
                      </CardTitle>
                      <CardDescription>Last synced: Just now</CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleDisconnect}
                    data-testid="button-disconnect-bank"
                  >
                    Disconnect
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Checking Account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        ${mockAccountData.checking.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Savings Account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        ${mockAccountData.savings.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>
                  Based on your Capital One account data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background rounded-lg border">
                  <h3 className="font-semibold mb-2">Recommended Down Payment</h3>
                  <p className="text-3xl font-bold text-primary mb-2">
                    ${recommendedDownPayment.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Based on 25% of your savings balance, this keeps you financially secure while lowering monthly payments.
                  </p>
                </div>

                <div className="p-4 bg-background rounded-lg border">
                  <h3 className="font-semibold mb-2">Monthly Budget Available</h3>
                  <p className="text-3xl font-bold text-primary mb-2">
                    ${monthlyBudget.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    After your average monthly expenses (${mockAccountData.avgMonthlySpending.toLocaleString()}), you have this amount available for vehicle financing.
                  </p>
                </div>

                <div className="p-4 bg-background rounded-lg border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Financial Health Score
                  </h3>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 bg-muted rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                    <span className="text-2xl font-bold">78%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Strong financial position. You can comfortably afford vehicles up to $32,000 with the recommended down payment.
                  </p>
                </div>

                <Button 
                  size="lg" 
                  className="w-full gap-2"
                  onClick={() => navigate("/vehicles")}
                  data-testid="button-view-matches"
                >
                  View Personalized Vehicle Matches
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
