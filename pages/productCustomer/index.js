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
import ImageWithAuth from "@/components/template/productImage";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
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

        console.log("Final API Params:", params.toString()); // Debug

        const { data } = await axios.get(
          "http://localhost:5001/getProductspn",
          { params, paramsSerializer: (params) => params.toString() }
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
      <div className="m-5 min-h-[1600px]">
        <h2 className="p-7 font-bold">محصولات موجود</h2>
        <div className="relative w-full flex justify-center">
          {/* Products Table */}
          <div
            className={` shadow-md rounded w-[calc(100%-350px)] mr-5 inline-block align-top ${
              currentTheme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <table
              className={`table-auto border-collapse w-full text-center h-full ${
                currentTheme === "dark" ? "border-gray-600" : "border-gray-400"
              }`}
            >
              <thead
                className={` ${
                  currentTheme === "dark" ? "bg-gray-600" : "bg-gray-200"
                }`}
              >
                <tr className="h-16">
                  <th
                    className={`border px-4 py-2 ${
                      currentTheme === "dark"
                        ? "border-gray-600"
                        : "border-gray-300"
                    }`}
                  >
                    نام محصول
                  </th>
                  <th
                    className={`border px-4 py-2 ${
                      currentTheme === "dark"
                        ? "border-gray-600"
                        : "border-gray-300"
                    }`}
                  >
                    تصویر
                  </th>
                  <th
                    className={`border px-4 py-2 ${
                      currentTheme === "dark"
                        ? "border-gray-600"
                        : "border-gray-300"
                    }`}
                  >
                    قیمت
                  </th>
                  <th
                    className={`border px-4 py-2 ${
                      currentTheme === "dark"
                        ? "border-gray-600"
                        : "border-gray-300"
                    }`}
                  >
                    موجودی
                  </th>
                  <th className={` px-4 py-2`}></th>
                </tr>
              </thead>
              <tbody>
                {products.map((post) => (
                  <tr
                    key={post.product_id}
                    className={`${
                      currentTheme === "dark"
                        ? "odd:bg-gray-600 even:bg-gray-800 "
                        : "odd:bg-white even:bg-gray-100 "
                    }`}
                  >
                    <td
                      className={`border px-4 py-2 ${
                        currentTheme === "dark"
                          ? "border-gray-700"
                          : "border-gray-300"
                      }`}
                    >
                      {post.name}
                    </td>
                    <td
                      className={`border  ${
                        currentTheme === "dark"
                          ? "border-gray-700"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="flex justify-center">
                        <ImageWithAuth
                          imagePath={post.image_address.replace(
                            /^uploads\//,
                            ""
                          )}
                        />
                      </div>
                    </td>
                    <td
                      className={`border  ${
                        currentTheme === "dark"
                          ? "border-gray-700"
                          : "border-gray-300"
                      } px-4 py-2`}
                    >
                      {post.price_per_unit} تومان
                    </td>
                    <td
                      className={`border  ${
                        currentTheme === "dark"
                          ? "border-gray-700"
                          : "border-gray-300"
                      } px-4 py-2`}
                    >
                      {post.available_quantity}
                    </td>
                    <td
                      className={`flex justify-around border  ${
                        currentTheme === "dark"
                          ? "border-gray-700"
                          : "border-gray-300"
                      } px-4 py-[25px]`}
                    >
                      <button
                        className="relative group ml-4"
                        onClick={() => openModal(post.product_id)}
                      >
                        <IoEyeSharp
                          className="text-lg text-blue-400"
                          size={30}
                        />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-zinc-600 text-white text-sm rounded-md px-2 py-1">
                          جزئیات
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav
              aria-label="Page navigation example"
              className="py-8 flex justify-center"
            >
              <ul className="flex items-center -space-x-px h-8 text-sm">
                <li>
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={`flex items-center justify-center px-3 h-14 w-14 leading-tight text-gray-700  border  rounded-s-lg  hover:text-gray-400 ${
                      page === 1
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : ""
                    } ${
                      currentTheme === "dark"
                        ? "bg-gray-500 border-gray-700 hover:bg-gray-600"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                    disabled={page === 1}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-3 h-3 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 1 1 5l4 4"
                      />
                    </svg>
                  </button>
                </li>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setPage(index + 1)}
                      className={`flex items-center justify-center px-3 h-14 w-14 leading-tight ${
                        page === index + 1
                          ? currentTheme === "dark"
                            ? "text-blue-300 bg-blue-800 border border-blue-700"
                            : "text-blue-600 bg-blue-50 border border-blue-300"
                          : currentTheme === "dark"
                          ? "bg-gray-600 hover:bg-gray-800 border border-gray-700"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={`flex items-center justify-center px-3 h-14 w-14 leading-tight text-gray-700  border  rounded-e-lg  hover:text-gray-400 ${
                      page === totalPages
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : ""
                    } ${
                      currentTheme === "dark"
                        ? "bg-gray-500 border-gray-700 hover:bg-gray-600"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                    disabled={page === totalPages}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-3 h-3 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {isModalOpen && productDetails && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="fixed inset-0  flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-1/2">
              <h4 className="p-3 font-medium">
                جزئیات محصول {productDetails.name}
              </h4>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <tbody>
                  <tr className="border-b-8 border-white">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white whitespace-nowrap bg-zinc-500"
                    >
                      دسته بندی:
                    </th>
                    <td className="px-6 py-4 bg-zinc-200">
                      {productDetails.category_name}
                    </td>
                  </tr>
                  <tr className="border-b-8 border-white">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white whitespace-nowrap bg-zinc-500"
                    >
                      قیمت:
                    </th>
                    <td className="px-6 py-4 bg-zinc-200">
                      {productDetails.price_per_unit} تومان
                    </td>
                  </tr>
                  <tr className="border-b-8 border-white">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white whitespace-nowrap bg-zinc-500"
                    >
                      برند:
                    </th>
                    <td className="px-6 py-4 bg-zinc-200">
                      {productDetails.manufacturer_name}
                    </td>
                  </tr>
                  <tr className="border-b-8 border-white">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white whitespace-nowrap bg-zinc-500"
                    >
                      موجودی
                    </th>
                    <td className="px-6 py-4 bg-zinc-200">
                      {productDetails.available_quantity}
                    </td>
                  </tr>
                  <tr className="border-b-8 border-white">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white whitespace-nowrap bg-zinc-500"
                    >
                      ارزش غذایی:
                    </th>
                    <td className="px-6 py-4 bg-zinc-200">
                      {productDetails.nutritional_information}
                    </td>
                  </tr>
                  <tr className="border-b-8 border-white">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white whitespace-nowrap bg-zinc-500"
                    >
                      تاریخ انقضا:
                    </th>
                    <td className="px-6 py-4 bg-zinc-200">
                      {productDetails.expiration_date}
                    </td>
                  </tr>
                </tbody>
              </table>

              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={closeModal}
              >
                بستن
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
Index.showSidebar = true;
Index.isAdmin = false;

export default Index;
