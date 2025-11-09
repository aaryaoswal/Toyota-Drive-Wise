import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import QuickCalculator from "@/components/QuickCalculator";
import HowItWorks from "@/components/HowItWorks";
import FeaturedVehicles from "@/components/FeaturedVehicles";
import AffordabilityDashboard from "@/components/AffordabilityDashboard";
import DepreciationChart from "@/components/DepreciationChart";
import AIRecommendation from "@/components/AIRecommendation";
import ReviewsSection from "@/components/ReviewsSection";
import TrustTransparency from "@/components/TrustTransparency";
import Footer from "@/components/Footer";
import type { AffordabilityResponse } from "@shared/schema";

export default function Home() {
  const [affordabilityData, setAffordabilityData] = useState<AffordabilityResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <QuickCalculator 
        onAffordabilityCalculated={setAffordabilityData}
        onCalculating={setIsCalculating}
      />
      <HowItWorks />
      <FeaturedVehicles />
      <AffordabilityDashboard 
        data={affordabilityData}
        isLoading={isCalculating}
      />
      <DepreciationChart />
      <AIRecommendation />
      <ReviewsSection />
      <TrustTransparency />
      <Footer />
    </div>
  );
}
