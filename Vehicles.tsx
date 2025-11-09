import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import camryImage from "@assets/generated_images/Toyota_Camry_product_shot_1efcce4c.png";
import rav4Image from "@assets/generated_images/Toyota_RAV4_product_shot_76854cb0.png";
import corollaImage from "@assets/generated_images/Toyota_Corolla_product_shot_0e79ae5b.png";
import highlanderImage from "@assets/generated_images/Toyota_Highlander_product_shot_2b3bfc13.png";
import tacomaImage from "@assets/generated_images/Toyota_Tacoma_product_shot_03ce728a.png";
import fourRunnerImage from "@assets/generated_images/Toyota_4Runner_product_shot_af5c0b5b.png";

// TODO: remove mock functionality - comprehensive Toyota lineup
const allVehicles = [
  {
    id: "camry-xse",
    image: camryImage,
    model: "Camry",
    trim: "XSE",
    year: 2024,
    price: 32500,
    matchPercentage: 94,
    category: "Sedan",
    mpg: "28/39",
    seating: 5,
    fuelType: "Gas",
    reliability: 4.8,
    monthlyPayment: 485
  },
  {
    id: "camry-le",
    image: camryImage,
    model: "Camry",
    trim: "LE",
    year: 2024,
    price: 28400,
    matchPercentage: 96,
    category: "Sedan",
    mpg: "28/39",
    seating: 5,
    fuelType: "Gas",
    reliability: 4.8,
    monthlyPayment: 425
  },
  {
    id: "camry-hybrid",
    image: camryImage,
    model: "Camry",
    trim: "Hybrid SE",
    year: 2024,
    price: 31900,
    matchPercentage: 93,
    category: "Sedan",
    mpg: "51/53",
    seating: 5,
    fuelType: "Hybrid",
    reliability: 4.9,
    monthlyPayment: 475
  },
  {
    id: "rav4-xle",
    image: rav4Image,
    model: "RAV4",
    trim: "XLE Hybrid",
    year: 2024,
    price: 35800,
    matchPercentage: 91,
    category: "SUV",
    mpg: "41/38",
    seating: 5,
    fuelType: "Hybrid",
    reliability: 4.7,
    monthlyPayment: 535
  },
  {
    id: "rav4-le",
    image: rav4Image,
    model: "RAV4",
    trim: "LE",
    year: 2024,
    price: 30500,
    matchPercentage: 89,
    category: "SUV",
    mpg: "27/35",
    seating: 5,
    fuelType: "Gas",
    reliability: 4.7,
    monthlyPayment: 455
  },
  {
    id: "rav4-prime",
    image: rav4Image,
    model: "RAV4 Prime",
    trim: "SE",
    year: 2024,
    price: 44500,
    matchPercentage: 85,
    category: "SUV",
    mpg: "94 MPGe",
    seating: 5,
    fuelType: "Plug-in Hybrid",
    reliability: 4.6,
    monthlyPayment: 665
  },
  {
    id: "corolla-se",
    image: corollaImage,
    model: "Corolla",
    trim: "SE",
    year: 2024,
    price: 24500,
    matchPercentage: 89,
    category: "Sedan",
    mpg: "31/40",
    seating: 5,
    fuelType: "Gas",
    reliability: 4.9,
    monthlyPayment: 365
  },
  {
    id: "corolla-le",
    image: corollaImage,
    model: "Corolla",
    trim: "LE",
    year: 2024,
    price: 22300,
    matchPercentage: 92,
    category: "Sedan",
    mpg: "30/38",
    seating: 5,
    fuelType: "Gas",
    reliability: 4.9,
    monthlyPayment: 332
  },
  {
    id: "corolla-hybrid",
    image: corollaImage,
    model: "Corolla",
    trim: "Hybrid LE",
    year: 2024,
    price: 25900,
    matchPercentage: 90,
    category: "Sedan",
    mpg: "53/52",
    seating: 5,
    fuelType: "Hybrid",
    reliability: 4.9,
    monthlyPayment: 386
  },
  {
    id: "highlander-limited",
    image: highlanderImage,
    model: "Highlander",
    trim: "Limited",
    year: 2024,
    price: 48500,
    matchPercentage: 76,
    category: "SUV",
    mpg: "21/29",
    seating: 8,
    fuelType: "Gas",
    reliability: 4.6,
    monthlyPayment: 725
  },
  {
    id: "highlander-le",
    image: highlanderImage,
    model: "Highlander",
    trim: "LE",
    year: 2024,
    price: 40500,
    matchPercentage: 82,
    category: "SUV",
    mpg: "21/29",
    seating: 8,
    fuelType: "Gas",
    reliability: 4.6,
    monthlyPayment: 605
  },
  {
    id: "highlander-hybrid",
    image: highlanderImage,
    model: "Highlander",
    trim: "Hybrid XLE",
    year: 2024,
    price: 47500,
    matchPercentage: 78,
    category: "SUV",
    mpg: "36/35",
    seating: 8,
    fuelType: "Hybrid",
    reliability: 4.7,
    monthlyPayment: 710
  },
  {
    id: "tacoma-trd",
    image: tacomaImage,
    model: "Tacoma",
    trim: "TRD Sport",
    year: 2024,
    price: 42000,
    matchPercentage: 82,
    category: "Truck",
    mpg: "18/22",
    seating: 5,
    fuelType: "Gas",
    reliability: 4.5,
    monthlyPayment: 628
  },
  {
    id: "tacoma-sr5",
    image: tacomaImage,
    model: "Tacoma",
    trim: "SR5",
    year: 2024,
    price: 36500,
    matchPercentage: 85,
    category: "Truck",
    mpg: "19/24",
    seating: 5,
    fuelType: "Gas",
    reliability: 4.5,
    monthlyPayment: 545
  },
  {
    id: "tacoma-trd-pro",
    image: tacomaImage,
    model: "Tacoma",
    trim: "TRD Pro",
    year: 2024,
    price: 52500,
    matchPercentage: 72,
    category: "Truck",
    mpg: "17/20",
    seating: 5,
    fuelType: "Gas",
    reliability: 4.4,
    monthlyPayment: 785
  },
  {
    id: "4runner-sr5",
    image: fourRunnerImage,
    model: "4Runner",
    trim: "SR5",
    year: 2024,
    price: 45000,
    matchPercentage: 79,
    category: "SUV",
    mpg: "16/19",
    seating: 7,
    fuelType: "Gas",
    reliability: 4.7,
    monthlyPayment: 673
  },
  {
    id: "4runner-trd-pro",
    image: fourRunnerImage,
    model: "4Runner",
    trim: "TRD Pro",
    year: 2024,
    price: 55000,
    matchPercentage: 71,
    category: "SUV",
    mpg: "16/19",
    seating: 7,
    fuelType: "Gas",
    reliability: 4.6,
    monthlyPayment: 822
  },
  {
    id: "4runner-limited",
    image: fourRunnerImage,
    model: "4Runner",
    trim: "Limited",
    year: 2024,
    price: 49500,
    matchPercentage: 75,
    category: "SUV",
    mpg: "16/19",
    seating: 7,
    fuelType: "Gas",
    reliability: 4.7,
    monthlyPayment: 740
  }
];

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("match");
  const [income, setIncome] = useState(75000);
  const [creditScore, setCreditScore] = useState(720);

  const { data: vehiclesData, isLoading } = useQuery({
    queryKey: ["/api/vehicles/match", income, creditScore],
    queryFn: async () => {
      const response = await fetch("/api/vehicles/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          annualIncome: income,
          creditScore: creditScore,
          employmentSubsidy: 0,
          budgetMin: 20000,
          budgetMax: 80000,
          leaseTerm: 48,
          limit: 20
        })
      });
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      return response.json();
    }
  });

  const vehicles = vehiclesData || allVehicles;

  const filteredVehicles = vehicles
    .filter((vehicle: any) => {
      const matchesSearch = vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.trim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.vehicle?.trim?.toLowerCase().includes(searchTerm.toLowerCase());
      const category = vehicle.category || vehicle.vehicle?.category;
      const matchesCategory = categoryFilter === "all" || category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "match") return (b.matchPercentage || 0) - (a.matchPercentage || 0);
      const priceA = a.price || a.vehicle?.msrp || 0;
      const priceB = b.price || b.vehicle?.msrp || 0;
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="w-full py-12 bg-sidebar border-b">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold font-[Lexend] mb-4">
            Browse All Toyota Vehicles
          </h1>
          <p className="text-lg text-muted-foreground">
            {isLoading ? "Loading vehicles..." : `Explore our complete lineup of ${vehicles.length} vehicles, personalized to your financial profile`}
          </p>
        </div>
      </div>

      <div className="w-full py-8 border-b bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by model or trim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
                data-testid="input-search"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-12" data-testid="select-category">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Sedan">Sedans</SelectItem>
                <SelectItem value="SUV">SUVs</SelectItem>
                <SelectItem value="Truck">Trucks</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing <span className="font-bold text-foreground">{filteredVehicles.length}</span> vehicles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Loading vehicles...
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-xl text-muted-foreground">No vehicles found matching your criteria</p>
                <Button 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredVehicles.map((vehicle: any) => {
                const vehicleData = vehicle.vehicle || vehicle;
                return (
                  <VehicleCard
                    key={vehicleData.id || vehicle.id}
                    id={vehicleData.id || vehicle.id}
                    image={vehicleData.model === "Camry" ? camryImage :
                          vehicleData.model === "RAV4" ? rav4Image :
                          vehicleData.model === "Corolla" ? corollaImage :
                          vehicleData.model === "Highlander" ? highlanderImage :
                          vehicleData.model === "Tacoma" ? tacomaImage :
                          vehicleData.model === "4Runner" ? fourRunnerImage : camryImage}
                    model={vehicleData.model}
                    trim={vehicleData.trim}
                    year={vehicleData.year}
                    price={vehicleData.msrp || vehicleData.price}
                    matchPercentage={vehicle.matchPercentage}
                    category={vehicleData.category}
                    mpg={vehicleData.mpg}
                    seating={vehicleData.seating}
                    fuelType={vehicleData.fuelType}
                    reliability={vehicleData.reliability}
                    monthlyPayment={vehicle.monthlyPayment || vehicleData.monthlyPayment}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
