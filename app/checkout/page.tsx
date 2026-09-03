"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Retrieve active items from localStorage if your app uses client-side cart state
    const savedCart = localStorage.getItem("cart");
    const cartItems = savedCart ? JSON.parse(savedCart) : [];

    const totalAmount = cartItems.reduce(
      (sum: number, item: any) => sum + Number(item.price) * item.quantity,
      0
    );

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: cartItems,
          total: totalAmount,
        }),
      });

      const data = await res.json();

      if (data.orderId) {
        localStorage.removeItem("cart");
        router.push(`/order/${data.orderId}`);
      } else {
        alert(data.error || "Order failed. Please try again.");
      }
    } catch (err) {
      alert("Something went wrong placing the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Checkout & Delivery Details</h1>
      <form onSubmit={handleCheckout} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            required
            name="name"
            placeholder="John Doe"
            onChange={handleChange}
            className="w-full border border-neutral-300 rounded-lg p-2.5 outline-none focus:border-black"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              required
              type="email"
              name="email"
              placeholder="john@example.com"
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg p-2.5 outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              required
              type="tel"
              name="phone"
              placeholder="+91 9876543210"
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg p-2.5 outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Street Address</label>
          <input
            required
            name="streetAddress"
            placeholder="Flat 101, Apartment Name, Street Name"
            onChange={handleChange}
            className="w-full border border-neutral-300 rounded-lg p-2.5 outline-none focus:border-black"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              required
              name="city"
              placeholder="Jaipur"
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg p-2.5 outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              required
              name="state"
              placeholder="Rajasthan"
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg p-2.5 outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Postal Code</label>
            <input
              required
              name="postalCode"
              placeholder="302001"
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg p-2.5 outline-none focus:border-black"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Processing Order..." : "Confirm & Place Order"}
        </button>
      </form>
    </main>
  );
}