'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import AdminHeader from '../../components/AdminHeader';
import Footer from '../../components/Footer';
import { ordersService } from '../../lib/api/services/orders.service';
import { toast } from 'sonner';

function ShippingPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['orders', { status: 'PACKING' }],
    queryFn: () => ordersService.getAll({ status: 'PACKING' }),
  });

  const shipMutation = useMutation({
    mutationFn: ordersService.markAsShipped,
    onSuccess: () => {
      toast.success('Order marked as shipped');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const orders = data?.orders || [];

  function handleShip(orderNumber: string) {
    if (confirm(`Mark order ${orderNumber} as shipped?`)) {
      shipMutation.mutate(orderNumber);
    }
  }

  return (
    <>
      <AdminHeader />
      <main className="p-8 bg-slate-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Mark Orders as Shipped</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 font-mono text-sm">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div>{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleShip(order.orderNumber)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Mark as Shipped
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-12 text-gray-500">No orders ready to ship</div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function ShippingPageWrapper() {
  return (
    <ProtectedRoute allowedRoles={['WAREHOUSE_WORKER', 'ADMIN']}>
      <ShippingPage />
    </ProtectedRoute>
  );
}
