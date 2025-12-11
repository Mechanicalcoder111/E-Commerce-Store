'use client';

import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Link from "next/link";

function AdminDashboard() {
  return (
    <>
      <AdminHeader />
      <main className="p-8 bg-slate-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Administrative Interface</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/products"
            className="border rounded-lg p-6 bg-white shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg mb-2">Products</h2>
            <p className="text-sm text-gray-600">
              Manage product catalog, add, edit, or remove products.
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="border rounded-lg p-6 bg-white shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg mb-2">Orders</h2>
            <p className="text-sm text-gray-600">
              Search and view orders by date, status, or price range.
            </p>
          </Link>

          <Link
            href="/admin/shipping"
            className="border rounded-lg p-6 bg-white shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg mb-2">Shipping Brackets</h2>
            <p className="text-sm text-gray-600">
              Set weight brackets and their associated charges.
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="border rounded-lg p-6 bg-white shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg mb-2">Users</h2>
            <p className="text-sm text-gray-600">
              Manage user accounts and create new staff members.
            </p>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}