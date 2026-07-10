"use client";
import React from "react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-stone-700 dark:text-stone-500"
      onClick={() => {
        if (theme === "dark") {
          setTheme("light");
        } else {
          setTheme("dark");
        }
      }}
    >
      {theme === "dark" ? <Sun size="16" /> : <Moon size="16" />}
    </Button>
  );
}

export default ThemeToggle;
