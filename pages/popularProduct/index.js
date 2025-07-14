import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
export default function PopularProduct() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          router.push("/");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        // Fetching each API endpoint sequentially
        const topProductsResponse = await axios.get(
          "http://localhost:5000/stats/top_products",
          { headers }
        );
        const popularCategoriesResponse = await axios.get(
          "http://localhost:5000/stats/most_popular_categories",
          { headers }
        );
        const peakHourResponse = await axios.get(
          "http://localhost:5000/stats/peak_order_hour",
          { headers }
        );
        const monthlyGrowthResponse = await axios.get(
          "http://localhost:5000/stats/monthly_sales_growth",
          { headers }
        );

        // Setting data from responses
        setData({
          topProducts: topProductsResponse.data,
          popularCategories: popularCategoriesResponse.data,
          peakHour: peakHourResponse.data,
          monthlyGrowth: monthlyGrowthResponse.data,
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state or if data is not yet fetched
  if (loading || !data)
    return <p className="text-center py-10">در حال بارگذاری...</p>;

  // Destructure data
  const { topProducts, popularCategories, peakHour, monthlyGrowth } = data;
  if (!mounted) return null;

  return (
    <div className="p-6 max-10 mx-auto space-y-6" dir="rtl">
      <h2 className="text-xl font-semibold">گزارش‌های آماری فروشگاه</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <section
          className={`rounded-xl shadow-lg p-6 transition-all hover:shadow-xl ${
            currentTheme === "dark"
              ? "bg-gray-800"
              : "bg-white border border-gray-100"
          }`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`p-3 rounded-lg ${
                currentTheme === "dark" ? "bg-gray-700" : "bg-blue-50"
              }`}
            >
              <span className="text-2xl">📦</span>
            </div>
            <h2 className="text-xl font-semibold mr-3">پرفروش‌ترین محصولات</h2>
          </div>
          <ul className="space-y-3">
            {topProducts.map((item, index) => (
              <li
                key={item.product_id}
                className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700"
              >
                <span className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    {index + 1}.
                  </span>
                  {item.name}
                </span>
                <span className="font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                  {item.total_quantity} عدد
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Popular Categories */}
        <section
          className={`rounded-xl shadow-lg p-6 transition-all hover:shadow-xl ${
            currentTheme === "dark"
              ? "bg-gray-800"
              : "bg-white border border-gray-100"
          }`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`p-3 rounded-lg ${
                currentTheme === "dark" ? "bg-gray-700" : "bg-purple-50"
              }`}
            >
              <span className="text-2xl">📁</span>
            </div>
            <h2 className="text-xl font-semibold mr-3">
              محبوب‌ترین دسته‌بندی‌ها
            </h2>
          </div>
          <ul className="space-y-3">
            {popularCategories.map((cat, index) => (
              <li
                key={cat.category_id}
                className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700"
              >
                <span className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    {index + 1}.
                  </span>
                  {cat.category_name}
                </span>
                <span className="font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                  {cat.order_count} سفارش
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Peak Hour */}
        <section
          className={`rounded-xl shadow-lg p-6 transition-all hover:shadow-xl ${
            currentTheme === "dark"
              ? "bg-gray-800"
              : "bg-white border border-gray-100"
          }`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`p-3 rounded-lg ${
                currentTheme === "dark" ? "bg-gray-700" : "bg-amber-50"
              }`}
            >
              <span className="text-2xl">⏰</span>
            </div>
            <h2 className="text-xl font-semibold mr-3">ساعت اوج سفارش</h2>
          </div>
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              بیشترین سفارش در ساعت
            </p>
            <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 my-3">
              {peakHour.hour}:00
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              با{" "}
              <span className="font-bold text-gray-800 dark:text-white">
                {peakHour.order_count}
              </span>{" "}
              سفارش
            </p>
          </div>
        </section>

        {/* Monthly Growth */}
        <section
          className={`rounded-xl shadow-lg p-6 transition-all hover:shadow-xl ${
            currentTheme === "dark"
              ? "bg-gray-800"
              : "bg-white border border-gray-100"
          }`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`p-3 rounded-lg ${
                currentTheme === "dark" ? "bg-gray-700" : "bg-green-50"
              }`}
            >
              <span className="text-2xl">📊</span>
            </div>
            <h2 className="text-xl font-semibold mr-3">رشد فروش ماهانه</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">
                فروش این ماه:
              </span>
              <span className="font-medium">
                {monthlyGrowth.current_sales.toLocaleString()} تومان
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">
                فروش ماه گذشته:
              </span>
              <span className="font-medium">
                {monthlyGrowth.previous_sales.toLocaleString()} تومان
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-300">نرخ رشد:</span>
              <span
                className={`font-bold text-lg ${
                  monthlyGrowth.growth_rate_percentage !== null &&
                  monthlyGrowth.growth_rate_percentage >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {monthlyGrowth.growth_rate_percentage !== null
                  ? `${
                      monthlyGrowth.growth_rate_percentage >= 0 ? "+" : ""
                    }${monthlyGrowth.growth_rate_percentage.toFixed(2)}%`
                  : "ندارد"}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
PopularProduct.showSidebar = true;
PopularProduct.isAdmin = true;
