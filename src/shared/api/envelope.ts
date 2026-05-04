import { z } from "zod";

export const apiEnvelopeSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    status: z.string(),
    code: z.number(),
    description: z.string().optional(),
    data: data,
  });

export type ApiResponse<T> = {
  status: string;
  code: number;
  description?: string;
  data: T;
};

export type ApiErrorPayload = {
  status: "error";
  code: number;
  description?: string;
  errorCode?: "TOKEN_EXPIRED" | "UPSTREAM_ERROR" | "INVALID_QUERY";
};
