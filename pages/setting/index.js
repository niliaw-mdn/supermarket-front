import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const Chart = dynamic(() => import("@/components/template/chart"), { ssr: false });

export default function Admin() {
  const [admin, setAdmin] = useState(null);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    fetch("/server/admin.json") // Ensure correct path to JSON file
      .then((res) => res.json())
      .then((data) => {
        setAdmin(data);
      })
      .catch((err) => {
        console.error("خطا در دریافت داده‌ها:", err);
      });
  }, []);


  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>در حال آماده‌سازی محیط...</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>اطلاعاتی یافت نشد.</p>
      </div>
    );
  }


  const performanceCategories = [
    "ساعات کاری",
    "اضافه‌کاری",
    "وظایف انجام‌شده",
    "کیفیت کار (%)",
    "حقوق (به میلیون تومان)",
  ];

  const performanceData = [
    admin.performance.workingHours,
    admin.performance.overtime,
    admin.performance.completedTasks,
    admin.performance.qualityScore,
    admin.performance.salary / 1000000, 
  ];

  


  return (
    <div className="m-5 flex items-center justify-center  p-6">
      <div className={`p-6  mx-auto border rounded-lg shadow-md w-auto ${currentTheme === "dark" ? "bg-gray-500" : "bg-white"}`}>
        <div className="flex items-center mb-4">
          <Image
            src={admin.avatar}
            alt={admin.name}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{admin.name}</h1>
            <p className="text-gray-600">{admin.role}</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">اطلاعات کلی:</h2>
          <p>تاریخ شروع: {admin.startDate}</p>
          <p>مهارت‌ها: {admin.skills.join(", ")}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">کارکرد:</h2>
          <ul className="pl-5">
            <li>ساعات کاری: {admin.performance.workingHours}</li>
            <li>اضافه‌کاری: {admin.performance.overtime}</li>
            <li>وظایف انجام‌شده: {admin.performance.completedTasks}</li>
            <li>کیفیت کار: {admin.performance.qualityScore}٪</li>
            <li>حقوق: {admin.performance.salary.toLocaleString()} تومان</li>
          </ul>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">نمودار عملکرد:</h2>
          <Chart
            title={`نمودار عملکرد ${admin.name}`}
            categories={performanceCategories}
            data={performanceData}
            color="#4CAF50"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold">اطلاعات تماس:</h2>
          <p>تلفن: {admin.contact.phone}</p>
          <p>ایمیل: {admin.contact.email}</p>
        </div>
      </div>
    </div>
  );
}
Admin.showSidebar =true;
Admin.isAdmin = true;
