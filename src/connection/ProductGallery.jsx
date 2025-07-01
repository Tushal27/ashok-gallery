import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

function ProductGallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null); // For modal

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

  const openModal = (product) => setModalData(product);
  const closeModal = () => setModalData(null);

  if (loading) return <p style={{ textAlign: "center", marginTop: "30px" }}>Loading...</p>;

  if (!products.length) return <p style={{ textAlign: "center", marginTop: "30px" }}>No products found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🛍 Product Gallery</h2>

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
                objectFit: "contain",
                borderRadius: "6px",
                backgroundColor: "#f9f9f9",
              }}
            />
            <p style={{ marginTop: "10px", fontWeight: "bold" }}>{product.name}</p>
          </div>
        ))}
      </div>

      {/* ✅ Modal Popup */}
      {modalData && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              maxWidth: "90%",
              maxHeight: "90%",
              textAlign: "center",
            }}
          >
            <img
              src={modalData.image_url}
              alt="Zoomed"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
            <h3 style={{ marginTop: "15px" }}>{modalData.name}</h3>
            <button
              onClick={closeModal}
              style={{
                marginTop: "10px",
                padding: "6px 15px",
                background: "#222",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
