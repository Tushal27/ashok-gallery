import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import Login from "./connection/login";
import AdminUpload from "./connection/AdminUpload";
import ProductGallery from "./connection/ProductGallery";
import { supabase } from "./connection/supabase";

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
      <nav style={navbarStyle}>
        <div style={navLeft}>
          <Link to="/" style={navLink}>🏠 Home</Link>
          {user && <Link to="/admin" style={navLink}>📤 Upload</Link>}
        </div>
        <div>
          {user ? (
            <button onClick={handleLogout} style={logoutBtn}>🔓 Logout</button>
          ) : (
            <Link to="/login" style={navLink}>🔐 Admin Login</Link>
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
              <p style={{ padding: "20px", color: "red", textAlign: "center" }}>
                Please login to access admin upload.
              </p>
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;

// 🔵 Inline Styles
const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 25px",
  backgroundColor: "#007bff",
  color: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const navLeft = {
  display: "flex",
  gap: "20px",
  alignItems: "center",
};

const navLink = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px",
};

const logoutBtn = {
  backgroundColor: "#e63946",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
};