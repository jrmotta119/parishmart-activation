import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import StoreRegistration from "./components/StoreRegistration";
import StoreRegistrationForm from "./components/StoreRegistrationForm";
import VendorRegistrationForm from "./components/VendorRegistrationForm";
import SellWithUs from "./components/SellWithUs";
import ProductsPage from "./components/ProductsPage";
import ShopPage from "./components/ShopPage";
import MarketplacePage from "./components/MarketplacePage";
import DonationsPage from "./components/DonationsPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { AuthProvider } from "./components/auth/AuthContext";
import VendorProfilePage from "./components/VendorProfilePage";

// Conditional import for tempo routes
let routes: any = [];
if (import.meta.env.VITE_TEMPO === "true") {
  try {
    routes = require("tempo-routes");
  } catch (error) {
    console.warn("Tempo routes not available");
  }
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          {/* For the tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && routes.length > 0 && useRoutes(routes)}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/why-register" element={<StoreRegistration />} />
            <Route
              path="/store-registration"
              element={<StoreRegistrationForm />}
            />
            <Route
              path="/vendor-registration-form"
              element={<VendorRegistrationForm />}
            />
            <Route path="/sell-with-us" element={<SellWithUs />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:category" element={<MarketplacePage />} />
            <Route path="/marketplace/:category/:subcategory" element={<MarketplacePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:category" element={<ProductsPage />} />
            <Route path="/products/:category/:subcategory" element={<ProductsPage />} />
            <Route path="/donations" element={<DonationsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/marketplace/vendor/:vendorId" element={<VendorProfilePage />} />

            {/* Add this before any catchall route */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" element={<></>} />
            )}

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
