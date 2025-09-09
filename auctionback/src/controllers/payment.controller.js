import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { asynchandler } from "../utils/asynchandler.js";

export const createCheckoutSession = asynchandler(async (req, res) => {
  const { itemName, amount } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: { name: itemName },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CORS_ORIGIN}/payment-success`,
    cancel_url: `${process.env.CORS_ORIGIN}/payment-cancel`,
  });

  res.status(200).json({ sessionId: session.id });
});
