import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Car, Calculator, BarChart3, User, Settings, UserCircle, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import logoUrl from "@assets/Auto Dealership Logo Design_1762680404610.png";

interface CurrentUser {
  id: string;
  username: string;
  email: string;
}

export default function Navigation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user } = useQuery<CurrentUser>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 bg-sidebar">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover-elevate px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <img src={logoUrl} alt="DriveWise Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold font-[Lexend]">DriveWise</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors" data-testid="link-home">
              Home
            </Link>
            <Link href="/calculator" className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors" data-testid="link-calculator">
              <Calculator className="w-4 h-4" />
              Calculator
            </Link>
            <Link href="/vehicles" className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors" data-testid="link-vehicles">
              <Car className="w-4 h-4" />
              Vehicles
            </Link>
            <Link href="/insights" className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors" data-testid="link-insights">
              <BarChart3 className="w-4 h-4" />
              Insights
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-account">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">{user.username}</span>
                      <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/profile-settings")} data-testid="menu-item-profile-settings">
                    <UserCircle className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/account-settings")} data-testid="menu-item-account-settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="menu-item-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setLocation("/login")} data-testid="button-login">
                <User className="w-5 h-5" />
              </Button>
            )}

            <Button 
              className="hidden md:inline-flex" 
              onClick={() => setLocation("/apply-financing")} 
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
