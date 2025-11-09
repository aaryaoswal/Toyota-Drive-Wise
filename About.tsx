import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Target, Users, TrendingUp, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        <section className="w-full py-24 bg-gradient-to-br from-primary/5 via-background to-accent/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold font-[Lexend] mb-6" data-testid="heading-about">
              About DriveWise
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering smarter vehicle financing decisions through AI-powered insights and transparent pricing
            </p>
          </div>
        </section>
        
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-[Lexend]">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To democratize access to sophisticated financial analysis tools, helping every buyer make informed decisions about vehicle financing based on their unique financial situation and long-term goals.
              </p>
            </Card>
            
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-[Lexend]">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A world where every vehicle purchase decision is backed by transparent data, accurate depreciation forecasting, and personalized financial analysis that accounts for individual circumstances.
              </p>
            </Card>
          </div>
          
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-[Lexend] text-center mb-12">
              What Sets Us Apart
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/50 mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Advanced machine learning models analyze historical data to provide accurate depreciation forecasts and personalized vehicle recommendations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/50 mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Transparent Pricing</h3>
                <p className="text-muted-foreground">
                  Complete cost breakdown including insurance, fuel, maintenance, and taxes—no hidden fees or surprise costs.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/50 mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Toyota Partnership</h3>
                <p className="text-muted-foreground">
                  Backed by Toyota Financial Services, combining decades of automotive expertise with cutting-edge fintech innovation.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center bg-accent/20 rounded-2xl p-12">
            <h2 className="text-3xl font-bold font-[Lexend] mb-4">
              Ready to Find Your Perfect Vehicle?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start with our Quick Check calculator to discover which Toyota vehicles fit your budget and lifestyle.
            </p>
            <Button size="lg" asChild data-testid="button-get-started">
              <Link href="/">
                Get Started
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
