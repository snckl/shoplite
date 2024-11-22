import stripe from "./../config/stripe";

const paymentUtil = async (totalAmount: number, email: string, id: string) => {
  return await stripe.paymentIntents.create({
    amount: totalAmount * 100, // Stripe expects the amount in cents
    currency: "usd", // Adjust for other currencies if needed
    payment_method: "pm_card_visa", // Use the test card for now
    payment_method_types: ["card"],
    confirm: true,
    receipt_email: email,
    metadata: { orderId: id },
  });
};

export default paymentUtil;
