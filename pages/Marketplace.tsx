import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, MapPin } from 'lucide-react';
import { Product, Store } from '../types';
import { getProducts, STORES } from '../services/mockData';

interface MarketplaceProps {
  selectedStoreId: string;
}

const Marketplace: React.FC<MarketplaceProps> = ({ selectedStoreId }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(100);
  
  // Fetch products (mock)
  const allProducts = useMemo(() => getProducts(), []);
  
  // Filter Logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // 1. Store Filter
      if (selectedStoreId && product.storeId !== selectedStoreId) return false;
      // 2. Category Filter
      if (activeCategory !== 'All' && product.category !== activeCategory) return false;
      // 3. Price Filter
      if (product.pricePerDay > priceRange) return false;
      
      return true;
    });
  }, [selectedStoreId, activeCategory, priceRange, allProducts]);

  const currentStore = STORES.find(s => s.id === selectedStoreId);

  return (
    <div className="bg-brand-cream min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-serif text-4xl text-brand-darkGrey mb-2">Marketplace</h1>
            <p className="text-gray-500 flex items-center gap-2">
              <MapPin size={16} />
              {currentStore ? `Showing items at ${currentStore.name}` : 'Showing items from all locations'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{filteredProducts.length} items found</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
            {/* Category Filter */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                <Filter size={18} /> Categories
              </h3>
              <div className="space-y-2">
                {['All', 'Veil', 'Dress', 'Accessory'].map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeCategory === cat ? 'border-brand-lavender' : 'border-gray-300'}`}>
                      {activeCategory === cat && <div className="w-2 h-2 rounded-full bg-brand-lavender"></div>}
                    </div>
                    <input 
                      type="radio" 
                      name="category" 
                      className="hidden" 
                      checked={activeCategory === cat} 
                      onChange={() => setActiveCategory(cat)} 
                    />
                    <span className={`text-sm ${activeCategory === cat ? 'text-brand-lavender font-bold' : 'text-gray-600 group-hover:text-brand-lavender'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                <SlidersHorizontal size={18} /> Max Price / Day
              </h3>
              <div className="space-y-4">
                <input 
                  type="range" 
                  min="0" 
                  max="150" 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-lavender"
                />
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>0€</span>
                  <span className="text-brand-lavender">{priceRange}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                <h3 className="font-serif text-xl text-gray-400 mb-2">No items found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters or location.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-600 uppercase tracking-wider">
          {product.category}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-brand-darkGrey mb-1 group-hover:text-brand-lavender transition-colors">{product.title}</h3>
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-2">
          <span className="text-brand-darkGrey font-semibold">{product.pricePerDay}€ <span className="text-xs font-normal text-gray-400">/ day</span></span>
          <span className="text-xs text-brand-lavender font-medium bg-brand-lavender/10 px-2 py-1 rounded">View Details</span>
        </div>
      </div>
    </Link>
  );
};

export default Marketplace;
