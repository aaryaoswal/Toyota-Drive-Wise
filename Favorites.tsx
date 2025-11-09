import { useQuery } from "@tanstack/react-query";
import VehicleCard from "@/components/VehicleCard";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Vehicle {
  id: string;
  model: string;
  trim: string;
  year: number;
  price: number;
  category: string;
  mpg: string;
  seating: number;
  fuelType: string;
  reliability: number;
  image: string;
}

export default function Favorites() {
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const { data: favorites, isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user,
    retry: false,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Login to See Your Favorites</h2>
          <p className="text-muted-foreground mb-6">
            Save your favorite vehicles and access them anytime
          </p>
          <Link href="/login">
            <Button data-testid="button-login">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold font-[Lexend] mb-8">Favorite Vehicles</h1>
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Favorites Yet</h2>
          <p className="text-muted-foreground mb-6">
            Click the heart icon on vehicles to add them to your favorites
          </p>
          <Link href="/vehicles">
            <Button data-testid="button-browse-vehicles">Browse Vehicles</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-[Lexend] mb-2">Favorite Vehicles</h1>
        <p className="text-muted-foreground">
          {favorites.length} vehicle{favorites.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            id={vehicle.id}
            image={vehicle.image}
            model={vehicle.model}
            trim={vehicle.trim}
            year={vehicle.year}
            price={vehicle.price}
            category={vehicle.category}
            mpg={vehicle.mpg}
            seating={vehicle.seating}
            fuelType={vehicle.fuelType}
            reliability={vehicle.reliability}
          />
        ))}
      </div>
    </div>
  );
}
