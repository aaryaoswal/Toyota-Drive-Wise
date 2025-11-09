/**
 * Financial calculation engine for DriveWise
 * Handles net pay estimation, affordability scoring, APR calculations
 */

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

// 2024 Federal tax brackets (single filer)
const FEDERAL_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

const STANDARD_DEDUCTION = 14600; // 2024 single filer
const FICA_RATE = 0.0765; // Social Security + Medicare

/**
 * Calculate federal income tax using progressive brackets
 */
function calculateFederalTax(taxableIncome: number): number {
  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of FEDERAL_TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const bracketIncome = Math.min(
      remainingIncome,
      bracket.max - bracket.min
    );
    tax += bracketIncome * bracket.rate;
    remainingIncome -= bracketIncome;
  }

  return tax;
}

/**
 * Estimate annual net pay after taxes and deductions
 */
export function calculateNetPay(annualIncome: number, employmentSubsidy: number = 0): {
  grossIncome: number;
  federalTax: number;
  ficaTax: number;
  netIncome: number;
  monthlyNet: number;
  volatilityFactor: number;
} {
  const taxableIncome = Math.max(0, annualIncome - STANDARD_DEDUCTION);
  const federalTax = calculateFederalTax(taxableIncome);
  const ficaTax = annualIncome * FICA_RATE;
  
  // Add employment subsidy (e.g., transportation allowance)
  const netIncome = annualIncome - federalTax - ficaTax + employmentSubsidy;
  const monthlyNet = netIncome / 12;

  // Volatility factor: higher for lower incomes (less financial cushion)
  const volatilityFactor = Math.max(0.05, Math.min(0.25, 50000 / annualIncome));

  return {
    grossIncome: annualIncome,
    federalTax,
    ficaTax,
    netIncome,
    monthlyNet,
    volatilityFactor
  };
}

/**
 * Calculate maximum affordable car price based on annual income and credit score
 * Formula: Affordable car price = annual income * f(credit score)
 * 
 * Credit Score Ranges:
 * - 750+ (Excellent): 0.6-0.8 → use 0.7
 * - 700-749 (Good): 0.4-0.6 → use 0.5
 * - 650-699 (Fair): 0.3-0.4 → use 0.35
 * - 600-649 (Poor): 0.2-0.3 → use 0.25
 * - <600 (Bad): 0.1-0.2 → use 0.15
 */
export function calculateAffordableCarPrice(annualIncome: number, creditScore: number): number {
  let scalingFactor: number;
  
  if (creditScore >= 750) {
    scalingFactor = 0.7;  // Excellent - low interest, can afford higher ratio
  } else if (creditScore >= 700) {
    scalingFactor = 0.5;  // Good - favorable loans, moderate risk
  } else if (creditScore >= 650) {
    scalingFactor = 0.35; // Fair - higher interest, more risk
  } else if (creditScore >= 600) {
    scalingFactor = 0.25; // Poor - subprime loan territory
  } else {
    scalingFactor = 0.15; // Bad - only buy if you really need it
  }
  
  return annualIncome * scalingFactor;
}

/**
 * Calculate APR based on credit score
 * Uses typical automotive lending rates
 */
export function calculateAPR(creditScore: number): number {
  if (creditScore >= 720) return 4.5;   // Excellent
  if (creditScore >= 690) return 6.2;   // Good
  if (creditScore >= 630) return 8.9;   // Fair
  if (creditScore >= 580) return 12.5;  // Poor
  return 15.9;  // Very Poor
}

/**
 * Calculate monthly payment for a loan
 */
export function calculateMonthlyPayment(
  principal: number,
  apr: number,
  termMonths: number
): number {
  const monthlyRate = apr / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  
  const payment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  return Math.round(payment * 100) / 100;
}

/**
 * Estimate insurance cost based on vehicle price and driver profile
 */
export function estimateInsurance(
  vehiclePrice: number,
  creditScore: number,
  age: number = 35
): number {
  // Base rate: ~$145/month average
  let monthlyRate = 145;
  
  // Vehicle price adjustment (higher value = higher premium)
  const priceMultiplier = 1 + ((vehiclePrice - 30000) / 100000) * 0.3;
  monthlyRate *= Math.max(0.7, Math.min(1.5, priceMultiplier));
  
  // Credit score adjustment (better credit = lower rate)
  if (creditScore >= 720) monthlyRate *= 0.85;
  else if (creditScore >= 650) monthlyRate *= 1.0;
  else monthlyRate *= 1.25;
  
  return Math.round(monthlyRate);
}

/**
 * Estimate fuel cost based on MPG and annual mileage
 */
