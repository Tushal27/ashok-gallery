import React, { useEffect, useState } from "react"; import { supabase } from "./supabase";

export default function DeleteProducts() { const [products, setProducts] = useState([]); const [searchTerm, setSearchTerm] = useState(""); const [loading, setLoading] = useState(true);

useEffect(() => { const fetchData = async () => { const { data, error } = await supabase.from("products").select("*"); if (!error) setProducts(data); setLoading(false); }; fetchData(); }, []);

const handleDelete = async (id, imageUrl) => { const filePath = imageUrl.split("/product-images/")[1]; const { error: delError } = await supabase.from("products").delete().eq("id", id); if (!delError) { await supabase.storage.from("product-images").remove([filePath]); setProducts(products.filter((p) => p.id !== id)); alert("✅ Deleted successfully!"); } else { alert("❌ Delete failed: " + delError.message); } };

const filtered = products.filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.price?.toLowerCase().includes(searchTerm.toLowerCase()) );

return ( <div style={{ padding: "20px" }}> <h2 style={{ textAlign: "center" }}>🗑 Delete Products</h2> <input type="text" placeholder="Search by name or heading..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "20px" }} />

{loading ? (
    <p>Loading...</p>
  ) : filtered.length === 0 ? (
    <p>No products match your search.</p>
  ) : (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px",
      }}
    >
      {filtered.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            textAlign: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
            }}
          />
          <p style={{ fontWeight: "bold", margin: "10px 0" }}>{product.name}</p>
          <p style={{ color: "#777" }}>{product.price}</p>
          <button
            onClick={() => handleDelete(product.id, product.image_url)}
            style={{
                backgroundColor: "#ff4d4d",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "8px 12px",
                cursor: "pointer",
            }}
          >
            🗑️ Delete
            </button>
        </div>
        ))}
    </div>
  )}
</div>
);
}