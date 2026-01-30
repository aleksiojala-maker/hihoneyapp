import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { 
  Package, Calendar, Clock, RotateCcw, 
  LayoutGrid, List, PlusCircle, Search, X, Check, User as UserIcon, MapPin, Pencil, Trash2, Image as ImageIcon
} from 'lucide-react';
import { getRentals, getProducts, createRental, STORES, addProduct, updateProduct, deleteProduct } from '../services/mockData';
import { Product, Rental, RentalStatus, Category } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory'>('overview');
  const [rentals, setRentals] = useState<Rental[]>(getRentals());
  const [products, setProducts] = useState<Product[]>(getProducts());

  // --- Actions ---
  const refreshData = () => {
    setRentals([...getRentals()]);
    setProducts([...getProducts()]);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-brand-darkGrey">Store Dashboard</h1>
            <p className="text-sm text-gray-500">Manage bookings, inventory, and blocking.</p>
          </div>
          
          {/* Tab Switcher */}
          <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors
                ${activeTab === 'overview' ? 'bg-brand-lavender text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <LayoutGrid size={16} /> Overview
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors
                ${activeTab === 'inventory' ? 'bg-brand-lavender text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <List size={16} /> Inventory & Bookings
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <OverviewTab rentals={rentals} products={products} />
        ) : (
          <InventoryTab products={products} rentals={rentals} onUpdate={refreshData} />
        )}

      </div>
    </div>
  );
};

// --- Overview Tab Components ---

