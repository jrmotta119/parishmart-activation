import React, { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import StoreRegistration from "./components/StoreRegistration";
import StoreRegistrationForm from "./components/StoreRegistrationForm";
import VendorRegistrationForm from "./components/VendorRegistrationForm";
import BusinessActivation from "./components/BusinessActivation";
import ParishActivation from "./components/ParishActivation";
import CauseActivation from "./components/CauseActivation";
import DioceseActivation from "./components/DioceseActivation";
import SponsorActivation from "./components/SponsorActivation";
import ActivationHub from "./components/ActivationHub";
import SellWithUs from "./components/SellWithUs";
import ProductsPage from "./components/ProductsPage";
import ShopPage from "./components/ShopPage";
import MarketplacePage from "./components/MarketplacePage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { AuthProvider } from "./components/auth/AuthContext";
import VendorProfilePage from "./components/VendorProfilePage";
import AboutUs from "./components/AboutUs";
import { AdminProvider, useAdmin } from "./components/admin/AdminContext";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";

// Conditional import for tempo routes
let routes: any = [];
if (import.meta.env.VITE_TEMPO === "true") {
  try {
    routes = require("tempo-routes");
  } catch (error) {
    console.warn("Tempo routes not available");
  }
}

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdmin();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <>
            {/* For the tempo routes */}
            {import.meta.env.VITE_TEMPO === "true" && routes.length > 0 && useRoutes(routes)}

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/why-register" element={<Navigate to="/activate" />} />
              <Route path="/sell-with-us" element={<Navigate to="/activate" />} />
              <Route
                path="/store-registration"
                element={<StoreRegistrationForm />}
              />
              <Route
                path="/vendor-registration-form"
                element={<BusinessActivation />}
              />
              <Route
                path="/vendor-registration-form-legacy"
                element={<VendorRegistrationForm />}
              />
              <Route path="/parish-activation" element={<ParishActivation />} />
              <Route path="/cause-activation" element={<CauseActivation />} />
              <Route path="/diocese-activation" element={<DioceseActivation />} />
              <Route path="/sponsor-activation" element={<SponsorActivation />} />
              <Route path="/activate" element={<ActivationHub />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/:category" element={<MarketplacePage />} />
              <Route path="/marketplace/:category/:subcategory" element={<MarketplacePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:category" element={<ProductsPage />} />
              <Route path="/products/:category/:subcategory" element={<ProductsPage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/marketplace/vendor/:vendorId" element={<VendorProfilePage />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />

              {/* Add this before any catchall route */}
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" element={<></>} />
              )}

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        </Suspense>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
