import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Database, RefreshCw, FileText } from "lucide-react";

export default function TrustTransparency() {
  return (
    <div className="w-full py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-[Lexend] mb-4">
            Trust & Transparency
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our commitment to accurate, honest financial guidance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-bold mb-2">Licensed Data Sources</h3>
            <p className="text-sm text-muted-foreground">
              All pricing and residual value data from verified automotive data providers
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="font-bold mb-2">Daily Updates</h3>
            <p className="text-sm text-muted-foreground">
              Market data refreshed every 24 hours to ensure accuracy
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="font-bold mb-2">Clear Methodology</h3>
            <p className="text-sm text-muted-foreground">
              Transparent calculation methods with detailed explanations
            </p>
          </Card>
        </div>

        <Card className="p-8">
          <h3 className="text-2xl font-bold font-[Lexend] mb-6">
            Methodology & Data Sources
          </h3>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="pricing">
              <AccordionTrigger className="text-left" data-testid="accordion-pricing">
                <div>
                  <div className="font-semibold">Vehicle Pricing Data</div>
                  <div className="text-sm text-muted-foreground">How we determine MSRP and market values</div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-accent/30 rounded-lg space-y-3 text-sm">
                  <p><span className="font-semibold">Primary Source:</span> Toyota Motor Corporation official MSRP data</p>
                  <p><span className="font-semibold">Secondary Sources:</span> Kelley Blue Book, Edmunds, NADA Guides</p>
                  <p><span className="font-semibold">Update Frequency:</span> Daily for market values, immediate for MSRP changes</p>
                  <p><span className="font-semibold">Methodology:</span> Aggregated median values across geographic regions with standard deviation ranges</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="depreciation">
              <AccordionTrigger className="text-left" data-testid="accordion-depreciation">
                <div>
                  <div className="font-semibold">Depreciation Forecasting</div>
                  <div className="text-sm text-muted-foreground">Residual value calculations and confidence intervals</div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-accent/30 rounded-lg space-y-3 text-sm">
                  <p><span className="font-semibold">Model:</span> Hedonic pricing combined with gradient boosting (XGBoost) on historical cohort data (2015-2024)</p>
                  <p><span className="font-semibold">Factors:</span> Trim level, mileage, condition, region, macro conditions (interest rates, fuel prices)</p>
                  <p><span className="font-semibold">Validation:</span> Backtested on Toyota vehicles with R² &gt; 0.87 accuracy</p>
                  <p><span className="font-semibold">Confidence Intervals:</span> ±8% at 3 years, ±12% at 7 years based on historical variance</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="affordability">
              <AccordionTrigger className="text-left" data-testid="accordion-affordability">
                <div>
                  <div className="font-semibold">Affordability Calculations</div>
                  <div className="text-sm text-muted-foreground">How we compute your personalized score</div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-accent/30 rounded-lg space-y-3 text-sm">
                  <p><span className="font-semibold">Net Pay Estimation:</span> Federal and state tax tables (2024 IRS data), standard deductions, FICA</p>
                  <p><span className="font-semibold">Total Monthly Cost:</span> Payment + insurance (ZIP-based averages) + fuel (EPA MPG × regional gas prices) + maintenance (manufacturer schedules) + taxes/fees</p>
                  <p><span className="font-semibold">Score Formula:</span> Weighted composite of debt-to-income ratio, credit-based APR, and total cost cap compliance</p>
                  <p><span className="font-semibold">Guardrails:</span> Recommends vehicles only when total monthly cost &lt; 20% of net income</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="compliance">
              <AccordionTrigger className="text-left" data-testid="accordion-compliance">
                <div>
                  <div className="font-semibold">Compliance & Privacy</div>
                  <div className="text-sm text-muted-foreground">Data handling and legal disclosures</div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-accent/30 rounded-lg space-y-3 text-sm">
                  <p><span className="font-semibold">Data Privacy:</span> Financial information encrypted at rest and in transit. Never shared with third parties.</p>
                  <p><span className="font-semibold">Estimates Disclaimer:</span> All projections are estimates, not guarantees. Actual values may vary based on market conditions.</p>
                  <p><span className="font-semibold">No Scraping:</span> Reviews sourced via authorized CarGurus API access with proper attribution.</p>
                  <p><span className="font-semibold">Licensing:</span> Automotive data used under commercial licenses from J.D. Power, Black Book, and ALG.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
