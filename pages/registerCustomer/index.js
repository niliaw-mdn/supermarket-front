import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import Image from "next/image";

function Index() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();

  const loginHandler = async () => {
  if (phone.length < 11) {
    toast.error("شماره تلفن باید حداقل ۱۱ رقم باشد");
    return;
  }

  const formData = new FormData();
  formData.append('customer_name', name);
  formData.append('customer_phone', phone);
  formData.append('number_of_purchases', '0');
  formData.append('total', '0');

  if (image) {
    formData.append('file', image);
  } else {
    const defaultImage = await fetch('/pic/avatar.png')
      .then(res => res.blob())
      .then(blob => new File([blob], 'avatar.png', { type: 'image/png' }));
    formData.append('file', defaultImage);
  }

  try {
    const response = await fetch("http://localhost:5001/insertCustomer", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      toast.success("با موفقیت ثبت شد");
      router.push("/productCustomer");
      localStorage.setItem("phone", phone);
      localStorage.setItem("name", name);
    } else {
      const errorData = await response.json();
      toast.error(errorData.error || "خطا در ثبت اطلاعات");
    }
  } catch (err) {
    toast.error("خطا در ارتباط با سرور");
    console.error(err);
  }
};


  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="bg-[url(/pic/bg.jpg)] bg-cover bg-center bg-no-repeat min-h-screen">
      <Toaster />
      <div className="flex justify-center items-center h-screen">
        <div className="border border-white rounded-md backdrop-blur-3xl shadow-md">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-10 justify-center items-center p-10">
              <h3 className="text-3xl text-white">
                خوش آمدید! لطفاً وارد شوید یا ثبت‌نام کنید
              </h3>

              {/* Add image upload input */}
              <div className="relative w-full">
                <label className="block text-white mb-2">عکس پروفایل</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-white"
                />
              </div>

              <div className="relative w-full">
                <input
                  type="text"
                  className="block w-full h-10 px-2.5 pt-5 pb-2 text-gray-900 bg-gray-500/40 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring focus:ring-purple-600 peer"
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label className="absolute px-1 duration-300 transform top-[-10px] right-2 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-700 peer-focus:top-[-25px] peer-focus:text-purple-300">
                  نام
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="tel"
                  className="block w-full h-10 px-2.5 pt-5 pb-2 text-gray-900 bg-gray-500/40 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring focus:ring-purple-600 peer"
                  placeholder=" "
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label className="absolute px-1 duration-300 transform top-[-10px] right-2 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-700 peer-focus:top-[-25px] peer-focus:text-purple-300">
                  شماره همراه
                </label>
              </div>

              <div className="flex justify-center">
                <button
                  className="bg-purple-400 hover:bg-purple-600 w-64 rounded-md h-10 text-white font-bold text-lg transition duration-300"
                  onClick={loginHandler}
                >
                  ورود
                </button>
              </div>
            </div>

            <div className="relative w-[600px] h-[500px] overflow-hidden hidden md:block">
              <Image
                src="/pic/tablet-login-concept-illustration.png"
                width={400}
                height={500}
                className="absolute left-14 z-10 object-contain"
                alt="Login Illustration"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;