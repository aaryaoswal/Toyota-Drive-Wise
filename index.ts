import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

(async () => {
  try {
    // Initialize session store
    let sessionStore: any = undefined;
    
    if (process.env.DATABASE_URL) {
      try {
        const ConnectPgSimple = (await import("connect-pg-simple")).default;
        const { Pool } = await import("@neondatabase/serverless");
        const PgSession = ConnectPgSimple(session);
        
        sessionStore = new PgSession({
          pool: new Pool({ connectionString: process.env.DATABASE_URL }),
          createTableIfMissing: true,
        });
        log("Using PostgreSQL session store");
      } catch (error) {
        log("WARNING: Failed to connect to PostgreSQL. Using in-memory session store.");
        log(`Database error: ${error}`);
        sessionStore = undefined;
      }
    } else {
      log("WARNING: DATABASE_URL not set. Using in-memory session store (not suitable for production)");
    }

    if (!process.env.SESSION_SECRET) {
      log("WARNING: SESSION_SECRET not set. Using default secret for development only.");
    }

    // Configure session middleware after store is ready
    app.use(session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || 'drivewise-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      }
    }));

    // Request logging middleware
    app.use((req, res, next) => {
      const start = Date.now();
      const path = req.path;
      let capturedJsonResponse: Record<string, any> | undefined = undefined;

      const originalResJson = res.json;
      res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
      };

      res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
          let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
          if (capturedJsonResponse) {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          }

          if (logLine.length > 80) {
            logLine = logLine.slice(0, 79) + "…";
          }

          log(logLine);
        }
      });

      next();
    });

    // Register routes and start server
    const server = await registerRoutes(app);

    if (!server) {
      throw new Error("Failed to create server from registerRoutes");
    }

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // Serve static assets from attached_assets/stock_images
    app.use("/stock_images", express.static(path.resolve(import.meta.dirname, "..", "attached_assets", "stock_images")));
    log("Serving stock images from /stock_images");

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Server successfully started on port ${port}`);
      log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      log(`Listening on http://0.0.0.0:${port}`);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        log(`ERROR: Port ${port} is already in use`);
        process.exit(1);
      } else {
        log(`ERROR: Server error: ${error.message}`);
        throw error;
      }
    });

  } catch (error) {
    log(`FATAL ERROR during server initialization: ${error}`);
    console.error(error);
    process.exit(1);
  }
})().catch((error) => {
  log(`UNHANDLED ERROR in async initialization: ${error}`);
  console.error(error);
  process.exit(1);
});
