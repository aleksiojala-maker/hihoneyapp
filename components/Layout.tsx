import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { STORES } from '../services/mockData';
import { useCart } from '../context/CartContext';

interface LayoutProps {
  children: React.ReactNode;
  selectedStoreId: string;
  setSelectedStoreId: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, selectedStoreId, setSelectedStoreId }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  const isLinkActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-darkGrey">
      {/* Top Bar - Store Selector */}
      <div className="bg-brand-lavender text-white text-xs py-2 px-4 flex justify-between items-center">
        <span>Free pickup & returns at your local studio</span>
        <div className="flex items-center gap-2">
          <span>Your Store:</span>
          <select 
            value={selectedStoreId} 
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="bg-brand-lavenderDark text-white border-none rounded px-2 py-0.5 text-xs cursor-pointer focus:ring-1 focus:ring-white"
          >
            <option value="">All Locations</option>
            {STORES.map(store => (
              <option key={store.id} value={store.id}>{store.city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-brand-cream border-b border-brand-lavender/20 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif text-2xl font-bold text-brand-lavenderDark tracking-tight">
                Hi Honey
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={`text-sm font-medium hover:text-brand-lavender transition-colors ${isLinkActive('/') ? 'text-brand-lavender font-bold' : ''}`}>Home</Link>
              <Link to="/marketplace" className={`text-sm font-medium hover:text-brand-lavender transition-colors ${isLinkActive('/marketplace') ? 'text-brand-lavender font-bold' : ''}`}>Marketplace</Link>
              <Link to="/locations" className={`text-sm font-medium hover:text-brand-lavender transition-colors ${isLinkActive('/locations') ? 'text-brand-lavender font-bold' : ''}`}>Locations</Link>
              <Link to="/admin" className={`text-sm font-medium hover:text-brand-lavender transition-colors ${isLinkActive('/admin') ? 'text-brand-lavender font-bold' : ''}`}>Admin</Link>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-6">
               <Link to="/profile" className="text-gray-500 hover:text-brand-lavender relative">
                 <Heart size={20} />
               </Link>
               <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-brand-lavender">
                 <User size={20} />
                 <span>Sign In</span>
               </Link>
               <Link to="/cart" className="bg-brand-lavender hover:bg-brand-lavenderDark text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                 <ShoppingBag size={16} />
                 <span>Cart ({cartCount})</span>
               </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Link to="/cart" className="text-gray-500 hover:text-brand-lavender p-2 mr-2 relative">
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-lavender text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-brand-lavender p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-brand-cream hover:text-brand-lavender">Home</Link>
              <Link to="/marketplace" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-brand-cream hover:text-brand-lavender">Marketplace</Link>
              <Link to="/locations" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-brand-cream hover:text-brand-lavender">Locations</Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-brand-cream hover:text-brand-lavender">My Profile</Link>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-brand-cream hover:text-brand-lavender">Admin Dashboard</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-cream border-t border-brand-lavender/20 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
             <div>
               <h3 className="font-serif text-lg font-bold text-brand-lavenderDark mb-4">Hi Honey</h3>
               <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                 Expanding our love for sustainable bridal fashion. Rent luxury pieces, love them for a moment, pass them on.
               </p>
             </div>
             <div>
               <h3 className="font-serif text-lg font-bold text-brand-lavenderDark mb-4">Customer Care</h3>
               <ul className="space-y-2 text-sm text-gray-500">
                 <li><a href="#" className="hover:text-brand-lavender">How it Works</a></li>
                 <li><a href="#" className="hover:text-brand-lavender">Fitting Guide</a></li>
                 <li><a href="#" className="hover:text-brand-lavender">Rental Agreement</a></li>
                 <li><a href="#" className="hover:text-brand-lavender">FAQ</a></li>
               </ul>
             </div>
             <div>
               <h3 className="font-serif text-lg font-bold text-brand-lavenderDark mb-4">Visit Us</h3>
               <p className="text-sm text-gray-500">Maaherrantie 34</p>
               <p className="text-sm text-gray-500">00650 Helsinki</p>
               <p className="text-sm text-gray-500 mt-2">info@ompelimohihoney.fi</p>
             </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-400">
            &copy; 2025 Hi Honey Rental Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;