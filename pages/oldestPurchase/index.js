"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";

export default function OldestPurchaseTable() {
  const [order, setOrder] = useState(null);
  const [flag, setFlag] = useState(null);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      const [purchaseRes, flagRes] = await Promise.all([
        fetch("http://localhost:5001/oldestPurchase"),
        fetch("http://localhost:5001/getPurchaseFlag"),
      ]);

      if (!purchaseRes.ok || !flagRes.ok) {
        toast.error("خطا در دریافت اطلاعات");
        setLoading(false);
        return;
      }

      const purchaseData = await purchaseRes.json();
      const flagData = await flagRes.json();

      setOrder(purchaseData);
      setFlag(flagData["Purchase Flag"]);
      setLoading(false);
    } catch (error) {
      toast.error("مشکل در اتصال به سرور");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const bg = isDark ? "bg-gray-900" : "bg-white";
  const text = isDark ? "text-gray-100" : "text-gray-900";
  const border = isDark ? "border-gray-700" : "border-gray-100";
  const muted = isDark ? "text-gray-400" : "text-gray-500";
  const headerBg = isDark ? "bg-gray-800" : "bg-gray-50";
  const hoverBg = isDark ? "bg-gray-800" : "bg-gray-50";

  return (
    <div className={`max-w-6xl m-5 rounded mx-auto p-4 sm:p-6 ${bg} ${text}`}>
      <Toaster position="top-center" />
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold">
            قدیمی‌ترین سفارش
            {loading && order && (
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                در حال بروزرسانی...
              </span>
            )}
          </h2>
          {flag && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {flag}
            </span>
          )}
        </div>

        {order ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ["شناسه سفارش", order.purchase_id],
                ["تاریخ ثبت", order.created_at],
                ["نام مشتری", order.purchase_data.customer_name],
                ["مبلغ کل", `${order.purchase_data.total?.toLocaleString()} تومان`],
              ].map(([label, value], idx) => (
                <div key={idx} className={`p-4 rounded-lg shadow-sm border ${border} ${bg}`}>
                  <p className={`text-sm ${muted}`}>{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>

            <div className={`overflow-hidden rounded-xl shadow-sm border ${border}`}>
              <table className="min-w-full divide-y">
                <thead className={headerBg}>
                  <tr>
                    {["کد محصول", "نام محصول", "دسته‌بندی", "تعداد", "قیمت واحد", "قیمت کل"].map((head, idx) => (
                      <th
                        key={idx}
                        className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${muted}`}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${border}`}>
                  {order.purchase_data.items?.map((item, idx) => (
                    <tr key={idx} className={`transition-colors hover:${hoverBg}`}>
                      <td className={`px-6 py-4 text-sm ${muted}`}>{item.product_id}</td>
                      <td className="px-6 py-4 text-sm font-medium">{item.name}</td>
                      <td className={`px-6 py-4 text-sm ${muted}`}>{item.category_name}</td>
                      <td className={`px-6 py-4 text-sm ${muted}`}>{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-green-600">{item.ppu.toLocaleString()} تومان</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">{item.total_price.toLocaleString()} تومان</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className={`p-8 text-center rounded-xl border ${border} ${isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600"}`}>
            سفارشی پیدا نشد.
          </div>
        )}
      </div>
    </div>
  );
}

OldestPurchaseTable.showSidebar = true;
OldestPurchaseTable.isAdmin = false;