export function estimateFuelCost(
  mpgCombined: number,
  annualMileage: number = 12000,
  gasPrice: number = 3.50
): number {
  const gallonsPerYear = annualMileage / mpgCombined;
  const annualCost = gallonsPerYear * gasPrice;
  return Math.round((annualCost / 12) * 100) / 100;
}

/**
 * Estimate maintenance cost based on vehicle age and reliability
 */
export function estimateMaintenanceCost(
  vehiclePrice: number,
  reliability: number
): number {
  // Base monthly maintenance: ~$75
  let monthly = 75;
  
  // Higher-end vehicles typically have higher maintenance
  if (vehiclePrice > 45000) monthly = 100;
  else if (vehiclePrice > 35000) monthly = 85;
  
  // Reliability adjustment (higher reliability = lower maintenance)
  const reliabilityFactor = 1 - ((reliability - 4.0) * 0.15);
  monthly *= Math.max(0.7, Math.min(1.3, reliabilityFactor));
  
  return Math.round(monthly);
}

/**
 * Calculate total monthly car cost (all-in)
 */
export interface TotalMonthlyCost {
  payment: number;
  insurance: number;
  fuel: number;
  maintenance: number;
  taxesAndFees: number;
  total: number;
}

export function calculateTotalMonthlyCost(
  vehiclePrice: number,
  downPayment: number,
  apr: number,
  termMonths: number,
  creditScore: number,
  mpgCombined: number,
  reliability: number,
  annualMileage: number = 12000
): TotalMonthlyCost {
  const principal = vehiclePrice - downPayment;
  const payment = calculateMonthlyPayment(principal, apr, termMonths);
  const insurance = estimateInsurance(vehiclePrice, creditScore);
  const fuel = estimateFuelCost(mpgCombined, annualMileage);
  const maintenance = estimateMaintenanceCost(vehiclePrice, reliability);
  
  // Taxes and fees (registration, etc.) - roughly $65/month average
  const taxesAndFees = Math.round(vehiclePrice * 0.0008 + 50);
  
  const total = payment + insurance + fuel + maintenance + taxesAndFees;
  
  return {
    payment,
    insurance,
    fuel,
    maintenance,
    taxesAndFees,
    total: Math.round(total)
  };
}

/**
 * Calculate affordability score (0-100)
 * Based on income-to-cost ratio and financial profile
 */
export function calculateAffordabilityScore(
  monthlyIncome: number,
  totalMonthlyCost: number,
  creditScore: number,
  volatilityFactor: number
): number {
  // Debt-to-income ratio (aim for < 20% for vehicles)
  const dti = totalMonthlyCost / monthlyIncome;
  
  // Base score from DTI (inverted - lower DTI = higher score)
  let score = 100 * (1 - Math.min(1, dti / 0.3));
  
  // Credit score bonus/penalty
  const creditAdjustment = (creditScore - 650) / 10;
  score += creditAdjustment;
  
  // Volatility penalty (higher volatility = lower score)
  score -= volatilityFactor * 100;
  
  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate vehicle match percentage for user
 */
export function calculateMatchPercentage(
  vehiclePrice: number,
  reliability: number,
  mpgCombined: number,
  monthlyIncome: number,
  budgetMin: number,
  budgetMax: number,
  leaseTerm: number,
  creditScore: number
): number {
  let matchScore = 0;
  
  // Price fit (40% weight) - how well does it fit the budget range?
  const priceFit = vehiclePrice >= budgetMin && vehiclePrice <= budgetMax ? 40 :
                   vehiclePrice < budgetMin ? 40 * (vehiclePrice / budgetMin) :
                   40 * (budgetMax / vehiclePrice);
  matchScore += priceFit;
  
  // Reliability (30% weight) - prefer high reliability
  const reliabilityScore = ((reliability - 4.0) / 1.0) * 30;
  matchScore += Math.max(0, Math.min(30, reliabilityScore));
  
  // Affordability (20% weight) - can they actually afford monthly payment?
  const apr = calculateAPR(creditScore);
  const payment = calculateMonthlyPayment(vehiclePrice * 0.9, apr, leaseTerm);
  const affordabilityScore = payment < (monthlyIncome * 0.15) ? 20 :
                             payment < (monthlyIncome * 0.20) ? 15 :
                             payment < (monthlyIncome * 0.25) ? 10 : 5;
  matchScore += affordabilityScore;
  
  // Efficiency (10% weight) - fuel economy matters
  const efficiencyScore = Math.min(10, (mpgCombined / 30) * 10);
  matchScore += efficiencyScore;
  
  return Math.round(Math.max(0, Math.min(100, matchScore)));
}
