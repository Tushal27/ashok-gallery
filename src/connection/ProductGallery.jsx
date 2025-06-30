import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

function ProductGallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "30px" }}>Loading products...</p>;
  }

  if (!products.length) {
    return <p style={{ textAlign: "center", marginTop: "30px" }}>No products found.</p>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "28px" }}>🛍 Product Gallery</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/200?text=Image+Not+Found";
              }}
            />
            <h3 style={{ marginTop: "12px", fontSize: "18px" }}>{product.name}</h3>
            <p style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;