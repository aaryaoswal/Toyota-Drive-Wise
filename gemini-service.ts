/**
 * Gemini AI service for personalized vehicle recommendations
 */

import { GoogleGenAI } from "@google/genai";
import type { VehicleData } from "./vehicle-data";
import type { VehicleMatch } from "./storage";

let ai: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

export interface RecommendationRequest {
  vehicleMatch: VehicleMatch;
  userProfile: {
    annualIncome: number;
    creditScore: number;
    leaseTerm: number;
    budgetRange: { min: number; max: number };
  };
}

export interface AIRecommendation {
  summary: string;
  keyPoints: string[];
  financialInsight: string;
  reliabilityInsight: string;
  valueInsight: string;
}

/**
 * Generate AI-powered recommendation for a vehicle match
 */
export async function generateVehicleRecommendation(
  request: RecommendationRequest
): Promise<AIRecommendation> {
  const { vehicleMatch, userProfile } = request;
  const vehicle = vehicleMatch.vehicle;

  const prompt = `You are a financial advisor specializing in automotive purchasing decisions. Analyze this vehicle match for a customer and provide personalized insights.

Vehicle: ${vehicle.year} ${vehicle.model} ${vehicle.trim}
Price: $${vehicle.msrp.toLocaleString()}
Category: ${vehicle.category}
Fuel Type: ${vehicle.fuelType}
MPG: ${vehicle.mpg} (Combined: ${vehicle.mpgCombined})
Reliability: ${vehicle.reliability}/5.0
Seating: ${vehicle.seating}

Customer Profile:
- Annual Income: $${userProfile.annualIncome.toLocaleString()}
- Credit Score: ${userProfile.creditScore}
- Desired Lease Term: ${userProfile.leaseTerm} months
- Budget Range: $${userProfile.budgetRange.min.toLocaleString()} - $${userProfile.budgetRange.max.toLocaleString()}

Financial Analysis:
- Match Percentage: ${vehicleMatch.matchPercentage}%
- Monthly Payment: $${vehicleMatch.monthlyPayment}
- Salary Fit Score: ${vehicleMatch.salaryFit}%
- Affordability Score: ${vehicleMatch.affordabilityScore}/100
- Total Monthly Cost: $${vehicleMatch.totalMonthlyCost.total}

Please provide:
1. A brief summary (2-3 sentences) explaining why this vehicle is a good match
2. Three key points about this recommendation (focus on financial fit, reliability, and value)
3. A financial insight (1 sentence about affordability and budget fit)
4. A reliability insight (1 sentence about the vehicle's dependability and Toyota's reputation)
5. A value insight (1 sentence about long-term cost and resale value)

Format your response as JSON with this structure:
{
  "summary": "...",
  "keyPoints": ["point1", "point2", "point3"],
  "financialInsight": "...",
  "reliabilityInsight": "...",
  "valueInsight": "..."
}`;

  try {
    const client = getGeminiClient();
    if (!client) {
      console.warn("GEMINI_API_KEY not set, using fallback recommendation");
      return generateFallbackRecommendation(vehicleMatch, userProfile);
    }

    const result = await client.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    const text = result.text || '';
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as AIRecommendation;
    }
    
    // Fallback if JSON parsing fails
    return generateFallbackRecommendation(vehicleMatch, userProfile);
  } catch (error) {
    console.error("Gemini API error:", error);
    return generateFallbackRecommendation(vehicleMatch, userProfile);
  }
}

/**
 * Fallback recommendation generation (rule-based)
 */
