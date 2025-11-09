import { 
  type User, 
  type InsertUser, 
  type FinancialProfile, 
  type InsertFinancialProfile, 
  type UserProfile,
  type InsertUserProfile,
  type Favorite,
  type InsertFavorite,
  type BankAccount,
  type InsertBankAccount,
  type AffordabilityResponse 
} from "@shared/schema";
import { randomUUID } from "crypto";
import { TOYOTA_VEHICLES, type VehicleData } from "./vehicle-data";
import {
  calculateNetPay,
  calculateAPR,
  calculateTotalMonthlyCost,
  calculateAffordabilityScore,
  calculateMatchPercentage,
  calculateAffordableCarPrice,
  type TotalMonthlyCost
} from "./financial-engine";

export interface AffordabilityResult extends AffordabilityResponse {
  apr: number;
  canAfford: boolean;
  recommendation: string;
}

export interface VehicleMatch {
  vehicle: VehicleData;
  matchPercentage: number;
  monthlyPayment: number;
  totalMonthlyCost: TotalMonthlyCost;
  affordabilityScore: number;
  salaryFit: number;
  reliabilityScore: number;
  termMatch: number;
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Financial profile methods
  createFinancialProfile(userId: string, profile: InsertFinancialProfile): Promise<FinancialProfile>;
  getFinancialProfile(id: string): Promise<FinancialProfile | undefined>;
  getFinancialProfileByUserId(userId: string): Promise<FinancialProfile | undefined>;
  
  // User profile methods
  createUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile>;
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
  
  // Favorites methods
  addFavorite(userId: string, vehicleId: string): Promise<Favorite>;
  removeFavorite(userId: string, vehicleId: string): Promise<void>;
  getFavorites(userId: string): Promise<string[]>;
  isFavorite(userId: string, vehicleId: string): Promise<boolean>;
  
  // Bank account methods
  createBankAccount(userId: string, account: InsertBankAccount): Promise<BankAccount>;
  getBankAccounts(userId: string): Promise<BankAccount[]>;
  updateBankAccount(accountId: string, updates: Partial<BankAccount>): Promise<BankAccount>;
  
  // Financial calculations
  calculateAffordability(
    annualIncome: number,
    creditScore: number,
    employmentSubsidy: number,
    vehiclePrice: number,
    downPayment: number,
    leaseTerm: number,
    mpgCombined: number,
    reliability: number
  ): Promise<AffordabilityResult>;
  
  // Vehicle matching
  getMatchedVehicles(
    annualIncome: number,
    creditScore: number,
    employmentSubsidy: number,
    budgetMin: number,
    budgetMax: number,
    leaseTerm: number,
    limit?: number
  ): Promise<VehicleMatch[]>;
  
  getAllVehicles(): Promise<VehicleData[]>;
  getVehicleById(id: string): Promise<VehicleData | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private financialProfiles: Map<string, FinancialProfile>;
  private userProfiles: Map<string, UserProfile>;
  private favorites: Map<string, Favorite>;
  private bankAccounts: Map<string, BankAccount>;

