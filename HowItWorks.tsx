import { Card } from "@/components/ui/card";
import { DollarSign, Car, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: DollarSign,
    title: "Share Your Finances",
    description: "Tell us about your income, credit score, and budget preferences. All data stays secure and private.",
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    icon: TrendingUp,
    title: "Get Personalized Insights",
    description: "Our AI analyzes affordability, depreciation trends, and total cost of ownership tailored to your situation.",
    color: "bg-purple-500/10 text-purple-600"
  },
  {
    icon: Car,
    title: "Find Your Perfect Match",
    description: "Browse Toyota vehicles ranked by compatibility with your budget, lifestyle, and financial goals.",
    color: "bg-green-500/10 text-green-600"
  }
];

export default function HowItWorks() {
  return (
    <div className="w-full py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-[Lexend] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to smarter vehicle financing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="p-8 relative hover-elevate">
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <div className={`w-16 h-16 rounded-lg ${step.color} flex items-center justify-center mb-6`}>
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-[Lexend] mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
