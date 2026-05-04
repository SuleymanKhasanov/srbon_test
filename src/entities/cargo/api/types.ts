export type Locale = "ru" | "uz" | "en" | "tr" | "zh";

export type CargoType = {
  id: string;
  code: string;
  name_ru: string;
  name_uz: string;
  name_en: string;
  name_tr?: string;
  name_zh?: string;
};

export type RoutePointType = "LOAD" | "UNLOAD";

export type RoutePoint = {
  id: string;
  cargo_id: string;
  type: RoutePointType;
  address: string;
  city_code: string;
  city_name: string;
  country_code: string;
  region_code?: string | null;
  lat: number;
  lng: number;
  date: string;
  delivery_asap: boolean;
  comment: string | null;
  orientir: string | null;
  point_order: number;
  is_main_load: boolean;
  is_main_unload: boolean;
  place_id: string | null;
  ready_enabled: boolean;
};

export type Currency = "USD" | "EUR" | "UZS" | "RUB" | string;
export type PaymentType =
  | "CASH"
  | "BANK_TRANSFER"
  | "AFTER_INVOICE"
  | "AFTER_LOADING"
  | "AFTER_UNLOADING"
  | string;

export type Payment = {
  id: string;
  cargo_id: string;
  total_amount: number | null;
  total_currency: Currency | null;
  prepayment_amount: number | null;
  prepayment_currency: Currency | null;
  prepayment_type: PaymentType | null;
  remaining_amount: number | null;
  remaining_currency: Currency | null;
  remaining_type: PaymentType | null;
  with_prepayment: boolean;
  is_negotiable: boolean;
  price_request: boolean;
  payment_note: string | null;
  payment_terms_note: string | null;
};

export type CargoStatus =
  | "SEARCHING_ALL"
  | "SEARCHING"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "CANCELLED"
  | "MODERATION"
  | "DRAFT"
  | string;

export type ShipmentType = "FTL" | "LTL" | string;
export type TruckType =
  | "TENT"
  | "REFRIGERATOR"
  | "CONTAINER"
  | "ISOTHERMAL"
  | "OPEN"
  | "FLATBED"
  | string;

export type Cargo = {
  id: string;
  name: string;
  comment: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  cargo_type: CargoType;
  status: CargoStatus;
  shipment_type: ShipmentType | null;
  truck_type: TruckType | null;
  power_plate_type: string | null;
  trailer_plate_type: string | null;
  vehicles_amount: number;
  vehicles_left: number;
  is_two_drivers_required: boolean;
  weight: number | null;
  volume: number | null;
  dimensions: string | null;
  temp_min: number | null;
  temp_max: number | null;
  belts_count: number | null;
  packaging: string | null;
  packaging_amount: number | null;
  adr_enabled: boolean;
  adr_class: string | null;
  loading_types: string[];
  unloading_types: string[];
  photos: string[];
  documents: Record<string, unknown> | null;
  payment: Payment;
  route_points: RoutePoint[];
  way_points: RoutePoint[];
  created_at: string;
  updated_at: string;
  created_by_id: string | null;
  created_by_type: string | null;
  company_id: string | null;
  is_liked: boolean;
  moderation_rejection_reason: string | null;
};

export type CargoListData = {
  items: Cargo[];
  total: number;
};

export type CargoListResponse = {
  status: string;
  code: number;
  description?: string;
  data: CargoListData;
};

export type CargoListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  status?: string;
  truck_type?: string;
  weight_min?: number;
  weight_max?: number;
  created_from?: string;
  created_to?: string;
  with_offers?: boolean;
  q?: string;
  company_id?: string;
  from_city_code?: string;
  to_city_code?: string;
};

export type CargoApiError = {
  status: "error";
  code: number;
  errorCode?: "TOKEN_EXPIRED" | "UPSTREAM_ERROR" | "INVALID_QUERY";
  description?: string;
};
