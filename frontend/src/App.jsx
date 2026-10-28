import { useEffect, useState } from "react";
import BuyingProcess from "./components/public/BuyingProcess";
import Testimonials from "./components/public/Testimonials";
import Welcome from "./components/public/Welcome";
import Footer from "./components/public/Footer";
import SearchBar from "./components/public/SearchBar";
import NavBar from "./components/public/NavBar";
import PublicVehicleGrid from "./components/public/PublicVehicleGrid";
import Login from "./components/public/Login";
import PublicVehicleDetail from "./pages/public/PublicVehicleDetail";
import AdminLayout from "./layouts/AdminLayout";
import AdminVehicleForm from "./pages/admin/AdminVehicleForm";
import AdminVehicles from "./pages/admin/AdminVehicles";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

function ScrollToRoute() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function PublicHome() {
  const [vehicleFilters, setVehicleFilters] = useState({});

  return (
    <>
      <NavBar />
      <Welcome />
      <SearchBar onSearch={setVehicleFilters} />
      <PublicVehicleGrid
        key={JSON.stringify(vehicleFilters)}
        filters={vehicleFilters}
      />
      <BuyingProcess />
      <Testimonials />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToRoute />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route
            path="/vehicles/:vehicleId"
            element={<PublicVehicleDetail />}
          />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="vehicles" replace />} />
              <Route path="vehicles" element={<AdminVehicles />} />
              <Route path="vehicles/new" element={<AdminVehicleForm />} />
              <Route
                path="vehicles/:vehicleId/edit"
                element={<AdminVehicleForm />}
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
