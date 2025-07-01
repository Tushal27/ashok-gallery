import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

function ProductGallery() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        const grouped = {};
        data.forEach((item) => {
          const heading = item.price || "Others";
          if (!grouped[heading]) grouped[heading] = [];
          grouped[heading].push(item);
        });
        setGroupedProducts(grouped);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const openModal = (product) => setModalData(product);
  const closeModal = () => setModalData(null);

  if (loading) return <p style={{ textAlign: "center", marginTop: "30px" }}>Loading...</p>;
  if (!Object.keys(groupedProducts).length) return <p style={{ textAlign: "center", marginTop: "30px" }}>No products found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🛍 Product Gallery</h2>

      {Object.entries(groupedProducts).map(([heading, products]) => (
        <div key={heading} style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "22px", color: "#333", marginBottom: "15px" }}>📌 {heading}</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => openModal(product)}
              >
                <img
                  src={product.image_url}
                  alt="Product"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    backgroundColor: "#f9f9f9",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/200?text=Image+Not+Found";
                  }}
                />
                <p style={{ marginTop: "10px", fontWeight: "bold", fontSize: "16px" }}>
                  {product.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ✅ Modal Popup */}
      {modalData && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
            overflow: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "30px",
              width: "100%",
              maxWidth: "1000px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
              boxSizing: "border-box",
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={modalData.image_url}
              alt="Zoomed Product"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
            <h2 style={{ marginTop: "15px", fontSize: "22px", color: "#222" }}>
              {modalData.name}
            </h2>
            <button
              onClick={closeModal}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
