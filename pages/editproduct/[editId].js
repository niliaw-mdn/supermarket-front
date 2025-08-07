import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";

function EditProduct({ editId, onClose }) {
  const [productData, setProductData] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originalProductData, setOriginalProductData] = useState({});
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          router.push("/");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        if (editId) {
          const productRes = await axios.get(
            `http://localhost:5000/getProduct/${editId}`,
            { headers }
          );
          setProductData(productRes.data);
          setOriginalProductData(productRes.data);
        }

        const uomRes = await axios.get("http://localhost:5000/getUOM", {
          headers,
        });
        setUomOptions(uomRes.data);

        const categoryRes = await axios.get(
          "http://localhost:5000/getcategory",
          { headers }
        );
        setCategoryOptions(categoryRes.data);

        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          router.push("/");
        } else {
          console.error("Error fetching expired products:", err);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [editId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (productData.name) formData.append("name", productData.name);
    if (productData.price_per_unit)
      formData.append("price_per_unit", parseFloat(productData.price_per_unit));
    if (productData.available_quantity)
      formData.append(
        "available_quantity",
        parseInt(productData.available_quantity)
      );
    if (productData.uom_id)
      formData.append("uom_id", parseInt(productData.uom_id));
    if (productData.manufacturer_name)
      formData.append("manufacturer_name", productData.manufacturer_name);
    if (productData.weight)
      formData.append("weight", parseFloat(productData.weight));
    if (productData.purchase_price)
      formData.append("purchase_price", parseFloat(productData.purchase_price));
    if (productData.discount_percentage)
      formData.append(
        "discount_percentage",
        parseInt(productData.discount_percentage)
      );
    if (productData.voluminosity)
      formData.append("voluminosity", parseFloat(productData.voluminosity));
    if (productData.category_id)
      formData.append("category_id", parseInt(productData.category_id));

    if (
      productData.expiration_date &&
      productData.expiration_date !== originalProductData.expiration_date
    ) {
      formData.append("expiration_date", productData.expiration_date);
    }

    if (productData.image) {
      formData.append("image", productData.image);
    }

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/");
        return;
      }

      const header = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.put(
        `http://localhost:5000/updateProduct/${editId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("محصول با موفقیت بروزرسانی شد.");
      onClose();

      setProductData((prev) => ({
        ...prev,
        image_address: response.data.image_address,
      }));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        router.push("/");
      } else {
        toast.error("بروزرسانی محصول به مشکل برخورد، دوباره تلاش کنید.");
      }
    }
  };
  if (loading) return <div>Loading...</div>;
  if (!mounted) return null;
  return (
    <>
      <Toaster />
      <div>
        <div className="relative w-full max-w-3xl bg-inherit rounded-xl shadow-xl p-6 space-y-6">
          {/* Close Button */}
          <button
            className="absolute top-4 left-4 text-zinc-500 hover:text-red-500 text-xl"
            onClick={onClose}
          >
            ✖
          </button>

          {/* Title */}
          <h2 className="text-center text-xl font-bold">بروزرسانی محصول</h2>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              {[
                { label: "نام محصول", key: "name", type: "text" },
                {
                  label: "واحد اندازه‌گیری",
                  key: "uom_id",
                  type: "select",
                  options: uomOptions,
                },
                { label: "برند", key: "manufacturer_name", type: "text" },
                { label: "قیمت فروش", key: "purchase_price", type: "number" },
              ].map((field) => (
                <div key={field.key} className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">{field.label}:</label>
                  {field.type === "select" ? (
                    <select
                      className={`p-2 rounded border ${
                        currentTheme === "dark"
                          ? "bg-gray-800 border-gray-600"
                          : "bg-white border-gray-300 "
                      }`}
                      value={productData[field.key] || ""}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          [field.key]: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">انتخاب {field.label}</option>
                      {field.options.map((option) => (
                        <option
                          key={option.uom_id || option.category_id}
                          value={option.uom_id || option.category_id}
                        >
                          {option.uom_name || option.category_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className={`p-2 rounded border  ${
                        currentTheme === "dark"
                          ? "bg-gray-800 border-gray-600"
                          : "bg-white border-gray-300 "
                      }`}
                      value={productData[field.key] || ""}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          [field.key]: e.target.value,
                        })
                      }
                      required
                    />
                  )}
                </div>
              ))}

              {/* Right Column */}
              {[
                { label: "وزن", key: "weight", type: "number" },
                {
                  label: "دسته‌بندی",
                  key: "category_id",
                  type: "select",
                  options: categoryOptions,
                },
                { label: "قیمت", key: "price_per_unit", type: "number" },
                { label: "موجودی", key: "available_quantity", type: "number" },
              ].map((field) => (
                <div key={field.key} className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">{field.label}:</label>
                  {field.type === "select" ? (
                    <select
                      className={`p-2 rounded border ${
                        currentTheme === "dark"
                          ? "bg-gray-800 border-gray-600"
                          : "bg-white border-gray-300 "
                      }`}
                      value={productData[field.key] || ""}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          [field.key]: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">انتخاب {field.label}</option>
                      {field.options.map((option) => (
                        <option
                          key={option.uom_id || option.category_id}
                          value={option.uom_id || option.category_id}
                        >
                          {option.uom_name || option.category_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className={`p-2 rounded border  ${
                        currentTheme === "dark"
                          ? "bg-gray-800 border-gray-600"
                          : "bg-white border-gray-300 "
                      }`}
                      value={productData[field.key] || ""}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          [field.key]: e.target.value,
                        })
                      }
                      required
                    />
                  )}
                </div>
              ))}

              {/* Image Upload */}
              <div className="flex flex-col space-y-1 md:col-span-1">
                <label className="text-sm font-medium">تصویر محصول:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProductData({ ...productData, image: e.target.files[0] })
                  }
                  className={`p-2 rounded border ${
                    currentTheme === "dark"
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-300 "
                  }`}
                />
              </div>

              {/* Expiration Date */}
              <div className="flex flex-col space-y-1 md:col-span-1">
                <label className="text-sm font-medium">تاریخ انقضا:</label>
                <input
                  type="date"
                  value={productData.expiration_date || ""}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      expiration_date: e.target.value,
                    })
                  }
                  className={`p-2 rounded border ${
                    currentTheme === "dark"
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-300 "
                  }`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                بروزرسانی محصول
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProduct;
