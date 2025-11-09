import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertFinancialProfileSchema, affordabilityResponseSchema } from "@shared/schema";
import { generateDepreciationForecast, calculateResaleValue, calculateTCO, type DepreciationFactors } from "./depreciation-engine";
import { estimateInsurance, estimateFuelCost, estimateMaintenanceCost, calculateAPR } from "./financial-engine";
import { generateVehicleRecommendation, generateComparisonInsights, type RecommendationRequest } from "./gemini-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  };

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const bcrypt = await import("bcrypt");
      const schema = z.object({
        username: z.string().min(3),
        password: z.string().min(6),
        email: z.string().email().optional(),
      });

      const data = schema.parse(req.body);
      
      const existing = await storage.getUserByUsername(data.username);
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        username: data.username,
        password: hashedPassword,
        email: data.email,
      });

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const bcrypt = await import("bcrypt");
      const schema = z.object({
        username: z.string(),
        password: z.string(),
      });

      const data = schema.parse(req.body);
      const user = await storage.getUserByUsername(data.username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(data.password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to login" });
      }
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Financial profile routes
  app.post("/api/financial-profile", requireAuth, async (req, res) => {
    try {
      const data = insertFinancialProfileSchema.parse(req.body);
      const profile = await storage.createFinancialProfile(req.session.userId!, data);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create financial profile" });
      }
    }
  });

  app.get("/api/financial-profile", requireAuth, async (req, res) => {
    try {
      const profile = await storage.getFinancialProfileByUserId(req.session.userId!);
      if (!profile) {
        return res.status(404).json({ error: "Financial profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get financial profile" });
    }
  });

  app.put("/api/financial-profile", requireAuth, async (req, res) => {
    try {
      const schema = insertFinancialProfileSchema.partial();
      const data = schema.parse(req.body);
      
      // Get existing profile
      const existing = await storage.getFinancialProfileByUserId(req.session.userId!);
      if (!existing) {
        return res.status(404).json({ error: "Financial profile not found. Create one first." });
      }

      // Update profile by creating a new one (since storage doesn't have update method)
      const updated = await storage.createFinancialProfile(req.session.userId!, {
        ...existing,
        ...data,
      } as any);
      
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update financial profile" });
      }
    }
  });

  // Calculate affordability for a specific vehicle
  app.post("/api/affordability/calculate", async (req, res) => {
    try {
      const schema = z.object({
        annualIncome: z.number().positive(),
        creditScore: z.number().min(300).max(850),
        employmentSubsidy: z.number().default(0),
        vehiclePrice: z.number().positive(),
        downPayment: z.number().min(0),
        leaseTerm: z.number().positive(),
        mpgCombined: z.number().positive(),
        reliability: z.number().min(1).max(5)
      });

      const data = schema.parse(req.body);
      const result = await storage.calculateAffordability(
        data.annualIncome,
        data.creditScore,
        data.employmentSubsidy,
        data.vehiclePrice,
        data.downPayment,
        data.leaseTerm,
        data.mpgCombined,
        data.reliability
      );

      // Validate response matches AffordabilityResponse schema
      const validatedResponse = affordabilityResponseSchema.parse({
        score: result.score,
        monthlyNetIncome: result.monthlyNetIncome,
        totalMonthlyCost: result.totalMonthlyCost,
        breakdown: result.breakdown,
        budgetUtilization: result.budgetUtilization
      });

      res.json(validatedResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to calculate affordability" });
      }
    }
  });

  // Get matched vehicles based on financial profile
  app.post("/api/vehicles/match", async (req, res) => {
    try {
      const schema = z.object({
        annualIncome: z.number().positive(),
        creditScore: z.number().min(300).max(850),
        employmentSubsidy: z.number().default(0),
        budgetMin: z.number().positive(),
        budgetMax: z.number().positive(),
        leaseTerm: z.number().positive(),
        limit: z.number().optional().default(10)
      });

      const data = schema.parse(req.body);
      const matches = await storage.getMatchedVehicles(
        data.annualIncome,
        data.creditScore,
        data.employmentSubsidy,
        data.budgetMin,
        data.budgetMax,
        data.leaseTerm,
        data.limit
      );

      res.json(matches);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to match vehicles" });
      }
    }
  });

  // Get all vehicles
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  // Get vehicle by ID
  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.getVehicleById(req.params.id);
      if (!vehicle) {
        res.status(404).json({ error: "Vehicle not found" });
        return;
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  });

  // Generate depreciation forecast
  app.post("/api/depreciation/forecast", async (req, res) => {
    try {
      const schema = z.object({
        vehiclePrice: z.number().positive(),
        factors: z.object({
          lowMileage: z.boolean().default(false),
          goodCondition: z.boolean().default(false),
          lowInterest: z.boolean().default(false),
          lowGas: z.boolean().default(false)
        }).default({})
      });

      const data = schema.parse(req.body);
      const forecast = generateDepreciationForecast(
        data.vehiclePrice,
        data.factors as DepreciationFactors
      );

      res.json(forecast);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to generate forecast" });
      }
    }
  });

  // Calculate resale value
  app.post("/api/depreciation/resale", async (req, res) => {
    try {
      const schema = z.object({
        vehiclePrice: z.number().positive(),
        years: z.number().positive(),
        factors: z.object({
          lowMileage: z.boolean().default(false),
          goodCondition: z.boolean().default(false),
          lowInterest: z.boolean().default(false),
          lowGas: z.boolean().default(false)
        }).default({})
      });

      const data = schema.parse(req.body);
      const resale = calculateResaleValue(
        data.vehiclePrice,
        data.years,
        data.factors as DepreciationFactors
      );

      res.json(resale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to calculate resale value" });
      }
    }
  });

  // Calculate total cost of ownership
  app.post("/api/tco/calculate", async (req, res) => {
    try {
      const schema = z.object({
        vehiclePrice: z.number().positive(),
        downPayment: z.number().min(0),
        termMonths: z.number().positive(),
        creditScore: z.number().min(300).max(850),
        mpgCombined: z.number().positive(),
        reliability: z.number().min(1).max(5),
        annualMileage: z.number().default(12000),
        factors: z.object({
          lowMileage: z.boolean().default(false),
          goodCondition: z.boolean().default(false),
          lowInterest: z.boolean().default(false),
          lowGas: z.boolean().default(false)
        }).default({})
      });

      const data = schema.parse(req.body);
      const apr = calculateAPR(data.creditScore);
      const monthlyInsurance = estimateInsurance(data.vehiclePrice, data.creditScore);
      const monthlyFuel = estimateFuelCost(data.mpgCombined, data.annualMileage);
      const monthlyMaintenance = estimateMaintenanceCost(data.vehiclePrice, data.reliability);
      const monthlyTaxesFees = Math.round(data.vehiclePrice * 0.0008 + 50);

      const tco = calculateTCO(
        data.vehiclePrice,
        data.downPayment,
        apr,
        data.termMonths,
        monthlyInsurance,
        monthlyFuel,
        monthlyMaintenance,
        monthlyTaxesFees,
        data.factors as DepreciationFactors
      );

      res.json(tco);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to calculate TCO" });
      }
    }
  });

  // Generate AI recommendation for a vehicle
  app.post("/api/ai/recommendation", async (req, res) => {
    try {
      const schema = z.object({
        vehicleId: z.string(),
        annualIncome: z.number().positive(),
        creditScore: z.number().min(300).max(850),
        employmentSubsidy: z.number().default(0),
        budgetMin: z.number().positive(),
        budgetMax: z.number().positive(),
        leaseTerm: z.number().positive()
      });

      const data = schema.parse(req.body);
      
      // Get matched vehicles
      const matches = await storage.getMatchedVehicles(
        data.annualIncome,
        data.creditScore,
        data.employmentSubsidy,
        data.budgetMin,
        data.budgetMax,
        data.leaseTerm,
        20
      );

      // Find the specific vehicle
      const vehicleMatch = matches.find(m => m.vehicle.id === data.vehicleId);
      if (!vehicleMatch) {
        res.status(404).json({ error: "Vehicle not found or not suitable for profile" });
        return;
      }

      const recommendation = await generateVehicleRecommendation({
        vehicleMatch,
        userProfile: {
          annualIncome: data.annualIncome,
          creditScore: data.creditScore,
          leaseTerm: data.leaseTerm,
          budgetRange: { min: data.budgetMin, max: data.budgetMax }
        }
      });

      res.json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("AI recommendation error:", error);
        res.status(500).json({ error: "Failed to generate recommendation" });
      }
    }
  });

  // Generate AI comparison insights
  app.post("/api/ai/compare", async (req, res) => {
    try {
      const schema = z.object({
        vehicleIds: z.array(z.string()).min(2).max(5),
        annualIncome: z.number().positive(),
        creditScore: z.number().min(300).max(850),
        employmentSubsidy: z.number().default(0),
        budgetMin: z.number().positive(),
        budgetMax: z.number().positive(),
        leaseTerm: z.number().positive()
      });

      const data = schema.parse(req.body);
      
      // Get matched vehicles
      const allMatches = await storage.getMatchedVehicles(
        data.annualIncome,
        data.creditScore,
        data.employmentSubsidy,
        data.budgetMin,
        data.budgetMax,
        data.leaseTerm,
        20
      );

      // Filter to requested vehicles
      const selectedMatches = allMatches.filter(m => 
        data.vehicleIds.includes(m.vehicle.id)
      );

      if (selectedMatches.length < 2) {
        res.status(400).json({ error: "At least 2 vehicles required for comparison" });
        return;
      }

      const comparison = await generateComparisonInsights(
        selectedMatches,
        {
          annualIncome: data.annualIncome,
          creditScore: data.creditScore,
          leaseTerm: data.leaseTerm,
          budgetRange: { min: data.budgetMin, max: data.budgetMax }
        }
      );

      res.json({ comparison, vehicles: selectedMatches });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("AI comparison error:", error);
        res.status(500).json({ error: "Failed to generate comparison" });
      }
    }
  });

  // User Profile routes
  app.post("/api/profile", requireAuth, async (req, res) => {
    try {
      const schema = z.object({
        age: z.number().optional(),
        isStudent: z.boolean().optional(),
        isFirstCar: z.boolean().optional(),
        hasHomeCharging: z.boolean().optional(),
        hasWorkCharging: z.boolean().optional(),
        climateCondition: z.string().optional(),
        needsAWD: z.boolean().optional(),
        dailyCommuteOneWay: z.number().optional(),
        weekendDrivingPerWeek: z.number().optional(),
        estimatedAnnualMileage: z.number().optional(),
      });

      const data = schema.parse(req.body);
      const profile = await storage.createUserProfile(req.session.userId!, data);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create profile" });
      }
    }
  });

  app.get("/api/profile", requireAuth, async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.session.userId!);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  app.patch("/api/profile", requireAuth, async (req, res) => {
    try {
      const schema = z.object({
        age: z.number().optional(),
        isStudent: z.boolean().optional(),
        isFirstCar: z.boolean().optional(),
        hasHomeCharging: z.boolean().optional(),
        hasWorkCharging: z.boolean().optional(),
        climateCondition: z.string().optional(),
        needsAWD: z.boolean().optional(),
        dailyCommuteOneWay: z.number().optional(),
        weekendDrivingPerWeek: z.number().optional(),
        estimatedAnnualMileage: z.number().optional(),
      });

      const data = schema.parse(req.body);
      const profile = await storage.updateUserProfile(req.session.userId!, data);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update profile" });
      }
    }
  });

  // Favorites routes
  app.post("/api/favorites", requireAuth, async (req, res) => {
    try {
      const schema = z.object({
        vehicleId: z.string(),
      });

      const data = schema.parse(req.body);
      const favorite = await storage.addFavorite(req.session.userId!, data.vehicleId);
      res.json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to add favorite" });
      }
    }
  });

  app.delete("/api/favorites/:vehicleId", requireAuth, async (req, res) => {
    try {
      await storage.removeFavorite(req.session.userId!, req.params.vehicleId);
      res.json({ message: "Favorite removed" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites", requireAuth, async (req, res) => {
    try {
      const vehicleIds = await storage.getFavorites(req.session.userId!);
      const vehicles = await Promise.all(
        vehicleIds.map(id => storage.getVehicleById(id))
      );
      res.json(vehicles.filter(v => v !== undefined));
    } catch (error) {
      res.status(500).json({ error: "Failed to get favorites" });
    }
  });

  app.get("/api/favorites/check/:vehicleId", requireAuth, async (req, res) => {
    try {
      const isFavorite = await storage.isFavorite(req.session.userId!, req.params.vehicleId);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ error: "Failed to check favorite" });
    }
  });

  // Bank Account routes
  app.post("/api/bank-accounts", requireAuth, async (req, res) => {
    try {
      const schema = z.object({
        accountType: z.string(),
        balance: z.number(),
        provider: z.string().optional(),
        isLinked: z.boolean().optional(),
      });

      const data = schema.parse(req.body);
      const account = await storage.createBankAccount(req.session.userId!, data);
      res.json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create bank account" });
      }
    }
  });

  app.get("/api/bank-accounts", requireAuth, async (req, res) => {
    try {
      const accounts = await storage.getBankAccounts(req.session.userId!);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to get bank accounts" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
