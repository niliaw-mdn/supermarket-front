import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import toast from "react-hot-toast";

const Calendar = dynamic(
  () => import("react-multi-date-picker").then((mod) => mod.Calendar),
  {
    ssr: false,
  }
);

import { RxDoubleArrowRight } from "react-icons/rx";
import { IoMenuOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import { PiNotePencilDuotone } from "react-icons/pi";
import { BsChatText } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { GoSun } from "react-icons/go";
import { RiHome6Fill } from "react-icons/ri";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";
import { TbFileReport } from "react-icons/tb";
import { FaMoneyBillWave } from "react-icons/fa6";
import { SiGitbook } from "react-icons/si";
import { MdPeopleAlt } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdSupportAgent } from "react-icons/md";
import { GrNotes } from "react-icons/gr";
import { IoPersonOutline } from "react-icons/io5";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { RiPassExpiredLine } from "react-icons/ri";

export default function SidebarAdmin({ isOpen, setIsOpen }) {
  const [openUser, setOpenUser] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef(null);
  const router = useRouter();
  const toggleMenu = () => setIsOpen(!isOpen);
  const [open, setOpen] = useState(false);
  const [dropStates, setDropStates] = useState({
    products: false,
    reports: false,
    finance: false,
    users: false,
    authentication: false,
    support: false,
  });
   const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birthday: "",
  });
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;

  const [mounted, setMounted] = useState(false);

  const [windowWidth, setWindowWidth] = useState(0);


  const toggleDropdownUser = () => setOpenUser((prev) => !prev);
  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenUser(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

   useEffect(() => {
  const timer = setTimeout(() => {
    if (searchValue.trim()) {
      router.push({
        pathname: router.pathname,
        query: { search: searchValue },
      });
    } else {
      router.push(router.pathname);
    }
  }, 500);

  return () => clearTimeout(timer);
}, [searchValue, router]);


  useEffect(() => {
    if (windowWidth >= 1024) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [windowWidth]);
   const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

  const fetchUserInfo = async () => {
    if (!token || !email) return; // اگر token یا email نبود، نرو جلو

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
          birthday:
            result.birthday && typeof result.birthday === "string"
              ? new Date(result.birthday).toISOString().split("T")[0]
              : "",
        });
        toast.dismiss(loadingToast);
      } else {
        toast.error(result.error || "خطا در دریافت اطلاعات کاربر", { id: loadingToast });
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("خطا در دریافت اطلاعات کاربر", { id: loadingToast });
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [token, email]);

  useEffect(() => {
    setDropStates((prevState) => ({
      ...prevState,
      products:
        router.pathname === "/allProduct" || router.pathname === "/addItem",
      reports:
        router.pathname === "/totalSell" ||
        router.pathname === "/popularProduct",

      users: router.pathname === "/profile" || router.pathname === "/setting",
      authentication:
        router.pathname === "/login" || router.pathname === "/singUp",
      support:
        router.pathname === "/sendTicket" ||
        router.pathname === "/mngTicket" ||
        router.pathname === "/educationCenter",
    }));
  }, [router.pathname]);

  const toggleDropdown = (dropdown) => {
    setDropStates((prevState) => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === dropdown ? !prevState[key] : false;
        return acc;
      }, {});
      return newState;
    });
  };

  if (!mounted) return null;

  return (
    <>
      {/* header section*/}
      <div
        className={`sticky top-0 z-30 flex justify-between w-full items-center p-4 shadow-md ${
          currentTheme === "dark" ? "bg-[#0e1726]" : "bg-white"
        }`}
      >
        <div className="flex max-sm:gap-2.5 gap-4 items-center">
          <a href="/" className="flex items-center gap-2">
            <Image
              className="w-8 h-8"
              src="/pic/logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
            <span className="text-2xl font-semibold hidden md:inline">
              فروشگاه آنلاین
            </span>
          </a>

          <button
            onClick={toggleMenu}
            className={`relative flex justify-center items-center w-10 h-10 max-sm:h-7 max-sm:w-7 p-2 rounded-full hover:text-blue-900 ${
              currentTheme === "dark"
                ? "bg-[#282b3b] text-[#d0d2d6]"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <IoMenuOutline className="text-xl" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`relative w-10 h-10 max-sm:h-7 max-sm:w-7 p-2 flex justify-center items-center rounded-full hover:text-blue-900 ${
                currentTheme === "dark"
                  ? "bg-[#282b3b] text-[#d0d2d6]"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <CiCalendar size={50} />
            </button>

            {showCalendar && (
              <div className="absolute right-0 z-50 mt-2">
                <Calendar
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-left"
                  readOnly
                />
              </div>
            )}
          </div>

          <div className="relative flex items-center">
            <button
              onClick={() => setOpen(!open)}
              className={`relative w-10 h-10 max-sm:h-7 max-sm:w-7 p-2 flex justify-center items-center rounded-full hover:text-blue-900 ${
                currentTheme === "dark"
                  ? "bg-[#282b3b] text-[#d0d2d6]"
                  : "bg-gray-100 text-gray-700"
              } z-30`}
            >
              <IoSearch className="text-xl" />
            </button>

            {open && (
              <input
                type="text"
                autoFocus
                placeholder="جستجو..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    router.push({
                      query: { search: searchValue },
                    });
                    setOpen(false);
                    setSearchValue("");
                  }
                }}
                className={`absolute right-12 w-48 p-2 px-3 outline-none focus:ring focus:ring-purple-500 rounded placeholder:text-sm placeholder:tracking-wider transition-all duration-300 ${
                  currentTheme === "dark" ? "bg-[#282b3b]" : "bg-gray-100"
                }`}
              />
            )}
          </div>
        </div>

        <div className="flex justify-center items-center gap-x-3">
          <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            type="button"
            className={`relative w-10 h-10 max-sm:h-7 max-sm:w-7 p-2 flex justify-center items-center rounded-full hover:text-blue-900 ${
              currentTheme === "dark"
                ? "bg-[#282b3b] text-[#d0d2d6]"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {currentTheme === "dark" ? (
              <IoMoonOutline className="text-xl" />
            ) : (
              <GoSun className="text-xl" />
            )}
          </button>

          <div ref={dropdownRef} className="relative flex items-center">
            <button onClick={toggleDropdownUser} className="group relative">
              <Image
                src="/pic/avatar.png"
                alt="User Profile"
                width={36}
                height={36}
                className="h-10 w-10 max-sm:h-7 max-sm:w-7 rounded-full object-cover saturate-50 group-hover:saturate-100"
              />
            </button>

            {openUser && (
              <ul
                className={`absolute top-11 left-0 w-[230px] py-0 font-mono text-gray-500 rounded shadow z-50 ${
                  currentTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <li className="px-4 py-4 flex gap-1.5 items-center">
                  <Image
                    src="/pic/avatar.png"
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <div className="truncate pl-4">
                    <h4
                      className={`text-base ${
                        currentTheme === "dark" ? "text-white" : "text-black"
                      } `}
                    >
         {userData.first_name} {userData.last_name}
                      <span className="mr-2 rounded bg-green-100 px-1.5 text-xs text-green-600">
                        admin
                      </span>
                    </h4>
                    <a
                      href="#"
                      className="text-black/60 text-xs hover:text-blue-600"
                    >
                      {userData.email}
                    </a>
                  </div>
                </li>

                <li>
                  <Link
                    href="/profile"
                    className="flex items-center gap-1 px-4 py-1 hover:text-blue-600 hover:bg-blue-300/10"
                    onClick={() => setOpenUser(false)}
                  >
                    <span className="m-2">
                      <IoPersonOutline size={20} />
                    </span>
                    <p> پروفایل</p>
                  </Link>
                </li>

                
              </ul>
            )}
          </div>
        </div>
      </div>
      {/* sidebar section*/}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className={`fixed right-0 top-0 w-[270px] h-screen ${
                currentTheme === "dark" ? "bg-[#0e1726]" : "bg-white"
              } shadow-2xl z-40`}
            >
              <div className="sticky top-0 flex items-center justify-between px-3 py-4 bg-inherit">
                <a href="/" className="flex items-center gap-2">
                  <Image
                    src="/pic/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <span className="text-2xl whitespace-nowrap font-semibold hidden md:inline">
                    فروشگاه آنلاین
                  </span>
                </a>

                <button
                  onClick={toggleMenu}
                  className="flex items-center justify-center"
                >
                  <RxDoubleArrowRight
                    className={`text-xl w-10 h-10 p-2  rounded-full  ${
                      currentTheme === "dark"
                        ? "hover:bg-[#282b3b] text-[#d0d2d6]"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                <ul>
                  <li>
                    <a
                      href="/dashboard"
                      onClick={toggleMenu}
                      className={`flex justify-center items-center group ${
                        currentTheme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      <div
                        className={`flex w-[90%] rounded-md p-2 ${
                          currentTheme === "dark"
                            ? "group-hover:bg-gray-800"
                            : "group-hover:bg-gray-200"
                        }  ${
                          router.pathname === "/dashboard"
                            ? currentTheme === "dark"
                              ? "bg-gray-800"
                              : "bg-gray-200"
                            : ""
                        }`}
                      >
                        <RiHome6Fill
                          className="shrink-0 text-gray-500 group-hover:text-blue-700"
                          size={22}
                        />
                        <span className="ltr:pl-3 rtl:pr-3 text-[#647492]">
                          داشبورد
                        </span>
                      </div>
                    </a>
                  </li>

                  <h2
                    className={`w-full my-1 flex items-center px-7 py-3 uppercase ${
                      currentTheme === "dark" ? "bg-[#292f506b]" : "bg-gray-100"
                    }`}
                  >
                    <span>دسترسی ها</span>
                  </h2>

                  <li className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => toggleDropdown("products")}
                      className={`nav-link group flex items-center justify-between w-[90%] rounded-md mb-1 p-2 group ${
                        currentTheme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-200"
                      }  ${
                        router.pathname === "/allProduct" ||
                        router.pathname === "/addIem"
                          ? currentTheme === "dark"
                            ? "bg-gray-800"
                            : "bg-gray-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <AiFillProduct
                          className="shrink-0 text-gray-500 group-hover:text-blue-700"
                          size={22}
                        />
                        <span className="ltr:pl-3 rtl:pr-3 text-[#506690]">
                          محصولات
                        </span>
                      </div>

                      <div
                        className={`transition-transform ${
                          dropStates.products ? "rotate-270" : "rotate-0"
                        }`}
                      >
                        <IoIosArrowBack />
                      </div>
                    </button>

                    <ul
                      className={`w-[90%] flex flex-col gap-1 overflow-hidden text-gray-500 transition-all duration-300 ${
                        dropStates.products
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <li className="group">
                        <a
                          href="/allProduct"
                          className={`flex rounded-md p-2 pr-8 group-hover:text-blue-700 ${
                            currentTheme === "dark"
                              ? "group-hover:bg-[#2527396b]"
                              : "group-hover:bg-blue-600/10"
                          } ${
                            router.pathname === "/allProduct"
                              ? "text-blue-700"
                              : ""
                          }`}
                        >
                          - موجودی ها
                        </a>
                      </li>
                      <li className="group">
                        <a
                          href="/addItem"
                          className={`flex rounded-md p-2 pr-8 group-hover:text-blue-700 ${
                            currentTheme === "dark"
                              ? "group-hover:bg-[#2527396b]"
                              : "group-hover:bg-blue-600/10"
                          } ${
                            router.pathname === "/addItem"
                              ? "text-blue-700"
                              : ""
                          }`}
                        >
                          - افزودن محصول
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => toggleDropdown("reports")}
                      className={`nav-link group flex items-center justify-between w-[90%] rounded-md mb-1 p-2 group ${
                        currentTheme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-200"
                      } ${
                        router.pathname === "/totalSell" ||
                        router.pathname === "/popularProduct"
                          ? currentTheme === "dark"
                            ? "bg-gray-800"
                            : "bg-gray-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <TbFileReport
                          className="shrink-0 text-gray-500 group-hover:text-blue-700"
                          size={22}
                        />
                        <span className="ltr:pl-3 rtl:pr-3 text-[#506690]">
                          گزارشات
                        </span>
                      </div>

                      <div
                        className={`transition-transform ${
                          dropStates.reports ? "rotate-270" : "rotate-0"
                        }`}
                      >
                        <IoIosArrowBack />
                      </div>
                    </button>

                    <ul
                      className={`w-[90%] flex flex-col gap-1 overflow-hidden text-gray-500 transition-all duration-300 ${
                        dropStates.reports
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <li className="group">
                        <a
                          href="/totalSell"
                          className={`flex rounded-md p-2 pr-8 group-hover:text-blue-700 ${
                            currentTheme === "dark"
                              ? "group-hover:bg-[#2527396b]"
                              : "group-hover:bg-blue-600/10"
                          } ${
                            router.pathname === "/totalSell"
                              ? "text-blue-700"
                              : ""
                          }`}
                        >
                          - فروش کل
                        </a>
                      </li>
                      <li className="group">
                        <a
                          href="/popularProduct"
                          className={`flex rounded-md p-2 pr-8 group-hover:text-blue-700 ${
                            currentTheme === "dark"
                              ? "group-hover:bg-[#2527396b]"
                              : "group-hover:bg-blue-600/10"
                          } ${
                            router.pathname === "/popularProduct"
                              ? "text-blue-700"
                              : ""
                          }`}
                        >
                          - محصولات پرفروش
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <a
                      href="/expiredProduct"
                      onClick={toggleMenu}
                      className={`flex justify-center items-center group ${
                        currentTheme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      <div
                        className={`flex w-[90%] rounded-md p-2 ${
                          currentTheme === "dark"
                            ? "group-hover:bg-gray-800"
                            : "group-hover:bg-gray-200"
                        } ${
                          router.pathname === "/expiredProduct"
                            ? currentTheme === "dark"
                              ? "bg-gray-800"
                              : "bg-gray-200"
                            : ""
                        }
                        `}
                      >
                        <RiPassExpiredLine
                          className="shrink-0 text-gray-500 group-hover:text-blue-700"
                          size={22}
                        />
                        <span className="ltr:pl-3 rtl:pr-3 text-[#506690]">
                          محصولات منقضی
                        </span>
                      </div>
                    </a>
                  </li>
                  <h2
                    className={`w-full my-1 flex items-center px-7 py-3 uppercase ${
                      currentTheme === "dark" ? "bg-[#292f506b]" : "bg-gray-100"
                    }`}
                  >
                    <span>مدیریت کاربران</span>
                  </h2>
                  <li className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => toggleDropdown("users")}
                      className={`nav-link group flex items-center justify-between w-[90%] rounded-md mb-1 p-2 group ${
                        currentTheme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-200"
                      } ${
                        router.pathname === "/profile" ||
                        router.pathname === "/setting"
                          ? currentTheme === "dark"
                            ? "bg-gray-800"
                            : "bg-gray-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <MdPeopleAlt
                          className="shrink-0 text-gray-500 group-hover:text-blue-700"
                          size={22}
                        />
                        <span className="ltr:pl-3 rtl:pr-3 text-[#506690]">
                          کاربران
                        </span>
                      </div>

                      <div
                        className={`transition-transform ${
                          dropStates.users ? "rotate-270" : "rotate-0"
                        }`}
                      >
                        <IoIosArrowBack />
                      </div>
                    </button>

                    <ul
                      className={`w-[90%] flex flex-col gap-1 overflow-hidden text-gray-500 transition-all duration-300 ${
                        dropStates.users
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <li className="group">
                        <a
                          href="/profile"
                          className={`flex rounded-md p-2 pr-8 group-hover:text-blue-700 ${
                            currentTheme === "dark"
                              ? "group-hover:bg-[#2527396b]"
                              : "group-hover:bg-blue-600/10"
                          }  ${
                            router.pathname === "/profile"
                              ? "text-blue-700"
                              : ""
                          }`}
                        >
                          - پروفایل
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => toggleDropdown("authentication")}
                      className={`nav-link group flex items-center justify-between w-[90%] rounded-md mb-1 p-2 group ${
                        currentTheme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-200"
                      }${
                        router.pathname === "/login" ||
                        router.pathname === "/signUp"
                          ? currentTheme === "dark"
                            ? "bg-gray-800"
                            : "bg-gray-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <RiLockPasswordFill
                          className="shrink-0 text-gray-500 group-hover:text-blue-700"
                          size={22}
                        />
                        <span className="ltr:pl-3 rtl:pr-3 text-[#506690]">
                          احراز هویت
                        </span>
                      </div>

                      <div
                        className={`transition-transform ${
                          dropStates.authentication ? "rotate-270" : "rotate-0"
                        }`}
                      >
                        <IoIosArrowBack />
                      </div>
                    </button>

                    <ul
                      className={`w-[90%] flex flex-col gap-1 overflow-hidden text-gray-500 transition-all duration-300 ${
                        dropStates.authentication
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <li className="group">
                        <a
                          href="/login"
                          className={`flex rounded-md p-2 pr-8 group-hover:text-blue-700 ${
                            currentTheme === "dark"
                              ? "group-hover:bg-[#2527396b]"
                              : "group-hover:bg-blue-600/10"
                          } ${
                            router.pathname === "/login" ? "text-blue-700" : ""
                          }`}
                        >
                          - صفحه لاگین
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
