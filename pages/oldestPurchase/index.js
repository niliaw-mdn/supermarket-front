"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";

export default function OldestPurchaseTable() {
  const [order, setOrder] = useState(null);
  const [flag, setFlag] = useState(false); // Initialize as boolean false instead of null  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const phone = localStorage.getItem("phone");
  const name = localStorage.getItem("name");

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // First check the flag
      const flagRes = await fetch("http://localhost:5001/getPurchaseFlag");
      if (!flagRes.ok) {
        throw new Error("خطا در دریافت وضعیت سفارش");
      }

      const flagData = await flagRes.json();
      setFlag(flagData["Purchase Flag"]);

      // Only proceed if flag is true
      if (!flagData["Purchase Flag"]) {
        setOrder(null);
        return;
      }

      // Fetch purchase data
      const purchaseRes = await fetch("http://localhost:5001/oldestPurchase");
      if (!purchaseRes.ok) {
        throw new Error("خطا در دریافت اطلاعات سفارش");
      }

      setOrder(await purchaseRes.json());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async () => {
    if (!order?.purchase_data) return;

    try {
      // Convert the purchase_data to the format the API expects
      const payload = {};
      for (const [product_name, quantity] of Object.entries(
        order.purchase_data
      )) {
        payload[product_name] = quantity;
      }

      const response = await fetch(
        "http://localhost:5001/updateStockAfterOrder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "خطا در به‌روزرسانی موجودی");
      }

      toast.success("موجودی محصولات با موفقیت به روز شد");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const sendToInsertOrder = async () => {
    if (!order?.purchase_data) {
      toast.error("اطلاعات سفارش موجود نیست");
      return;
    }

    try {
      const payload = {
        customer_name: name || "مشتری ناشناس",
        customer_phone: phone || "00000000000",
        payment_method_id: 2,
        products: order.purchase_data,
      };

      const response = await fetch("http://localhost:5001/insertOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در ثبت سفارش");
      }

      toast.success(`سفارش با موفقیت ثبت شد. کد سفارش: ${data.order_id}`);
      await updateCustomerAfterOrder();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const updateCustomerAfterOrder = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/updateCustomerAfterOrder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customer_phone: phone }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در به‌روزرسانی اطلاعات مشتری");
      }

      toast.success("اطلاعات مشتری با موفقیت به‌روز شد");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const bg = isDark ? "bg-gray-900" : "bg-white";
  const text = isDark ? "text-gray-100" : "text-gray-900";
  const border = isDark ? "border-gray-700" : "border-gray-200";
  const cardBg = isDark ? "bg-gray-800" : "bg-gray-50";
  const headerBg = isDark ? "bg-gray-800" : "bg-gray-100";
  const hoverBg = isDark ? "hover:bg-gray-800" : "hover:bg-gray-50";

  // تبدیل purchase_data به آرایه
  const items = order?.purchase_data
    ? Object.entries(order.purchase_data).map(([product_name, quantity]) => ({
        product_name,
        quantity,
      }))
    : [];

  // محاسبه تعداد کل آیتم‌ها
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // تابع برای فرمت‌بندی نام محصولات
  const formatProductName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div
      className={`max-w-5xl m-5 mx-auto p-4 sm:p-6 ${bg} ${text} rounded-2xl shadow-lg`}
    >
      <Toaster position="top-center" />

      {/* هدر */}
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              سفارشات
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              نمایش قدیمی‌ترین سفارش سیستم
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {loading && order && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                در حال بروزرسانی...
              </span>
            )}
            {flag && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {flag}
              </span>
            )}
            {/* دکمه جدید برای به‌روزرسانی موجودی */}
            {order && (
              <>
                <button
                  onClick={updateStock}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  به‌روزرسانی موجودی
                </button>
                <button
                  onClick={sendToInsertOrder}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  ثبت نهایی سفارش
                </button>
              </>
            )}
          </div>
        </div>

        {/* کارت‌های اطلاعات */}
        {order ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-5 rounded-xl shadow-sm border ${border} ${cardBg} transition-all hover:shadow-md`}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="mr-2">
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      شناسه سفارش
                    </p>
                    <p className="font-bold text-lg">{order.purchase_id}</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-5 rounded-xl shadow-sm border ${border} ${cardBg} transition-all hover:shadow-md`}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="mr-2">
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      تاریخ ثبت
                    </p>
                    <p className="font-bold text-lg">{order.created_at}</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-5 rounded-xl shadow-sm border ${border} ${cardBg} transition-all hover:shadow-md`}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <div className="mr-2">
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      تعداد کل اقلام
                    </p>
                    <p className="font-bold text-lg">
                      {totalItems.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* جدول محصولات */}
            <div
              className={`rounded-xl overflow-hidden shadow-sm border ${border} mt-6`}
            >
              <div className={`px-6 py-4 ${headerBg} border-b ${border}`}>
                <h3 className="font-semibold flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  لیست محصولات
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={headerBg}>
                    <tr>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                          isDark ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        ردیف
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                          isDark ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        نام محصول
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                          isDark ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        تعداد
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                      isDark ? "bg-gray-900" : "bg-white"
                    }`}
                  >
                    {items.map((item, idx) => (
                      <tr key={idx} className={`${hoverBg} transition-colors`}>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              isDark
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${
                                isDark ? "bg-gray-700" : "bg-gray-100"
                              }`}
                            >
                              <span
                                className={`font-bold ${
                                  isDark ? "text-purple-400" : "text-purple-600"
                                }`}
                              >
                                {item.product_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="mr-3">
                              <div className="text-sm font-medium">
                                {formatProductName(item.product_name)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <span
                            className={`px-2 py-1 rounded-full ${
                              isDark
                                ? "bg-blue-900/50 text-blue-300"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {item.quantity.toLocaleString()} عدد
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`p-8 text-center rounded-xl border ${border} ${
              isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600"
            } flex flex-col items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium">سفارشی یافت نشد</p>
            <p className="text-sm mt-1">هیچ سفارشی در سیستم ثبت نشده است</p>
          </div>
        )}
      </div>
    </div>
  );
}

OldestPurchaseTable.showSidebar = true;
OldestPurchaseTable.isAdmin = false;
