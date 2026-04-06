import { Button } from "@/components/index";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { Sun, Moon, ChartNoAxesCombined, HandCoins } from "lucide-react";

export function Header() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="fixed z-50 bottom-0 lg:bottom-auto lg:top-0  w-full bg-black/30 backdrop-blur-xl border-t-2 lg:border-t-0 lg:border-b-2">
      <nav className="min-h-16 max-w-5xl w-full mx-auto flex items-center justify-center lg:justify-between lg:px-3">
        <div className="flex items-center justify-between gap-12">
          <NavLink
            className={({ isActive }) =>
              (isActive ? "text-blue-900 font-semibold" : "") +
              ` dark:text-neutral-200 flex flex-col items-center`
            }
            to={"/finanzas"}
          >
            <HandCoins className="lg:hidden" size={18} />
            Finanzas
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              (isActive ? "text-blue-900 font-semibold" : "") +
              ` dark:text-neutral-200 flex flex-col items-center`
            }
            to={"/dashboard"}
          >
            <ChartNoAxesCombined className="lg:hidden" size={18} />
            Dashboard
          </NavLink>
          <Button
            variant={"link"}
            className="hover:no-underline scale-110 visible lg:invisible flex flex-col items-center gap-0"
            onClick={handleTheme}
          >
            {theme === "light" ? <Moon /> : <Sun />}
            <span className="lg:hidden">Tema</span>
          </Button>
        </div>
        <div className="lg:flex items-center gap-6 hidden">
          {/* <Link to={"/login"}>Iniciar Sesión</Link> */}
          <Button variant={"link"} className="scale-110" onClick={handleTheme}>
            {theme === "light" ? <Moon /> : <Sun />}
          </Button>
        </div>
      </nav>
    </header>
  );
}
