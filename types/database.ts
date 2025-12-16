export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      beefy_customers: {
        Row: {
          address: string
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          phone: string
          suburb: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          phone: string
          suburb?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          phone?: string
          suburb?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      beefy_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          notes: string | null
          price: number
          property_id: string | null
          route_order: number | null
          scheduled_date: string
          scheduled_time: string | null
          services: Json | null
          status: Database["public"]["Enums"]["job_status"] | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          notes?: string | null
          price: number
          property_id?: string | null
          route_order?: number | null
          scheduled_date: string
          scheduled_time?: string | null
          services?: Json | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          notes?: string | null
          price?: number
          property_id?: string | null
          route_order?: number | null
          scheduled_date?: string
          scheduled_time?: string | null
          services?: Json | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beefy_jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "beefy_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beefy_jobs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "beefy_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      beefy_properties: {
        Row: {
          access_difficulty:
            | Database["public"]["Enums"]["access_difficulty"]
            | null
          address: string
          created_at: string | null
          customer_id: string | null
          estimated_edging_m: number | null
          gradient: Database["public"]["Enums"]["gradient_level"] | null
          hedge_length_m: number | null
          id: string
          lawn_area_sqm: number | null
          total_area_sqm: number | null
          updated_at: string | null
        }
        Insert: {
          access_difficulty?:
            | Database["public"]["Enums"]["access_difficulty"]
            | null
          address: string
          created_at?: string | null
          customer_id?: string | null
          estimated_edging_m?: number | null
          gradient?: Database["public"]["Enums"]["gradient_level"] | null
          hedge_length_m?: number | null
          id?: string
          lawn_area_sqm?: number | null
          total_area_sqm?: number | null
          updated_at?: string | null
        }
        Update: {
          access_difficulty?:
            | Database["public"]["Enums"]["access_difficulty"]
            | null
          address?: string
          created_at?: string | null
          customer_id?: string | null
          estimated_edging_m?: number | null
          gradient?: Database["public"]["Enums"]["gradient_level"] | null
          hedge_length_m?: number | null
          id?: string
          lawn_area_sqm?: number | null
          total_area_sqm?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beefy_properties_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "beefy_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      beefy_quotes: {
        Row: {
          access_difficulty:
            | Database["public"]["Enums"]["access_difficulty"]
            | null
          address: string
          converted_to_customer_id: string | null
          created_at: string | null
          dog_size: Database["public"]["Enums"]["dog_size"] | null
          email: string | null
          estimated_edging_m: number | null
          frequency: Database["public"]["Enums"]["lawn_frequency"] | null
          gradient: Database["public"]["Enums"]["gradient_level"] | null
          hedge_length_m: number | null
          id: string
          lawn_area_sqm: number | null
          name: string
          phone: string
          price_max: number | null
          price_min: number | null
          services: Json | null
          status: Database["public"]["Enums"]["booking_status"] | null
          suburb: string | null
          total_area_sqm: number | null
          updated_at: string | null
        }
        Insert: {
          access_difficulty?:
            | Database["public"]["Enums"]["access_difficulty"]
            | null
          address: string
          converted_to_customer_id?: string | null
          created_at?: string | null
          dog_size?: Database["public"]["Enums"]["dog_size"] | null
          email?: string | null
          estimated_edging_m?: number | null
          frequency?: Database["public"]["Enums"]["lawn_frequency"] | null
          gradient?: Database["public"]["Enums"]["gradient_level"] | null
          hedge_length_m?: number | null
          id?: string
          lawn_area_sqm?: number | null
          name: string
          phone: string
          price_max?: number | null
          price_min?: number | null
          services?: Json | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          suburb?: string | null
          total_area_sqm?: number | null
          updated_at?: string | null
        }
        Update: {
          access_difficulty?:
            | Database["public"]["Enums"]["access_difficulty"]
            | null
          address?: string
          converted_to_customer_id?: string | null
          created_at?: string | null
          dog_size?: Database["public"]["Enums"]["dog_size"] | null
          email?: string | null
          estimated_edging_m?: number | null
          frequency?: Database["public"]["Enums"]["lawn_frequency"] | null
          gradient?: Database["public"]["Enums"]["gradient_level"] | null
          hedge_length_m?: number | null
          id?: string
          lawn_area_sqm?: number | null
          name?: string
          phone?: string
          price_max?: number | null
          price_min?: number | null
          services?: Json | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          suburb?: string | null
          total_area_sqm?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beefy_quotes_converted_to_customer_id_fkey"
            columns: ["converted_to_customer_id"]
            isOneToOne: false
            referencedRelation: "beefy_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      beefy_schedules: {
        Row: {
          base_price: number
          created_at: string | null
          customer_id: string | null
          frequency: Database["public"]["Enums"]["lawn_frequency"]
          id: string
          is_active: boolean | null
          next_service_date: string | null
          preferred_day: string | null
          property_id: string | null
          services: Json | null
          updated_at: string | null
        }
        Insert: {
          base_price: number
          created_at?: string | null
          customer_id?: string | null
          frequency: Database["public"]["Enums"]["lawn_frequency"]
          id?: string
          is_active?: boolean | null
          next_service_date?: string | null
          preferred_day?: string | null
          property_id?: string | null
          services?: Json | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          created_at?: string | null
          customer_id?: string | null
          frequency?: Database["public"]["Enums"]["lawn_frequency"]
          id?: string
          is_active?: boolean | null
          next_service_date?: string | null
          preferred_day?: string | null
          property_id?: string | null
          services?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beefy_schedules_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "beefy_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beefy_schedules_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "beefy_properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      access_difficulty: "Easy" | "Standard" | "Tricky"
      booking_status: "pending" | "confirmed" | "cancelled"
      dog_size: "small" | "medium" | "large"
      gradient_level: "Flat" | "Gentle slope" | "Moderate slope" | "Steep"
      job_status:
        | "scheduled"
        | "next"
        | "in_progress"
        | "completed"
        | "cancelled"
      lawn_frequency: "weekly" | "fortnightly" | "monthly" | "one_off"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"]

// Simplified type helpers that work with public schema
export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"]

export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T]

// Convenience type aliases for Beefy Cuts tables
export type BeefyCustomer = Tables<"beefy_customers">
export type BeefyProperty = Tables<"beefy_properties">
export type BeefyQuote = Tables<"beefy_quotes">
export type BeefyJob = Tables<"beefy_jobs">
export type BeefySchedule = Tables<"beefy_schedules">

export type BeefyCustomerInsert = TablesInsert<"beefy_customers">
export type BeefyPropertyInsert = TablesInsert<"beefy_properties">
export type BeefyQuoteInsert = TablesInsert<"beefy_quotes">
export type BeefyJobInsert = TablesInsert<"beefy_jobs">
export type BeefyScheduleInsert = TablesInsert<"beefy_schedules">

// Enum types
export type JobStatus = Enums<"job_status">
export type BookingStatus = Enums<"booking_status">
export type LawnFrequency = Enums<"lawn_frequency">
export type GradientLevel = Enums<"gradient_level">
export type AccessDifficulty = Enums<"access_difficulty">
export type DogSizeEnum = Enums<"dog_size">
