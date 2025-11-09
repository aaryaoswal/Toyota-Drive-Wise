import { Link } from "wouter";
import { Car, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="w-full bg-sidebar border-t">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-[Lexend]">DriveWise</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering smarter vehicle financing decisions through AI-powered insights and transparent pricing.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-calculator">
                  Affordability Calculator
                </Link>
              </li>
              <li>
                <Link href="/vehicles" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-vehicles">
                  Browse Vehicles
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-insights">
                  Market Insights
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-methodology">
                  Our Methodology
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-terms">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest market insights and financing tips.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="h-10"
                data-testid="input-newsletter"
              />
              <Button data-testid="button-subscribe">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>123 Finance Ave, San Francisco, CA 94102</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>support@drivewise.com</span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 DriveWise. All rights reserved. Part of Toyota Financial Services.</p>
            <p className="mt-2">
              All financial projections are estimates. Actual values may vary based on market conditions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
