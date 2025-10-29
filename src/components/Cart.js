import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';

const CONFIG = {
  WHATSAPP_NO: '917986297302'
};

export default function Cart() {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('grotech_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('grotech_cart', JSON.stringify(cart));
  }, [cart]);

  function removeItem(index) {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  }

  function downloadPdf() {
    if (cart.length === 0) {
      alert('Cart empty');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('GROTECH — Cart Quote', 14, 18);
    doc.setFontSize(10);
    let y = 28;
    cart.forEach((c, i) => {
      doc.text(`${i + 1}. ${c.itemName} (${c.variant}) — ${c.qty} x ${c.price}`, 14, y);
      y += 8;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save('GROTECH_cart_quote.pdf');
  }

  function sendCartWhatsapp() {
    if (cart.length === 0) {
      alert('Cart empty');
      return;
    }
    const name = prompt('Enter your name (required)');
    if (!name) return alert('Name required');
    const city = prompt('Enter your city (required)');
    if (!city) return alert('City required');
    const mobile = prompt('Enter your mobile number (required)');
    if (!mobile) return alert('Mobile required');

    let msg = `New enquiry from ${name}%0ACity: ${city}%0AMobile: ${mobile}%0A%0AProducts:%0A`;
    cart.forEach(c => {
      msg += `${c.itemName} | ${c.variant} | Qty: ${c.qty} | Price: ${c.price}%0A`;
    });
    const wa = `https://wa.me/${CONFIG.WHATSAPP_NO}?text=${encodeURIComponent(msg)}`;
    window.open(wa, '_blank');
  }

  return (
    <section id="cart" style={{ marginTop: 28 }}>
      <h2>Cart</h2>
      <div className="top-note">Get special quote for below products</div>
      <div id="cartTableWrap" className="card">
        {cart.length === 0 ? (
          <div className="muted">Your cart is empty.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Variant</th>
                <th>Description</th>
                <th>Price/Unit</th>
                <th>Qty</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((c, idx) => (
                <tr key={idx}>
                  <td>{c.itemName}</td>
                  <td>{c.variant}</td>
                  <td>{c.description}</td>
                  <td>{c.price}</td>
                  <td>{c.qty}</td>
                  <td>
                    <button className="outline" onClick={() => removeItem(idx)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button className="btn" onClick={downloadPdf}>Download as PDF</button>
        <button className="btn" onClick={sendCartWhatsapp}>Send Enquiry via WhatsApp</button>
      </div>
    </section>
  );
}
