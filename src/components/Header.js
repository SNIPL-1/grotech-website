import React from 'react';

export default function Header() {
  return (
    <header>
      <div className="container">
        <div className="hero">
          <div>
            <h1>GROTECH — Sri Neelkanth Impex Pvt. Ltd.</h1>
            <div className="muted">
              Manufacturers & Exporters of Hand Tools, Garden Tools, Mason Tools,
              Automotive Tools, Scaffolding Accessories & Hardware
            </div>
          </div>
          <img
            id="brandLogo"
            alt="GROTECH logo"
            src="" // Add logo URL here if available
            style={{ width: 140, height: 90, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px #0002)', background: '#fff', borderRadius: 10, padding: 8 }}
          />
        </div>
        <nav id="mainNav">
          <a href="#about">About</a>
          <a href="#products">Products</a>
          <a href="#cart">Cart</a>
          <a href="#enquiry">Enquiry</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
