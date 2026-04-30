"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded-full border border-[#AFA9EC] bg-[#CECBF6] dark:bg-[#26215C] dark:border-[#534AB7] flex items-center justify-center transition-all duration-200 hover:bg-[#AFA9EC] hover:border-[#7F77DD] dark:hover:bg-[#3C3489] hover:scale-105 active:scale-95"
    >
      {isDark
        ? <Sun  size={16} className="text-[#AFA9EC] transition-transform duration-300 rotate-0" />
        : <Moon size={16} className="text-[#26215C] transition-transform duration-300 rotate-0" />
      }
    </button>
  );
}