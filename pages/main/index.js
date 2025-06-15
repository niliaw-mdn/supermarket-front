import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 min-h-screen text-white">
      <div className="min-h-screen flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <Image
              src="/pic/main.jpg"
              width={600}
              height={600}
              className="w-full max-w-xl rounded-xl shadow-lg"
              alt="superMarket"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-center md:text-right max-w-2xl space-y-6"
          >
            <h1 className="text-4xl font-extrabold text-white">
              به فروشگاه هوشمند ما خوش آمدید!
            </h1>
            <p className="text-2xl text-white/90">
              تجربه‌ای نو از خرید آنلاین، سریع، ساده و هوشمند
            </p>
            <span className="text-lg text-white/80 leading-relaxed block">
              در دنیای امروز، وقت طلاست. ما اینجاییم تا خرید را برایتان آسان،
              دقیق و لذت‌بخش کنیم. فروشگاه هوشمند ما با استفاده از تکنولوژی‌های
              نوین، پیشنهادهای شخصی‌سازی‌شده، قیمت‌های رقابتی و ارسال سریع،
              بهترین تجربه خرید آنلاین را برای شما فراهم می‌کند.
            </span>
           <div className="flex gap-4 justify-center mt-4">
              <a href="/registerCustomer" className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-md shadow-lg transition-all duration-300 hover:bg-indigo-100 hover:scale-105">
                ورود به عنوان کاربر
              </a>
              <a href="/login" className="bg-transparent border border-white text-white font-semibold px-6 py-2 rounded-md shadow-lg transition-all duration-300 hover:bg-white hover:text-indigo-600 hover:scale-105">
                ورود به عنوان ادمین
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
