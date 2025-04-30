
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// deno-lint-ignore-file no-explicit-any

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a signed URL for storage files
async function getSignedUrl(supabase: any, bucket: string, filePath: string) {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days expiry

    if (error) {
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error(`Error generating signed URL for ${filePath}:`, error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check authentication
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    
    // Verify JWT token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Get request parameters
    const { order_id } = await req.json();
    
    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "Missing order_id parameter" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify the user has access to this order
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .select("user_id, status")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    if (order.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "You don't have permission to access this order" }),
        { status: 403, headers: corsHeaders }
      );
    }

    // Only allow access to finalized orders
    if (order.status !== "Finalizado") {
      return new Response(
        JSON.stringify({ error: "Order is not finalized yet" }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Check for delivery files in storage
    const orderFilesBucket = "order_files";
    const orderFilesDirectory = `order_${order_id}`;

    // Use service role for storage operations
    const supabaseServiceRole = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );

    // List files in the order directory
    const { data: files, error: filesError } = await supabaseServiceRole
      .storage
      .from(orderFilesBucket)
      .list(orderFilesDirectory);

    if (filesError) {
      // Don't treat this as an error, the bucket or folder might not exist yet
      return new Response(
        JSON.stringify({ files: [] }),
        { status: 200, headers: corsHeaders }
      );
    }

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ files: [] }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Generate signed URLs for each file
    const fileLinks = [];
    for (const file of files) {
      const filePath = `${orderFilesDirectory}/${file.name}`;
      const signedUrl = await getSignedUrl(supabaseServiceRole, orderFilesBucket, filePath);
      
      if (signedUrl) {
        fileLinks.push({
          name: file.name,
          url: signedUrl,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });
      }
    }

    // Return file links
    return new Response(
      JSON.stringify({ 
        files: fileLinks,
      }),
      { status: 200, headers: corsHeaders }
    );
    
  } catch (err) {
    console.error(`Error in get-delivery-files function:`, err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
