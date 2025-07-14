import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import ProductsTable from "@/components/template/ProductsTable";
import Chart from "@/components/template/chart";
import { useTheme } from "next-themes";

import { MdFastfood } from "react-icons/md";
import { GiTeapotLeaves } from "react-icons/gi";
import { GiClothes } from "react-icons/gi";
import { FaChartLine } from "react-icons/fa";
import { TbMilk } from "react-icons/tb";
import { GiCannedFish } from "react-icons/gi";
import { GiFruitBowl } from "react-icons/gi";
import { GiEggClutch } from "react-icons/gi";
import { RiDrinks2Fill } from "react-icons/ri";
import { GiJellyBeans } from "react-icons/gi";
import { PiCheese } from "react-icons/pi";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { MdOutlineCleanHands } from "react-icons/md";
import { GiVacuumCleaner } from "react-icons/gi";
import { LuBaby } from "react-icons/lu";
import { GiSaltShaker } from "react-icons/gi";
import { TbMeat } from "react-icons/tb";
import { PiBowlSteamLight } from "react-icons/pi";
import { GiPickle } from "react-icons/gi";

function Performance() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;
  const [mounted, setMounted] = useState(false);
  const [salesData, setSalesData] = useState({
    daily: [],
    monthly: [],
    yearly: [],
  });

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          router.push("/");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [dailyRes, monthlyRes, yearlyRes, totalProductsRes] =
          await Promise.all([
            fetch("http://localhost:5000/stats/sales_by_date", { headers }),
            fetch("http://localhost:5000/stats/sales_by_month", { headers }),
            fetch("http://localhost:5000/stats/sales_by_year", { headers }),
            fetch("http://localhost:5000/total_products", { headers }),
          ]);

        const dailyData = await dailyRes.json();
        const monthlyData = await monthlyRes.json();
        const yearlyData = await yearlyRes.json();
        const totalProductsData = await totalProductsRes.json();

        const formatDate = (dateStr) => {
          const date = new Date(dateStr);
          return `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
        };

        setSalesData({
          daily: dailyData.map((item) => ({
            date: formatDate(item[0]),
            daily_sales: item[1],
          })),
          monthly: monthlyData.map((item) => ({
            month: item[0],
            monthly_sales: item[1],
          })),
          yearly: yearlyData.map((item) => ({
            year: item[0],
            yearly_sales: item[1],
          })),
        });

        const colors = [
          "#1ec0d5",
          "#fea11f",
          "#5db461",
          "#af24f0",
          "#ff5b5b",
          "#4a90e2",
          "#00b894",
          "#ff9f43",
          "#6c5ce7",
        ];

        const categoryRes = await fetch("http://localhost:5000/getcategory", {
          headers,
        });
        const categoryData = await categoryRes.json();
        setCategories([
          {
            category_id: "total",
            category_name: "تعداد کل محصولات",
            product_count: totalProductsData.total_products,
            icon: <FaChartLine className="text-white" size={60} />,
            color: "#af24f0",
          },
          ...categoryData.map((cat, index) => ({
            ...cat,
            icon:
              index === 0 ? (
                <MdFastfood className="text-white" size={60} />
              ) : index === 1 ? (
                <TbMilk className="text-white" size={60} />
              ) : index === 2 ? (
                <GiCannedFish className="text-white" size={60} />
              ) : index === 3 ? (
                <GiFruitBowl className="text-white" size={60} />
              ) : index === 4 ? (
                <GiEggClutch className="text-white" size={60} />
              ) : index === 5 ? (
                <RiDrinks2Fill className="text-white" size={60} />
              ) : index === 6 ? (
                <GiJellyBeans className="text-white" size={60} />
              ) : index === 7 ? (
                <PiCheese className="text-white" size={60} />
              ) : index === 8 ? (
                <LiaCookieBiteSolid className="text-white" size={60} />
              ) : index === 9 ? (
                <MdOutlineCleanHands className="text-white" size={60} />
              ) : index === 10 ? (
                <GiVacuumCleaner className="text-white" size={60} />
              ) : index === 11 ? (
                <LuBaby className="text-white" size={60} />
              ) : index === 12 ? (
                <GiSaltShaker className="text-white" size={60} />
              ) : index === 13 ? (
                <TbMeat className="text-white" size={60} />
              ) : index === 14 ? (
                <PiBowlSteamLight className="text-white" size={60} />
              ) : (
                <GiPickle className="text-white" size={60} />
              ),

            color: colors[index % colors.length],
          })),
        ]);
      } catch (err) {
      if (err.response && err.response.status === 401) {
        router.push("/");
      } else {
        console.error("Error fetching expired products:", err);
      }
    }
    };

    fetchData();
  }, [router]);

  const dailyData = {
    title: "مجموع فروش روزانه",
    categories: salesData.daily.map((item) => item.date),
    data: salesData.daily.map((item) => item.daily_sales),
    color: "#1A56DB",
  };

  const monthlyData = {
    title: "مجموع فروش ماهانه",
    categories: salesData.monthly.map((item) => item.month),
    data: salesData.monthly.map((item) => item.monthly_sales),
    color: "#FF5733",
  };

  const yearlyData = {
    title: "مجموع فروش سالانه",
    categories: salesData.yearly.map((item) => item.year),
    data: salesData.yearly.map((item) => item.yearly_sales),
    color: "#28A745",
  };
  if (!mounted) return null;

  return (
    <>
      <div className="m-5">
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 500,
            disableOnInteraction: false,
          }}
          spaceBetween={30}
          slidesPerView={1.2}
          loop={true}
          observer={true}
          observeParents={true}
          onSwiper={(swiper) => {
            setTimeout(() => {
              swiper.update();
            }, 100);
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {categories
            .filter(
              (cat) =>
                cat.category_name !== null && cat.category_name.trim() !== ""
            )
            .map((cat) => (
              <SwiperSlide key={cat.category_id}>
                <div className="relative w-full h-36 cursor-grab">
                  <div
                    className="absolute z-10 -top-4 right-3 flex justify-center shadow-md hover:shadow-none items-center w-24 h-24 rounded-md"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  {/* WHITE BOX */}
                  <div
                    className={` mt-10 rounded-md w-[350px] h-28 shadow relative z-0 ${
                      currentTheme === "dark" ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <div className="absolute whitespace-nowrap right-32 top-3 text-gray-500 font-normal">
                      {cat.category_name}
                      <div className="font-bold p-4 text-2xl">
                        {cat.product_count}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
        <div className="mt-16 flex justify-center">
          <div className="w-[90%] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            <div
              className={`flex-1 flex-col  border rounded-md shadow-md mt-20 ${
                currentTheme === "dark"
                  ? "bg-gray-800 border-zinc-700"
                  : "bg-white border-zinc-300"
              }`}
            >
              <p
                className={`w-full border-b h-14 p-3 ${
                  currentTheme === "dark"
                    ? " border-zinc-700"
                    : " border-zinc-300"
                }`}
              >
                کارکرد هفتگی
              </p>
              <Chart {...dailyData} />
            </div>

            <div
              className={`flex-1 flex-col  border not-last:rounded-md shadow-md mt-20 ${
                currentTheme === "dark"
                  ? "bg-gray-800 border-zinc-700"
                  : "bg-white border-zinc-300"
              }`}
            >
              <p
                className={`w-full border-b h-14 p-3 ${
                  currentTheme === "dark"
                    ? " border-zinc-700"
                    : " border-zinc-300"
                }`}
              >
                {" "}
                ماهیانه
              </p>
              <Chart {...monthlyData} />
            </div>

            <div
              className={`flex-1 flex-col  border  rounded-md shadow-md mt-20 ${
                currentTheme === "dark"
                  ? "bg-gray-800 border-zinc-700"
                  : "bg-white border-zinc-300"
              }`}
            >
              <p
                className={`w-full border-b h-14 p-3 ${
                  currentTheme === "dark"
                    ? " border-zinc-700"
                    : " border-zinc-300"
                }`}
              >
                کارکرد کلی
              </p>
              <Chart {...yearlyData} />
            </div>
            <div
              className={`flex-1 flex-col   border  rounded-md shadow-md mt-20 ${
                currentTheme === "dark"
                  ? "bg-gray-800 border-zinc-700"
                  : "bg-white border-zinc-300"
              }`}
            >
              <ProductsTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
Performance.showSidebar = true;
Performance.isAdmin = true;

export default Performance;
