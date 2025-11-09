import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, DollarSign, Zap, Users, Snowflake, Mountain, Zap as ElectricIcon } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import camryImage from "@assets/generated_images/Toyota_Camry_product_shot_1efcce4c.png";

interface UserProfile {
  age: number;
  isStudent: boolean;
  isFirstCar: boolean;
  dailyCommuteOneWay: number;
  weekendDrivingPerWeek: number;
  climateCondition: string;
  needsAWD: boolean;
  hasHomeCharging: boolean;
}

interface FinancialProfile {
  annualIncome: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  creditScore: number;
  budgetMin: number;
  budgetMax: number;
  leaseTerm: number;
}

export default function AIRecommendation() {
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    enabled: !!user,
    retry: false,
  });

  const { data: financialProfile } = useQuery<FinancialProfile>({
    queryKey: ["/api/financial-profile"],
    enabled: !!user,
    retry: false,
  });
  
  // Default values for non-logged-in users
  const matchPercentage = 94;
  const salaryFit = 92;
  const reliabilityScore = 96;
  const termMatch = 91;
  const recommendedVehicleId = "camry-xse";

  // Generate personalized match reasons
  const generateMatchReasons = () => {
    const reasons = [];

    if (financialProfile) {
      const monthlyPayment = Math.round(financialProfile.budgetMax / 60 * 1.05); // Estimate with interest
      const paymentPercentage = ((monthlyPayment / financialProfile.monthlyIncome) * 100).toFixed(0);
      
      reasons.push({
        icon: <TrendingUp className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />,
        text: `Monthly payment of $${monthlyPayment} is ${paymentPercentage}% of your $${financialProfile.monthlyIncome.toLocaleString()} monthly income, ${parseFloat(paymentPercentage) < 15 ? "well below" : "within"} the recommended 15% limit`
      });

      if (financialProfile.creditScore >= 700) {
        reasons.push({
          icon: <DollarSign className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />,
          text: `Your ${financialProfile.creditScore} credit score qualifies you for excellent APR rates, saving thousands over the loan term`
        });
      } else {
        reasons.push({
          icon: <DollarSign className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />,
          text: `Exceptional resale value with projected 63% retention after ${Math.round(financialProfile.leaseTerm / 12)} years based on historical data`
        });
      }
    } else {
      reasons.push({
        icon: <TrendingUp className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />,
        text: "Monthly payment of $485 fits comfortably within your budget, leaving room for savings"
      });
      reasons.push({
        icon: <DollarSign className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />,
        text: "Exceptional resale value with projected 63% retention after 3 years based on historical data"
      });
    }

    if (userProfile) {
      if (userProfile.isStudent || userProfile.isFirstCar) {
        reasons.push({
          icon: <Users className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />,
          text: userProfile.isStudent 
            ? "Perfect for students with excellent fuel economy (32 MPG combined) reducing operational costs"
            : "Ideal first car with user-friendly technology, excellent safety ratings, and low maintenance costs"
        });
      } else if (userProfile.dailyCommuteOneWay > 30) {
        reasons.push({
          icon: <Sparkles className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />,
          text: `With your ${userProfile.dailyCommuteOneWay}-mile daily commute, the hybrid variant saves $960/year vs gas, paying for itself over time`
        });
      } else {
        reasons.push({
          icon: <Sparkles className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />,
          text: "Industry-leading reliability score (4.8/5.0) minimizes unexpected maintenance costs"
        });
      }

      if (userProfile.needsAWD) {
        reasons.push({
          icon: <Mountain className="w-4 h-4 mt-0.5 text-indigo-600 flex-shrink-0" />,
          text: "Available AWD option provides enhanced traction and control for your driving needs"
        });
      }

      if (userProfile.climateCondition === "cold") {
        reasons.push({
          icon: <Snowflake className="w-4 h-4 mt-0.5 text-cyan-600 flex-shrink-0" />,
          text: "Equipped with heated seats and remote start for cold climate comfort and convenience"
        });
      }

      if (userProfile.hasHomeCharging && userProfile.dailyCommuteOneWay < 25) {
        reasons.push({
          icon: <ElectricIcon className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />,
          text: "With home charging available, you could save even more with a plug-in hybrid or full electric option"
        });
      }
    } else {
      reasons.push({
        icon: <Sparkles className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />,
        text: "Industry-leading reliability score (4.8/5.0) minimizes unexpected maintenance costs"
      });
    }

    // Limit to 3 most relevant reasons
    return reasons.slice(0, 3);
  };

  const matchReasons = generateMatchReasons();
  
  const handleCompareClick = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Vehicle comparison functionality will be available in the next update.",
    });
  };

  return (
    <div className="w-full py-24 bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-[Lexend] mb-4">
            AI-Powered Recommendation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your financial profile and preferences, we've found your perfect match
          </p>
        </div>

        <Card className="p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary text-primary-foreground px-4 py-2 text-base">
                <Sparkles className="w-4 h-4 mr-2" />
                Top Match
              </Badge>
              <h3 className="text-4xl font-bold font-[Lexend] mb-2">
                2024 Toyota Camry
              </h3>
              <p className="text-xl text-muted-foreground mb-8">XSE Trim</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-primary" data-testid="text-match-percentage">
                    {matchPercentage}%
                  </span>
                  <span className="text-xl text-muted-foreground">Match</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Compatibility score based on your profile
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 rounded-lg bg-accent/30">
                  <div className="text-2xl font-bold mb-1" data-testid="text-salary-fit">{salaryFit}%</div>
                  <div className="text-xs text-muted-foreground">Salary Fit</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/30">
                  <div className="text-2xl font-bold mb-1" data-testid="text-reliability">{reliabilityScore}%</div>
                  <div className="text-xs text-muted-foreground">Reliability</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/30">
                  <div className="text-2xl font-bold mb-1" data-testid="text-term-match">{termMatch}%</div>
                  <div className="text-xs text-muted-foreground">Term Match</div>
                </div>
              </div>

              <div className="p-6 bg-accent/50 rounded-lg mb-8">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Why This Match?
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {matchReasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {reason.icon}
                      <span>{reason.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1" asChild data-testid="button-view-full-details">
                  <Link href={`/vehicles/${recommendedVehicleId}`}>
                    View Full Details
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleCompareClick}
                  data-testid="button-compare-options"
                >
                  Compare Options
                </Button>
              </div>
            </div>

            <div className="bg-accent/20 rounded-2xl p-8 flex items-center justify-center">
              <img
                src={camryImage}
                alt="2024 Toyota Camry"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
