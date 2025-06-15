import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Chart from "@/components/template/chart";
import { useTheme } from "next-themes";

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

  useEffect(() => {
    setMounted(true);
     const token = localStorage.getItem("access_token");

        if (!token) {
          router.push("/");
          return
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

    // 1. Fetch Daily Sales
    fetch("http://localhost:5000/stats/sales_by_date",{headers})
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
    fetch("http://localhost:5000/stats/sales_by_payment_method",{headers})
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((item) => ({
          payment_method_id: item[0] || "نامشخص",
          total_sales: item[1],
        }));
        setPaymentMethodSales(formattedData);

        const series = formattedData.map((item) => item.total_sales);
        const labels = formattedData.map(
          (item) => `روش ${item.payment_method_id}`
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
    fetch("http://localhost:5000/stats/top_products",{headers})
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
    <div className="p-4">
      <div className="flex justify-center">
        <table className="table-auto border-collapse border border-gray-500 my-10 w-[90%]">
          <thead className="bg-slate-600 text-white">
            <tr>
              <th className="px-4 py-5">تاریخ</th>
              <th className="px-4 py-5">فروش روزانه</th>
              <th className="px-4 py-5">تعداد تراکنش‌ها</th>
              <th className="px-4 py-5">میانگین ارزش تراکنش</th>
              <th className="px-4 py-5">تخفیف کل</th>
              <th className="px-4 py-5">پرفروش‌ترین محصول</th>
              <th className="px-4 py-5">روش پرداخت</th>
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
                <tr key={index} className={`${currentTheme === "dark" ? "odd:bg-gray-500 even:bg-gray-700" : "odd:bg-white even:bg-gray-200"} `}>
                  <td className=" px-4 py-2">
                    {new Date(item.date).toLocaleDateString("fa-IR")}
                  </td>
                  <td className=" px-4 py-2">
                    {item.daily_sales.toLocaleString()}
                  </td>
                  <td className=" px-4 py-2">{runningTransactions}</td>
                  <td className=" px-4 py-2">
                    {runningAvg.toLocaleString()}
                  </td>
                  <td className=" px-4 py-2">0</td>
                  <td className=" px-4 py-2">
                    {getRandom(bestProducts)}
                  </td>
                  <td className=" px-4 py-2">
                    {getRandom(
                      paymentMethodSales.map(
                        (p) => `روش ${p.payment_method_id}`
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-5 mr-10">
        {chartData?.dailyData && (
          <div className={` w-full flex flex-col items-center rounded ${currentTheme === "dark"? "bg-gray-800": "bg-white shadow"}`}>
            <Chart
              title={chartData.dailyData.title}
              categories={chartData.dailyData.categories}
              data={chartData.dailyData.data}
              color={chartData.dailyData.color}
            />
          </div>
        )}

        {chartData?.pieData && chartData.pieData.series.length > 0 && (
          <div className={` w-full flex flex-col items-center rounded ${currentTheme === "dark"? "bg-gray-800": "bg-white shadow"}`}>
            <button
              onClick={toggleLegend}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
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
              width={500}
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
