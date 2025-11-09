import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Gauge, Fuel, TrendingUp, Heart } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";

interface VehicleCardProps {
  id: string;
  image: string;
  model: string;
  trim: string;
  year: number;
  price: number;
  matchPercentage?: number;
  category: string;
  mpg: string;
  seating: number;
  fuelType: string;
  reliability: number;
  monthlyPayment?: number;
}

export default function VehicleCard({
  id,
  image,
  model,
  trim,
  year,
  price,
  matchPercentage,
  category,
  mpg,
  seating,
  fuelType,
  reliability,
  monthlyPayment
}: VehicleCardProps) {
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);

  // Check if user is authenticated
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });
  
  // Check if vehicle is favorited (only if user is authenticated)
  const { data: favoriteCheck, isLoading: checkingFavorite } = useQuery({
    queryKey: ["/api/favorites/check", id],
    enabled: !!id && !!user,
    retry: false,
  });

  useEffect(() => {
    if (favoriteCheck) {
      setIsFavorited(favoriteCheck.isFavorite);
    }
  }, [favoriteCheck]);

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        return apiRequest("DELETE", `/api/favorites/${id}`, {});
      } else {
        return apiRequest("POST", "/api/favorites", { vehicleId: id });
      }
    },
    onSuccess: () => {
      setIsFavorited(!isFavorited);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/check", id] });
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited ? "Vehicle removed from your favorites" : "Vehicle added to your favorites",
      });
    },
    onError: (error: any) => {
      if (error?.error === "Authentication required") {
        toast({
          title: "Login required",
          description: "Please log in to save favorites",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update favorites",
          variant: "destructive",
        });
      }
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favoriteMutation.mutate();
  };
  
  const handleCompareClick = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Vehicle comparison functionality will be available in the next update.",
    });
  };
  
  return (
    <Card className="overflow-hidden hover-elevate group relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {matchPercentage && (
          <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1" data-testid="badge-match">
            {matchPercentage}% Match
          </Badge>
        )}
      </div>
      
      <button
        onClick={handleFavoriteClick}
        disabled={favoriteMutation.isPending || checkingFavorite}
        className="absolute top-4 left-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        data-testid="button-favorite"
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`w-5 h-5 transition-all ${
            isFavorited 
              ? "fill-primary stroke-primary" 
              : "stroke-foreground hover:stroke-primary"
          }`}
        />
      </button>
      
      <div className="aspect-[4/3] bg-accent/20 overflow-hidden">
        <img 
          src={image} 
          alt={`${year} ${model} ${trim}`}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">{category}</p>
          <h3 className="text-2xl font-bold font-[Lexend]" data-testid="text-model">
            {year} {model}
          </h3>
          <p className="text-sm text-muted-foreground">{trim}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b">
          <div className="flex flex-col items-center text-center">
            <Users className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Seats</span>
            <span className="text-sm font-semibold">{seating}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Fuel className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">MPG</span>
            <span className="text-sm font-semibold">{mpg}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Gauge className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Fuel</span>
            <span className="text-sm font-semibold">{fuelType}</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">MSRP</span>
            <span className="text-2xl font-bold" data-testid="text-price">
              ${price.toLocaleString()}
            </span>
          </div>
          {monthlyPayment && (
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Est. Monthly</span>
              <span className="text-lg font-semibold text-primary" data-testid="text-monthly">
                ${monthlyPayment}/mo
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-muted-foreground">
              Reliability: <span className="font-semibold text-foreground">{reliability}/5.0</span>
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/vehicles/${id}`} className="flex-1">
            <Button className="w-full" data-testid="button-view-details">
              View Details
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={handleCompareClick}
            data-testid="button-compare"
          >
            Compare
          </Button>
        </div>
      </div>
    </Card>
  );
}
