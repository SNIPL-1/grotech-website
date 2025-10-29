import React from 'react';
import Header from './components/Header';
import About from './components/About';
import Products from './components/Products';
import Cart from './components/Cart';
import Enquiry from './components/Enquiry';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  // Global states for cart and product data will be handled inside Products and Cart

  return (
    <>
      <Header />
      <main className="container">
        <About />
        <Products />
        <Cart />
        <Enquiry />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
