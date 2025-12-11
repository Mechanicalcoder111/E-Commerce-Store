'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import AdminHeader from '../../components/AdminHeader';
import Footer from '../../components/Footer';
import { ordersService } from '../../lib/api/services/orders.service';
import { toast } from 'sonner';
import { OrderFilters } from '../../lib/api/types';

function OrdersManagement() {
  const [filters, setFilters] = useState<OrderFilters>({});
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersService.getAll(filters),
  });

  console.log('Orders query:', { data, isLoading, error, orders: data?.orders });

  const cancelMutation = useMutation({
    mutationFn: ordersService.cancel,
    onSuccess: () => {
      toast.success('Order cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel order');
    },
  });

  const orders = data?.orders || [];

  function handleCancel(orderNumber: string) {
    if (confirm(`Are you sure you want to cancel order ${orderNumber}?`)) {
      cancelMutation.mutate(orderNumber);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <>
      <AdminHeader />
      <main className="p-8 bg-slate-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Filter Orders</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any || undefined })}
                className="w-full border rounded p-2"
              >
                <option value="">All</option>
                <option value="ORDERED">ORDERED</option>
                <option value="PACKING">PACKING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Customer Email</label>
              <input
                type="email"
                value={filters.customerEmail || ''}
                onChange={(e) => setFilters({ ...filters, customerEmail: e.target.value || undefined })}
                className="w-full border rounded p-2"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order ID</label>
              <input
                type="text"
                value={filters.orderId || ''}
                onChange={(e) => setFilters({ ...filters, orderId: e.target.value || undefined })}
                className="w-full border rounded p-2"
                placeholder="Order ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input
                type="text"
                value={filters.customerName || ''}
                onChange={(e) => setFilters({ ...filters, customerName: e.target.value || undefined })}
                className="w-full border rounded p-2"
                placeholder="Customer name"
              />
            </div>
          </form>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading orders...</div>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
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
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        order.status === 'SHIPPED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PACKING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">{new Date(order.orderedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      {order.status !== 'SHIPPED' && order.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancel(order.orderNumber)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-12 text-gray-500">No orders found</div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <OrdersManagement />
    </ProtectedRoute>
  );
}
