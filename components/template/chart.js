import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const Chart = ({ title, categories, data, color }) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;

  const [mounted, setMounted] = useState(false);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: "100%",
      type: "area",
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      theme: currentTheme === "dark" ? "dark" : "light",
      enabled: true,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        gradientToColors: [color],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      show: false,
    },
  });

  const [chartSeries, setChartSeries] = useState([
    {
      name: title,
      data: data,
      colors:
      currentTheme === "dark" ? ["#2196f3", "#e7515a"] : ["#1b55e2", "#e7515a"],
    },
  ]);

  useEffect(() => {
    setMounted(true);
  
    setChartSeries([
      {
        name: title,
        data: data,
        colors:
          currentTheme === "dark"
            ? ["#2196f3", "#e7515a"]
            : ["#1b55e2", "#e7515a"],
      },
    ]);
  
    setChartOptions((prev) => ({
      ...prev,
      tooltip: {
        ...prev.tooltip,
        theme: currentTheme === "dark" ? "dark" : "light",
      },
    }));
  }, [title, categories, data, color, currentTheme]); // 🔥 Add currentTheme here
  

  if (!mounted) return null;

  return (
    <div className="w-full">
      <ApexCharts
        options={chartOptions}
        series={chartSeries}
        type="area"
        height="300"
        width="600"
      />
    </div>
  );
};

export default Chart;
