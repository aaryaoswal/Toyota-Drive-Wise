import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import type { AffordabilityResponse } from "@shared/schema";

interface AffordabilityDashboardProps {
  data: AffordabilityResponse | null;
  isLoading?: boolean;
}

export default function AffordabilityDashboard({ data, isLoading }: AffordabilityDashboardProps) {
  if (isLoading) {
    return (
      <div className="w-full py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Loading affordability data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Calculate your affordability to see detailed breakdown</p>
          </div>
        </div>
      </div>
    );
  }

  const { score, monthlyNetIncome, totalMonthlyCost, breakdown, budgetUtilization } = data;

  const getScoreColor = () => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreColorBg = () => {
    if (score >= 70) return "bg-green-600";
    if (score >= 40) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div className="w-full py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-[Lexend] mb-4">
            Your Affordability Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive breakdown of your vehicle ownership costs
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="p-8 flex flex-col items-center justify-center">
            <DollarSign className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
              Affordability Score
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <div className={`text-6xl font-bold font-[Lexend] ${getScoreColor()}`} data-testid="text-score">
                {score}
              </div>
              <span className="text-2xl text-muted-foreground">/100</span>
            </div>
            <Progress value={score} className="w-full h-2 mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              Based on income-to-cost ratio and credit profile
            </p>
          </Card>

          <Card className="p-8">
            <h3 className="text-lg font-bold font-[Lexend] mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Cost Breakdown
            </h3>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
              <p className="text-3xl font-bold" data-testid="text-total-cost">
                ${totalMonthlyCost.toLocaleString()}
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-lg font-bold font-[Lexend] mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Budget vs. Reality
            </h3>
            <div className="space-y-6">
              {breakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm font-bold">${item.value.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(item.value / totalMonthlyCost) * 100} 
                    className="h-2"
                    indicatorStyle={{ backgroundColor: item.color }}
                  />
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold">Budget Utilization</span>
                  <span className="text-sm font-bold" data-testid="text-utilization">
                    {budgetUtilization.toFixed(1)}%
                  </span>
                </div>
                <Progress value={budgetUtilization} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  of monthly income (${monthlyNetIncome.toLocaleString()})
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
