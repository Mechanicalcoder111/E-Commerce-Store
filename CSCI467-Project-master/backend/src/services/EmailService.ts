import { Resend } from 'resend';
import { env } from '../config/env.js';
import { logger } from './LoggerService.js';

const resend = new Resend(env.RESEND_API_KEY);

interface OrderConfirmationData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
}

export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
  try {
    const itemsList = data.items
      .map(item => `- ${item.name} x ${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    const htmlContent = `
      <h1>Order Confirmation</h1>
      <p>Dear ${data.customerName},</p>
      <p>Thank you for your order! Your order number is: <strong>${data.orderNumber}</strong></p>

      <h2>Order Summary:</h2>
      <pre>${itemsList}</pre>

      <p>Subtotal: $${data.subtotal.toFixed(2)}</p>
      <p>Shipping: $${data.shippingCost.toFixed(2)}</p>
      <p><strong>Total: $${data.total.toFixed(2)}</strong></p>

      <p>We'll send you another email when your order ships.</p>
      <p>Thank you for shopping with us!</p>
    `;

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html: htmlContent
    });

    logger.info('Order confirmation email sent:', {
      orderNumber: data.orderNumber,
      email: data.customerEmail
    });
  } catch (error) {
    logger.error('Failed to send order confirmation email:', error);
    // Don't throw - email failure shouldn't fail order
  }
}

export async function sendShippingConfirmation(
  customerName: string,
  customerEmail: string,
  orderNumber: string
): Promise<void> {
  try {
    const htmlContent = `
      <h1>Your Order Has Shipped!</h1>
      <p>Dear ${customerName},</p>
      <p>Great news! Your order <strong>${orderNumber}</strong> has been shipped.</p>
      <p>You should receive your items within 5-7 business days.</p>
      <p>Thank you for your business!</p>
    `;

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: customerEmail,
      subject: `Order Shipped - ${orderNumber}`,
      html: htmlContent
    });

    logger.info('Shipping confirmation email sent:', {
      orderNumber,
      email: customerEmail
    });
  } catch (error) {
    logger.error('Failed to send shipping confirmation email:', error);
  }
}

export async function sendCancellationEmail(
  customerName: string,
  customerEmail: string,
  orderNumber: string,
  refundAmount: number
): Promise<void> {
  try {
    const htmlContent = `
      <h1>Order Cancelled</h1>
      <p>Dear ${customerName},</p>
      <p>Your order <strong>${orderNumber}</strong> has been cancelled.</p>
      <p>A refund of <strong>$${refundAmount.toFixed(2)}</strong> has been processed to your credit card.</p>
      <p>Please allow 5-7 business days for the refund to appear on your statement.</p>
      <p>If you have any questions, please contact our customer service.</p>
    `;

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: customerEmail,
      subject: `Order Cancelled - ${orderNumber}`,
      html: htmlContent
    });

    logger.info('Cancellation email sent:', {
      orderNumber,
      email: customerEmail
    });
  } catch (error) {
    logger.error('Failed to send cancellation email:', error);
  }
}
