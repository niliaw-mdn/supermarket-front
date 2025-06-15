import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useTheme } from "next-themes";

import { PiChartLineUpBold } from "react-icons/pi";
import { PiChartLineDownBold } from "react-icons/pi";

const ProductsTable = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const router = useRouter();
  const currentTheme = theme === "system" ? "light" : theme;

  const [mounted, setMounted] = useState(false);

  const [statistics, setStatistics] = useState({
    totalProfit: 0,
    averageDiscount: 0,
    profitAbove1000: 0,
    maxProfit: 0,
    minProfit: 0,
    negativeProfitProducts: 0,
    totalUnitsSold: 0,
    maxUnitsSold: 0,
    minUnitsSold: 0,
  });

  useEffect(() => {
    setMounted(true);
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          router.push("/");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const [
          totalProfit,
          averageDiscount,
          profitAbove1000,
          maxProfit,
          minProfit,
          negativeProfitProducts,
          totalUnitsSold,
          maxUnitsSold,
          minUnitsSold,
        ] = await Promise.all([
          axios.get("http://localhost:5000/total_profit", { headers }),
          axios.get("http://localhost:5000/average_discount", { headers }),
          axios.get("http://localhost:5000/profit_above_1000", { headers }),
          axios.get("http://localhost:5000/max_profit", { headers }),
          axios.get("http://localhost:5000/min_profit", { headers }),
          axios.get("http://localhost:5000/negative_profit_products", {
            headers,
          }),
          axios.get("http://localhost:5000/total_units_sold", { headers }),
          axios.get("http://localhost:5000/max_units_sold", { headers }),
          axios.get("http://localhost:5000/min_units_sold", { headers }),
        ]);

        setStatistics({
          totalProfit: totalProfit.data[0] || 0,
          averageDiscount: averageDiscount.data[0] || 0,
          profitAbove1000: profitAbove1000.data[0] || 0,
          maxProfit: maxProfit.data[0] || 0,
          minProfit: minProfit.data[0] || 0,
          negativeProfitProducts: negativeProfitProducts.data[0] || 0,
          totalUnitsSold: totalUnitsSold.data[0] || 0,
          maxUnitsSold: maxUnitsSold.data[0] || 0,
          minUnitsSold: minUnitsSold.data[0] || 0,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, [router]);
  if (!mounted) return null;
  return (
    <div className="container mx-auto p-4">
      <table className="table-auto font-light w-full">
        <thead>
          <tr
            className={`h-12  ${
              currentTheme === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <th className="font-light">آمار</th>
            <th className="font-light">مقدار</th>
            <th className="font-light"></th>
          </tr>
        </thead>
        <tbody>
          <tr className=" border-b border-b-gray-400">
            <td className="py-2 text-center px-3">سود کل</td>
            <td className="py-2 text-center px-3">{statistics.totalProfit}</td>
            <td className="py-2 text-center px-3 flex flex-row text-green-600">
              +<PiChartLineUpBold className="text-green-600" size={30} />
            </td>
          </tr>
          <tr className=" border-b border-b-gray-400">
            <td className="py-2 text-center px-3">میانگین تخفیف</td>
            <td className="py-2 text-center px-3">
              {statistics.averageDiscount}
            </td>
            <td className="py-2 text-center px-3 flex flex-row text-red-700">
              +<PiChartLineDownBold className="text-red-700" size={30} />
            </td>
          </tr>
          <tr className=" border-b border-b-gray-400">
            <td className="py-2 text-center px-3">
              تعداد محصولات با سود بیشتر از1000 تومان
            </td>
            <td className="py-2 text-center px-3">
              {statistics.profitAbove1000}
            </td>
            <td className="py-2 text-center px-3 flex flex-row text-green-600">
              +<PiChartLineUpBold className="text-green-600" size={30} />
            </td>
          </tr>
          <tr className=" border-b border-b-gray-400">
            <td className="py-2 text-center px-3">حداکثر سود</td>
            <td className="py-2 text-center px-3">{statistics.maxProfit}</td>
            <td className="py-2 text-center px-3 flex flex-row text-green-600">
              +<PiChartLineUpBold className="text-green-600" size={30} />
            </td>
          </tr>
          <tr className=" border-b border-b-gray-400">
            <td className="py-2 text-center px-3">حداقل سود</td>
            <td className="py-2 text-center px-3">{statistics.minProfit}</td>
            <td className="py-2 text-center px-3 flex flex-row text-green-600">
              +<PiChartLineUpBold className="text-green-600" size={30} />
            </td>
          </tr>
          <tr className=" border-b border-b-gray-400">
            <td className="py-2 text-center px-3">تعداد محصولات با سود منفی</td>
            <td className="py-2 text-center px-3">
              {statistics.negativeProfitProducts}
            </td>
            <td className="py-2 text-center px-3 flex flex-row text-red-700">
              +<PiChartLineDownBold className="text-red-700" size={30} />
            </td>
          </tr>
          <tr className=" border-b border-b-gray-400">
            <td className="py-2 text-center px-3">
              تعداد کل واحدهای فروخته شده
            </td>
            <td className="py-2 text-center px-3">
              {statistics.totalUnitsSold}
            </td>
            <td className="py-2 text-center px-3 flex flex-row text-green-600">
              +<PiChartLineUpBold className="text-green-600" size={30} />
            </td>
          </tr>
          <tr className=" border-b border-b-gray-400">
            <td className="py-2 text-center px-3">
              بیشترین تعداد واحد فروخته شده
            </td>
            <td className="py-2 text-center px-3">{statistics.maxUnitsSold}</td>
            <td className="py-2 text-center px-3 flex flex-row text-green-600">
              +<PiChartLineUpBold className="text-green-600" size={30} />
            </td>
          </tr>
          <tr>
            <td className="py-2 text-center px-3">
              کمترین تعداد واحد فروخته شده
            </td>
            <td className="py-2 text-center px-3">{statistics.minUnitsSold}</td>
            <td className="py-2 text-center px-3 flex flex-row text-red-700">
              +<PiChartLineDownBold className="text-red-700" size={30} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
