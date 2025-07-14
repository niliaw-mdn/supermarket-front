import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

function Profile() {
  const { systemTheme, theme, setTheme } = useTheme();
  const router = useRouter();
  const currentTheme = theme === "system" ? "light" : theme;
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    birthday: "",
    membership_date: "",
    work_experience: "",
    country: "",
    skills: "",
    working_hours: "",
  });

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("email");

    if (!token) {
      router.push("/");
      return;
    }

    const fetchUserInfo = async () => {
      const loadingToast = toast.loading("در حال دریافت اطلاعات کاربر...");

      try {
        const response = await fetch("http://localhost:5000/get_user_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (response.ok) {
          setUserData({
            email: result.email || email,
            first_name: result.first_name || "",
            last_name: result.last_name || "",
            birthday: result.birthday ? result.birthday.split("T")[0] : "",
            membership_date: result.membership_date
              ? result.membership_date.split("T")[0]
              : "",
            work_experience: result.work_experience || "",
            country: result.country || "",
            skills: result.skills || "",
            working_hours: result.working_hours || "",
          });
          toast.dismiss(loadingToast);
        } else {
          toast.error(result.error || "خطا در دریافت اطلاعات کاربر", {
            id: loadingToast,
          });
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const saveToast = toast.loading("در حال ذخیره تغییرات...");
    try {
      const token = localStorage.getItem("access_token");
      const email = localStorage.getItem("email");

      if (!token || !email) {
        toast.error("لطفاً ابتدا وارد سیستم شوید", { id: saveToast });
        router.push("/login");
        return;
      }

      // Prepare the data to match your API expectations
      const updateData = {
        email: email, // Required by your API
        first_name: userData.first_name,
        last_name: userData.last_name,
        birthday: userData.birthday,
        work_experience: userData.work_experience,
        country: userData.country,
        skills: userData.skills,
        working_hours: userData.working_hours,
      };

      const response = await fetch("http://localhost:5000/update_user_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "اطلاعات با موفقیت ذخیره شد", {
          id: saveToast,
        });
      } else {
        toast.error(result.error || "خطا در ذخیره اطلاعات", { id: saveToast });
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("خطا در ارتباط با سرور", { id: saveToast });
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: currentTheme === "dark" ? "#1F2937" : "#FFFFFF",
            color: currentTheme === "dark" ? "#FFFFFF" : "#1F2937",
            border:
              currentTheme === "dark"
                ? "1px solid #374151"
                : "1px solid #E5E7EB",
          },
        }}
      />
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Profile Form Section */}
        <div
          className={`flex-1 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            currentTheme === "dark"
              ? "bg-gray-800"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              پروفایل کاربری
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    نام
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      currentTheme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    تاریخ تولد
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={userData.birthday}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      currentTheme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                {/* Skills Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    مهارت‌ها
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={userData.skills}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      currentTheme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    ساعات کاری (ساعت در هفته)
                  </label>
                  <input
                    type="number"
                    name="working_hours"
                    value={userData.working_hours}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      currentTheme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    نام خانوادگی
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      currentTheme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    آدرس ایمیل
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    readOnly
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      currentTheme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    سابقه کاری
                  </label>
                  <input
                    type="text"
                    name="work_experience"
                    value={userData.work_experience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      currentTheme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    کشور
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={userData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      currentTheme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Working Hours */}

            <div className="flex justify-end gap-4 mt-8">
              <button
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
                onClick={() => router.back()}
              >
                انصراف
              </button>
              <button
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
                onClick={handleSave}
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>

        {/* Profile Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Profile Card */}
          <div
            className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
              currentTheme === "dark"
                ? "bg-gray-800"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="p-6 flex flex-col items-center">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="/pic/avatar.png"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
                {userData.first_name || "کاربر"} {userData.last_name || ""}
              </h3>
              <p className="text-blue-500 dark:text-blue-400 font-medium">
                admin{" "}
              </p>
            </div>
          </div>

          {/* Skills Card */}
          <div
            className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
              currentTheme === "dark"
                ? "bg-gray-800"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">
                مهارت‌ها
              </h3>
              <div className="flex flex-wrap gap-3">
                {userData.skills ? (
                  userData.skills.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentTheme === "dark"
                          ? "bg-blue-900/30 text-blue-300"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    هیچ مهارتی ثبت نشده است
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Profile.showSidebar = true;
Profile.isAdmin = true;

export default Profile;