  constructor() {
    this.users = new Map();
    this.financialProfiles = new Map();
    this.userProfiles = new Map();
    this.favorites = new Map();
    this.bankAccounts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      id,
      email: insertUser.email ?? null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createFinancialProfile(userId: string, profile: InsertFinancialProfile): Promise<FinancialProfile> {
    const id = randomUUID();
    const financialProfile: FinancialProfile = {
      id,
      userId,
      ...profile,
      employmentSubsidy: profile.employmentSubsidy ?? 0,
      cashflowStability: profile.cashflowStability ?? null,
      avgMonthlyCashflow: profile.avgMonthlyCashflow ?? null,
      cashflowVolatility: profile.cashflowVolatility ?? null,
    };
    this.financialProfiles.set(id, financialProfile);
    return financialProfile;
  }

  async getFinancialProfile(id: string): Promise<FinancialProfile | undefined> {
    return this.financialProfiles.get(id);
  }

  async getFinancialProfileByUserId(userId: string): Promise<FinancialProfile | undefined> {
    return Array.from(this.financialProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const userProfile: UserProfile = {
      id,
      userId,
      age: profile.age ?? null,
      isStudent: profile.isStudent ?? null,
      isFirstCar: profile.isFirstCar ?? null,
      hasHomeCharging: profile.hasHomeCharging ?? null,
      hasWorkCharging: profile.hasWorkCharging ?? null,
      climateCondition: profile.climateCondition ?? null,
      needsAWD: profile.needsAWD ?? null,
      dailyCommuteOneWay: profile.dailyCommuteOneWay ?? null,
      weekendDrivingPerWeek: profile.weekendDrivingPerWeek ?? null,
      estimatedAnnualMileage: profile.estimatedAnnualMileage ?? null,
    };
    this.userProfiles.set(id, userProfile);
    return userProfile;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile> {
    const existing = await this.getUserProfile(userId);
    if (!existing) {
      throw new Error("User profile not found");
    }
    const updated: UserProfile = { ...existing, ...updates };
    this.userProfiles.set(existing.id, updated);
    return updated;
  }

  async addFavorite(userId: string, vehicleId: string): Promise<Favorite> {
    const id = randomUUID();
    const favorite: Favorite = {
      id,
      userId,
      vehicleId,
      createdAt: new Date(),
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: string, vehicleId: string): Promise<void> {
    const favorite = Array.from(this.favorites.values()).find(
      (f) => f.userId === userId && f.vehicleId === vehicleId
    );
    if (favorite) {
      this.favorites.delete(favorite.id);
    }
  }

  async getFavorites(userId: string): Promise<string[]> {
    return Array.from(this.favorites.values())
      .filter((f) => f.userId === userId)
      .map((f) => f.vehicleId);
  }

  async isFavorite(userId: string, vehicleId: string): Promise<boolean> {
    return Array.from(this.favorites.values()).some(
      (f) => f.userId === userId && f.vehicleId === vehicleId
    );
  }

  async createBankAccount(userId: string, account: InsertBankAccount): Promise<BankAccount> {
    const id = randomUUID();
    const bankAccount: BankAccount = {
      id,
      userId,
      accountType: account.accountType,
      accountNumber: account.accountNumber ?? null,
      balance: account.balance,
      provider: account.provider ?? null,
      isLinked: account.isLinked ?? null,
      accessToken: account.accessToken ?? null,
      refreshToken: account.refreshToken ?? null,
      dynamicAPR: account.dynamicAPR ?? null,
      dynamicCreditLimit: account.dynamicCreditLimit ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bankAccounts.set(id, bankAccount);
    return bankAccount;
  }

  async getBankAccounts(userId: string): Promise<BankAccount[]> {
    return Array.from(this.bankAccounts.values()).filter(
      (account) => account.userId === userId
    );
  }

  async updateBankAccount(accountId: string, updates: Partial<BankAccount>): Promise<BankAccount> {
    const existing = this.bankAccounts.get(accountId);
    if (!existing) {
      throw new Error("Bank account not found");
    }
    const updated: BankAccount = { 
      ...existing, 
      ...updates,
      updatedAt: new Date()
    };
    this.bankAccounts.set(accountId, updated);
    return updated;
  }

  async calculateAffordability(
    annualIncome: number,
    creditScore: number,
    employmentSubsidy: number,
    vehiclePrice: number,
    downPayment: number,
    leaseTerm: number,
    mpgCombined: number,
    reliability: number
  ): Promise<AffordabilityResult> {
    const netPay = calculateNetPay(annualIncome, employmentSubsidy);
    const apr = calculateAPR(creditScore);
    const totalCost = calculateTotalMonthlyCost(
      vehiclePrice,
      downPayment,
      apr,
      leaseTerm,
      creditScore,
      mpgCombined,
      reliability
    );
    
    // Calculate maximum affordable car price based on income and credit score
    const maxAffordablePrice = calculateAffordableCarPrice(annualIncome, creditScore);
    
    // Calculate affordability score based on how close vehicle price is to max affordable
    const priceRatio = vehiclePrice / maxAffordablePrice;
    let score: number;
    
    if (priceRatio <= 0.7) {
      score = 95; // Well within budget
    } else if (priceRatio <= 0.85) {
      score = 80; // Good fit
    } else if (priceRatio <= 1.0) {
      score = 60; // At the limit but affordable
    } else if (priceRatio <= 1.15) {
      score = 40; // Slightly over budget
    } else {
      score = 20; // Too expensive
    }
    
    // Adjust score based on monthly payment affordability
    const paymentRatio = totalCost.total / netPay.monthlyNet;
    if (paymentRatio > 0.25) {
      score = Math.max(0, score - 20); // Heavy penalty if monthly cost is too high
    } else if (paymentRatio > 0.20) {
      score = Math.max(0, score - 10); // Moderate penalty
    }
    
    const canAfford = vehiclePrice <= maxAffordablePrice && totalCost.total < (netPay.monthlyNet * 0.25);
    
    let recommendation = "";
    if (score >= 80) {
      recommendation = `Excellent fit! This vehicle is well within your budget. Based on your income and credit score, you can afford up to $${Math.round(maxAffordablePrice).toLocaleString()}.`;
    } else if (score >= 60) {
      recommendation = `Good match. This vehicle fits your budget, though it will be a significant monthly expense. Maximum recommended budget: $${Math.round(maxAffordablePrice).toLocaleString()}.`;
    } else if (score >= 40) {
      recommendation = `Proceed with caution. This vehicle is at or above your recommended limit of $${Math.round(maxAffordablePrice).toLocaleString()}.`;
    } else {
      recommendation = `Consider a less expensive option. This vehicle exceeds your recommended budget of $${Math.round(maxAffordablePrice).toLocaleString()} and may strain your finances.`;
    }
    
    const budgetUtilization = (totalCost.total / netPay.monthlyNet) * 100;
    
    // Create breakdown array with colors for charts
    const breakdown = [
      { name: "Monthly Payment", value: totalCost.payment, color: "hsl(var(--chart-1))" },
      { name: "Insurance", value: totalCost.insurance, color: "hsl(var(--chart-2))" },
      { name: "Fuel", value: totalCost.fuel, color: "hsl(var(--chart-3))" },
      { name: "Maintenance", value: totalCost.maintenance, color: "hsl(var(--chart-4))" },
      { name: "Taxes & Fees", value: totalCost.taxesAndFees, color: "hsl(var(--chart-5))" },
    ];
    
    return {
      score,
      monthlyNetIncome: netPay.monthlyNet,
      totalMonthlyCost: totalCost.total,
      breakdown,
      budgetUtilization,
      apr,
      canAfford,
      recommendation
    };
  }

  async getMatchedVehicles(
    annualIncome: number,
    creditScore: number,
    employmentSubsidy: number,
    budgetMin: number,
    budgetMax: number,
    leaseTerm: number,
    limit: number = 10
  ): Promise<VehicleMatch[]> {
    const netPay = calculateNetPay(annualIncome, employmentSubsidy);
    const apr = calculateAPR(creditScore);
    
    const matches: VehicleMatch[] = TOYOTA_VEHICLES.map(vehicle => {
      const matchPercentage = calculateMatchPercentage(
        vehicle.msrp,
        vehicle.reliability,
        vehicle.mpgCombined,
        netPay.monthlyNet,
        budgetMin,
        budgetMax,
        leaseTerm,
        creditScore
      );
      
      const downPayment = vehicle.msrp * 0.1; // 10% down
      const totalCost = calculateTotalMonthlyCost(
        vehicle.msrp,
        downPayment,
        apr,
        leaseTerm,
        creditScore,
        vehicle.mpgCombined,
        vehicle.reliability
      );
      
      const affordabilityScore = calculateAffordabilityScore(
        netPay.monthlyNet,
        totalCost.total,
        creditScore,
        netPay.volatilityFactor
      );
      
      // Calculate component scores
      const salaryFit = totalCost.payment < (netPay.monthlyNet * 0.15) ? 95 : 
                       totalCost.payment < (netPay.monthlyNet * 0.20) ? 85 : 70;
      const reliabilityScore = Math.round(vehicle.reliability * 20);
      const termMatch = leaseTerm === 36 ? 95 : leaseTerm === 48 ? 90 : 85;
      
      return {
        vehicle,
        matchPercentage,
        monthlyPayment: totalCost.payment,
        totalMonthlyCost: totalCost,
        affordabilityScore,
        salaryFit,
        reliabilityScore,
        termMatch
      };
    });
    
    // Sort by match percentage (highest first)
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return matches.slice(0, limit);
  }

  async getAllVehicles(): Promise<VehicleData[]> {
    return TOYOTA_VEHICLES;
  }

  async getVehicleById(id: string): Promise<VehicleData | undefined> {
    return TOYOTA_VEHICLES.find(v => v.id === id);
  }
}

export const storage = new MemStorage();
