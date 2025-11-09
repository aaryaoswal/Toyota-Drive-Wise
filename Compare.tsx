import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  msrp: number;
  imageUrl: string;
  mpgCity: number;
  mpgHighway: number;
  mpgCombined: number;
  fuelType: string;
  seatingCapacity: number;
  cargoCapacity: number;
  transmission: string;
  drivetrain: string;
  horsepower: number;
  torque: number;
  zeroToSixty: number;
  topSpeed: number;
  fuelTankCapacity: number;
  reliability: number;
  safetyRating: number;
  warrantyYears: number;
  warrantyMiles: number;
}

type ComparisonMetric = "prices" | "performance" | "efficiency" | "features" | "safety";

export default function Compare() {
  const [, setLocation] = useLocation();
  const [selectedMetric, setSelectedMetric] = useState<ComparisonMetric>("prices");
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
    enabled: vehicleIds.length > 0,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("ids")?.split(",") || [];
    setVehicleIds(ids);
  }, []);

  const comparedVehicles = vehicles?.filter((v) => vehicleIds.includes(v.id)) || [];

  const getComparisonData = () => {
    if (comparedVehicles.length === 0) return [];

    switch (selectedMetric) {
      case "prices":
        return comparedVehicles.map((v) => ({
          name: `${v.model}`,
          "MSRP": v.msrp,
          "Price per HP": Math.round(v.msrp / v.horsepower),
        }));

      case "performance":
        return comparedVehicles.map((v) => ({
          name: `${v.model}`,
          "Horsepower": v.horsepower,
          "Torque (lb-ft)": v.torque,
          "0-60 (seconds)": v.zeroToSixty,
        }));

      case "efficiency":
        return comparedVehicles.map((v) => ({
          name: `${v.model}`,
          "City MPG": v.mpgCity,
          "Highway MPG": v.mpgHighway,
          "Combined MPG": v.mpgCombined,
        }));

      case "features":
        return comparedVehicles.map((v) => ({
          name: `${v.model}`,
          "Seating": v.seatingCapacity,
          "Cargo (cu ft)": v.cargoCapacity,
          "Fuel Tank (gal)": v.fuelTankCapacity,
        }));

      case "safety":
        return comparedVehicles.map((v) => ({
          name: `${v.model}`,
          "Safety Rating": v.safetyRating,
          "Reliability": v.reliability,
          "Warranty (years)": v.warrantyYears,
        }));

      default:
        return [];
    }
  };

  const comparisonData = getComparisonData();

  const getMetricColors = () => {
    switch (selectedMetric) {
      case "prices":
        return ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];
      case "performance":
        return ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];
      case "efficiency":
        return ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];
      case "features":
        return ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];
      case "safety":
        return ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];
      default:
        return [];
    }
  };

  const getBarKeys = () => {
    if (comparisonData.length === 0) return [];
    const keys = Object.keys(comparisonData[0]).filter((key) => key !== "name");
    return keys;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading comparison...</p>
      </div>
    );
  }

  if (vehicleIds.length === 0 || comparedVehicles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>No Vehicles Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Please select vehicles to compare from the vehicles page.
              </p>
              <Button onClick={() => setLocation("/vehicles")} data-testid="button-browse-vehicles">
                Browse Vehicles
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/vehicles")}
          className="mb-6"
          data-testid="button-back-to-vehicles"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vehicles
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Vehicle Comparison</h1>
          <p className="text-muted-foreground">
            Compare {comparedVehicles.length} vehicle{comparedVehicles.length > 1 ? "s" : ""} side by side
          </p>
        </div>

        {/* Comparison Chart Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Comparison Chart</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Compare by:</span>
                <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as ComparisonMetric)}>
                  <SelectTrigger className="w-[180px]" data-testid="select-comparison-metric">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prices">Prices</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="efficiency">Efficiency</SelectItem>
                    <SelectItem value="features">Features</SelectItem>
                    <SelectItem value="safety">Safety & Reliability</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {getBarKeys().map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={getMetricColors()[index]}
                    radius={[8, 8, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Details Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparedVehicles.map((vehicle) => (
            <Card key={vehicle.id} data-testid={`card-vehicle-${vehicle.id}`}>
              <CardHeader>
                <img
                  src={vehicle.imageUrl}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <CardTitle>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{vehicle.trim}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">MSRP</span>
                    <span className="font-semibold">${vehicle.msrp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">MPG Combined</span>
                    <span className="font-semibold">{vehicle.mpgCombined}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Horsepower</span>
                    <span className="font-semibold">{vehicle.horsepower} hp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">0-60 mph</span>
                    <span className="font-semibold">{vehicle.zeroToSixty}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Seating</span>
                    <span className="font-semibold">{vehicle.seatingCapacity} passengers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Safety Rating</span>
                    <span className="font-semibold">{vehicle.safetyRating}/5</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => setLocation(`/vehicles/${vehicle.id}`)}
                  data-testid={`button-view-details-${vehicle.id}`}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
