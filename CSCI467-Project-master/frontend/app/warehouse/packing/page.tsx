'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import AdminHeader from '../../components/AdminHeader';
import Footer from '../../components/Footer';
import { LoadingButton } from '../../components/LoadingButton';
import { ordersService } from '../../lib/api/services/orders.service';
import { toast } from 'sonner';
import { Order } from '../../lib/api/types';

function PackingListPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  // Fetch orders with status ORDERED
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', { status: 'ORDERED' }],
    queryFn: () => ordersService.getAll({ status: 'ORDERED' }),
  });

  const availableOrders = ordersData?.orders || [];

  const packingMutation = useMutation({
    mutationFn: ordersService.getPackingList,
    onSuccess: (data) => {
      setOrder(data.order);
      toast.success('Packing list loaded');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId) {
      toast.error('Please select an order');
      return;
    }
    packingMutation.mutate(orderId);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <AdminHeader />
      <main className="p-8 bg-slate-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Packing Lists</h1>

        <div className="bg-white p-6 rounded shadow mb-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 border rounded p-2"
              required
              disabled={ordersLoading}
            >
              <option value="">
                {ordersLoading ? 'Loading orders...' : 'Select an order'}
              </option>
              {availableOrders.map((o) => (
                <option key={o.id} value={o.orderNumber}>
                  Order #{o.orderNumber} - {o.customerName} (${o.totalAmount.toFixed(2)})
                </option>
              ))}
            </select>
            <LoadingButton
              type="submit"
              isLoading={packingMutation.isPending}
              loadingText="Loading..."
            >
              Get Packing List
            </LoadingButton>
          </form>
          {availableOrders.length === 0 && !ordersLoading && (
            <p className="text-sm text-gray-500 mt-2">No orders available for packing</p>
          )}
        </div>

        {order && (
          <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order #{order.orderNumber}</h2>
              <button
                onClick={handlePrint}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Print
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Customer</h3>
                <p>{order.customerName}</p>
                <p className="text-sm text-gray-600">{order.customerEmail}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
              </div>
            </div>
            <h3 className="font-semibold mb-2">Items</h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{item.productName}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function PackingPage() {
  return (
    <ProtectedRoute allowedRoles={['WAREHOUSE_WORKER', 'ADMIN']}>
      <PackingListPage />
    </ProtectedRoute>
  );
}
