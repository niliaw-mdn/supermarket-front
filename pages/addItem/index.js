import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
export default function AddItem() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? "light" : theme;
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    uom_id: "",
    price_per_unit: "",
    available_quantity: "",
    manufacturer_name: "",
    weight: "",
    purchase_price: "",
    discount_percentage: "",
    voluminosity: "",
    combinations: "",
    nutritional_information: "",
    expiration_date: "",
    storage_conditions: "",
    number_sold: "",
    date_added_to_stock: "",
    total_profit_on_sales: "",
    error_rate_in_weight: "",
    category_id: "",
    file: null,
  });
  const fieldLabels = {
    name: "نام محصول",
    uom_id: "واحد اندازه‌گیری",
    price_per_unit: "قیمت هر واحد",
    available_quantity: "مقدار موجود",
    manufacturer_name: "نام تولیدکننده",
    weight: "وزن",
    purchase_price: "قیمت خرید",
    discount_percentage: "درصد تخفیف",
    voluminosity: "حجم",
    combinations: "ترکیبات",
    nutritional_information: "اطلاعات تغذیه‌ای",
    expiration_date: "تاریخ انقضا",
    storage_conditions: "شرایط نگهداری",
    number_sold: "تعداد فروش‌رفته",
    date_added_to_stock: "تاریخ اضافه‌شده به انبار",
    total_profit_on_sales: "سود کل فروش",
    error_rate_in_weight: "نرخ خطا در وزن",
    category_id: "دسته‌بندی",
    file: "تصویر محصول",
  };

  const [categories, setCategories] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchCategories = async () => {
      const categoryData = [
        { category_id: 1, category_name: "Snacks" },
        { category_id: 2, category_name: "Dairy" },
        { category_id: 3, category_name: "Canned and Ready Meals" },
        { category_id: 4, category_name: "Fruits and Vegetables" },
        { category_id: 5, category_name: "Protein Ingredients" },
        { category_id: 6, category_name: "Beverages" },
      ];
      setCategories(categoryData);
    };

    const fetchUOMs = async () => {
      const uomData = [
        { uom_id: 1, uom_name: "each" },
        { uom_id: 2, uom_name: "kg" },
        { uom_id: 3, uom_name: "g" },
        { uom_id: 4, uom_name: "m" },
        { uom_id: 5, uom_name: "m²" },
        { uom_id: 6, uom_name: "m³" },
        { uom_id: 7, uom_name: "litr" },
      ];
      setUoms(uomData);
    };

    fetchCategories();
    fetchUOMs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: [
        "price_per_unit",
        "weight",
        "purchase_price",
        "discount_percentage",
        "voluminosity",
        "total_profit_on_sales",
        "error_rate_in_weight",
      ].includes(name)
        ? value === ""
          ? ""
          : parseFloat(value)
        : [
            "available_quantity",
            "number_sold",
            "category_id",
            "uom_id",
          ].includes(name)
        ? value === ""
          ? ""
          : parseInt(value)
        : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        file: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      alert("Please select a file before submitting.");
      return;
    }

    setIsLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "file" && formData[key] === null) return;
      formDataToSend.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const res = await fetch("http://localhost:5000/insertProduct", {
        method: "POST",
        body: formDataToSend,
        headers,
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        alert(`✅ محصول شما با موفقیت ثبت شد`);
        setFormData({
          name: "",
          uom_id: "",
          price_per_unit: "",
          available_quantity: "",
          manufacturer_name: "",
          weight: "",
          purchase_price: "",
          discount_percentage: "",
          voluminosity: "",
          combinations: "",
          nutritional_information: "",
          expiration_date: "",
          storage_conditions: "",
          number_sold: "",
          date_added_to_stock: "",
          total_profit_on_sales: "",
          error_rate_in_weight: "",
          category_id: "",
          file: null,
        });
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setIsLoading(false);
      alert("❌ Something went wrong!");
    }
  };
  if (!mounted) return null;

  return (
    <div
      className={`max-w-4xl mx-auto m-5 p-8 shadow-lg rounded-lg ${
        currentTheme === "dark" ? "bg-gray-600" : "bg-gray-100"
      }`}
    >
      <h1 className="text-2xl font-semibold mb-6">مشخصات محصول</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => {
          if (key === "file") {
            return (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium">عکس محصول</label>
                <label
                  htmlFor="dropzone-file"
                  className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition ${
                    currentTheme === "dark"
                      ? "bg-gray-800 hover:bg-gray-900 border-gray-600"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  {formData.file ? (
                    <img
                      src={URL.createObjectURL(formData.file)}
                      alt="Uploaded Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                      <svg
                        className="w-10 h-10 mb-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 15a4 4 0 004 4h10a4 4 0 004-4m-4-4V5a2 2 0 00-2-2H9a2 2 0 00-2 2v6m4-4l-4 4m0 0l4 4m-4-4h12"
                        />
                      </svg>
                      <p className="text-sm font-semibold">
                        برای بارگذاری کلیک کنید
                      </p>
                      <p className="text-xs">PNG, JPG, GIF تا ابعاد 800×400</p>
                    </div>
                  )}
                  <input
                    id="dropzone-file"
                    type="file"
                    name={key}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>
            );
          }

          if (key === "category_id") {
            if (!formData[key] && categories.length > 0) {
              formData[key] = categories[0].category_id;
            }
            return (
              <div key={key} className="flex flex-col">
                <label className="mb-2 text-sm font-medium">
                  {fieldLabels.category_id}
                </label>
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className={` outline-none ${
                    currentTheme === "dark" ? "bg-gray-800/50" : "bg-white"
                  } px-4 py-2 rounded-md`}
                  required
                >
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (key === "uom_id") {
            if (!formData[key] && uoms.length > 0) {
              formData[key] = uoms[0].uom_id;
            }
            return (
              <div key={key} className="flex flex-col">
                <label className="mb-2 text-sm font-medium">
                  {fieldLabels.uom_id}
                </label>
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className={` outline-none ${
                    currentTheme === "dark" ? "bg-gray-800/50" : "bg-white"
                  } px-4 py-2 rounded-md`}
                  required
                >
                  {uoms.map((uom) => (
                    <option key={uom.uom_id} value={uom.uom_id}>
                      {uom.uom_name}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={key} className="flex flex-col">
              <label className="mb-2 text-sm font-medium">
                {fieldLabels[key] || key}
              </label>

              <input
                type={
                  key.includes("date")
                    ? "date"
                    : key === "error_rate_in_weight"
                    ? "number"
                    : "text"
                }
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className={` outline-none ${
                  currentTheme === "dark" ? "bg-gray-800/50" : "bg-white"
                } px-4 py-2 rounded-md`}
                required
              />
            </div>
          );
        })}

        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? "در حال ارسال..." : "افزودن محصول"}
        </button>
      </form>
    </div>
  );
}
AddItem.showSidebar = true;
AddItem.isAdmin = true;
