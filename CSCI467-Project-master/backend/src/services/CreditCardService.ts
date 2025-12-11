import fetch from 'node-fetch';
import { env } from '../config/env.js';
import { logger } from './LoggerService.js';

interface CreditCardRequest {
  vendor: string;
  trans: string;
  cc: string;
  name: string;
  exp: string;
  amount: string;
}

export async function processCreditCard(
  orderId: string,
  cardNumber: string,
  cardName: string,
  expiry: string,
  amount: number
): Promise<{ success: boolean; authNumber?: string; error?: string }> {
  try {
    const timestamp = Date.now();
    const transactionId = `ORDER-${orderId}-${timestamp}`;

    const requestData: CreditCardRequest = {
      vendor: env.CC_VENDOR,
      trans: transactionId,
      cc: cardNumber,
      name: cardName,
      exp: expiry,
      amount: amount.toFixed(2)
    };

    logger.info('Processing credit card transaction:', {
      transactionId,
      amount,
      cardLast4: cardNumber.slice(-4)
    });

    const response = await fetch(env.CC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    const data = await response.text();

    // Check if response starts with "Error"
    if (data.startsWith('Error')) {
      logger.warn('Credit card declined:', {
        transactionId,
        error: data
      });
      return {
        success: false,
        error: data
      };
    } else {
      // Success - response is the authorization number
      logger.info('Credit card authorized:', {
        transactionId,
        authNumber: data
      });
      return {
        success: true,
        authNumber: data.trim()
      };
    }
  } catch (error) {
    logger.error('Credit card processing error:', error);
    return {
      success: false,
      error: 'Payment processing failed'
    };
  }
}

export async function refundCreditCard(
  authNumber: string,
  amount: number
): Promise<boolean> {
  logger.info('Refund requested (manual processing required):', {
    authNumber,
    amount
  });
  return true;
}
