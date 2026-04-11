import { Toaster } from "@/components/index";
import { FinanzasLayout } from "@/features/Finanzas/Layout/FInanzasLayout";
import { Header } from "@/Global/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { MeshGradientBackground } from "./components/ui/mesh-gradient";
import { DashboardLayout } from "./features/Dashboard/layout/DashboardLayout";

function App() {
  const queryClient = new QueryClient();

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
      <MeshGradientBackground className="-z-50" />
      <Header />
      <QueryClientProvider client={queryClient}>
        <main className="w-full max-w-5xl mx-auto px-3 mb-24 mt-12 lg:mt-24 lg:mb-12">
          <Routes>
            <Route path="/" element={<Navigate to={"/finanzas"} />} />
            <Route path="/finanzas" element={<FinanzasLayout />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
          </Routes>

          <Toaster
            toastOptions={{
              style: {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              },
            }}
            position={isMobile ? "top-center" : "bottom-right"}
          />
        </main>
      </QueryClientProvider>
    </>
  );
}

export default App;
