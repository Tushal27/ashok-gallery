import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

function ProductGallery() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [searchterm, setSearchterm] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);

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
  const handleSearch = () => setSearchClicked(true);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "30px" }}>Loading...</p>;

  const filteredEntries = Object.entries(groupedProducts).filter(
    ([heading, products]) =>
      heading.toLowerCase().includes(searchterm.toLowerCase()) ||
      products.some((p) =>
        p.name.toLowerCase().includes(searchterm.toLowerCase())
      )
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🛍 Product Gallery</h2>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Search by name or heading..."
          value={searchterm}
          onChange={(e) => setSearchterm(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          🔍 Search
        </button>
      </div>

      {searchClicked && filteredEntries.length === 0 && (
        <p style={{ textAlign: "center", color: "gray" }}>🔍 No matches found.</p>
      )}

      {(searchClicked ? filteredEntries : Object.entries(groupedProducts)).map(
        ([heading, products]) => (
          <div key={heading} style={{ marginBottom: "40px" }}>
            <h3 style={{ fontSize: "22px", color: "#333", marginBottom: "15px" }}>
              📌 {heading}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {(searchClicked
                ? products.filter(
                    (p) =>
                      heading.toLowerCase().includes(searchterm.toLowerCase()) ||
                      p.name.toLowerCase().includes(searchterm.toLowerCase())
                  )
                : products
              ).map((product) => (
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
                      e.target.src =
                        "https://via.placeholder.com/200?text=Image+Not+Found";
                    }}
                  />
                  <p
                    style={{
                      marginTop: "10px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#333",
                    }}
                  >
                    {product.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* ✅ Popup Modal */}
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
            padding: "10px",
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "20px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            <img
              src={modalData.image_url}
              alt="Zoomed"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            />
            <h2 style={{ fontSize: "20px", margin: "0 0 10px", color: "#222" }}>
              {modalData.name}
            </h2>
            <button
              onClick={closeModal}
              style={{
                marginTop: "10px",
                padding: "8px 18px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "15px",
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