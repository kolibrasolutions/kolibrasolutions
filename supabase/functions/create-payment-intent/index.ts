
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@13.3.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { order_id, payment_type, price_id } = await req.json();
    
    if (!order_id || !payment_type) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: order_id and payment_type" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Validate payment type
    if (payment_type !== "initial" && payment_type !== "final") {
      return new Response(
        JSON.stringify({ error: "Payment type must be 'initial' or 'final'" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize Supabase client (client using anon key for auth)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get user JWT from authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get authenticated user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create service role client for DB operations
    const supabaseServiceRole = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );
    
    // Fetch the order
    const { data: order, error: orderError } = await supabaseServiceRole
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();
    
    if (orderError || !order) {
      console.error("Order fetch error:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Verify that the order belongs to the authenticated user
    if (order.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Order does not belong to authenticated user" }),
        { 
          status: 403, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate order status for requested payment type
    let paymentAmount;
    if (payment_type === "initial") {
      if (order.status !== "Aceito") {
        return new Response(
          JSON.stringify({ error: "Initial payment can only be processed when the order is accepted" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      paymentAmount = order.initial_payment_amount || Math.round(order.total_price * 0.2);
    } else { // final payment
      if (order.status !== "Em Andamento" && order.status !== "Pagamento Inicial Realizado" && order.status !== "Finalizado") {
        return new Response(
          JSON.stringify({ error: "Order not ready for final payment" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      paymentAmount = order.final_payment_amount || (order.total_price - (order.initial_payment_amount || 0));
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
      httpClient: Deno.createFetch(),
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(paymentAmount * 100), // Convert to cents
      currency: "brl",
      metadata: { 
        order_id: order.id.toString(), 
        user_id: user.id,
        payment_type 
      },
      // If a price_id is provided, use it
      ...(price_id && { payment_method_types: ["card"] })
    });

    // Record the payment intent in the database
    const { error: paymentInsertError } = await supabaseServiceRole
      .from("payments")
      .insert({
        order_id: order.id,
        amount: paymentAmount,
        stripe_payment_intent_id: paymentIntent.id,
        payment_type,
        status: paymentIntent.status,
      });

    if (paymentInsertError) {
      console.error("Payment insert error:", paymentInsertError);
      return new Response(
        JSON.stringify({ error: "Failed to record payment" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Return the client secret for the frontend
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
