import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

function Profile() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;
  const [mounted, setMounted] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const customerPhone = localStorage.getItem("phone");

    if (!customerPhone) {
      console.error("شماره تماس در localStorage یافت نشد");
      return;
    }

    const fetchCustomer = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/get_customer_info",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer_phone: localStorage.getItem("phone"),
            }),
          }
        );

        const data = await response.json();

        // Process image path to ensure it starts with /customer_image/
        let imagePath = "/pic/avatar.png";
        if (data.image_address) {
          imagePath = data.image_address.startsWith("/customer_image")
            ? data.image_address
            : `/customer_image/${data.image_address.split("/").pop()}`;
        }

        setCustomer({
          customer_name: data.customer_name || "مشتری",
          customer_phone: data.customer_phone,
          membership_date: data.membership_date || "",
          number_of_purchases: data.number_of_purchases || 0,
          image_address: imagePath,
        });
      } catch (err) {
        setCustomer({
          customer_name: "میهمان",
          image_address: "/pic/avatar.png",
        });
      }
    };
    fetchCustomer();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/update_customer_info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("اطلاعات با موفقیت ذخیره شد");
      } else {
        alert(result.error || "خطا در ذخیره اطلاعات");
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("خطا در ارتباط با سرور");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-40px)] p-5">
      <div
        className={`flex flex-col w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-xl ${
          currentTheme === "dark"
            ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100"
            : "bg-gradient-to-br from-white to-gray-50 text-gray-900"
        }`}
      >
        {/* Profile Header */}
        <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative group">
              <Image
                src={
                  customer?.image_address?.startsWith("/customer_image")
                    ? `http://localhost:5001${customer.image_address}`
                    : customer?.image_address || "/pic/avatar.png"
                }
                alt="User Profile"
                width={160}
                height={160}
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "/pic/avatar.png";
                  e.target.onerror = null;
                }}
                unoptimized={true}
              />
              <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-blue-300 transition-all duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-6 text-center px-6">
          <h1 className="text-2xl font-bold mb-1">
            {customer?.customer_name || "میهمان"}
          </h1>
          <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-4 py-1 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            مشتری
          </div>
        </div>

        {/* Profile Form */}
        <form className="flex flex-col p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                نام کامل
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={customer?.customer_name || ""}
                  onChange={(e) =>
                    setCustomer({ ...customer, customer_name: e.target.value })
                  }
                  className={`w-full p-3 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    currentTheme === "dark"
                      ? "bg-gray-800 text-gray-100 placeholder-gray-400"
                      : "bg-white text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="نام خود را وارد کنید"
                />
                <div className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                شماره تماس
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="phone"
                  value={customer?.customer_phone || ""}
                  readOnly
                  className={`w-full p-3 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 ${
                    currentTheme === "dark"
                      ? "bg-gray-800/50 text-gray-400"
                      : "bg-gray-100 text-gray-500"
                  } cursor-not-allowed`}
                  placeholder="شماره تماس"
                />
                <div className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                تاریخ عضویت
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  value={customer?.membership_date?.split("T")[0] || ""}
                  readOnly
                  className={`w-full p-3 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 ${
                    currentTheme === "dark"
                      ? "bg-gray-800/50 text-gray-400"
                      : "bg-gray-100 text-gray-500"
                  } cursor-not-allowed`}
                />
                <div className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Purchases Field */}
            <div className="space-y-2">
              <label
                htmlFor="number"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                تعداد خریدها
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="number"
                  value={customer?.number_of_purchases || 0}
                  readOnly
                  className={`w-full p-3 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 ${
                    currentTheme === "dark"
                      ? "bg-gray-800/50 text-gray-400"
                      : "bg-gray-100 text-gray-500"
                  } cursor-not-allowed`}
                />
                <div className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            ذخیره تغییرات
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
Profile.showSidebar = true;
Profile.isAdmin = false;

export default Profile;