function generateFallbackRecommendation(
  vehicleMatch: VehicleMatch,
  userProfile: RecommendationRequest["userProfile"]
): AIRecommendation {
  const vehicle = vehicleMatch.vehicle;
  const monthlyIncome = userProfile.annualIncome / 12;
  const paymentRatio = (vehicleMatch.monthlyPayment / monthlyIncome) * 100;

  const summary = `The ${vehicle.year} ${vehicle.model} ${vehicle.trim} is an excellent match for your financial profile, with a ${vehicleMatch.matchPercentage}% compatibility score. This ${vehicle.category.toLowerCase()} fits comfortably within your budget while providing ${vehicle.fuelType.toLowerCase()} efficiency and Toyota's renowned reliability.`;

  const keyPoints = [
    `Monthly payment of $${vehicleMatch.monthlyPayment} represents ${paymentRatio.toFixed(1)}% of your income, leaving comfortable room for other expenses and savings`,
    `Exceptional reliability rating of ${vehicle.reliability}/5.0 minimizes unexpected maintenance costs over your ${userProfile.leaseTerm}-month lease term`,
    `Strong resale value with projected 63% retention after 3 years, protecting your investment for the long term`
  ];

  const financialInsight = vehicleMatch.affordabilityScore >= 80 
    ? `This vehicle is well within your financial comfort zone, with total monthly costs of $${vehicleMatch.totalMonthlyCost.total} leaving ample budget for savings and other priorities.`
    : vehicleMatch.affordabilityScore >= 60
    ? `This vehicle represents a significant but manageable monthly commitment at $${vehicleMatch.totalMonthlyCost.total}, fitting appropriately within your income range.`
    : `While this vehicle is at the upper end of your budget, the monthly cost of $${vehicleMatch.totalMonthlyCost.total} is still within acceptable financing parameters.`;

  const reliabilityInsight = `With an industry-leading reliability score of ${vehicle.reliability}/5.0, this Toyota model demonstrates exceptional dependability that will minimize repair costs and maximize peace of mind throughout your ownership.`;

  const valueInsight = `${vehicle.fuelType === "Hybrid" ? "The hybrid powertrain provides excellent fuel economy" : "This model maintains"} strong resale value typical of Toyota vehicles, with minimal depreciation protecting your investment over the ${userProfile.leaseTerm / 12}-year term.`;

  return {
    summary,
    keyPoints,
    financialInsight,
    reliabilityInsight,
    valueInsight
  };
}

/**
 * Generate comparison insights for multiple vehicles
 */
export async function generateComparisonInsights(
  vehicles: VehicleMatch[],
  userProfile: RecommendationRequest["userProfile"]
): Promise<string> {
  if (vehicles.length < 2) {
    return "Add more vehicles to compare.";
  }

  const vehicleDescriptions = vehicles.map((v, i) => 
    `${i + 1}. ${v.vehicle.model} ${v.vehicle.trim} - $${v.vehicle.msrp.toLocaleString()}, ${v.matchPercentage}% match, $${v.monthlyPayment}/mo`
  ).join("\n");

  const prompt = `Compare these ${vehicles.length} Toyota vehicles for a customer and provide a brief recommendation (2-3 sentences) on which one offers the best value for their specific situation.

Customer: $${userProfile.annualIncome.toLocaleString()} annual income, ${userProfile.creditScore} credit score

Vehicles:
${vehicleDescriptions}

Provide a concise comparison highlighting the best choice and why.`;

  try {
    const client = getGeminiClient();
    if (!client) {
      const topMatch = vehicles[0];
      return `The ${topMatch.vehicle.model} ${topMatch.vehicle.trim} offers the best overall value with a ${topMatch.matchPercentage}% match score and monthly payment of $${topMatch.monthlyPayment}, providing an optimal balance of affordability, reliability, and features for your budget.`;
    }

    const result = await client.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    return result.text || '';
  } catch (error) {
    console.error("Gemini API error:", error);
    const topMatch = vehicles[0];
    return `The ${topMatch.vehicle.model} ${topMatch.vehicle.trim} offers the best overall value with a ${topMatch.matchPercentage}% match score and monthly payment of $${topMatch.monthlyPayment}, providing an optimal balance of affordability, reliability, and features for your budget.`;
  }
}