const OverviewTab: React.FC<{ rentals: Rental[], products: Product[] }> = ({ rentals, products }) => {
  
  // 1. Stats Calculation
  const stats = {
    active: rentals.filter(r => r.status === 'active').length,
    reserved: rentals.filter(r => r.status === 'reserved').length,
    completed: rentals.filter(r => r.status === 'completed').length,
    revenue: rentals.reduce((acc, curr) => acc + curr.totalPrice, 0)
  };

  // 2. Top Products Data
  const productStats = products.map(p => {
    const count = rentals.filter(r => r.productId === p.id).length;
    return { name: p.title, count, id: p.id };
  }).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5

  // 3. Category Data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    rentals.forEach(r => {
      const p = products.find(prod => prod.id === r.productId);
      if (p) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [rentals, products]);

  // 4. Location Data
  const locationStats = useMemo(() => {
    return STORES.map(store => {
      const storeRentals = rentals.filter(r => r.storeId === store.id);
      return {
        name: store.city,
        rentals: storeRentals.length,
        revenue: storeRentals.reduce((sum, r) => sum + r.totalPrice, 0)
      };
    });
  }, [rentals]);

  const COLORS = ['#9F87AF', '#D4AF37', '#F4E1E1', '#7A6588'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Active Rentals" value={stats.active} icon={<Clock className="text-blue-500" />} />
        <StatCard title="Upcoming" value={stats.reserved} icon={<Calendar className="text-purple-500" />} />
        <StatCard title="Returns Due" value={1} icon={<RotateCcw className="text-orange-500" />} />
        <StatCard title="Total Revenue" value={`${stats.revenue}€`} icon={<Package className="text-green-500" />} />
      </div>

      {/* Location Performance */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-darkGrey mb-4 flex items-center gap-2">
          <MapPin className="text-brand-lavender" /> Location Performance
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Rentals per Location */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-6 text-brand-darkGrey">Rentals by Location</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationStats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="rentals" fill="#9F87AF" radius={[4, 4, 0, 0]} barSize={50}>
                     {locationStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue per Location */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-6 text-brand-darkGrey">Revenue by Location</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationStats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis unit="€" />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg mb-6 text-brand-darkGrey">Most Rented Items</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productStats} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="count" fill="#9F87AF" radius={[0, 4, 4, 0]} barSize={20}>
                  {productStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#D4AF37' : '#9F87AF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg mb-6 text-brand-darkGrey">Rentals by Category</h2>
          <div className="h-[300px] w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Inventory & Bookings Tab ---

const InventoryTab: React.FC<{ products: Product[], rentals: Rental[], onUpdate: () => void }> = ({ products, rentals, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingModalProduct, setBookingModalProduct] = useState<Product | null>(null);
  const [productFormModalOpen, setProductFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setProductFormModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      await deleteProduct(id);
      onUpdate();
    }
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setProductFormModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      {/* Table Header / Toolbar */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <h2 className="font-bold text-xl text-brand-darkGrey whitespace-nowrap">Inventory</h2>
          <button 
            onClick={handleAddClick}
            className="bg-brand-lavender text-white hover:bg-brand-lavenderDark px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1"
          >
            <PlusCircle size={16} /> Add Item
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-lavender focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Collection</th>
              <th className="px-6 py-4">Store</th>
              <th className="px-6 py-4 text-center">Stats</th>
              <th className="px-6 py-4 text-right">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map(product => {
              const productRentals = rentals.filter(r => r.productId === product.id);
              const storeName = STORES.find(s => s.id === product.storeId)?.city || 'Unknown';

              return (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative border border-gray-200">
                        <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-darkGrey text-sm">{product.title}</p>
                        <p className="text-xs text-gray-400">{product.pricePerDay}€ / day</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.collection || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {storeName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400">Rentals</span>
                      <span className="font-bold text-gray-700">{productRentals.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="text-gray-400 hover:text-brand-lavender p-1.5 hover:bg-brand-lavender/10 rounded-md transition-colors"
                        title="Edit Item"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="h-4 w-px bg-gray-200 mx-1"></div>
                      <button 
                        onClick={() => setBookingModalProduct(product)}
                        className="bg-brand-lavender/10 text-brand-lavenderDark hover:bg-brand-lavender hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        Book / Block
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {bookingModalProduct && (
        <AdminBookingModal 
          product={bookingModalProduct} 
          onClose={() => setBookingModalProduct(null)} 
          onConfirm={onUpdate}
        />
      )}

      {productFormModalOpen && (
        <ProductFormModal 
          product={editingProduct} 
          onClose={() => setProductFormModalOpen(false)} 
          onConfirm={onUpdate} 
        />
      )}
    </div>
  );
};

// --- Product Form Modal (Add / Edit) ---

const ProductFormModal: React.FC<{ product: Product | null, onClose: () => void, onConfirm: () => void }> = ({ product, onClose, onConfirm }) => {
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    title: '',
    category: 'Veil',
    storeId: STORES[0].id,
    pricePerDay: 0,
    imageUrl: '',
    description: '',
    features: [],
    collection: '',
    buyPrice: 0
  });
  const [featureInput, setFeatureInput] = useState(product?.features.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const processedData = {
      ...formData,
      features: featureInput.split(',').map(f => f.trim()).filter(f => f !== '')
    };

    if (product) {
      await updateProduct(product.id, processedData);
    } else {
      await addProduct(processedData as any);
    }

    setIsSubmitting(false);
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="font-serif text-lg font-bold text-brand-darkGrey">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title & Category */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-lavender outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-lavender outline-none"
                  >
                    <option value="Veil">Veil</option>
                    <option value="Dress">Dress</option>
                    <option value="Accessory">Accessory</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Store Location</label>
                  <select 
                    value={formData.storeId}
                    onChange={e => setFormData({...formData, storeId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-lavender outline-none"
                  >
                    {STORES.map(s => <option key={s.id} value={s.id}>{s.city}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rent Price / Day (€)</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    value={formData.pricePerDay}
                    onChange={e => setFormData({...formData, pricePerDay: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-lavender outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Buy Price (€)</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="Optional"
                    value={formData.buyPrice || ''}
                    onChange={e => setFormData({...formData, buyPrice: e.target.value ? Number(e.target.value) : undefined})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-lavender outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Collection</label>
                <input 
                  type="text" 
                  placeholder="e.g. Wildest Dreams"
                  value={formData.collection || ''}
                  onChange={e => setFormData({...formData, collection: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-lavender outline-none"
                />
              </div>
            </div>

            {/* Image & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-lavender outline-none"
                    placeholder="https://..."
                  />
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
            <textarea 
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-lavender outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Features (Comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. Silk, 300cm, Lace trim"
              value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-lavender outline-none"
            />
          </div>

          <div className="pt-4 flex gap-3 border-t border-gray-100 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-brand-lavender hover:bg-brand-lavenderDark text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Admin Booking Modal ---

const AdminBookingModal: React.FC<{ product: Product, onClose: () => void, onConfirm: () => void }> = ({ product, onClose, onConfirm }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState<RentalStatus>('reserved');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const total = days * product.pricePerDay;

    // Admin bookings are auto-approved/paid usually, or manually handled
    await createRental({
      userId: customerName || 'Admin Block', // Use name as ID for mock
      productId: product.id,
      storeId: product.storeId,
      startDate: startDate,
      endDate: endDate,
      status: status,
      paymentStatus: 'paid', // Assume admin handled payment or it's a block
      totalPrice: total
    });

    setIsSubmitting(false);
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-serif text-lg font-bold text-brand-darkGrey">Manual Booking</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4 bg-brand-cream/50 p-3 rounded-lg border border-brand-lavender/10">
            <div className="w-12 h-12 rounded bg-white overflow-hidden border border-gray-100">
              <img src={product.imageUrl} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-sm text-brand-darkGrey">{product.title}</p>
              <p className="text-xs text-gray-500">{product.category}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Customer / Reason</label>
            <div className="relative">
              <input 
                required
                type="text" 
                placeholder="e.g. Maintenance, John Doe, Photoshoot"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-lavender focus:border-transparent outline-none"
              />
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Date</label>
              <input 
                required
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-lavender outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Date</label>
              <input 
                required
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-lavender outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as RentalStatus)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-lavender outline-none"
            >
              <option value="reserved">Reserved</option>
              <option value="active">Active (Picked Up)</option>
              <option value="completed">Completed (Returned)</option>
              <option value="late">Late</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-brand-lavender hover:bg-brand-lavenderDark text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : <><Check size={18}/> Create Booking</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
      {icon}
    </div>
  </div>
);

export default AdminDashboard;