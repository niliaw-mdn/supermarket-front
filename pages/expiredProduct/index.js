import { useEffect, useState } from "react";
import axios from "axios";
import {
  RiArrowLeftSLine,
  RiArrowLeftDoubleFill,
  RiArrowRightSLine,
  RiArrowRightDoubleFill,
} from "react-icons/ri";
import { useTheme } from "next-themes";

function Expired() {
  const [expiredProducts, setExpiredProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [expiredPageCount, setExpiredPageCount] = useState(0);
  const [expiringPageCount, setExpiringPageCount] = useState(0);
  const [expiredCurrentPage, setExpiredCurrentPage] = useState(0);
  const [expiringCurrentPage, setExpiringCurrentPage] = useState(0);
  const { theme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;
  const [mounted, setMounted] = useState(false);
  const itemsPerPage = 10;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  if (!token) {
    router.push("/");
    return null;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchExpiredProducts = async (page) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/expired_productspn?page=${
          page + 1
        }&limit=${itemsPerPage}`,
        { headers }
      );
      const data = res.data;
      setExpiredProducts(data.products);
      setExpiredPageCount(data.total_pages);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        router.push("/");
      } else {
        console.error("Error fetching expired products:", err);
      }
    }
  };

  const fetchExpiringProducts = async (page) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/expiring_productspn?page=${
          page + 1
        }&limit=${itemsPerPage}`,
        { headers }
      );
      const data = res.data;
      setExpiringProducts(data.products);
      setExpiringPageCount(data.total_pages);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        router.push("/");
      } else {
        console.error("Error fetching expired products:", err);
      }
    }
  };

  const handleExpiredPageChange = (page) => {
    setExpiredCurrentPage(page);
    fetchExpiredProducts(page);
  };

  const handleExpiringPageChange = (page) => {
    setExpiringCurrentPage(page);
    fetchExpiringProducts(page);
  };

  useEffect(() => {
    setMounted(true);
    fetchExpiredProducts(expiredCurrentPage);
    fetchExpiringProducts(expiringCurrentPage);
  }, []);

  if (!mounted) return null;

  const baseBg = currentTheme === "dark" ? "bg-gray-900" : "bg-white";
  const baseText = currentTheme === "dark" ? "text-gray-200" : "text-gray-900";
  const borderBase =
    currentTheme === "dark" ? "border-gray-700" : "border-gray-300";
  const headerExpiredBg = currentTheme === "dark" ? "bg-red-700" : "bg-red-600";
  const headerExpiringBg =
    currentTheme === "dark" ? "bg-yellow-700" : "bg-yellow-400";
  const expiredRowEvenBg =
    currentTheme === "dark"
      ? "even:bg-gray-800 hover:bg-red-600/40"
      : "even:bg-red-50 hover:bg-red-100";
  const expiringRowEvenBg =
    currentTheme === "dark"
      ? "even:bg-gray-800 hover:bg-yellow-600/40"
      : "even:bg-yellow-50 hover:bg-yellow-100";

  const renderPagination = (
    currentPage,
    pageCount,
    onPageChange,
    totalItems
  ) => (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center text-sm mt-4 gap-2 sm:gap-0 ${
        currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
      }`}
    >
      <div className="select-none">
        نمایش {Math.min(currentPage * itemsPerPage + 1, totalItems)} تا{" "}
        {Math.min((currentPage + 1) * itemsPerPage, totalItems)} از {totalItems}{" "}
        ورودی
      </div>
      <nav className="flex gap-1 items-center" aria-label="Pagination">
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          aria-label="رفتن به صفحه اول"
          className={`p-2 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white ${
            currentTheme === "dark"
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <RiArrowRightDoubleFill size={20} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="صفحه قبل"
          className={`p-2 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white ${
            currentTheme === "dark"
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <RiArrowRightSLine size={20} />
        </button>

        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            aria-current={currentPage === i ? "page" : undefined}
            className={`min-w-[36px] px-3 py-1 rounded-full text-sm font-medium transition ${
              currentPage === i
                ? "bg-blue-600 text-white shadow-md"
                : currentTheme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pageCount - 1}
          aria-label="صفحه بعد"
          className={`p-2 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white ${
            currentTheme === "dark"
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <RiArrowLeftSLine size={20} />
        </button>
        <button
          onClick={() => onPageChange(pageCount - 1)}
          disabled={currentPage === pageCount - 1}
          aria-label="رفتن به صفحه آخر"
          className={`p-2 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white ${
            currentTheme === "dark"
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <RiArrowLeftDoubleFill size={20} />
        </button>
      </nav>
    </div>
  );

  return (
    <div
      dir="rtl"
      className={`m-5 p-6 rounded-lg shadow-lg ${baseBg} ${baseText}`}
    >
      <h1 className="text-3xl font-bold mb-8 text-center">
        مدیریت محصولات منقضی و در حال انقضا
      </h1>

      {/* Expired Products */}
      <section className="mb-12">
        <h2>محصولات منقضی شده</h2>
        <div
          className={`overflow-x-auto rounded-lg shadow border ${borderBase}`}
        >
          <table className="min-w-full text-sm text-right">
            <thead className={`${headerExpiredBg} text-white h-14`}>
              <tr>
                <th className="px-6 py-3 font-light whitespace-nowrap">
                  نام محصول
                </th>
                <th className="px-6 py-3 font-light whitespace-nowrap">قیمت</th>
                <th className="px-6 py-3 font-light whitespace-nowrap">
                  تعداد موجود
                </th>
                <th className="px-6 py-3 font-light whitespace-nowrap">
                  تاریخ انقضا
                </th>
              </tr>
            </thead>
            <tbody>
              {expiredProducts.map((p) => (
                <tr
                  key={p.product_id}
                  className={`border-b transition-colors cursor-pointer ${expiredRowEvenBg}`}
                >
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-green-500 font-semibold">
                    {p.price_per_unit.toLocaleString()} تومان
                  </td>
                  <td className="px-6 py-4">
                    {p.available_quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{p.expiration_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(
          expiredCurrentPage,
          expiredPageCount,
          handleExpiredPageChange,
          expiredProducts.length
        )}
      </section>

      {/* Expiring Products */}
      <section>
        <h2
          className={`text-2xl font-semibold mb-4 border-b-4 inline-block pb-2 ${
            currentTheme === "dark" ? "border-yellow-500" : "border-yellow-600"
          }`}
        >
          محصولات در حال انقضا
        </h2>
        <div
          className={`overflow-x-auto rounded-lg shadow border ${borderBase}`}
        >
          <table className="min-w-full text-sm text-right">
            <thead className={`${headerExpiringBg} text-white h-14`}>
              <tr>
                <th className="px-6 py-3 font-light whitespace-nowrap">
                  نام محصول
                </th>
                <th className="px-6 py-3 font-light whitespace-nowrap">قیمت</th>
                <th className="px-6 py-3 font-light whitespace-nowrap">
                  تعداد موجود
                </th>
                <th className="px-6 py-3 font-light whitespace-nowrap">
                  تاریخ انقضا
                </th>
              </tr>
            </thead>
            <tbody>
              {expiringProducts.map((p) => (
                <tr
                  key={p.product_id}
                  className={`border-b transition-colors cursor-pointer ${expiringRowEvenBg}`}
                >
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-green-500 font-semibold">
                    {p.price_per_unit.toLocaleString()} تومان
                  </td>
                  <td className="px-6 py-4">
                    {p.available_quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{p.expiration_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(
          expiringCurrentPage,
          expiringPageCount,
          handleExpiringPageChange,
          expiringProducts.length
        )}
      </section>
    </div>
  );
}

Expired.showSidebar = true;
Expired.isAdmin = true;

export default Expired;
