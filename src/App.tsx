import { Header } from "@/Global/Header";
import { Route, Routes } from "react-router";
import { FinanzasLayout } from "@/features/Finanzas/Layout/FInanzasLayout";
import { Toaster } from "@/components/index";
import { DashboardLayout } from "./features/Dashboard/layout/DashboardLayout";
import { useEffect, useState } from "react";

function App() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth > 768 ? false : true,
  );

  const detectarTamaño = () => {
    setIsMobile(window.innerWidth > 768 ? false : true);
  };

  useEffect(() => {
    window.addEventListener("resize", detectarTamaño);
    return () => {
      window.removeEventListener("resize", detectarTamaño);
    };
  }, []);

  console.log(isMobile);

  return (
    <>
      <Header />
      <main className="w-full max-w-5xl mx-auto px-3 mb-24 mt-12 lg:mt-24 lg:mb-12">
        <Routes>
          <Route path="/finanzas" element={<FinanzasLayout />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
        </Routes>

        <Toaster position={isMobile ? "top-center" : "bottom-right"} />
      </main>
    </>
  );
}

export default App;
