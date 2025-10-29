import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const CONFIG = {
  CSV_DATA: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=0&single=true&output=csv',
  CSV_IMAGES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=676833393&single=true&output=csv',
  CSV_CATEGORIES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=2136776722&single=true&output=csv',
  WHATSAPP_NO: '917986297302'
};

function normalizeRow(r) {
  return {
    Category: (r['Category'] || r['category'] || '').trim(),
    ItemCode: (r['Item Code'] || r['ItemCode'] || r['Item code'] || '').trim(),
    HSN: (r['HSN Code'] || r['HSN'] || '').trim(),
    ItemName: (r['Item Name'] || r['Item'] || '').trim(),
    Specs: (r['Specs'] || '').trim(),
    Variant: (r['Variant Code'] || r['Variant'] || r['VariantCode'] || '').trim(),
    Description: (r['Description'] || '').trim(),
    Price: (r['Price/Unit'] || r['Price'] || '').trim(),
    Unit: (r['Unit'] || '').trim(),
    MOQ: (r['MOQ'] || '').trim()
  };
}

export default function Products() {
  const [data, setData] = useState([]);
  const [images, setImages] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductCode, setSelectedProductCode] = useState(null);

  useEffect(() => {
    async function fetchCSV(url) {
      return new Promise((resolve, reject) => {
        Papa.parse(url, { download: true, header: true, skipEmptyLines: true, complete: res => resolve(res.data), error: err => reject(err) });
      });
    }
    async function init() {
      try {
        const [dataCsv, imagesCsv, catsCsv] = await Promise.all([
          fetchCSV(CONFIG.CSV_DATA),
          fetchCSV(CONFIG.CSV_IMAGES),
          fetchCSV(CONFIG.CSV_CATEGORIES)
        ]);
        const normData = dataCsv.map(normalizeRow).filter(r => r.Category);
        setData(normData);

        let imgMap = {};
        imagesCsv.forEach(r => {
          if (r['Item Code']) imgMap[r['Item Code'].trim()] = r['Image URL'];
        });
        setImages(imgMap);

        const catsArr = catsCsv.filter(r => r.Category).map(r => ({ category: r.Category, image: r['Image URL'] }));
        setCategories(catsArr);
      } catch (e) {
        console.error(e);
        setData(null);
      }
    }
    init();
  }, []);

  if (!data) {
    return <div className="card">Error loading product data. Make sure your Google Sheet is published as CSV and the links are correct.</div>;
  }

  function uniqueCategories() {
    let map = new Map();
    categories.forEach(c => map.set(c.category, c.image));
    data.forEach(r => { if (!map.has(r.Category)) map.set(r.Category, ''); });
    return Array.from(map.entries()).map(([cat, img]) => ({ category: cat, image: img }));
  }

  function countItemsInCategory(cat) {
    return data.filter(d => d.Category === cat).map(d => d.ItemCode).filter((v, i, a) => v && a.indexOf(v) === i).length;
  }

  function getItemsByCategory(cat) {
    const items = {};
    data.filter(r => r.Category === cat).forEach(r => {
      if (r.ItemCode) items[r.ItemCode] = r;
    });
    return Object.values(items);
  }

  function whatsappLinkForVariant(itemName, row) {
    const text = `Hi, I am interested in product: ${itemName}%0AVariant: ${row.Variant || ''}%0ADescription: ${row.Description || ''}%0APrice/Unit: ${row.Price || ''}`;
    return `https://wa.me/${CONFIG.WHATSAPP_NO}?text=${encodeURIComponent(text)}`;
  }

  return (
    <section id="products" style={{ marginTop: 28 }}>
      <h2>Products</h2>
      <div className="muted">Click a category to view products</div>

      {!selectedCategory && (
        <div id="categoriesGrid" className="grid cards" style={{ marginTop: 12 }}>
          {uniqueCategories().map(({ category, image }) => (
            <div key={category} className="card">
              {image && <img src={image} alt={category} style={{ maxHeight: 150 }} onError={e => { e.target.style.display = 'none'; }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{category}</strong>
                  <div className="muted">{countItemsInCategory(category)} items</div>
                </div>
                <button className="btn" onClick={() => { setSelectedCategory(category); setSelectedProductCode(null); }}>View</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCategory && !selectedProductCode && (
        <div id="productsGrid" style={{ marginTop: 18 }}>
          <h3>Category: {selectedCategory}</h3>
          <div className="grid cards" id="prodCards">
            {getItemsByCategory(selectedCategory).map(itm => (
              <div key={itm.ItemCode} className="card">
                {images[itm.ItemCode] && <img src={images[itm.ItemCode]} alt={itm.ItemName} onError={e => { e.target.style.display = 'none'; }} />}
                <div>
                  <strong>{itm.ItemName || itm.ItemCode}</strong>
                  <div className="muted">Code: {itm.ItemCode}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn" onClick={() => setSelectedProductCode(itm.ItemCode)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
          <button className="btn" style={{ marginTop: 16 }} onClick={() => setSelectedCategory(null)}>Back to Categories</button>
        </div>
      )}

      {selectedProductCode && (
        <ProductDetail
          itemCode={selectedProductCode}
          data={data}
          images={images}
          onBack={() => setSelectedProductCode(null)}
          whatsappLinkForVariant={whatsappLinkForVariant}
        />
      )}
    </section>
  );
}

function ProductDetail({ itemCode, data, images, onBack, whatsappLinkForVariant }) {

  const [cart, setCart] = useCart();
  
  const rows = data.filter(r => r.ItemCode === itemCode);
  if (rows.length === 0) return null;
  const first = rows[0];
  const img = images[itemCode] || '';

  

  function addToCart(variantInfo) {
    let qty = prompt('Enter quantity for ' + (variantInfo.variant || variantInfo.itemCode));
    qty = parseInt(qty);
    if (!qty || qty <= 0) return alert('Invalid quantity');
    const newCart = [...cart, { ...variantInfo, qty }];
    setCart(newCart);
    alert('Added to cart');
  }

  return (
    <div id="productDetail" style={{ marginTop: 18 }}>
      <div className="card product-detail" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h2>{first.ItemName}</h2>
          <div className="muted">Item Code: {first.ItemCode} | HSN Code: {first.HSN || '--'}</div>
          {img && <div style={{ marginTop: 8 }}>
            <img src={img} alt={first.ItemName} onError={e => { e.target.style.display = 'none'; }} style={{ width: '100%', maxHeight: 320, objectFit: 'contain', borderRadius: 8, background: '#fff', padding: 10 }} />
          </div>}
          <h3>Specs</h3>
          <p className="muted">{first.Specs || '--'}</p>
        </div>
        <div style={{ flex: '1 1 400px', overflowX: 'auto' }}>
          <h3>Variants</h3>
          <table>
            <thead>
              <tr>
                <th>Variant Code</th>
                <th>Description</th>
                <th>Price/Unit</th>
                <th>Unit</th>
                <th>MOQ</th>
                <th>WhatsApp</th>
                <th>Add to Cart</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => {
                const waUrl = whatsappLinkForVariant(first.ItemName, r);
                return (
                  <tr key={idx}>
                    <td>{r.Variant || ''}</td>
                    <td>{r.Description || ''}</td>
                    <td>{r.Price || ''}</td>
                    <td>{r.Unit || ''}</td>
                    <td>{r.MOQ || ''}</td>
                    <td><a className="btn" href={waUrl} target="_blank" rel="noopener noreferrer">Chat</a></td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => addToCart({
                          itemName: first.ItemName,
                          itemCode: first.ItemCode,
                          variant: r.Variant,
                          description: r.Description,
                          price: r.Price,
                          unit: r.Unit
                        })}
                      >
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <button className="btn" style={{ marginTop: 16 }} onClick={onBack}>Back to Products</button>
    </div>
  );
}

function useCart() {
  const [cart, setCartState] = useState(() => {
    const stored = localStorage.getItem('grotech_cart');
    return stored ? JSON.parse(stored) : [];
  });

  function setCart(newCart) {
    setCartState(newCart);
    localStorage.setItem('grotech_cart', JSON.stringify(newCart));
  }

  return [cart, setCart];
}
