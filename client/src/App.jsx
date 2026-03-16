import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminItemForm from "./pages/admin/AdminItemForm";
import AdminItems from "./pages/admin/AdminItems";
import AdminLogin from "./pages/admin/AdminLogin";
import Contact from "./pages/public/Contact";
import Home from "./pages/public/Home";
import ItemDetail from "./pages/public/ItemDetail";
import Shop from "./pages/public/Shop";

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-antique-cream text-antique-dark">
      {!isAdminRoute ? <Navbar /> : null}

      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Shop />} path="/shop" />
        <Route element={<ItemDetail />} path="/shop/:id" />
        <Route element={<Contact />} path="/contact" />
        <Route element={<AdminLogin />} path="/admin/login" />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminDashboard />} path="/admin/dashboard" />
          <Route element={<AdminItems />} path="/admin/items" />
          <Route element={<AdminItemForm />} path="/admin/items/new" />
          <Route element={<AdminItemForm />} path="/admin/items/:id" />
          <Route element={<AdminCategories />} path="/admin/categories" />
          <Route element={<AdminEnquiries />} path="/admin/enquiries" />
        </Route>
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>

      {!isAdminRoute ? <Footer /> : null}
    </div>
  );
}

export default AppLayout;
