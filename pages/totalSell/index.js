import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Chart from "@/components/template/chart";
import { useTheme } from "next-themes";
import * as XLSX from "xlsx";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

function TotalSale() {
  const [dailySalesData, setDailySalesData] = useState([]);
  const [paymentMethodSales, setPaymentMethodSales] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState({
    dailyData: null,
    pieData: null,
  });
  const paymentMethodMap = {
    1: "پرداخت نقدی",
    2: "کارت بانکی",
    3: "درگاه اینترنتی",
    4: "کیف پول دیجیتال",
    5: "ارز دیجیتال",
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dailySalesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "گزارش فروش");
    XLSX.writeFile(workbook, "daily-sales-report.xlsx");
  };
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // 1. Fetch Daily Sales
    fetch("http://localhost:5000/stats/sales_by_date", { headers })
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((item) => ({
          date: item[0],
          daily_sales: item[1],
        }));
        setDailySalesData(formattedData);

        const categories = formattedData.map((item) =>
          new Date(item.date).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        );
        const dailyData = formattedData.map((item) => item.daily_sales);

        setChartData((prev) => ({
          ...prev,
          dailyData: {
            title: "فروش روزانه",
            categories,
            data: dailyData,
            color: "#FF5733",
          },
        }));
      });

    // 2. Fetch Sales by Payment Method
    fetch("http://localhost:5000/stats/sales_by_payment_method", { headers })
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((item) => ({
          payment_method_id: item[0],
          payment_method_name: paymentMethodMap[item[0]] || "نامشخص",
          total_sales: item[1],
        }));
        setPaymentMethodSales(formattedData);

        const series = formattedData.map((item) => item.total_sales);
        const labels = formattedData.map(
          (item) =>
            paymentMethodMap[item.payment_method_id] ||
            `روش ${item.payment_method_id}`
        );

        setChartData((prev) => ({
          ...prev,
          pieData: {
            series,
            options: {
              chart: {
                type: "pie",
                height: 350,
              },
              labels,
              legend: {
                show: true,
                position: "bottom",
                labels: {
                  colors: "#333",
                },
              },
              colors: ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#DAF7A6"],
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: { width: 300 },
                    legend: { position: "bottom" },
                  },
                },
              ],
            },
          },
        }));
      });

    // 3. Fetch Top Products
    fetch("http://localhost:5000/stats/top_products", { headers })
      .then((res) => res.json())
      .then((data) => {
        setBestProducts(data.map((item) => item[0] || "نامشخص"));
      });
  }, []);

  const totalSales = dailySalesData.reduce(
    (acc, item) => acc + item.daily_sales,
    0
  );
  const totalTransactions = dailySalesData.length;
  const avgTransactionValue = totalTransactions
    ? (totalSales / totalTransactions).toFixed(0)
    : 0;

  const getRandom = (arr) =>
    arr.length ? arr[Math.floor(Math.random() * arr.length)] : "نامشخص";

  const toggleLegend = () => {
    setChartData((prev) => ({
      ...prev,
      pieData: {
        ...prev.pieData,
        options: {
          ...prev.pieData.options,
          legend: {
            ...prev.pieData.options.legend,
            show: !prev.pieData.options.legend.show,
          },
        },
      },
    }));
  };
  if (!mounted) return null;

  return (
    <div className="p-6 space-y-10">
      {/* هدر و دکمه‌های ابزار */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold">گزارش فروش روزانه</h2>

        <div className="flex flex-wrap gap-2">
          {/* خروجی اکسل */}
          <button
            onClick={handleExportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
          >
            خروجی Excel
          </button>

          {/* چاپ گزارش */}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition"
          >
            چاپ گزارش
          </button>
        </div>
      </div>

      {/* جدول فروش */}
      <div className="overflow-x-auto">
        <table
          className={`w-full text-sm rounded-xl overflow-hidden shadow-md border ${
            currentTheme === "dark"
              ? "bg-gray-800 text-gray-100 border-gray-700"
              : "bg-white text-gray-800 border-gray-300"
          }`}
        >
          <thead
            className={`text-xs font-semibold uppercase tracking-wide ${
              currentTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <tr>
              {[
                "تاریخ",
                "فروش روزانه",
                "تعداد تراکنش‌ها",
                "میانگین ارزش تراکنش",
                "تخفیف کل",
                "پرفروش‌ترین محصول",
                "روش پرداخت",
              ].map((label) => (
                <th
                  key={label}
                  className="px-6 py-4 whitespace-nowrap text-center"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dailySalesData.map((item, index) => {
              const runningTotalSales = dailySalesData
                .slice(0, index + 1)
                .reduce((acc, r) => acc + r.daily_sales, 0);
              const runningTransactions = index + 1;
              const runningAvg = (
                runningTotalSales / runningTransactions
              ).toFixed(0);

              return (
                <tr
                  key={index}
                  className={`text-center transition ${
                    currentTheme === "dark"
                      ? index % 2 === 0
                        ? "bg-gray-700/50"
                        : "bg-gray-800"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  } hover:bg-blue-100/20`}
                >
                  <td className="px-4 py-3">
                    {new Date(item.date).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-600">
                    {item.daily_sales.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{runningTransactions}</td>
                  <td className="px-4 py-3">{runningAvg.toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-500">۰</td>
                  <td className="px-4 py-3">{getRandom(bestProducts)}</td>
                  <td className="px-4 py-3">
                    {getRandom(
                      paymentMethodSales.map((p) => p.payment_method_name)
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
        {chartData?.dailyData && (
          <div
            className={`w-full p-6 rounded-xl shadow-lg ${
              currentTheme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-white text-gray-800"
            }`}
          >
            <Chart
              title={chartData.dailyData.title}
              categories={chartData.dailyData.categories}
              data={chartData.dailyData.data}
              color={chartData.dailyData.color}
            />
          </div>
        )}

        {chartData?.pieData && chartData.pieData.series.length > 0 && (
          <div
            className={`w-full p-6 rounded-xl shadow-lg flex flex-col items-center ${
              currentTheme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-white text-gray-800"
            }`}
          >
            <button
              onClick={toggleLegend}
              className="mb-6 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white text-sm"
            >
              {chartData.pieData.options.legend.show
                ? "پنهان کردن توضیحات"
                : "نمایش توضیحات"}
            </button>
            <ApexCharts
              options={chartData.pieData.options}
              series={chartData.pieData.series}
              type="pie"
              height={350}
              width="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
}

TotalSale.showSidebar = true;
TotalSale.isAdmin = true;

export default TotalSale;
