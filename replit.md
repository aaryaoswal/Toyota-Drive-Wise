# DriveWise - Toyota Financial Platform

## Overview

DriveWise is an AI-powered Toyota vehicle financing platform designed for a hackathon, addressing Capital One's fintech and Toyota Financial's vehicle shopping tracks. The platform's core purpose is to empower users with informed vehicle purchasing decisions by integrating financial planning tools with transparent vehicle pricing. Key capabilities include real-time affordability calculations, depreciation forecasting, total cost of ownership analysis, AI-generated personalized recommendations, a mocked Capital One bank integration, enhanced vehicle matching based on lifestyle, and comprehensive user authentication. The project aims to innovate in vehicle financing and shopping.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite.
**Routing**: Wouter for client-side routing, defining core pages like Home, Vehicles, Login, Onboarding, and financing applications.
**UI Component System**: shadcn/ui with Radix UI primitives for accessibility, styled using Tailwind CSS. Features a custom theme system with light/dark modes and a professional aesthetic mirroring Toyota Financial.
**State Management**: TanStack Query for server state; local component state via React hooks.
**Key Design Decisions**: Component-based architecture, responsive design with a mobile-first approach, multi-step forms with validation, and session-based authentication.

### Backend Architecture

**Framework**: Express.js server with TypeScript.
**API Design**: RESTful endpoints for user authentication, profile management, financial data, bank connections, vehicle favorites, affordability calculations, depreciation forecasts, vehicle matching, and AI recommendations.
**Business Logic Engines**:
1.  **Financial Engine**: Calculates net pay, APR based on credit scores, and total cost of ownership; determines affordability scores.
2.  **Depreciation Engine**: Uses a hedonic pricing model with historical Toyota data and factor-based adjustments to forecast depreciation.
3.  **Vehicle Data**: Manages comprehensive Toyota vehicle lineup data.
**Development Choices**: TypeScript for type safety, Zod for validation, and shared schema types between frontend and backend.

### Data Storage

**Database**: PostgreSQL via Neon serverless driver.
**ORM**: Drizzle ORM for type-safe database operations.
**Schema Design**: Includes tables for users, user profiles, driving profiles, financial profiles, bank accounts, and favorite vehicles, ensuring a comprehensive data model for user-centric features.
**Migration Strategy**: Drizzle Kit for schema migrations.
**Storage Interface**: An abstracted storage layer supports both in-memory (for development) and PostgreSQL implementations.

## External Dependencies

**AI Services**:
-   Google Gemini AI (`@google/genai`) for personalized vehicle recommendations, with graceful fallback if the API key is not provided.

**Data Visualization**:
-   Recharts library for financial charts and graphs.

**UI Component Libraries**:
-   Radix UI primitives for accessible components.
-   React Hook Form with Zod resolvers for form validation.
-   `date-fns` for date manipulation.
-   `cmdk` for command palette interfaces.

**Development Tools**:
-   Vite plugins (runtime error overlay, Cartographer, dev banner).
-   PostCSS with Tailwind CSS and Autoprefixer.
-   ESBuild for server-side bundling.

**Authentication**:
-   `connect-pg-simple` for PostgreSQL-backed session management.
-   Bcrypt for password hashing.
-   Express-session with secure cookies.

**Environment Variables Required**:
-   `DATABASE_URL` (PostgreSQL connection string)
-   `SESSION_SECRET` (Session encryption key)
-   `GEMINI_API_KEY` (Google Gemini API key, optional)
-   `NODE_ENV` (Environment flag)