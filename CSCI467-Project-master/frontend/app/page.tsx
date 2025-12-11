"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useCart } from "./components/CartProvider";
import { productsService } from "./lib/api/services/products.service";
import { toast } from "sonner";

export default function Home() {
  const { cart, addToCart, removeFromCart } = useCart();

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getAll(),
  });

  const products = data?.products || [];
  const totalItems = Object.values(cart).reduce((s, n) => s + n, 0);
  const totalPrice = products.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);

  if (error) {
    toast.error('Failed to load products');
  }

  return (
    <>
      <Header />
      <main className="p-8 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Product Catalog</h1>
          <div className="bg-white p-3 rounded shadow text-right">
            <div className="text-sm text-gray-500">Cart</div>
            <div className="font-semibold">{totalItems} item{totalItems !== 1 ? 's' : ''}</div>
            <div className="text-sm text-gray-700">${totalPrice.toFixed(2)}</div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 bg-white shadow"
              >
                <img
                  src={product.pictureURL}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-3 rounded"
                />
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.description}</p>
                <p className="font-bold text-xl mt-1">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Available: {product.quantity}</p>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    disabled={!cart[product.id]}
                    className="px-3 py-1 rounded bg-red-500 text-white disabled:opacity-50"
                  >
                    -
                  </button>

                  <div className="min-w-[2rem] text-center">{cart[product.id] || 0}</div>

                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={(cart[product.id] || 0) >= product.quantity || product.quantity === 0}
                    className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}