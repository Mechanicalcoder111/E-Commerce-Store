'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import AdminHeader from '../../components/AdminHeader';
import Footer from '../../components/Footer';
import { LoadingButton } from '../../components/LoadingButton';
import { productsService } from '../../lib/api/services/products.service';
import { inventoryService } from '../../lib/api/services/inventory.service';
import { toast } from 'sonner';

function ReceivingPage() {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getAll(),
  });

  const addMutation = useMutation({
    mutationFn: inventoryService.addInventory,
    onSuccess: () => {
      toast.success('Inventory added successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setProductId('');
      setQuantity('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const products = data?.products || [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addMutation.mutate({
      productId,
      quantity: parseInt(quantity),
    });
  }

  return (
    <>
      <AdminHeader />
      <main className="p-8 bg-slate-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Receive Inventory</h1>

        <div className="bg-white p-6 rounded shadow mb-6 max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Current: {product.quantity})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity to Add</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border rounded p-2"
                min="1"
                required
              />
            </div>
            <LoadingButton
              type="submit"
              isLoading={addMutation.isPending}
              loadingText="Adding..."
              className="w-full"
            >
              Add to Inventory
            </LoadingButton>
          </form>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Current Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-2xl font-bold text-blue-600">{product.quantity}</p>
                <p className="text-sm text-gray-500">in stock</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ReceivingPageWrapper() {
  return (
    <ProtectedRoute allowedRoles={['RECEIVING_DESK', 'ADMIN']}>
      <ReceivingPage />
    </ProtectedRoute>
  );
}
