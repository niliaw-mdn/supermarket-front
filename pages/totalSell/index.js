import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Chart from "@/components/template/chart";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

function TotalSale() {
  const [dailySalesData, setDailySalesData] = useState([]);
  const [paymentMethodSales, setPaymentMethodSales] = useState([]);
  const [pieChartOptions, setPieChartOptions] = useState(null);
  const [showLegend, setShowLegend] = useState(false);

  // Mock data setup
  useEffect(() => {
    const fakeDailySales = [
      ["2025-05-10", 1500000],
      ["2025-05-11", 1800000],
      ["2025-05-12", 1200000],
      ["2025-05-13", 2000000],
      ["2025-05-14", 1700000],
    ];

    const fakePaymentMethods = [
      { payment_method: "کارت بانکی", total_sales: 3500000 },
      { payment_method: "نقدی", total_sales: 2000000 },
      { payment_method: "درگاه اینترنتی", total_sales: 2700000 },
    ];

    const categories = fakeDailySales.map((record) => {
      const date = new Date(record[0]);
      return date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    });

    const dailyData = fakeDailySales.map((record) => record[1]);
    const pieData = fakePaymentMethods.map((record) => record.total_sales);
    const labels = fakePaymentMethods.map((record) => record.payment_method);

    setDailySalesData(fakeDailySales);
    setPaymentMethodSales(fakePaymentMethods);

    setPieChartOptions({
      dailyData: {
        title: "فروش روزانه",
        categories: categories,
        data: dailyData,
        color: "#FF5733",
      },
      pieData: {
        series: pieData,
        options: {
          chart: { type: "pie" },
          labels: labels,
          legend: { show: false, position: "bottom" },
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
    });
  }, []);

  // Calculate total sales and transaction metrics
  const totalSales = dailySalesData.reduce((acc, record) => acc + record[1], 0);
  const totalTransactions = dailySalesData.length;
  const avgTransactionValue = totalTransactions
    ? (totalSales / totalTransactions).toFixed(0)
    : 0;

  // Mock data for best-selling products
  const bestSellingProducts = [
    "شامپو ضدشوره",
    "کفش ورزشی مردانه",
    "لباس مجلسی زنانه",
    "گوشی موبایل سامسونگ",
    "دوربین دیجیتال کانن",
  ];

  // Mock data for payment methods
  const paymentMethods = [
    "کارت بانکی",
    "نقدی",
    "درگاه اینترنتی",
  ];

  // Function to randomly pick a best-selling product and payment method
  const getRandomData = () => {
    const randomProduct =
      bestSellingProducts[Math.floor(Math.random() * bestSellingProducts.length)];
    const randomPaymentMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    return { randomProduct, randomPaymentMethod };
  };

  // Toggle pie chart legend
  const toggleLegend = () => {
    setPieChartOptions((prevOptions) => ({
      ...prevOptions,
      pieData: {
        ...prevOptions.pieData,
        options: {
          ...prevOptions.pieData.options,
          legend: {
            ...prevOptions.pieData.options.legend,
            show: !showLegend,
          },
        },
      },
    }));
    setShowLegend(!showLegend);
  };

  return (
    <div>
      <div className="flex justify-center">
        <table className="table-auto border-collapse border border-gray-300 my-10 w-[90%]">
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
            {dailySalesData.map((record, index) => {
              const runningTotalSales = dailySalesData.slice(0, index + 1).reduce((acc, record) => acc + record[1], 0);
              const runningTransactions = index + 1;
              const runningAvgTransactionValue = (runningTotalSales / runningTransactions).toFixed(0);

              // Get random data for each row
              const { randomProduct, randomPaymentMethod } = getRandomData();

              return (
                <tr key={index} className="odd:bg-white even:bg-gray-200">
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(record[0]).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{record[1]}</td>
                  <td className="border border-gray-300 px-4 py-2">{runningTransactions}</td>
                  <td className="border border-gray-300 px-4 py-2">{runningAvgTransactionValue}</td>
                  <td className="border border-gray-300 px-4 py-2">0</td>
                  <td className="border border-gray-300 px-4 py-2">{randomProduct}</td>
                  <td className="border border-gray-300 px-4 py-2">{randomPaymentMethod}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-row justify-evenly mb-5">
        <div className="bg-white border border-slate-300 shadow-md flex items-center rounded-md p-2">
          {pieChartOptions?.dailyData && (
            <Chart {...pieChartOptions.dailyData} />
          )}
        </div>
        <div className="flex flex-col bg-white p-10 border border-slate-300 shadow-md items-center rounded-md">
          {pieChartOptions?.pieData && (
            <ApexCharts
              options={pieChartOptions.pieData.options}
              series={pieChartOptions.pieData.series}
              type="pie"
              height="300"
              width="600"
            />
          )}
          <button
            className="mt-5 text-blue-600 font-normal text-right text-base"
            onClick={toggleLegend}
          >
            {showLegend ? "بستن" : "اطلاعات بیشتر..."}
          </button>
        </div>
      </div>
    </div>
  );
}
TotalSale.showSidebar = true;
export default TotalSale;
