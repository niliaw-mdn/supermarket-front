import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoEyeSharp } from "react-icons/io5";
import EditProduct from "../editproduct/[editId]";
import toast, { Toaster } from "react-hot-toast";
import Modal from "@/components/template/modal";
import { useTheme } from "next-themes";
import Image from "next/image";

import { RiArrowRightDoubleFill } from "react-icons/ri";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";
import { RiArrowRightSLine } from "react-icons/ri";

function Index() {
  const router = useRouter();
  const { search } = router.query;
  const searchQuery = search || "";
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
    selectedBrands: [],
    selectedCategory: "",
    isCategoryOpen: false,
    isPriceOpen: false,
    isBrandOpen: false,
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page,
          limit,
        });
        if (searchQuery) {
          params.append("search", searchQuery);
        }

        console.log("Final API Params:", params.toString());

        const { data } = await axios.get(
          "http://localhost:5001/getProductspn",
          {
            params,
            paramsSerializer: (params) => params.toString(),
          }
        );

        setProducts(data.products);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error?.response?.data || error
        );
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, filters, searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => ({ ...prev, selectedCategory: categoryId }));
    setPage(1);
  };

  const openModal = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/getProduct/${productId}`
      );
      setProductDetails(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product details.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductDetails(null);
  };

  if (!mounted) return null;
  return (
    <>
      <Toaster />
      <div className="p-6">
        {/* Header with Search */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              محصولات فروشگاه
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              مدیریت و مشاهده تمام محصولات
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div
          className={`rounded-xl overflow-hidden shadow-sm ${
            currentTheme === "dark"
              ? "bg-gray-800"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead
                className={
                  currentTheme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }
              >
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    نام محصول
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    تصویر
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    قیمت
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    موجودی
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product) => (
                  <tr
                    key={product.product_id}
                    className={`transition-colors hover:${
                      currentTheme === "dark" ? "bg-gray-700/80" : "bg-gray-50"
                    }`}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-right font-medium  ${
                        currentTheme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <div className="relative group h-16 w-16 rounded-lg overflow-hidden shadow-sm">
                          <Image
                            src={`http://localhost:5001/uploads/${product.image_address.replace(
                              /^uploads\//,
                              ""
                            )}`}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 dark:text-green-400 font-medium">
                      {product.price_per_unit.toLocaleString()} تومان
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          product.available_quantity > 10
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        }`}
                      >
                        {product.available_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => openModal(product.product_id)}
                        className="inline-flex items-center p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group relative"
                      >
                        <IoEyeSharp className="text-blue-500 dark:text-blue-400 text-xl" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          مشاهده جزئیات
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className={`px-6 py-4 border-t   ${
              currentTheme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div
                className={`text-sm  ${
                  currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                نمایش {(page - 1) * limit + 1} تا{" "}
                {Math.min(page * limit, products.length)} از {products.length}{" "}
                محصول
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className={`p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed   transition-colors ${
                    currentTheme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <RiArrowRightDoubleFill
                    className={` ${
                      currentTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    } `}
                  />
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className={`p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed   transition-colors ${
                    currentTheme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <RiArrowRightSLine
                    className={` ${
                      currentTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    } `}
                  />
                </button>

                <div className="flex gap-1 mx-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm ${
                        page === i + 1
                          ? "bg-blue-600 text-white shadow-md"
                          : currentTheme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed   transition-colors ${
                    currentTheme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <RiArrowLeftSLine
                    className={` ${
                      currentTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    } `}
                  />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className={`p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed   transition-colors ${
                    currentTheme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <RiArrowLeftDoubleFill
                    className={` ${
                      currentTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    } `}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Modal */}
        {isModalOpen && productDetails && (
          <Modal onClose={() => setShowModal(false)}>
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
              <div
                className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
                  currentTheme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold">
                        {productDetails.name}
                      </h3>
                      <p
                        className={` ${
                          currentTheme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }  mt-1`}
                      >
                        {productDetails.category_name}
                      </p>
                    </div>
                    <button
                      onClick={closeModal}
                      className={`p-2 rounded-full  transition-colors ${
                        currentTheme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-200"
                      }`}
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex justify-center">
                      <div className="relative h-64 w-64 rounded-xl overflow-hidden shadow-lg">
                        <Image
                          src={`http://localhost:5001/uploads/${productDetails.image_address.replace(
                            /^uploads\//,
                            ""
                          )}`}
                          alt={productDetails.name}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div
                        className={`p-4 rounded-lg  ${
                          currentTheme === "dark"
                            ? "bg-gray-700"
                            : "bg-gray-100"
                        }`}
                      >
                        <h4
                          className={`font-medium  mb-3 ${
                            currentTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          اطلاعات محصول
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span
                              className={` ${
                                currentTheme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              قیمت:
                            </span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {productDetails.price_per_unit.toLocaleString()}{" "}
                              تومان
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={` ${
                                currentTheme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              برند:
                            </span>
                            <span className="font-medium">
                              {productDetails.manufacturer_name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={` ${
                                currentTheme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              موجودی:
                            </span>
                            <span className="font-medium">
                              {productDetails.available_quantity}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={` ${
                                currentTheme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              تاریخ انقضا:
                            </span>
                            <span className="font-medium">
                              {productDetails.expiration_date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {productDetails.nutritional_information && (
                        <div
                          className={`p-4 rounded-lg  ${
                            currentTheme === "dark"
                              ? "bg-gray-700"
                              : "bg-gray-100"
                          }`}
                        >
                          <h4
                            className={`font-medium  mb-3 ${
                              currentTheme === "dark"
                                ? "text-gray-300"
                                : "text-gray-500"
                            }`}
                          >
                            مشخصات تغذیه‌ای
                          </h4>
                          <p
                            className={` ${
                              currentTheme === "dark"
                                ? "text-gray-200"
                                : "text-gray-700 "
                            }`}
                          >
                            {productDetails.nutritional_information}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
Index.showSidebar = true;
Index.isAdmin = false;

export default Index;
