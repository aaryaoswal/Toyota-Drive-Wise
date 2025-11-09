import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Fuel, 
  Users, 
  Shield,
  Star,
  MapPin,
  X,
  ZoomIn,
  Sparkles
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart
} from "recharts";

interface VehicleData {
  id: string;
  model: string;
  trim: string;
  year: number;
  msrp: number;
  image: string;
  category: string;
  fuelType: string;
  mpg: string;
  mpgCombined: number;
  seating: number;
  reliability: number;
}

export default function VehicleDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [annualMileage, setAnnualMileage] = useState([12000]);
  const [interestRate, setInterestRate] = useState([5.0]);
  const [gasPrice, setGasPrice] = useState([3.50]);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const { data: vehicle, isLoading } = useQuery<VehicleData>({
    queryKey: [`/api/vehicles/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-center text-muted-foreground">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-center text-muted-foreground">Vehicle not found</p>
        </div>
      </div>
    );
  }

  const downPayment = vehicle.msrp * 0.2;
  const loanAmount = vehicle.msrp - downPayment;
  const monthlyRate = interestRate[0] / 100 / 12;
  const months = 60;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

  const calculateDepreciation = () => {
    const data = [];
    let value = vehicle.msrp;
    
    for (let year = 0; year <= 10; year++) {
      const mileageFactor = 1 - (annualMileage[0] / 15000) * 0.02;
      const baseDepreciation = year === 0 ? 0 : 
                              year === 1 ? 0.20 : 
                              year <= 5 ? 0.12 : 0.08;
      
      value = value * (1 - baseDepreciation) * mileageFactor;
      
      const lowerBound = value * 0.90;
      const upperBound = value * 1.10;
      
      data.push({
        year: vehicle.year + year,
        value: Math.round(value),
        lowerBound: Math.round(lowerBound),
        upperBound: Math.round(upperBound)
      });
    }
    
    return data;
  };

  const depreciationData = calculateDepreciation();
  const monthlyFuelCost = (annualMileage[0] / 12 / vehicle.mpgCombined) * gasPrice[0];
  const monthlyInsurance = 150;
  const monthlyMaintenance = 100;
  const totalMonthlyCost = monthlyPayment + monthlyFuelCost + monthlyInsurance + monthlyMaintenance;

  const aiRecommendation = `Based on your profile, the ${vehicle.model} ${vehicle.trim} is an excellent choice. With a ${vehicle.reliability}/5 reliability rating and combined fuel economy of ${vehicle.mpgCombined} MPG, this vehicle offers strong long-term value. The estimated monthly payment of $${monthlyPayment.toFixed(0)} fits well within typical budgets, and the depreciation curve shows stable value retention over the next 5 years.`;

  const reviews = [
    {
      rating: 5,
      author: "John D.",
      location: "Seattle, WA",
      text: "Best car I've ever owned. The reliability is outstanding and fuel economy is better than advertised.",
      date: "2 weeks ago"
    },
    {
      rating: 4,
      author: "Sarah M.",
      location: "Austin, TX",
      text: "Love everything about this vehicle except the infotainment system could be more intuitive.",
      date: "1 month ago"
    },
    {
      rating: 5,
      author: "Michael R.",
      location: "Denver, CO",
      text: "Perfect for my commute. Comfortable, efficient, and has all the features I need.",
      date: "2 months ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
              <DialogTrigger asChild>
                <button 
                  className="relative group cursor-pointer w-full text-left p-0 border-0 bg-transparent"
                  data-testid="button-open-image-lightbox"
                  aria-label={`View enlarged image of ${vehicle.year} Toyota ${vehicle.model} ${vehicle.trim}`}
                >
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.year} ${vehicle.model} ${vehicle.trim}`}
                    className="w-full rounded-md transition-opacity group-hover:opacity-90"
                    data-testid="img-vehicle"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity bg-background/90 dark:bg-background/70 rounded-full p-3">
                      <ZoomIn className="w-6 h-6" />
                    </div>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl w-[95vw] p-0">
                <div className="relative">
                  <DialogClose asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background"
                      aria-label="Close image viewer"
                      data-testid="button-close-lightbox"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogClose>
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.year} Toyota ${vehicle.model} ${vehicle.trim}`}
                    className="w-full h-auto rounded-md"
                    data-testid="img-lightbox"
                  />
                  <div className="p-6 text-center">
                    <p className="text-lg font-semibold">
                      {vehicle.year} Toyota {vehicle.model} {vehicle.trim}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2" data-testid="text-vehicle-title">
                  {vehicle.year} Toyota {vehicle.model}
                </h1>
                <p className="text-xl text-muted-foreground">{vehicle.trim}</p>
              </div>
              <Badge className="text-lg px-4 py-2">{vehicle.category}</Badge>
            </div>
            
            <div className="text-3xl font-bold text-primary mb-6" data-testid="text-price">
              ${vehicle.msrp.toLocaleString()}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Economy</p>
                  <p className="font-semibold">{vehicle.mpg} MPG</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Seating</p>
                  <p className="font-semibold">{vehicle.seating} passengers</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Reliability</p>
                  <p className="font-semibold">{vehicle.reliability}/5</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Type</p>
                  <p className="font-semibold">{vehicle.fuelType}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-financing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Financing Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Monthly Payment Estimate</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle Price</span>
                    <span className="font-semibold">${vehicle.msrp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Down Payment (20%)</span>
                    <span className="font-semibold">-${downPayment.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Amount</span>
                    <span className="font-semibold">${loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">APR</span>
                    <span className="font-semibold">{interestRate[0]}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Term</span>
                    <span className="font-semibold">60 months</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Monthly Payment</span>
                    <span className="font-bold text-primary" data-testid="text-monthly-payment">
                      ${monthlyPayment.toFixed(0)}/mo
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Total Cost of Ownership (Monthly)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Payment</span>
                    <span className="font-semibold">${monthlyPayment.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel ({annualMileage[0].toLocaleString()} mi/yr)</span>
                    <span className="font-semibold">${monthlyFuelCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Insurance (est.)</span>
                    <span className="font-semibold">${monthlyInsurance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maintenance (est.)</span>
                    <span className="font-semibold">${monthlyMaintenance}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total Monthly Cost</span>
                    <span className="font-bold text-primary" data-testid="text-total-cost">
                      ${totalMonthlyCost.toFixed(0)}/mo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-depreciation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-6 w-6" />
              Depreciation Forecast
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Projected value over 10 years with confidence intervals
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Annual Mileage: {annualMileage[0].toLocaleString()} miles
                  </label>
                  <Slider
                    value={annualMileage}
                    onValueChange={setAnnualMileage}
                    min={5000}
                    max={25000}
                    step={1000}
                    data-testid="slider-mileage"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Interest Rate: {interestRate[0].toFixed(1)}%
                  </label>
                  <Slider
                    value={interestRate}
                    onValueChange={setInterestRate}
                    min={2.0}
                    max={10.0}
                    step={0.1}
                    data-testid="slider-interest"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Gas Price: ${gasPrice[0].toFixed(2)}/gal
                  </label>
                  <Slider
                    value={gasPrice}
                    onValueChange={setGasPrice}
                    min={2.00}
                    max={6.00}
                    step={0.10}
                    data-testid="slider-gas-price"
                  />
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={depreciationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      fill="#eb0a1e20"
                      stroke="none"
                    />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      fill="#ffffff"
                      stroke="none"
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#eb0a1e"
                      strokeWidth={3}
                      dot={{ fill: '#eb0a1e', r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-ai-recommendation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              AI-Powered Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-ai-recommendation">
              {aiRecommendation}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-reviews">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6" />
              Customer Reviews
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Real feedback from Toyota {vehicle.model} owners
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.author}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{review.location}</span>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 mt-8">
          <Button 
            size="lg" 
            className="rounded-full px-8" 
            onClick={() => navigate(`/vehicles/${id}/apply-financing`)}
            data-testid="button-apply-now"
          >
            Apply for Financing
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-full px-8"
            onClick={() => navigate(`/vehicles/${id}/schedule-test-drive`)}
            data-testid="button-schedule-test"
          >
            Schedule Test Drive
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
