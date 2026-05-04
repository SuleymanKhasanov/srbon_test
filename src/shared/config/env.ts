import "server-only";

import { z } from "zod";

const EnvSchema = z.object({
  SARBON_API_BASE_URL: z.string().url(),
  SARBON_CLIENT_TOKEN: z.string().min(1),
  SARBON_USER_TOKEN: z.string().min(1),
});

const parsed = EnvSchema.safeParse({
  SARBON_API_BASE_URL: process.env.SARBON_API_BASE_URL,
  SARBON_CLIENT_TOKEN: process.env.SARBON_CLIENT_TOKEN,
  SARBON_USER_TOKEN: process.env.SARBON_USER_TOKEN,
});

if (!parsed.success) {
  console.error("Invalid Sarbon env vars", z.treeifyError(parsed.error));
  throw new Error(
    "Missing or invalid Sarbon env vars. Copy .env.example to .env.local and fill all values.",
  );
}

export const env = parsed.data;
