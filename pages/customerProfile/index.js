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
    <div className="flex justify-center m-5 gap-5 mx-10">
      <div
        className={`flex flex-col w-[500px]  rounded-md shadow-md ${
          currentTheme === "dark" ? "bg-gray-900" : "bg-white"
        } `}
      >
        <div className="flex flex-col">
          <div className={`flex flex-col  items-center py-10`}>
            <Image
              src={
                customer?.image_address?.startsWith("/customer_image")
                  ? `http://localhost:5001${customer.image_address}`
                  : customer?.image_address || "/pic/avatar.png"
              }
              alt="User Profile"
              width={150}
              height={150}
              className="h-40 w-40 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "/pic/avatar.png";
                e.target.onerror = null;
              }}
              unoptimized={true}
            />
            <p className="pt-5">{customer?.customer_name || "میهمان"}</p>
            <p className="text-blue-600 text-base font-normal">مشتری</p>
          </div>
        </div>
        <div className="flex flex-col p-8">
          <div className="flex flex-col gap-1">
            <label htmlFor="name"> نام</label>
            <input
              type="text"
              id="name"
              value={customer?.customer_name || ""}
              onChange={(e) =>
                setCustomer({ ...customer, customer_name: e.target.value })
              }
              className={`p-1.5 ps-2 rounded-md focus:outline-none focus:ring focus:ring-blue-600 ${
                currentTheme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone"> شماره تماس</label>
            <input
              type="text"
              id="phone"
              value={customer?.customer_phone || ""}
              readOnly
              className={`p-1.5 ps-2 rounded-md focus:outline-none focus:ring focus:ring-blue-600 ${
                currentTheme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="date"> تاریخ ورود</label>
            <input
              type="date"
              id="date"
              value={customer?.membership_date?.split("T")[0] || ""}
              readOnly
              className={`p-1.5 ps-2 rounded-md focus:outline-none focus:ring focus:ring-blue-600 ${
                currentTheme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="number">تعداد خرید</label>
            <input
              type="number"
              id="number"
              value={customer?.number_of_purchases || 0}
              readOnly
              className={`p-1.5 ps-2 rounded-md focus:outline-none focus:ring focus:ring-blue-600 ${
                currentTheme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            />
          </div>
        </div>
        <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-violet-300 p-2 text-white w-28 rounded-md m-5"
        >
          ذخیره اطلاعات
        </button>
        </div>
      </div>
    </div>
  );
}
Profile.showSidebar = true;
Profile.isAdmin = false;

export default Profile;
