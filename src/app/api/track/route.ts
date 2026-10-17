import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query ? String(body.query).trim() : "";

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Phone number or Order ID is required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://rxdxykvpnzwontnmgikb.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZHh5a3Zwbnp3b250bm1naWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MzcwODcsImV4cCI6MjA5NzUxMzA4N30.nzOAQXp71tjax6KeX4inf7Dc9WUeM3cbg6pB09rk2IE';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: sbOrders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Track orders query error:", error);
    }

    const allOrders = sbOrders || [];
    const cleanQuery = query.toLowerCase();
    const phoneDigits = cleanQuery.replace(/\D/g, "");
    const last10Digits = phoneDigits.length >= 10 ? phoneDigits.slice(-10) : (phoneDigits.length >= 7 ? phoneDigits : null);

    const DELIVERED_STATUSES = ["delivered", "completed", "cancelled", "returned"];

    const matches = allOrders.filter((order: any) => {
      // 1. Order ID match
      const orderId = String(order.id || "").toLowerCase();
      const shortId = orderId.split("-")[0];
      if (
        orderId === cleanQuery ||
        shortId === cleanQuery ||
        cleanQuery.includes(shortId) ||
        cleanQuery.includes(orderId) ||
        `orv-${shortId}` === cleanQuery ||
        `orv-${orderId}` === cleanQuery
      ) {
        return true;
      }

      // 2. Email match if query looks like email
      if (cleanQuery.includes("@")) {
        const userEmail = String(order.user_email || order.shipping_address?.email || "").toLowerCase();
        if (userEmail.includes(cleanQuery)) return true;
      }

      // 3. Phone number match
      const orderPhone = String(
        order.shipping_address?.phone ||
        order.shipping_address?.phoneNumber ||
        order.phone ||
        ""
      );
      const orderPhoneDigits = orderPhone.replace(/\D/g, "");

      if (last10Digits && orderPhoneDigits.length >= 7) {
        if (orderPhoneDigits.endsWith(last10Digits) || orderPhoneDigits.includes(last10Digits)) {
          return true;
        }
      }

      if (phoneDigits.length >= 7 && orderPhoneDigits.length >= 7 && orderPhoneDigits.includes(phoneDigits)) {
        return true;
      }

      return false;
    });

    const underProcessing = matches.filter((order: any) => 
      !DELIVERED_STATUSES.includes(String(order.status || "").toLowerCase())
    );

    const delivered = matches.filter((order: any) => 
      DELIVERED_STATUSES.includes(String(order.status || "").toLowerCase())
    );

    return NextResponse.json({
      success: true,
      query,
      totalFound: matches.length,
      underProcessing,
      delivered
    });
  } catch (err: any) {
    console.error("Track API error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
