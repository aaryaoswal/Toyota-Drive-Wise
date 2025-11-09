import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Shield } from "lucide-react";
import heroImage from "@assets/IMG_4584_1762680705425.jpeg";

export default function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '85vh' }}>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-[Lexend] mb-6 leading-tight">
            Find Your Perfect Toyota Within Your Budget
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
            AI-powered financial planning meets transparent vehicle pricing. 
            Discover the Toyota that fits your lifestyle and finances with 
            real-time affordability insights and personalized recommendations.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Button 
              size="lg" 
              className="text-base px-8 py-6 h-auto"
              data-testid="button-calculate-budget"
              onClick={() => {
                const element = document.getElementById('quick-calculator');
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              Calculate Your Budget
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-8 py-6 h-auto bg-background/10 backdrop-blur-sm border-white/30 text-white hover:bg-background/20"
              data-testid="button-browse-vehicles"
              onClick={() => window.location.href = '/vehicles'}
            >
              Browse Vehicles
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Real-time pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span>AI-powered matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>Transparent costs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
