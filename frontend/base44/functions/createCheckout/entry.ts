import Stripe from "npm:stripe@14.21.0";

const PRICES = {
  pro: "price_1Te1rxCthTmitWTOyZEVSHTm",
  enterprise: "price_1Te1rxCthTmitWTOQzSasFqZ",
};

Deno.serve(async (req) => {
  try {
    const { plan, success_url, cancel_url } = await req.json();

    const priceId = PRICES[plan];
    if (!priceId) {
      return Response.json({ error: "Plan no válido" }, { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: success_url || "https://app.base44.com/success",
      cancel_url: cancel_url || "https://app.base44.com/plans",
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
        plan,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});