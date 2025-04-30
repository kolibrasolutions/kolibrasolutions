
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@13.3.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYMENT-INTENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Processing payment intent creation request");
    
    // Get request body
    const { order_id, payment_type, price_id, amount } = await req.json();
    
    logStep("Request parameters", { order_id, payment_type, price_id });
    
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

    logStep(`Processing ${payment_type} payment for order ${order_id}`);

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
    logStep("Authenticating with token", { token: token.substring(0, 10) + '...' });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      logStep("Authentication failed", { error: authError?.message });
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token", details: authError?.message }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    logStep("User authenticated", { userId: user.id, email: user.email });

    // Create service role client for DB operations
    const supabaseServiceRole = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );
    
    // Fetch the order
    logStep("Fetching order details", { orderId: order_id });
    const { data: order, error: orderError } = await supabaseServiceRole
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();
    
    if (orderError || !order) {
      logStep("Order fetch error", { error: orderError?.message });
      return new Response(
        JSON.stringify({ error: "Order not found", details: orderError?.message }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    logStep("Order fetched", { order: JSON.stringify(order) });
    
    // Verify that the order belongs to the authenticated user
    if (order.user_id !== user.id) {
      logStep("Order ownership verification failed", { 
        orderUserId: order.user_id,
        currentUserId: user.id
      });
      
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
        logStep("Invalid order status for initial payment", { status: order.status });
        return new Response(
          JSON.stringify({ error: "Initial payment can only be processed when the order is accepted", orderStatus: order.status }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      paymentAmount = order.initial_payment_amount || Math.round(order.total_price * 0.2);
    } else { // final payment
      if (order.status !== "Finalizado") {
        logStep("Invalid order status for final payment", { status: order.status });
        return new Response(
          JSON.stringify({ error: "Final payment can only be processed when the order is finalized", orderStatus: order.status }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      paymentAmount = order.final_payment_amount || (order.total_price - (order.initial_payment_amount || 0));
    }

    logStep("Payment amount determined", { paymentAmount, priceId: price_id || 'not provided' });

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      logStep("Missing STRIPE_SECRET_KEY environment variable");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing Stripe secret key" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate that the stripe key is a secret key (should start with "sk_")
    if (!stripeSecretKey.startsWith("sk_")) {
      logStep("Invalid STRIPE_SECRET_KEY format", { 
        keyStartsWith: stripeSecretKey.substring(0, 3),
        keyLength: stripeSecretKey.length
      });
      
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error: Invalid Stripe key format (must use secret key)", 
          details: "The STRIPE_SECRET_KEY environment variable must start with 'sk_', not 'pk_'. Please update your Supabase edge function secrets."
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    logStep("Stripe key validation passed");

    // Initialize Stripe properly without the problematic Deno.createFetch() option
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16"
    });

    // Create payment intent with proper configuration
    let paymentIntentData = {
      amount: Math.round(paymentAmount * 100), // Convert to cents
      currency: "brl",
      metadata: { 
        order_id: order.id.toString(), 
        user_id: user.id,
        payment_type 
      }
    };

    logStep("Creating payment intent", { data: paymentIntentData });
    
    try {
      // Create the payment intent
      const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
      logStep("Payment intent created successfully", { 
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      });
      
      // Record the payment intent in the database
      logStep("Recording payment intent in database");
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
        logStep("Payment insert error", { error: paymentInsertError.message });
        // We'll continue even if recording fails, as the payment intent was created successfully
      }

      // Return the client secret for the frontend
      return new Response(
        JSON.stringify({ clientSecret: paymentIntent.client_secret }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (stripeError) {
      logStep("Stripe error", { 
        error: stripeError.message,
        type: stripeError.type,
        code: stripeError.code
      });
      
      let errorMessage = "Failed to create payment intent";
      let statusCode = 500;

      // Handle specific Stripe errors
      if (stripeError.type === "StripeAuthenticationError") {
        errorMessage = "Authentication with payment provider failed. Please contact support.";
      } else if (stripeError.type === "StripeInvalidRequestError") {
        errorMessage = "Invalid payment request. Please check your payment details.";
        statusCode = 400;
      }

      return new Response(
        JSON.stringify({ 
          error: errorMessage, 
          details: stripeError.message,
          code: stripeError.code || "unknown",
          type: stripeError.type,
          requestData: paymentIntentData // Include request data for debugging
        }),
        { 
          status: statusCode, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
  } catch (error) {
    logStep("Unexpected error", { 
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
