import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import Locations from './pages/Locations';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';

const App: React.FC = () => {
  // Global state for selected store (default to Helsinki)
  const [selectedStoreId, setSelectedStoreId] = useState<string>('helsinki-oulunkyla');

  return (
    <CartProvider>
      <Router>
        <Layout selectedStoreId={selectedStoreId} setSelectedStoreId={setSelectedStoreId}>
          <Routes>
            <Route 
              path="/" 
              element={<Home setSelectedStoreId={setSelectedStoreId} />} 
            />
            <Route 
              path="/marketplace" 
              element={<Marketplace selectedStoreId={selectedStoreId} />} 
            />
            <Route 
              path="/locations" 
              element={<Locations />} 
            />
            <Route 
              path="/product/:id" 
              element={<ProductDetail />} 
            />
            <Route 
              path="/cart" 
              element={<Cart />} 
            />
            <Route 
              path="/admin" 
              element={<AdminDashboard />} 
            />
             <Route 
              path="/profile" 
              element={<UserProfile />} 
            />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
};

export default App;