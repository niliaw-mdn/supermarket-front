"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const { resolvedTheme } = useTheme();
  const [orderDetails, setOrderDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false); // Added missing state
  const [loading, setLoading] = useState(true);
  const [customerPhone, setCustomerPhone] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrderDetails = async (orderId) => {
    try {
      setSelectedOrderId(orderId);
      setModalLoading(true);

      const res = await fetch(
        `http://localhost:5001/get_order_details/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(
          error.message || error.error || `خطای سرور با وضعیت ${res.status}`
        );
      }

      const data = await res.json();
      setOrderDetails(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Fetch order details failed:", error);
      toast.error(error.message || "خطا در دریافت جزئیات سفارش");
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCustomerPhone(localStorage.getItem("phone"));
    }
  }, []);

  useEffect(() => {
    if (customerPhone) {
      fetchOrders();
    }
  }, [customerPhone]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/get_customer_orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_phone: customerPhone }),
      });

      if (res.ok) {
        const data = await res.json();
        // Ensure data is always an array
        setOrders(Array.isArray(data) ? data : []);
      } else {
        const error = await res.json();
        toast.error(error.error || "خطا در دریافت سفارش‌ها");
        setOrders([]); // Reset to empty array on error
      }
    } catch (error) {
      toast.error("خطا در اتصال به سرور");
      setOrders([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`m-5 p-6 rounded-lg ${
        resolvedTheme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <Toaster position="top-center" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">سفارش‌های من</h1>
        <p
          className={`${
            resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          مشاهده تاریخچه و جزئیات تمام سفارش‌ها
        </p>
      </div>

      {/* Orders Table */}
      <div
        className={`rounded-xl shadow-sm overflow-hidden ${
          resolvedTheme === "dark"
            ? "bg-gray-800"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead
              className={
                resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }
            >
              <tr>
                <th className="px-6 py-3 text-right font-medium uppercase tracking-wider">
                  شناسه سفارش
                </th>
                <th className="px-6 py-3 text-right font-medium uppercase tracking-wider">
                  نام مشتری
                </th>
                <th className="px-6 py-3 text-right font-medium uppercase tracking-wider">
                  مبلغ کل
                </th>
                <th className="px-6 py-3 text-right font-medium uppercase tracking-wider">
                  تاریخ
                </th>
                <th className="px-6 py-3 text-center font-medium uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.order_id}
                    className={`transition-colors hover:${
                      resolvedTheme === "dark" ? "bg-gray-700/80" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 dark:text-green-400 font-medium">
                      {order.total.toLocaleString()} تومان
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.date_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => fetchOrderDetails(order.order_id)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        جزئیات
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    {loading ? "در حال بارگذاری..." : "سفارشی یافت نشد"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {/* Order Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
              resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            {modalLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold">
                      جزئیات سفارش #{selectedOrderId}
                    </h2>
                    <p
                      className={`mt-1 ${
                        resolvedTheme === "dark"
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      مشاهده اقلام سفارش داده شده
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  className={`rounded-lg overflow-hidden ${
                    resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {orderDetails.length > 0 ? (
                    <table className="min-w-full">
                      <thead
                        className={
                          resolvedTheme === "dark"
                            ? "bg-gray-600"
                            : "bg-gray-200"
                        }
                      >
                        <tr>
                          <th className="px-4 py-3 text-right font-medium">
                            کد محصول
                          </th>
                          <th className="px-4 py-3 text-right font-medium">
                            نام
                          </th>
                          <th className="px-4 py-3 text-right font-medium">
                            دسته‌بندی
                          </th>
                          <th className="px-4 py-3 text-right font-medium">
                            تعداد
                          </th>
                          <th className="px-4 py-3 text-right font-medium">
                            قیمت واحد
                          </th>
                          <th className="px-4 py-3 text-right font-medium">
                            قیمت کل
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {orderDetails.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3">
                              {item.product_id || "--"}
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {item.product_name || "--"}
                            </td>
                            <td className="px-4 py-3">
                              {item.category_name || "--"}
                            </td>
                            <td className="px-4 py-3">
                              {item.quantity || "--"}
                            </td>
                            <td className="px-4 py-3 text-green-600 dark:text-green-400">
                              {item.ppu
                                ? item.ppu.toLocaleString() + " تومان"
                                : "--"}
                            </td>
                            <td className="px-4 py-3 font-medium text-green-600 dark:text-green-400">
                              {item.total_price
                                ? item.total_price.toLocaleString() + " تومان"
                                : "--"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      هیچ جزئیاتی برای این سفارش یافت نشد
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    بستن
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

CustomerOrders.showSidebar = true;
CustomerOrders.isAdmin = false;
