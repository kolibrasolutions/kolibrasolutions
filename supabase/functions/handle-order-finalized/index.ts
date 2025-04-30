
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

// deno-lint-ignore-file no-explicit-any

// Response headers for API requests
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

// Send delivery email with file links
async function sendDeliveryEmail(
  resend: Resend, 
  userEmail: string, 
  userName: string, 
  orderDetails: any, 
  fileLinks: any[]
) {
  // Prepare file links HTML if there are any
  let filesHTML = '';
  
  if (fileLinks && fileLinks.length > 0) {
    const fileLinksHTML = fileLinks.map(file => 
      `<li style="margin-bottom: 10px;"><a href="${file.url}" style="color: #10b981; font-weight: bold;">${file.name}</a></li>`
    ).join('');

    filesHTML = `
      <div style="margin: 20px 0; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
        <h3 style="margin-top: 0; color: #1f2937;">Arquivos do Projeto:</h3>
        <ul style="padding-left: 20px;">
          ${fileLinksHTML}
        </ul>
        <p style="margin-top: 15px; font-size: 0.9em; color: #64748b;">
          Estes links expiram em 7 dias. Por favor, baixe seus arquivos antes disso.
        </p>
      </div>
    `;
  }

  // Generate services list HTML
  let servicesHTML = '';
  if (orderDetails.order_items && orderDetails.order_items.length > 0) {
    const itemsHTML = orderDetails.order_items.map((item: any) => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${item.service_name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">R$ ${(item.price_at_order).toFixed(2)}</td>
      </tr>`
    ).join('');

    servicesHTML = `
      <div style="margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Detalhes do Pedido:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e0e0e0;">Serviço</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e0e0e0;">Qtd</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
            <tr style="font-weight: bold;">
              <td colspan="2" style="padding: 10px; text-align: right;">Total:</td>
              <td style="padding: 10px; text-align: right;">R$ ${orderDetails.total_price.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "JardimPró <noreply@sua-empresa.com.br>",
      to: [userEmail],
      subject: `Pedido #${orderDetails.id} - Entrega Finalizada`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <header style="background-color: #10b981; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Seu Pedido Foi Finalizado!</h1>
          </header>
          
          <div style="padding: 20px;">
            <p style="font-size: 16px; color: #333;">Olá ${userName || "cliente"},</p>
            
            <p style="font-size: 16px; color: #333;">
              Temos o prazer de informar que seu pedido #${orderDetails.id} foi finalizado e está pronto para entrega!
            </p>
            
            ${servicesHTML}
            
            ${filesHTML}
            
            ${!fileLinks || fileLinks.length === 0 ? 
              `<p style="font-size: 16px; color: #333; margin-top: 20px;">
                Entraremos em contato em breve para agendar a entrega ou para fornecer mais informações sobre o seu serviço.
              </p>` : ''
            }
            
            <p style="font-size: 16px; color: #333; margin-top: 20px;">
              Obrigado por escolher a JardimPró! Se tiver alguma dúvida, por favor entre em contato conosco.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 14px; color: #666;">
              <p>&copy; ${new Date().getFullYear()} JardimPró. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize clients
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceRole = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );
    
    // Initialize Resend for sending emails
    const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

    // Get request body
    const requestData = await req.json();
    const { order_id } = requestData;
    
    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "Missing order_id parameter" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseServiceRole
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found", details: orderError }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Verify the order status is "Finalizado"
    if (order.status !== "Finalizado") {
      return new Response(
        JSON.stringify({ error: "Order is not finalized yet" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get user details
    const { data: userData, error: userError } = await supabaseServiceRole
      .from("users")
      .select("email, full_name")
      .eq("id", order.user_id)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user data:", userError);
      return new Response(
        JSON.stringify({ error: "User not found", details: userError }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Get service details for each order item
    for (let i = 0; i < order.order_items.length; i++) {
      const item = order.order_items[i];
      const { data: serviceData } = await supabaseServiceRole
        .from("services")
        .select("name, category")
        .eq("id", item.service_id)
        .single();
        
      if (serviceData) {
        order.order_items[i].service_name = serviceData.name;
        order.order_items[i].service_category = serviceData.category;
      }
    }

    // Check for delivery files in storage
    const orderFilesBucket = "order_files";
    const orderFilesDirectory = `order_${order_id}`;

    // List files in the order directory
    const { data: files, error: filesError } = await supabaseServiceRole
      .storage
      .from(orderFilesBucket)
      .list(orderFilesDirectory);

    let fileLinks: any[] = [];
    
    if (!filesError && files && files.length > 0) {
      // Generate signed URLs for each file
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
    }

    // Send delivery email
    await sendDeliveryEmail(
      resend,
      userData.email,
      userData.full_name || "",
      order,
      fileLinks
    );

    // Update order with delivery_date
    const { error: updateError } = await supabaseServiceRole
      .from("orders")
      .update({ 
        delivery_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", order_id);

    if (updateError) {
      console.error("Error updating order delivery date:", updateError);
    }

    // Return success response with file links
    return new Response(
      JSON.stringify({
        success: true,
        message: "Order finalized and delivery email sent",
        files: fileLinks
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error(`Error in handle-order-finalized function:`, err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
