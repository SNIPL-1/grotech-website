import React from 'react';

export default function Footer() {
  return (
    <footer className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div>© Sri Neelkanth Impex Pvt. Ltd. — GROTECH [test]</div>
        <div className="muted">Built for export-quality tools | Ludhiana, India</div>
      </div>
    </footer>
  );
}
