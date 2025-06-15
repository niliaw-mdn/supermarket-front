"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const customerPhone = localStorage.getItem("phone");
  useEffect(() => {
    if (customerPhone) {
      fetchOrders();
    }
  }, [customerPhone]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5001/get_customer_orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_phone: customerPhone }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        const error = await res.json();
        toast.error(error.error || "خطا در دریافت سفارش‌ها");
      }
    } catch (error) {
      toast.error("خطا در اتصال به سرور");
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5001/get_order_details/${orderId}`
      );
      if (res.ok) {
        const data = await res.json();
        setOrderDetails(data);
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
      } else {
        const error = await res.json();
        toast.error(error.error || "جزئیات سفارش یافت نشد");
      }
    } catch (error) {
      toast.error("ارتباط با سرور برقرار نشد");
    }
  };

  return (
    <div className="p-4">
      <Toaster />
      <h2 className="text-xl font-bold mb-4">سفارش‌های مشتری</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">شناسه سفارش</th>
              <th className="border p-2">نام مشتری</th>
              <th className="border p-2">مبلغ کل</th>
              <th className="border p-2">تاریخ</th>
              <th className="border p-2">جزئیات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50">
                <td className="border p-2">{order.order_id}</td>
                <td className="border p-2">{order.customer_name}</td>
                <td className="border p-2">{order.total}</td>
                <td className="border p-2">{order.date_time}</td>
                <td className="border p-2">
                  <button
                    onClick={() => fetchOrderDetails(order.order_id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    جزئیات
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 left-2 text-gray-500 hover:text-red-500 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4">
              جزئیات سفارش #{selectedOrderId}
            </h3>
            <table className="w-full border text-sm text-right">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-1">کد محصول</th>
                  <th className="border p-1">نام</th>
                  <th className="border p-1">دسته‌بندی</th>
                  <th className="border p-1">تعداد</th>
                  <th className="border p-1">قیمت واحد</th>
                  <th className="border p-1">قیمت کل</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border p-1">{item.product_id}</td>
                    <td className="border p-1">{item.name}</td>
                    <td className="border p-1">{item.category_name}</td>
                    <td className="border p-1">{item.quantity}</td>
                    <td className="border p-1">{item.ppu}</td>
                    <td className="border p-1">{item.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
CustomerOrders.showSidebar = true;
CustomerOrders.isAdmin = false;
