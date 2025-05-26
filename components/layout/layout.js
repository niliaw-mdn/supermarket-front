import SidebarAdmin from "./sidebarAdmin";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

function Layout({ children, showSidebar = false}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? "light" : theme;

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`min-h-screen ${
        currentTheme === "dark" ? "bg-[#060818]" : "bg-gray-50"
      }`}
    >
      <div className="flex flex-col min-h-screen">
        {showSidebar && (
          <SidebarAdmin isOpen={menuOpen} setIsOpen={setMenuOpen} />
        )}
        <div className={`transition-all duration-300 flex-1`}>
          <div
            className={`${
              menuOpen
                ? "lg:translate-x-[-256px] mr-2 drawer lg:w-[74%] xl:w-[80%]"
                : "translate-x-0"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
