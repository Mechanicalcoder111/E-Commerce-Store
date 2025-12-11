"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../components/CartProvider";
import { productsService } from "../lib/api/services/products.service";
import { ordersService } from "../lib/api/services/orders.service";
import { LoadingButton } from "../components/LoadingButton";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
    creditCard: "",
    creditCardName: "",
    creditCardExpiry: "",
    creditCardCVV: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getAll(),
  });

  const createOrderMutation = useMutation({
    mutationFn: ordersService.create,
    onSuccess: (data) => {
      console.log('Order created successfully:', data);
      toast.success('Order placed successfully!');
      clearCart();
      router.push(`/order-confirmation/${data.order.id}`);
    },
    onError: (error: Error) => {
      console.error('Order creation failed:', error);
      toast.error(error.message || 'Failed to place order');
    },
  });

  const products = data?.products || [];
  const cartItems = products.filter((p) => cart[p.id]);
  const totalItems = Object.values(cart).reduce((s, n) => s + n, 0);
  const totalPrice = products.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { id, value } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!form.email.includes("@"))
      errs.email = "Email must be valid.";
    if (!form.address.trim()) errs.address = "Address is required.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!form.state.trim()) errs.state = "State is required.";
    if (!form.zip.trim()) errs.zip = "ZIP code is required.";
    if (!form.creditCard.trim()) errs.creditCard = "Credit card is required.";
    if (!form.creditCardName.trim()) errs.creditCardName = "Cardholder name is required.";
    if (!form.creditCardExpiry.trim()) errs.creditCardExpiry = "Expiry date is required.";
    if (!form.creditCardCVV.trim()) errs.creditCardCVV = "CVV is required.";
    else if (!/^\d{3,4}$/.test(form.creditCardCVV)) errs.creditCardCVV = "CVV must be 3 or 4 digits.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      const orderData = {
        customerName: form.name,
        customerEmail: form.email,
        shippingAddress: form.address,
        shippingCity: form.city,
        shippingState: form.state,
        shippingZip: form.zip,
        shippingCountry: form.country,
        creditCard: form.creditCard,
        creditCardName: form.creditCardName,
        creditCardExpiry: form.creditCardExpiry,
        items: Object.entries(cart).map(([productId, quantity]) => ({
          productId,
          quantity,
        })),
      };
      createOrderMutation.mutate(orderData);
    }
  }

  const canSubmit = totalItems > 0 && !createOrderMutation.isPending;

  return (
    <>
      <Header />
      <main className="p-8 bg-slate-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Enter your name"
              />
              {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Enter your email"
              />
              {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Street address"
              />
              {errors.address && <div className="text-red-600 text-sm mt-1">{errors.address}</div>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
                {errors.city && <div className="text-red-600 text-sm mt-1">{errors.city}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="state">
                  State
                </label>
                <input
                  id="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
                {errors.state && <div className="text-red-600 text-sm mt-1">{errors.state}</div>}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="zip">
                ZIP Code
              </label>
              <input
                id="zip"
                value={form.zip}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              {errors.zip && <div className="text-red-600 text-sm mt-1">{errors.zip}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="creditCard">
                Credit Card Number
              </label>
              <input
                id="creditCard"
                value={form.creditCard}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="4532015112830366"
              />
              {errors.creditCard && <div className="text-red-600 text-sm mt-1">{errors.creditCard}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="creditCardName">
                Cardholder Name
              </label>
              <input
                id="creditCardName"
                value={form.creditCardName}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              {errors.creditCardName && <div className="text-red-600 text-sm mt-1">{errors.creditCardName}</div>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="creditCardExpiry">
                  Expiry Date (MM/YYYY)
                </label>
                <input
                  id="creditCardExpiry"
                  value={form.creditCardExpiry}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  placeholder="12/2025"
                />
                {errors.creditCardExpiry && <div className="text-red-600 text-sm mt-1">{errors.creditCardExpiry}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="creditCardCVV">
                  CVV
                </label>
                <input
                  id="creditCardCVV"
                  type="text"
                  value={form.creditCardCVV}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  placeholder="123"
                  maxLength={4}
                />
                {errors.creditCardCVV && <div className="text-red-600 text-sm mt-1">{errors.creditCardCVV}</div>}
              </div>
            </div>

            <LoadingButton
              type="submit"
              disabled={!canSubmit}
              isLoading={createOrderMutation.isPending}
              loadingText="Placing Order..."
              className="w-full"
            >
              Place Order
            </LoadingButton>

            {!totalItems && <div className="text-sm text-gray-500 mt-2">Your cart is empty — add items before checking out.</div>}
          </form>

          <aside className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="text-sm text-gray-600 mb-2">Items: {totalItems}</div>
            <div className="font-bold text-lg">Total: ${totalPrice.toFixed(2)}</div>
            <ul className="mt-4 space-y-2">
              {cartItems.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>{p.name} x {cart[p.id]}</span>
                  <span>${((cart[p.id] || 0) * p.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}