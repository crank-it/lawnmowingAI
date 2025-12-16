import { createClient } from "./client";
import {
  BeefyQuoteInsert,
  BeefyCustomer,
  BeefyJob,
  BeefySchedule,
} from "@/types/database";

// ============================================
// QUOTES
// ============================================

export async function submitQuote(quote: BeefyQuoteInsert) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("beefy_quotes")
    .insert(quote)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getQuoteById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("beefy_quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getPendingQuotes() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("beefy_quotes")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// ============================================
// CUSTOMERS
// ============================================

export async function getCustomers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("beefy_customers")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;
  return data;
}

export async function getCustomerById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("beefy_customers")
    .select("*, beefy_properties(*), beefy_schedules(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getCustomersWithSchedules() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("beefy_customers")
    .select(`
      *,
      beefy_schedules(frequency, next_service_date, services, base_price)
    `)
    .eq("is_active", true)
    .order("name");

  if (error) throw error;
  return data;
}

// ============================================
// JOBS
// ============================================

export async function getJobsForDate(date: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("beefy_jobs")
    .select(`
      *,
      beefy_customers(name, phone, address)
    `)
    .eq("scheduled_date", date)
    .order("route_order");

  if (error) throw error;
  return data;
}

export async function getTodaysJobs() {
  const today = new Date().toISOString().split("T")[0];
  return getJobsForDate(today);
}

export async function updateJobStatus(
  jobId: string,
  status: "scheduled" | "next" | "in_progress" | "completed" | "cancelled"
) {
  const supabase = createClient();

  const updateData: {
    status: "scheduled" | "next" | "in_progress" | "completed" | "cancelled";
    completed_at?: string
  } = { status };
  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("beefy_jobs")
    .update(updateData)
    .eq("id", jobId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCompletedJobsForPeriod(startDate: string, endDate: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("beefy_jobs")
    .select("*")
    .eq("status", "completed")
    .gte("completed_at", startDate)
    .lte("completed_at", endDate);

  if (error) throw error;
  return data;
}

// ============================================
// EARNINGS
// ============================================

export async function getEarningsStats() {
  const supabase = createClient();
  const today = new Date();

  // Calculate date ranges
  const todayStr = today.toISOString().split("T")[0];
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekStartStr = weekStart.toISOString().split("T")[0];
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStartStr = monthStart.toISOString().split("T")[0];

  // Get completed jobs
  const { data: jobs, error } = await supabase
    .from("beefy_jobs")
    .select("price, completed_at")
    .eq("status", "completed");

  if (error) throw error;

  // Calculate earnings
  let todayEarnings = 0;
  let weekEarnings = 0;
  let monthEarnings = 0;
  let allTimeEarnings = 0;

  jobs?.forEach((job) => {
    const completedDate = job.completed_at?.split("T")[0];
    allTimeEarnings += job.price;

    if (completedDate === todayStr) {
      todayEarnings += job.price;
    }
    if (completedDate && completedDate >= weekStartStr) {
      weekEarnings += job.price;
    }
    if (completedDate && completedDate >= monthStartStr) {
      monthEarnings += job.price;
    }
  });

  return {
    today: todayEarnings,
    week: weekEarnings,
    month: monthEarnings,
    allTime: allTimeEarnings,
    jobCount: jobs?.length || 0,
  };
}

// ============================================
// SCHEDULES
// ============================================

export async function getActiveSchedules() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("beefy_schedules")
    .select(`
      *,
      beefy_customers(name, phone, address),
      beefy_properties(lawn_area_sqm, gradient)
    `)
    .eq("is_active", true)
    .order("next_service_date");

  if (error) throw error;
  return data;
}
