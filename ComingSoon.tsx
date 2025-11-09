import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Sparkles, ArrowLeft } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <Card className="max-w-2xl w-full p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold font-[Lexend] mb-4">
            {title}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            {description}
          </p>
          
          <p className="text-sm text-muted-foreground mb-8">
            Have questions? Contact us at{" "}
            <a 
              href="mailto:support@drivewise.com" 
              className="text-primary hover:underline"
            >
              support@drivewise.com
            </a>
          </p>
          
          <Button size="lg" asChild data-testid="button-back-home">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
