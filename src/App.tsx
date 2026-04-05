import { Header } from "@/Global/Header";
import { Route, Routes } from "react-router";
import { FinanzasLayout } from "@/features/Finanzas/Layout/FInanzasLayout";
import { Toaster } from "@/components/index";

function App() {
  return (
    <>
      <Header />
      <main className="w-full max-w-5xl mx-auto px-3 mb-24 mt-12 lg:mt-24 lg:mb-12">
        <Routes>
          <Route path="/finanzas" element={<FinanzasLayout />} />
        </Routes>

        <Toaster />
      </main>
    </>
  );
}

export default App;
