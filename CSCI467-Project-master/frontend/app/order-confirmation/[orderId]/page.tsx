'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  return (
    <>
      <Header />
      <main className="p-8 bg-slate-50 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <div className="text-center mb-6">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your order. We've sent a confirmation email to your inbox.
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold text-lg mb-2">Order Details</h2>
            <p className="text-sm text-gray-600 mb-4">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
            <p className="text-sm text-gray-600">
              You will receive shipping confirmation once your order has been dispatched.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
