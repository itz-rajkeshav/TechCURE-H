import { OpenAPIHandler } from "@orpc/openapi/node";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createContext } from "@techcure/api/context";
import { appRouter } from "@techcure/api/routers/index";
import { getAuth } from "@techcure/auth";
import { connectDB } from "@techcure/db";
import { env } from "@techcure/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";

const app = express();

// Apply JSON parsing middleware first
app.use(express.json());

// Apply CORS middleware
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  }),
);

// Auth routes - Better Auth handler with direct function call
app.use("/api/auth", async (req, res) => {
  console.log(`🔐 Auth request: ${req.method} ${req.originalUrl}`);
  
  try {
    const authInstance = await getAuth();
    const handler = toNodeHandler(authInstance);
    return handler(req, res);
  } catch (error: any) {
    console.error("❌ Auth error:", error);
    res.status(500).json({ error: "Authentication service error", details: error.message });
  }
});

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});
const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

app.use(async (req, res, next) => {
  const rpcResult = await rpcHandler.handle(req, res, {
    prefix: "/rpc",
    context: await createContext({ req }),
  });
  if (rpcResult.matched) return;

  const apiResult = await apiHandler.handle(req, res, {
    prefix: "/api-reference",
    context: await createContext({ req }),
  });
  if (apiResult.matched) return;

  next();
});

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.listen(3000, async () => {
  try {
    await connectDB();
    console.log("Server is running on http://localhost:3000");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
});
