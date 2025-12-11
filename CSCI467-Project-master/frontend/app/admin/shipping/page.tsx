'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import AdminHeader from '../../components/AdminHeader';
import Footer from '../../components/Footer';
import { LoadingButton } from '../../components/LoadingButton';
import { shippingService } from '../../lib/api/services/shipping.service';
import { toast } from 'sonner';
import { ShippingBracket } from '../../lib/api/types';

function ShippingManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingBracket, setEditingBracket] = useState<ShippingBracket | null>(null);
  const [form, setForm] = useState({
    minWeight: '',
    maxWeight: '',
    cost: '',
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['shipping'],
    queryFn: () => shippingService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: shippingService.create,
    onSuccess: () => {
      toast.success('Shipping bracket created');
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      shippingService.update(id, data),
    onSuccess: () => {
      toast.success('Shipping bracket updated');
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: shippingService.delete,
    onSuccess: () => {
      toast.success('Shipping bracket deleted');
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const brackets = data?.brackets || [];

  function resetForm() {
    setForm({ minWeight: '', maxWeight: '', cost: '' });
    setShowForm(false);
    setEditingBracket(null);
  }

  function handleEdit(bracket: ShippingBracket) {
    setEditingBracket(bracket);
    setForm({
      minWeight: bracket.minWeight.toString(),
      maxWeight: bracket.maxWeight.toString(),
      cost: bracket.cost.toString(),
    });
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (confirm('Delete this shipping bracket?')) {
      deleteMutation.mutate(id);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bracketData = {
      minWeight: parseFloat(form.minWeight),
      maxWeight: parseFloat(form.maxWeight),
      cost: parseFloat(form.cost),
    };

    if (editingBracket) {
      updateMutation.mutate({ id: editingBracket.id, data: bracketData });
    } else {
      createMutation.mutate(bracketData);
    }
  }

  return (
    <>
      <AdminHeader />
      <main className="p-8 bg-slate-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Shipping Brackets</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancel' : 'Add Bracket'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingBracket ? 'Edit Bracket' : 'New Bracket'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Weight (lbs)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.minWeight}
                    onChange={(e) => setForm({ ...form, minWeight: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Weight (lbs)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.maxWeight}
                    onChange={(e) => setForm({ ...form, maxWeight: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <LoadingButton
                  type="submit"
                  isLoading={createMutation.isPending || updateMutation.isPending}
                  loadingText={editingBracket ? 'Updating...' : 'Creating...'}
                >
                  {editingBracket ? 'Update' : 'Create'}
                </LoadingButton>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brackets.map((bracket) => (
                  <tr key={bracket.id}>
                    <td className="px-6 py-4">{bracket.minWeight} lbs</td>
                    <td className="px-6 py-4">{bracket.maxWeight} lbs</td>
                    <td className="px-6 py-4">${bracket.cost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(bracket)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bracket.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
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

export default function ShippingPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <ShippingManagement />
    </ProtectedRoute>
  );
}
