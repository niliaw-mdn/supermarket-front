import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoEyeSharp } from "react-icons/io5";
import EditProduct from "../editproduct/[editId]";
import toast, { Toaster } from "react-hot-toast";
import Modal from "@/components/template/modal";

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

  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        console.log("Fetching brands from API...");
        const response = await axios.get("http://localhost:5000/getBrands", {
          timeout: 5000, // 5 second timeout
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
          axios.get("http://localhost:5000/min_price"),
          axios.get("http://localhost:5000/max_price"),
          axios.get("http://localhost:5000/getcategory"),
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
          // Take only the first selected brand since backend expects single brand
          params.append("brand", filters.selectedBrands[0]);
        }

        console.log("Final API Params:", params.toString()); // Debug

        const { data } = await axios.get(
          "http://localhost:5000/getProductspn",
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
        `http://localhost:5000/getProduct/${productId}`
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

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProductId(null);
  };

  return (
    <>
      <Toaster />
      <div className="mb-[550px] mx-5">
        <h2 className="p-7 font-bold">محصولات موجود</h2>
        <div className="relative w-full">
          {/* Filters Section */}
          <div className="border-2 bg-white border-l-gray-500 shadow-md shadow-black w-[320px] inline-block align-top">
            {/* Category Filter */}
            <div className="relative w-full">
              <button
                onClick={() =>
                  handleFilterChange("isCategoryOpen", !filters.isCategoryOpen)
                }
                className="w-full inline-flex rounded-md bg-white px-7 pt-5 pb-3 font-medium text-gray-700 border-b-2"
              >
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
              </button>
              {filters.isCategoryOpen && (
                <div className="w-full bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <ul className="py-1 text-md divide-y-2 text-gray-700 text-center">
                    {categories.map((category) => (
                      <li key={category.category_id}>
                        <button
                          onClick={() =>
                            handleCategoryChange(category.category_id)
                          } // Pass category ID
                          className="block px-4 py-2 hover:bg-gray-100 w-full"
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
                className="w-full inline-flex rounded-md bg-white px-7 pt-5 pb-3 font-medium text-gray-700 border-b-2"
              >
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
              </button>
              {filters.isPriceOpen && (
                <div className="w-full bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4">
                  <div className="flex flex-col items-center">
                    <div className="flex justify-between w-full mb-4">
                      <label className="text-sm text-gray-600">
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
                      <label className="text-sm text-gray-600">
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
                className="w-full inline-flex rounded-md bg-white px-7 pt-5 pb-3 font-medium text-gray-700 border-b-2"
              >
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
              </button>

              {filters.isBrandOpen && (
                <div className="w-full bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4 max-h-60 overflow-y-auto">
                  {loadingBrands ? (
                    <div className="text-center py-4">
                      در حال بارگذاری برندها...
                    </div>
                  ) : availableBrands.length > 0 ? (
                    <ul className="py-1 text-md divide-y-2 text-gray-700">
                      {availableBrands.map((brand) => (
                        <li
                          className="py-2 flex items-center justify-between"
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
          <div className="border-2 bg-white border-l-gray-500 shadow-md shadow-black w-[calc(100%-350px)] mr-5 inline-block align-top">
            <table className="table-auto border-collapse border border-gray-300 w-full text-center h-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">
                    نام محصول
                  </th>
                  <th className="border border-gray-300 px-4 py-2">تصویر</th>
                  <th className="border border-gray-300 px-4 py-2">قیمت</th>
                  <th className="border border-gray-300 px-4 py-2">موجودی</th>
                  <th className="border border-gray-300 px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((post) => (
                  <tr
                    key={post.product_id}
                    className="odd:bg-white even:bg-gray-100"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {post.name}
                    </td>
                    <td className="border border-gray-300">
                      <div className="flex justify-center">
                        <img
                          src={`http://localhost:5000/uploads/${encodeURI(
                            post.image_address.replace(/^uploads\//, "")
                          )}`}
                          alt={`Product ${post.product_id}`}
                          className="h-16 w-16 object-cover"
                        />
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {post.price_per_unit} تومان
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {post.available_quantity}
                    </td>
                    <td className="flex justify-around border border-gray-300 px-4 py-[25px]">
                      <button
                        className="relative group ml-4"
                        onClick={() => {
                          setSelectedProductId(post.product_id);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <FaEdit className="text-lg text-green-400" size={30} />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-zinc-600 text-white text-sm rounded-md px-2 py-1">
                          ویرایش
                        </span>
                      </button>

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
                      <button
                        className="relative group ml-4"
                        onClick={() => deleteProduct(post.product_id)}
                      >
                        <RiDeleteBin5Fill
                          className="text-lg text-red-400"
                          size={30}
                        />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-zinc-600 text-white text-sm rounded-md px-2 py-1">
                          حذف
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
                    className={`flex items-center justify-center px-3 h-14 w-14 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${
                      page === 1
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : ""
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
                          ? "text-blue-600 bg-blue-50 border border-blue-300"
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
                    className={`flex items-center justify-center px-3 h-14 w-14 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
                      page === totalPages
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : ""
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

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <Modal onClose={() => setShowModal(false)}>
        <div className="fixed inset-0  flex justify-center items-center z-50">
          <div className="rounded-md shadow-lg">
            <EditProduct editId={selectedProductId} onClose={closeEditModal} />
          </div>
        </div>
        </Modal>
      )}
    </>
  );
}
Allproduct.showSidebar = true;
export default Allproduct;
