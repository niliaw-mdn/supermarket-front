import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

function Profile() {
  const { systemTheme, theme, setTheme } = useTheme();
  const router = useRouter();
  const currentTheme = theme === "system" ? "light" : theme;
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("email");

    if (!token) {
      router.push("/");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/get_user_info", {
          method: "POST",
          headers,
          body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (response.ok) {
          setUserData(result);
          console.log("User info:", result);
        } else {
          console.error(result.error || "خطا در دریافت اطلاعات");
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    };

    fetchUserInfo();
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-row m-5 gap-5 mx-10">
      <div
        className={`flex flex-col  rounded-md border border-slate-300 shadow-md ${
          currentTheme === "dark" ? "bg-gray-700" : "bg-white"
        } `}
      >
        <div className="flex flex-row">
          <div className="flex flex-col p-8">
            <p className=" text-gray-800  font-normal">
              نام
              <input
                type="text"
                defaultValue={userData?.first_name || ""}
                className="border-b-2 border-gray-400  w-96 h-9"
              />
            </p>
            <p className="pt-6 text-gray-800  font-normal">
              شماره تماس
              <input
                type="text"
                className="border-b-2 border-gray-400 w-96 h-9"
              />
            </p>
            <p className="pt-6 text-gray-800  font-normal">
              تاریخ تولد
              <input
                type="date"
                className="border-b-2 border-gray-400 w-96 h-9"
              />
            </p>
            <p className="pt-6 text-gray-800  font-normal">
              تاریخ ورود
              <input
                type="date"
                className="border-b-2 border-gray-400 w-96 h-9"
              />
            </p>
          </div>
          <div className="flex flex-col p-8">
            <p className=" text-gray-800  font-normal">
              نام خانوادگی
              <input
                type="text"
                className="border-b-2 border-gray-400 w-96 h-9"
              />
            </p>
            <p className="pt-6 text-gray-800  font-normal">
              آدرس ایمیل
              <input
                type="email"
                className="border-b-2 border-gray-400 w-96 h-9"
              />
            </p>
            <p className="pt-6 text-gray-800  font-normal">
              سابقه کاری
              <input
                type="number"
                className="border-b-2 border-gray-400 w-96 h-9"
              />
            </p>
            <p className="pt-6 text-gray-800  font-normal">
              کشور
              <input
                type="text"
                className="border-b-2 border-gray-400 w-96 h-9"
              />
            </p>
          </div>
        </div>
        <div className="flex flex-row">
          <button className="bg-violet-600 hover:bg-violet-300 p-2 text-white w-28 rounded-md m-5">
            save
          </button>
          <button className="bg-gray-200 hover:bg-gray-100 p-2 border  w-28 rounded-md m-5">
            cancel
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <div
          className={` rounded-md border border-slate-300 shadow-md flex flex-col ${
            currentTheme === "dark" ? "bg-gray-700" : "bg-white"
          } items-center py-10`}
        >
          <img src="pic/avatar.png" width={150} />
          <p className="pt-5">Niloofar Madani</p>
          <p className="text-gray-400 text-base font-normal">Front deeloper</p>
        </div>
        <div
          className={` mt-6 rounded-md border border-slate-300 shadow-md flex flex-col ${
            currentTheme === "dark" ? "bg-gray-700" : "bg-white"
          }  p-7`}
        >
          <h2>مهارت ها</h2>
          <div className="flex flex-wrap">
            <p className="p-2 bg-gray-200 text-gray-600 text-sm rounded-xl">
              Word
            </p>
            <p className="p-2 mx-5 bg-gray-200 text-gray-600 text-sm rounded-xl">
              Excel
            </p>
            <p className="p-2 bg-gray-200 text-gray-600 text-sm rounded-xl">
              PowerPoint{" "}
            </p>
            <p className="p-2 mx-5 bg-gray-200 text-gray-600 text-sm rounded-xl">
              Point of Sale
            </p>
            <p className="p-2  mt-3 bg-gray-200 text-gray-600 text-sm rounded-xl">
              QuickBooks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
Profile.showSidebar = true;
Profile.isAdmin = true;

export default Profile;
