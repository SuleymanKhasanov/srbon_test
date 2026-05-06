import { z } from "zod";

export const cargoTypeSchema = z.object({
  id: z.string(),
  code: z.string(),
  name_ru: z.string(),
  name_uz: z.string(),
  name_en: z.string(),
  name_tr: z.string().optional(),
  name_zh: z.string().optional(),
});

export const routePointSchema = z.object({
  id: z.string(),
  cargo_id: z.string(),
  type: z.enum(["LOAD", "UNLOAD"]),
  address: z.string(),
  city_code: z.string(),
  city_name: z.string(),
  country_code: z.string(),
  region_code: z.string().nullable().optional(),
  lat: z.number(),
  lng: z.number(),
  date: z.string(),
  delivery_asap: z.boolean(),
  comment: z.string().nullable(),
  orientir: z.string().nullable(),
  point_order: z.number(),
  is_main_load: z.boolean(),
  is_main_unload: z.boolean(),
  place_id: z.string().nullable(),
  ready_enabled: z.boolean(),
});

export const paymentSchema = z.object({
  id: z.string(),
  cargo_id: z.string(),
  total_amount: z.number().nullable(),
  total_currency: z.string().nullable(),
  prepayment_amount: z.number().nullable(),
  prepayment_currency: z.string().nullable(),
  prepayment_type: z.string().nullable(),
  remaining_amount: z.number().nullable(),
  remaining_currency: z.string().nullable(),
  remaining_type: z.string().nullable(),
  with_prepayment: z.boolean(),
  is_negotiable: z.boolean(),
  price_request: z.boolean(),
  payment_note: z.string().nullable(),
  payment_terms_note: z.string().nullable(),
});

export const cargoSchema = z.object({
  id: z.string(),
  name: z.string(),
  comment: z.string().nullable(),
  contact_name: z.string().nullable(),
  contact_phone: z.string().nullable(),
  cargo_type: cargoTypeSchema.nullable(),
  status: z.string(),
  shipment_type: z.string().nullable(),
  truck_type: z.string().nullable(),
  power_plate_type: z.string().nullable(),
  trailer_plate_type: z.string().nullable(),
  vehicles_amount: z.number(),
  vehicles_left: z.number(),
  is_two_drivers_required: z.boolean(),
  weight: z.number().nullable(),
  volume: z.number().nullable(),
  dimensions: z.string().nullable(),
  temp_min: z.number().nullable(),
  temp_max: z.number().nullable(),
  belts_count: z.number().nullable(),
  packaging: z.string().nullable(),
  packaging_amount: z.number().nullable(),
  adr_enabled: z.boolean(),
  adr_class: z.string().nullable(),
  loading_types: z.array(z.string()),
  unloading_types: z.array(z.string()),
  photos: z.array(z.string()),
  documents: z.record(z.string(), z.unknown()).nullable(),
  payment: paymentSchema,
  route_points: z.array(routePointSchema),
  way_points: z.array(z.record(z.string(), z.unknown())),
  created_at: z.string(),
  updated_at: z.string(),
  created_by_id: z.string().nullable(),
  created_by_type: z.string().nullable(),
  company_id: z.string().nullable(),
  is_liked: z.boolean(),
  moderation_rejection_reason: z.string().nullable(),
});

export const cargoListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  description: z.string().optional(),
  data: z.object({
    items: z.array(cargoSchema),
    total: z.number(),
  }),
});

export const cargoApiErrorSchema = z.object({
  status: z.literal("error"),
  code: z.number(),
  errorCode: z
    .enum(["TOKEN_EXPIRED", "UPSTREAM_ERROR", "INVALID_QUERY"])
    .optional(),
  description: z.string().optional(),
});
