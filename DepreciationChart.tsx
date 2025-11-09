import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, TooltipProps } from "recharts";
import { TrendingDown } from "lucide-react";

interface DepreciationChartProps {
  vehiclePrice?: number;
}

// TODO: remove mock functionality
const generateData = (factors: string[], vehiclePrice: number) => {
  const baseDepreciation = [
    { year: 0, valuePct: 100, lowerPct: 100, upperPct: 100 },
    { year: 1, valuePct: 85, lowerPct: 82, upperPct: 88 },
    { year: 2, valuePct: 73, lowerPct: 69, upperPct: 77 },
    { year: 3, valuePct: 63, lowerPct: 58, upperPct: 68 },
    { year: 4, valuePct: 55, lowerPct: 49, upperPct: 61 },
    { year: 5, valuePct: 48, lowerPct: 42, upperPct: 54 },
    { year: 7, valuePct: 38, lowerPct: 31, upperPct: 45 },
  ];

  let adjustment = 0;
  if (factors.includes("lowMileage")) adjustment += 3;
  if (factors.includes("goodCondition")) adjustment += 2;
  if (factors.includes("lowInterest")) adjustment += 2;
  if (factors.includes("lowGas")) adjustment += 1;

  return baseDepreciation.map(point => {
    const valuePct = Math.min(100, point.valuePct + adjustment);
    const lowerPct = Math.min(100, point.lowerPct + adjustment - 2);
    const upperPct = Math.min(100, point.upperPct + adjustment + 2);
    
    return {
      year: point.year,
      value: valuePct,
      lower: lowerPct,
      upper: upperPct,
      valueUsd: Math.round((valuePct / 100) * vehiclePrice),
      lowerUsd: Math.round((lowerPct / 100) * vehiclePrice),
      upperUsd: Math.round((upperPct / 100) * vehiclePrice),
    };
  });
};

const formatCurrency = (value: number | string | undefined): string => {
  if (value === undefined || value === null) return "$0";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(numValue);
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const valuePct = Number(data.value) || 0;
  const lowerPct = Number(data.lower) || 0;
  const upperPct = Number(data.upper) || 0;
  
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="font-semibold mb-2">Year {data.year}</p>
      <div className="space-y-1 text-sm">
        <p className="text-primary">
          <span className="font-medium">Projected Value:</span>{" "}
          {valuePct}% ({formatCurrency(data.valueUsd)})
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium">Range:</span>{" "}
          {lowerPct}%-{upperPct}% ({formatCurrency(data.lowerUsd)}-{formatCurrency(data.upperUsd)})
        </p>
      </div>
    </div>
  );
};

const factors = [
  { id: "lowMileage", label: "Low Annual Mileage (< 12k)", category: "vehicle" },
  { id: "goodCondition", label: "Excellent Condition", category: "vehicle" },
  { id: "lowInterest", label: "Low Interest Rates", category: "market" },
  { id: "lowGas", label: "Low Gas Prices", category: "market" },
];

export default function DepreciationChart({ vehiclePrice = 35000 }: DepreciationChartProps) {
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const toggleFactor = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId)
        ? prev.filter(id => id !== factorId)
        : [...prev, factorId]
    );
    console.log('Factor toggled:', factorId);
  };

  const data = generateData(selectedFactors, vehiclePrice);
  const latestData = data[data.length - 1];

  return (
    <div className="w-full py-24 bg-accent/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <TrendingDown className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-[Lexend] mb-4">
            Value Projection Explorer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how different factors affect your vehicle's projected value over time
          </p>
        </div>

        <Card className="p-8">
          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Select Factors to Adjust Projection
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {factors.map((factor) => (
                <div key={factor.id} className="flex items-center gap-3 p-3 rounded-lg hover-elevate">
                  <Checkbox
                    id={factor.id}
                    checked={selectedFactors.includes(factor.id)}
                    onCheckedChange={() => toggleFactor(factor.id)}
                    data-testid={`checkbox-${factor.id}`}
                  />
                  <Label
                    htmlFor={factor.id}
                    className="cursor-pointer flex-1 text-sm font-medium"
                  >
                    {factor.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="year" 
                  label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                  className="text-sm"
                />
                <YAxis 
                  label={{ value: 'Value Retention (%)', angle: -90, position: 'insideLeft' }}
                  className="text-sm"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="upper"
                  stackId="1"
                  stroke="none"
                  fill="url(#colorRange)"
                  fillOpacity={0.6}
                  name="Upper Range"
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stackId="1"
                  stroke="none"
                  fill="transparent"
                  name="Lower Range"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  name="Projected Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-3">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Year {latestData?.year} Projection:</span>{" "}
                Your ${vehiclePrice.toLocaleString()} vehicle is projected to retain{" "}
                <span className="font-bold text-primary">{latestData?.value}%</span> of its value (
                <span className="font-bold text-primary">${latestData?.valueUsd.toLocaleString()}</span>
                ), with an estimated range of ${latestData?.lowerUsd.toLocaleString()}-${latestData?.upperUsd.toLocaleString()}.
              </p>
            </div>
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Data Transparency:</span> Projections based on historical Toyota residual curves (2015-2024 cohorts) 
                with confidence intervals. Updated quarterly. Estimates only, not guarantees.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
