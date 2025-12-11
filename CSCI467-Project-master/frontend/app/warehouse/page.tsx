'use client';

import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";

function WarehouseDashboard() {
  const { user } = useAuth();

  return (
    <>
      <AdminHeader />
      <main className="p-8 bg-slate-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Warehouse Interface</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(user?.role === 'WAREHOUSE_WORKER' || user?.role === 'ADMIN') && (
            <>
              <Link
                href="/warehouse/packing"
                className="border rounded-lg p-6 bg-white shadow hover:shadow-lg transition"
              >
                <h2 className="font-semibold text-lg mb-2">Packing Lists</h2>
                <p className="text-sm text-gray-600">
                  View and print packing lists for orders ready to ship.
                </p>
              </Link>

              <Link
                href="/warehouse/shipping"
                className="border rounded-lg p-6 bg-white shadow hover:shadow-lg transition"
              >
                <h2 className="font-semibold text-lg mb-2">Mark as Shipped</h2>
                <p className="text-sm text-gray-600">
                  Update order status to shipped and print shipping labels.
                </p>
              </Link>
            </>
          )}

          {(user?.role === 'RECEIVING_DESK' || user?.role === 'ADMIN') && (
            <Link
              href="/warehouse/receiving"
              className="border rounded-lg p-6 bg-white shadow hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg mb-2">Receive Inventory</h2>
              <p className="text-sm text-gray-600">
                Add delivered products to inventory.
              </p>
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function WarehousePage() {
  return (
    <ProtectedRoute allowedRoles={['WAREHOUSE_WORKER', 'RECEIVING_DESK', 'ADMIN']}>
      <WarehouseDashboard />
    </ProtectedRoute>
  );
}