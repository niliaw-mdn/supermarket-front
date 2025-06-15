import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import Image from "next/image";

function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const loginHandler = async () => {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("email",email)
      toast.success("با موفقیت وارد شدید.");
      router.push("/dashboard");
    } else {
      toast.error("لطفا اطلاعات را درست وارد کنید.");
    }
  };

  return (
    <>
      <div className="bg-[url(/pic/bg.jpg)] bg-cover bg-center bg-no-repeat">
        <Toaster />
        <div className="flex justify-center items-center h-screen">
          <div className="border border-white rounded-md backdrop-blur-3xl shadow-md">
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-10 justify-center items-center p-10">
                <h3 className="text-3xl text-white">
                  برای ورود ایمیل و رمز عبور خود را وارد کنید
                </h3>
                <div className="relative w-full">
                  <input
                    type="email"
                    id="floating-input"
                    className="block w-full h-10 px-2.5 pt-5 pb-2 text-gray-900 bg-gray-500/40 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring focus:ring-purple-600 focus:border-purple-600 peer"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label
                    htmlFor="floating-input"
                    className="absolute   px-1 duration-300 transform top-[-10px] right-2 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-700 peer-placeholder-shown:bg-transparent peer-focus:top-[-25px] peer-focus:text-purple-300"
                  >
                    ایمیل
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="password"
                    id="floating-input"
                    className="block w-full h-10 px-2.5 pt-5 pb-2 text-gray-900 bg-gray-500/40 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring focus:ring-purple-600 focus:border-purple-600 peer"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    htmlFor="floating-input"
                    className="absolute   px-1 duration-300 transform top-[-10px] right-2 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-700 peer-placeholder-shown:bg-transparent peer-focus:top-[-25px] peer-focus:text-purple-300"
                  >
                    رمز ورود
                  </label>
                </div>
                <div className="flex justify-center">
                  <button
                    className="bg-purple-300/40 hover:bg-fuchsia-500 w-64 rounded-md h-10 text-white font-bold text-lg"
                    onClick={loginHandler}
                  >
                    ورود
                  </button>
                </div>
              </div>
              <div className="relative w-[600px] h-[500px] overflow-hidden">
                <div className="absolute inset-0">
                  <div className="relative -left-16 w-[1000px] h-full">
                    <div className="absolute inset-0 bg-white transform -skew-x-12 shadow-md" />
                  </div>
                </div>

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
    </>
  );
}

export default Index;
