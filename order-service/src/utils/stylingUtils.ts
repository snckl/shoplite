export default function styleEmail(
  items: { productName: string; quantity: number }[]
): string {
  let productTable =
    '<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
  productTable +=
    '<thead><tr><th style="padding: 8px; border: 1px solid #ddd; text-align: left; background-color: #f4f4f4;">Product Name</th><th style="padding: 8px; border: 1px solid #ddd; text-align: left; background-color: #f4f4f4;">Quantity</th></tr></thead><tbody>';

  items.forEach((item) => {
    productTable += `<tr><td style="padding: 8px; border: 1px solid #ddd;">${item.productName}</td><td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td><td style="padding: 8px; border: 1px solid #ddd;">PRODUCT-ACTIVATION-KEY</td></tr>`;
  });

  productTable += "</tbody></table>";

  return `
    <p style="font-size: 16px; color: #333;">Thank you for your purchase! We are excited to deliver your digital products:</p>
    ${productTable}
    <p style="font-size: 14px; color: #555;">If you have any questions, feel free to reach out to our support team.</p>
    <p style="font-size: 14px; color: #555;">Thank you for shopping with us at <strong>ShopLite</strong>!</p>
  `;
}
