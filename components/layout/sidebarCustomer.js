import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

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
import { TbShoppingCartCheck } from "react-icons/tb";
import { LuFolderCog } from "react-icons/lu";

export default function SidebarCustomer({ isOpen, setIsOpen }) {
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
  const { systemTheme, theme, setTheme } = useTheme();
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/st1", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      // First check if response is JSON
      const contentType = res.headers.get("content-type");
      let data;

      if (contentType?.includes("application/json")) {
        data = await res.json();
      } else {
        // If not JSON, get as text (for debugging)
        const text = await res.text();
        throw new Error(`Unexpected response: ${text.substring(0, 100)}...`);
      }

      if (!res.ok || data.status !== "success") {
        throw new Error(data.error || "Failed to launch Streamlit");
      }

      // Handle the response
      if (data.html_content) {
        // Open HTML content in new window
        const newWindow = window.open("", "_blank");
        newWindow.document.write(data.html_content);
      } else if (data.url) {
        // Direct URL approach
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

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
    const customerPhone = localStorage.getItem("phone");

    if (!customerPhone) {
      setError("شماره تماس در localStorage یافت نشد");
      return;
    }

    // In your fetchCustomer function:
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

        const name = data.customer_name || "مشتری";
        setCustomer({
          customer_name: name,
          customer_phone: data.customer_phone,
          image_address: imagePath,
        });
        localStorage.setItem("name", name);
      } catch (err) {
        setCustomer({
          image_address: "/pic/avatar.png",
        });
      }
    };
    fetchCustomer();
  }, []);
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
    if (windowWidth >= 1024) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [windowWidth]);

  useEffect(() => {
    setDropStates((prevState) => ({
      ...prevState,
      authentication:
        router.pathname === "/customerProfile" ||
        router.pathname === "/registerCustomer",
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
                src={
                  customer?.image_address?.startsWith("/customer_image")
                    ? `http://localhost:5001${customer.image_address}`
                    : customer?.image_address || "/pic/avatar.png"
                }
                alt="User Profile"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "/pic/avatar.png";
                  e.target.onerror = null;
                }}
                unoptimized={true}
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
                    src={
                      customer?.image_address?.startsWith("/customer_image")
                        ? `http://localhost:5001${customer.image_address}`
                        : customer?.image_address || "/pic/avatar.png"
                    }
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/pic/avatar.png";
                      e.target.onerror = null;
                    }}
                    unoptimized={true}
                  />
                  <div className="truncate pl-4">
                    <h4
                      className={`text-base ${
                        currentTheme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {customer?.customer_name || "میهمان"}
                      <span className="mr-2 rounded bg-green-100 px-1.5 text-xs text-green-600">
                        {customer?.customer_phone ? "مشتری" : "میهمان"}
                      </span>
                    </h4>
                    {error && (
                      <p className="text-red-500 text-xs mt-1">{error}</p>
                    )}
                  </div>
                </li>

                <li>
                  <Link
                    href="/customerProfile"
                    className="flex items-center gap-1 px-4 py-1 hover:text-blue-600 hover:bg-blue-300/10"
                    onClick={() => setOpenUser(false)}
                  >
                    <span className="m-2">
                      <IoPersonOutline size={20} />
                    </span>
                    <p> پروفایل</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/orders"
                    className="flex items-center gap-1 px-4 py-3 hover:text-blue-600 hover:bg-blue-300/10"
                    onClick={() => setOpenUser(false)}
                  >
                    <span className="mr-2">
                      <HiOutlineInboxArrowDown size={20} />
                    </span>
                    <p> لیست سفارشات</p>
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
                  <h2
                    className={`w-full my-1 flex items-center px-7 py-3 uppercase ${
                      currentTheme === "dark" ? "bg-[#292f506b]" : "bg-gray-100"
                    }`}
                  >
                    <span>دسترسی ها</span>
                  </h2>

                  <li>
                    <a
                      href="/productCustomer"
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
                          router.pathname === "/productCustomer"
                            ? currentTheme === "dark"
                              ? "bg-gray-800"
                              : "bg-gray-200"
                            : ""
                        }
                        `}
                      >
                        <AiFillProduct
                          className="shrink-0 text-gray-500 group-hover:text-blue-700"
                          size={22}
                        />
                        <span className="ltr:pl-3 rtl:pr-3 text-[#506690]">
                          محصولات{" "}
                        </span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/currentPurchase"
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
                          router.pathname === "/currentPurchase"
                            ? currentTheme === "dark"
                              ? "bg-gray-800"
                              : "bg-gray-200"
                            : ""
                        }
                        `}
                      >
                        <LuFolderCog
                          className="shrink-0 text-gray-500 group-hover:text-blue-700"
                          size={22}
                        />
                        <span className="ltr:pl-3 rtl:pr-3 text-[#506690]">
                          سفارش جاری
                        </span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/orders"
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
                          router.pathname === "/orders"
                            ? currentTheme === "dark"
                              ? "bg-gray-800"
                              : "bg-gray-200"
                            : ""
                        }
                        `}
                      >
                        <TbFileReport
                          className="shrink-0 text-gray-500 group-hover:text-blue-700"
                          size={22}
                        />
                        <span className="ltr:pl-3 rtl:pr-3 text-[#506690]">
                          سفارشات{" "}
                        </span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={handleClick}
                      className={`flex justify-center items-center group ${
                        currentTheme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      <div
                        className={`flex w-[90%] rounded-md p-2 ${
                          currentTheme === "dark"
                            ? "group-hover:bg-gray-800"
                            : "group-hover:bg-gray-200"
                        }
                        `}
                      >
                        <TbShoppingCartCheck
                          className="shrink-0 text-gray-500 group-hover:text-blue-700"
                          size={22}
                        />
                        <span className="ltr:pl-3 rtl:pr-3 text-[#506690]">
                          ثبت سفارش{" "}
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
                      onClick={() => toggleDropdown("authentication")}
                      className={`nav-link group flex items-center justify-between w-[90%] rounded-md mb-1 p-2 group ${
                        currentTheme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-200"
                      }${
                        router.pathname === "/customerProfile" ||
                        router.pathname === "/registerCustomer"
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
                          href="/customerProfile"
                          className={`flex rounded-md p-2 pr-8 group-hover:text-blue-700 ${
                            currentTheme === "dark"
                              ? "group-hover:bg-[#2527396b]"
                              : "group-hover:bg-blue-600/10"
                          }  ${
                            router.pathname === "/customerProfile"
                              ? "text-blue-700"
                              : ""
                          }`}
                        >
                          - پروفایل
                        </a>
                      </li>
                      <li className="group">
                        <a
                          href="/registerCustomer"
                          className={`flex rounded-md p-2 pr-8 group-hover:text-blue-700 ${
                            currentTheme === "dark"
                              ? "group-hover:bg-[#2527396b]"
                              : "group-hover:bg-blue-600/10"
                          }  ${
                            router.pathname === "/registerCustomer"
                              ? "text-blue-700"
                              : ""
                          }`}
                        >
                          - صفحه ثبت نام
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
