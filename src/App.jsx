import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import Login from "./connection/login";
import AdminUpload from "./connection/AdminUpload";
import ProductGallery from "./connection/ProductGallery";
import { supabase } from "./connection/supabase";
import logo from "./logo.png"; 
import DeleteProducts from "./connection/DeleteProducts";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  return (
    <div>
      {/* ✅ Navbar */}
      <nav style={{
        padding: "10px 20px",
        background: "#f8f8f8",
        display: "flex",
        flexWrap: "wrap",        
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #ddd"
      }}>
        {/* 🔵 Logo & Home */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: "40px", borderRadius: "5px" }}
          />
          <Link to="/" style={{ textDecoration: "none", color: "#333", fontSize: "20px", fontWeight: "bold" }}>
            BHAWANI ENTERPRISES
          </Link>
        </div>

        {/* 🔵 Menu */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {user ? (
            <>
              <Link  to="/delete-products" style={navLinkStyle}>🗑️ Delete Products</Link>
              <Link to="/admin" style={navLinkStyle}>📤 Upload</Link>
              <button onClick={handleLogout} style={logoutBtnStyle}>🔓 Logout</button>
            </>
          ) : (
            <Link to="/login" style={navLinkStyle}>🔐 Admin Login</Link>
          )}
        </div>
      </nav>

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<ProductGallery />} />
        <Route
          path="/login"
          element={
            <Login
              onLoginSuccess={(user) => {
                setUser(user);
                navigate("/admin");
              }}
            />
          }
        />
        <Route
          path="/admin"
          element={
            user ? (
              <AdminUpload />
            ) : (
              <p style={{ padding: "20px", color: "red" }}>
                Please login first to upload products.
              </p>
            )
          }
        />
        <Route
          path="/delete-products"
          element={
            user ? (
              <DeleteProducts />
            ) : (
              <p style={{ padding: "20px", color: "red" }}>
                Please login first to delete products.
              </p>
            )
          }
        />
        <Route path="*" element={<p style={{ padding: "20px" }}>404 - Page Not Found</p>} />
      </Routes>
    </div>
  );
}

// 🧾 Styles
const navLinkStyle = {
  textDecoration: "none",
  color: "#333",
  fontWeight: "bold",
};

const logoutBtnStyle = {
  padding: "6px 12px",
  fontSize: "14px",
  background: "#ff4d4d",
  border: "none",
  color: "white",
  borderRadius: "4px",
  cursor: "pointer"
};

export default App;
