'use client';
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts with SSR disabled
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const Chart = ({ title, categories, data, color }) => {
  const { theme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;

  const chartOptions = {
    chart: {
      height: "100%",
      type: "area",
      toolbar: { show: false },
    },
    tooltip: {
      theme: currentTheme === "dark" ? "dark" : "light",
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        gradientToColors: [color],
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 2 },
    grid: { show: false },
    xaxis: { categories: categories || [] },
    yaxis: { show: false },
  };

  const chartSeries = [
    {
      name: title || "",
      data: data || [],
    },
  ];

  return (
    <div className="w-full">
      <ApexCharts
        options={chartOptions}
        series={chartSeries}
        type="area"
        height={300}
        width="100%"
      />
    </div>
  );
};

export default Chart;
