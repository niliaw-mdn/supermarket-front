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
import TooltipButton from "@/components/template/toolTip";
import PaginationButton from "@/components/template/pageButton";
function Allproduct() {
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
  const token = localStorage.getItem("access_token");

  if (!token) {
    router.push("/");
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        console.log("Fetching brands from API...");
        const response = await axios.get("http://localhost:5000/getBrands", {
          timeout: 5000, // 5 second timeout
          headers,
        });

        console.log("Brands API response:", response.data);

        // Handle different response structures
        const brandsData = response.data.brands || response.data || [];
        setAvailableBrands(brandsData);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        toast.error("Could not load brands");
        setAvailableBrands([]);
      } finally {
        setLoadingBrands(false);
      }
    };

    // Fetch brands separately from other data
    fetchBrands();

    // Fetch other data
    const fetchOtherData = async () => {
      try {
        const [minPriceRes, maxPriceRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5000/min_price", { headers }),
          axios.get("http://localhost:5000/max_price", { headers }),
          axios.get("http://localhost:5000/getcategory", { headers }),
        ]);

        setFilters((prev) => ({
          ...prev,
          minPrice: minPriceRes.data[0] || 0,
          maxPrice: maxPriceRes.data[0] || 0,
        }));
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching other data:", error);
      }
    };

    fetchOtherData();
  }, []);

  useEffect(() => {
    setMounted(true);
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page,
          limit,
        });

        if (filters.minPrice > 0) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice > 0) params.append("maxPrice", filters.maxPrice);
        if (filters.selectedCategory)
          params.append("category_id", filters.selectedCategory);
        if (searchQuery) params.append("search", searchQuery);

        // Change from 'brands' to 'brand' to match backend expectation
        if (filters.selectedBrands.length > 0) {
          params.append("brand", filters.selectedBrands[0]);
        }

        console.log("Final API Params:", params.toString()); // Debug

        const { data } = await axios.get(
          "http://localhost:5000/getProductspn",
          { headers, params, paramsSerializer: (params) => params.toString() }
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

  const toggleBrandSelection = (brand) => {
    setFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand],
    }));
    setPage(1);
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("آیا مطمئنید میخواهید این محصول را حذف کنید؟")) return;
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/deleteProduct", {
        product_id: productId,
        headers,
      });
      toast.success("محصول با موفقیت حدف شد!");
      setProducts((prev) => prev.filter((p) => p.product_id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getProduct/${productId}`,
        { headers }
      );
      setProductDetails(response.data);
      setIsModalOpen(true);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        router.push("/");
      } else {
        console.error("Error fetching expired products:", err);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductDetails(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProductId(null);
  };
  if (!mounted) return null;
  return (
    <>
      <Toaster />
      <div className="m-5">
        <h2 className="p-7 font-bold">محصولات موجود</h2>
        <div className="relative w-full">
          {/* Filters Section */}
          <div
            className={`border  shadow-md w-[320px] inline-block align-top ${
              currentTheme === "dark"
                ? "bg-gray-800 border-gray-900"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Category Filter */}
            <div className="relative w-full">
              <button
                onClick={() =>
                  handleFilterChange("isCategoryOpen", !filters.isCategoryOpen)
                }
                className={`w-full inline-flex justify-center  font-medium text-gray-500  ${
                  currentTheme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <p className="flex justify-center w-[90%] border-b px-5 pt-5 pb-3">
                  دسته بندی
                  <svg
                    className="w-5 h-5 ml-2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </p>
              </button>
              {filters.isCategoryOpen && (
                <div
                  className={`w-full  shadow-lg ${
                    currentTheme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <ul className="py-1 text-md divide-y divide-gray-600 text-gray-500 text-center">
                    {categories.map((category) => (
                      <li key={category.category_id}>
                        <button
                          onClick={() =>
                            handleCategoryChange(category.category_id)
                          }
                          className={`block px-4 py-2 w-full ${
                            currentTheme === "dark"
                              ? "hover:bg-gray-600"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {category.category_name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="relative w-full mt-4">
              <button
                onClick={() =>
                  handleFilterChange("isPriceOpen", !filters.isPriceOpen)
                }
                className={`w-full inline-flex justify-center  font-medium text-gray-500  ${
                  currentTheme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <p className="flex justify-center w-[90%] border-b px-5 pt-5 pb-3">
                  محدوده قیمت
                  <svg
                    className="w-5 h-5 ml-2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </p>
              </button>
              {filters.isPriceOpen && (
                <div
                  className={`w-full  shadow-lg  ${
                    currentTheme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex flex-col w-full items-center">
                    <div className="flex justify-center items-center m-5 mr-10 mb-4">
                      <label className="text-sm text-gray-400">
                        حداقل قیمت:
                        <input
                          type="number"
                          min="0"
                          className="ml-2 border rounded-lg p-1 w-28"
                          value={filters.minPrice}
                          onChange={(e) =>
                            handleFilterChange(
                              "minPrice",
                              Number(e.target.value)
                            )
                          }
                        />
                      </label>
                      <label className="text-sm text-gray-400">
                        حداکثر قیمت:
                        <input
                          type="number"
                          min="0"
                          className="ml-2 border rounded-lg p-1 w-28"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            handleFilterChange(
                              "maxPrice",
                              Number(e.target.value)
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div className="relative w-full mt-4">
              <button
                onClick={() =>
                  handleFilterChange("isBrandOpen", !filters.isBrandOpen)
                }
                className={`w-full inline-flex justify-center  font-medium text-gray-500  ${
                  currentTheme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <p className="flex justify-center w-[90%] px-5 pt-5 pb-3">
                  برند
                  <svg
                    className={`w-5 h-5 ml-2 text-gray-500 transition-transform ${
                      filters.isBrandOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </p>
              </button>

              {filters.isBrandOpen && (
                <div
                  className={`w-full  shadow-lg ring h-screen overflow-y-auto ${
                    currentTheme === "dark"
                      ? "bg-gray-800 ring-gray-700"
                      : "bg-white ring-gray-300"
                  }`}
                >
                  {loadingBrands ? (
                    <div className="text-center py-4">
                      در حال بارگذاری برندها...
                    </div>
                  ) : availableBrands.length > 0 ? (
                    <ul className="py-1 flex flex-col justify-center items-center text-md divide-y text-gray-500">
                      {availableBrands.map((brand) => (
                        <li
                          className="py-2 w-[90%] flex items-center justify-between"
                          key={brand}
                        >
                          <span className="text-right flex-1" dir="rtl">
                            {brand}
                          </span>
                          <input
                            type="radio"
                            name="brandFilter"
                            checked={filters.selectedBrands[0] === brand}
                            onChange={() =>
                              setFilters((prev) => ({
                                ...prev,
                                selectedBrands: [brand],
                              }))
                            }
                            className="ml-2 border rounded p-1 w-5 h-5"
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-gray-500 py-2">
                      هیچ برندی یافت نشد
                    </p>
                  )}
                </div>
              )}
              {filters.selectedBrands.length > 0 && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, selectedBrands: [] }))
                  }
                  className="bg-blue-600 text-white w-full h-10 text-sm"
                >
                  حذف فیلتر
                </button>
              )}
            </div>
          </div>

          {/* Products Table */}
          <div
            className={` shadow-lg rounded-xl overflow-hidden ring-1 w-[calc(100%-350px)] mr-5 inline-block align-top ${
              currentTheme === "dark"
                ? "bg-gray-900 ring-gray-700"
                : "bg-white ring-gray-200"
            }`}
          >
            <table className="w-full table-auto text-sm text-center border-separate border-spacing-0">
              <thead
                className={`text-xs font-medium uppercase tracking-wide ${
                  currentTheme === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <tr>
                  <th className="px-4 py-4 border-b border-gray-400">
                    نام محصول
                  </th>
                  <th className="px-4 py-4 border-b border-gray-400">تصویر</th>
                  <th className="px-4 py-4 border-b border-gray-400">قیمت</th>
                  <th className="px-4 py-4 border-b border-gray-400">موجودی</th>
                  <th className="px-4 py-4 border-b border-gray-400">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((post, idx) => (
                  <tr
                    key={post.product_id}
                    className={`transition-all hover:bg-opacity-90 ${
                      currentTheme === "dark"
                        ? idx % 2 === 0
                          ? "bg-gray-800"
                          : "bg-gray-700"
                        : idx % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-4 border-b border-gray-400">
                      {post.name}
                    </td>
                    <td className="px-4 py-4 border-b border-gray-400">
                      <div className="flex justify-center">
                        <ImageWithAuth
                          imagePath={post.image_address.replace(
                            /^uploads\//,
                            ""
                          )}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-400">
                      {post.price_per_unit} تومان
                    </td>
                    <td className="px-4 py-4 border-b border-gray-400">
                      {post.available_quantity}
                    </td>
                    <td className="px-4 py-4 border-b border-gray-400">
                      <div className="flex justify-center gap-3">
                        <TooltipButton
                          icon={<FaEdit size={22} />}
                          color="text-green-500"
                          tooltip="ویرایش"
                          onClick={() => {
                            setSelectedProductId(post.product_id);
                            setIsEditModalOpen(true);
                          }}
                        />
                        <TooltipButton
                          icon={<IoEyeSharp size={22} />}
                          color="text-blue-500"
                          tooltip="جزئیات"
                          onClick={() => openModal(post.product_id)}
                        />
                        <TooltipButton
                          icon={<RiDeleteBin5Fill size={22} />}
                          color="text-red-500"
                          tooltip="حذف"
                          onClick={() => deleteProduct(post.product_id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="py-6 flex justify-center">
              <ul className="flex gap-1">
                <PaginationButton
                  label="‹"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  theme={currentTheme}
                />
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationButton
                    key={index}
                    label={index + 1}
                    active={page === index + 1}
                    onClick={() => setPage(index + 1)}
                    theme={currentTheme}
                  />
                ))}
                <PaginationButton
                  label="›"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  theme={currentTheme}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && productDetails && (
        <Modal onClose={closeModal}>
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
            <div
              className={`w-full max-w-xl p-6 rounded-xl shadow-2xl border space-y-6 transition-all ${
                currentTheme === "dark"
                  ? "bg-gray-900 border-gray-700 text-gray-100"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              {/* Modal Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-bold">
                  جزئیات محصول
                  <span className="text-blue-500 mx-2">
                    {productDetails.name}
                  </span>
                </h2>
              </div>

              {/* Detail Table */}
              <div className="overflow-hidden rounded-lg">
                <table className="w-full text-sm border-separate border-spacing-y-2">
                  <tbody>
                    {[
                      {
                        label: "دسته‌بندی",
                        value: productDetails.category_name,
                      },
                      {
                        label: "قیمت",
                        value: `${productDetails.price_per_unit} تومان`,
                      },
                      {
                        label: "برند",
                        value: productDetails.manufacturer_name,
                      },
                      {
                        label: "موجودی",
                        value: productDetails.available_quantity,
                      },
                      {
                        label: "ارزش غذایی",
                        value: productDetails.nutritional_information,
                      },
                      {
                        label: "تاریخ انقضا",
                        value: productDetails.expiration_date,
                      },
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <th
                          className={`w-1/3 text-right px-4 py-2 font-medium rounded-r-md whitespace-nowrap ${
                            currentTheme === "dark"
                              ? "bg-gray-800 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {row.label}:
                        </th>
                        <td
                          className={`w-2/3 px-4 py-2 rounded-l-md ${
                            currentTheme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-gray-50 text-gray-800"
                          }`}
                        >
                          {row.value || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Close Button */}
              <div className="text-center pt-2">
                <button
                  onClick={closeModal}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <Modal onClose={() => setShowModal(false)}>
          <div
            className={`w-full max-w-xl p-6 rounded-xl shadow-2xl border space-y-6 transition-all backdrop-blur ${
              currentTheme === "dark"
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <EditProduct editId={selectedProductId} onClose={closeEditModal} />
          </div>
        </Modal>
      )}
    </>
  );
}
Allproduct.showSidebar = true;
Allproduct.isAdmin = true;

export default Allproduct;
