import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  age: integer("age"),
  isStudent: boolean("is_student").default(false),
  isFirstCar: boolean("is_first_car").default(false),
  hasHomeCharging: boolean("has_home_charging").default(false),
  hasWorkCharging: boolean("has_work_charging").default(false),
  climateCondition: text("climate_condition"),
  needsAWD: boolean("needs_awd").default(false),
  dailyCommuteOneWay: integer("daily_commute_one_way").default(0),
  weekendDrivingPerWeek: integer("weekend_driving_per_week").default(0),
  estimatedAnnualMileage: integer("estimated_annual_mileage").default(12000),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  userId: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

// Financial Profile Schema
export const financialProfiles = pgTable("financial_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  annualIncome: integer("annual_income").notNull(),
  monthlyIncome: integer("monthly_income").notNull(),
  monthlyExpenses: integer("monthly_expenses").notNull(),
  totalSavings: integer("total_savings").notNull(),
  creditScore: integer("credit_score").notNull(),
  employmentSubsidy: integer("employment_subsidy").default(0),
  budgetMin: integer("budget_min").notNull(),
  budgetMax: integer("budget_max").notNull(),
  leaseTerm: integer("lease_term").notNull(),
  cashflowStability: decimal("cashflow_stability", { precision: 5, scale: 2 }),
  avgMonthlyCashflow: integer("avg_monthly_cashflow"),
  cashflowVolatility: decimal("cashflow_volatility", { precision: 5, scale: 2 }),
});

export const insertFinancialProfileSchema = createInsertSchema(financialProfiles).omit({
  id: true,
  userId: true,
});

export type InsertFinancialProfile = z.infer<typeof insertFinancialProfileSchema>;
export type FinancialProfile = typeof financialProfiles.$inferSelect;

export const bankAccounts = pgTable("bank_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  accountType: text("account_type").notNull(),
  accountNumber: text("account_number"),
  balance: integer("balance").notNull(),
  provider: text("provider").default("Capital One"),
  isLinked: boolean("is_linked").default(false),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  dynamicAPR: decimal("dynamic_apr", { precision: 5, scale: 2 }),
  dynamicCreditLimit: integer("dynamic_credit_limit"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBankAccountSchema = createInsertSchema(bankAccounts).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;
export type BankAccount = typeof bankAccounts.$inferSelect;

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  vehicleId: text("vehicle_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Vehicle Schema
export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey(),
  model: text("model").notNull(),
  trim: text("trim").notNull(),
  year: integer("year").notNull(),
  msrp: integer("msrp").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  fuelType: text("fuel_type").notNull(),
  mpg: text("mpg").notNull(),
  seating: integer("seating").notNull(),
  reliability: decimal("reliability", { precision: 3, scale: 2 }).notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;

// Comparison Schema
export const comparisons = pgTable("comparisons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  vehicleIds: text("vehicle_ids").array().notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Comparison = typeof comparisons.$inferSelect;

// Affordability Response Schema
export const affordabilityCostItemSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
});

export const affordabilityResponseSchema = z.object({
  score: z.number().min(0).max(100),
  monthlyNetIncome: z.number(),
  totalMonthlyCost: z.number(),
  breakdown: z.array(affordabilityCostItemSchema),
  budgetUtilization: z.number(),
});

export type AffordabilityResponse = z.infer<typeof affordabilityResponseSchema>;
