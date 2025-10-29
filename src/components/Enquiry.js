import React, { useState } from 'react';

const CONFIG = {
  WHATSAPP_NO: '917986297302'
};

export default function Enquiry() {
  const [form, setForm] = useState({
    name: '',
    city: '',
    mobile: '',
    email: '',
    message: ''
  });

  function onChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    const { name, city, mobile, email, message } = form;
    if (!name.trim() || !city.trim() || !mobile.trim()) {
      alert('Please fill required fields');
      return;
    }
    let text = `New enquiry from ${name.trim()}%0ACity: ${city.trim()}%0AMobile: ${mobile.trim()}`;
    if (email.trim()) text += `%0AEmail: ${email.trim()}`;
    if (message.trim()) text += `%0A%0AMessage:%0A${message.trim()}`;

    const wa = `https://wa.me/${CONFIG.WHATSAPP_NO}?text=${encodeURIComponent(text)}`;
    window.open(wa, '_blank');
  }

  return (
    <section id="enquiry" style={{ marginTop: 28 }}>
      <h2>Enquiry</h2>
      <div className="card">
        <form id="enquiryForm" onSubmit={onSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input placeholder="Name *" id="name" required value={form.name} onChange={onChange} />
            <input placeholder="City *" id="city" required value={form.city} onChange={onChange} />
            <input placeholder="Mobile *" id="mobile" required value={form.mobile} onChange={onChange} />
            <input placeholder="Email (optional)" id="email" value={form.email} onChange={onChange} />
          </div>
          <textarea
            id="message"
            placeholder="Tell us your requirement..."
            style={{ marginTop: 10, height: 120 }}
            value={form.message}
            onChange={onChange}
          />
          <div style={{ marginTop: 10, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn" type="submit">Send via WhatsApp</button>
          </div>
        </form>
      </div>
    </section>
  );
}
