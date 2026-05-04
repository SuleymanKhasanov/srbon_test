import { z } from "zod";

export const filterFormSchema = z.object({
  q: z.string().optional().default(""),
  truck_type: z.string().optional().default(""),
  from_city_code: z.string().optional().default(""),
  to_city_code: z.string().optional().default(""),
  weight_min: z.string().optional().default(""),
  weight_max: z.string().optional().default(""),
  created_from: z.string().optional().default(""),
  created_to: z.string().optional().default(""),
  with_offers: z.boolean().optional().default(false),
});

export type FilterFormValues = z.input<typeof filterFormSchema>;
export type FilterFormParsed = z.output<typeof filterFormSchema>;

export const TRUCK_TYPE_OPTIONS = [
  "TENT",
  "REFRIGERATOR",
  "CONTAINER",
  "ISOTHERMAL",
  "OPEN",
  "FLATBED",
] as const;

export const STATUS_OPTIONS = [
  "SEARCHING_ALL",
  "SEARCHING",
  "IN_PROGRESS",
  "DELIVERED",
  "CANCELLED",
  "MODERATION",
  "DRAFT",
] as const;
