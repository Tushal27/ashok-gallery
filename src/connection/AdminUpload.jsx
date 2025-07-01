import { useState } from 'react';
import { supabase } from './supabase';

export default function AdminUpload() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const upload = async () => {
    if (!file || !name ) return alert("❌ All fields are required!");

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) return alert("❌ Image upload failed: " + uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase
      .from('products')
      .insert([{ name, price: price, image_url: publicUrl }]);

    if (insertError) return alert("❌ DB insert failed: " + insertError.message);

    alert("✅ Product uploaded!");
    setFile(null);
    setName('');
    setPrice('');
  };

  return (
    <div style={{
      padding: '30px',
      maxWidth: '400px',
      margin: '40px auto',
      background: '#f0f0f0',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Upload Product</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} style={inputStyle} />
      <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
      <input type="text" placeholder="Heading" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
      <button onClick={upload} style={buttonStyle}>Upload</button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '16px'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer'
};
