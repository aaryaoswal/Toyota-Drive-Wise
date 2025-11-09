import VehicleCard from "./VehicleCard";
import camryImage from "@assets/generated_images/Toyota_Camry_product_shot_1efcce4c.png";
import rav4Image from "@assets/generated_images/Toyota_RAV4_product_shot_76854cb0.png";
import corollaImage from "@assets/generated_images/Toyota_Corolla_product_shot_0e79ae5b.png";
import highlanderImage from "@assets/generated_images/Toyota_Highlander_product_shot_2b3bfc13.png";
import tacomaImage from "@assets/generated_images/Toyota_Tacoma_product_shot_03ce728a.png";
import fourRunnerImage from "@assets/generated_images/Toyota_4Runner_product_shot_af5c0b5b.png";

// TODO: remove mock functionality
const vehicles = [
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
  }
];

export default function FeaturedVehicles() {
  return (
    <div className="w-full py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-[Lexend] mb-4">
            Featured Toyota Models
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular vehicles, personalized to match your financial profile
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} {...vehicle} />
          ))}
        </div>
      </div>
    </div>
  );
}
