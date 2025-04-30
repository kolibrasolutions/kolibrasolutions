
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@13.3.0";

// Disable no-explicit-any for this file
// deno-lint-ignore-file no-explicit-any

// Response headers for Stripe webhook
const webhookHeaders = {
  "Content-Type": "application/json",
};

serve(async (req) => {
  try {
    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
      httpClient: Deno.createFetch(),
    });
    
    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      console.error("No Stripe signature found in request");
      return new Response(
        JSON.stringify({ error: "No Stripe signature found" }),
        { status: 400, headers: webhookHeaders }
      );
    }
    
    // Get the raw body as text for verification
    const body = await req.text();
    
    // Verify the event came from Stripe
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { status: 400, headers: webhookHeaders }
      );
    }
    
    // Initialize Supabase client with service role for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRole = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );
    
    // Process the event
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const stripePaymentIntentId = paymentIntent.id;
    const status = paymentIntent.status;
    
    console.log(`Processing ${event.type} for ${stripePaymentIntentId} with status ${status}`);
    
    // Find the corresponding payment in our database
    const { data: paymentRecord, error: fetchError } = await supabaseServiceRole
      .from("payments")
      .select("*")
      .eq("stripe_payment_intent_id", stripePaymentIntentId)
      .single();
    
    if (fetchError || !paymentRecord) {
      console.error("Failed to find payment record:", fetchError);
      return new Response(
        JSON.stringify({ error: "Payment record not found" }),
        { status: 404, headers: webhookHeaders }
      );
    }
    
    // Update payment status in the database
    const { error: updateError } = await supabaseServiceRole
      .from("payments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("stripe_payment_intent_id", stripePaymentIntentId);
    
    if (updateError) {
      console.error("Failed to update payment status:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update payment status" }),
        { status: 500, headers: webhookHeaders }
      );
    }
    
    // Handle the successful payment
    if (event.type === "payment_intent.succeeded") {
      const orderId = paymentRecord.order_id;
      const paymentType = paymentRecord.payment_type;
      
      console.log(`Payment success for order ${orderId}, type: ${paymentType}`);
      
      // Update order status based on payment type
      let newStatus = "";
      if (paymentType === "initial") {
        newStatus = "Pagamento Inicial Realizado";
      } else if (paymentType === "final") {
        newStatus = "Finalizado";
      }
      
      if (newStatus) {
        const { error: orderUpdateError } = await supabaseServiceRole
          .from("orders")
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq("id", orderId);
        
        if (orderUpdateError) {
          console.error("Failed to update order status:", orderUpdateError);
          return new Response(
            JSON.stringify({ error: "Failed to update order status" }),
            { status: 500, headers: webhookHeaders }
          );
        }
        
        console.log(`Updated order ${orderId} status to ${newStatus}`);
      }
    } else if (event.type === "payment_intent.payment_failed") {
      console.log(`Payment failed for order ${paymentRecord.order_id}`);
      // Optional: Add additional handling for failed payments
    }
    
    // Return a 200 response to acknowledge receipt of the event
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: webhookHeaders }
    );
    
  } catch (err) {
    console.error(`Webhook error: ${err.message}`);
    return new Response(
      JSON.stringify({ error: "Webhook handler failed", details: err.message }),
      { status: 500, headers: webhookHeaders }
    );
  }
});
