import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Heart } from 'lucide-react';
import { STORES } from '../services/mockData';

interface HomeProps {
  setSelectedStoreId: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ setSelectedStoreId }) => {
  // Map categories to public Unsplash images
  const categoryImages: Record<string, string> = {
    'Veils': 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&q=80',
    'Dresses': 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=800&q=80',
    'Accessories': 'https://images.unsplash.com/photo-1546167889-0d259e4dc4f4?w=800&q=80',
    'Sashes': 'https://images.unsplash.com/photo-1595407753234-0882f1e77954?w=800&q=80'
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative bg-brand-softPink/30 h-[600px] flex items-center overflow-hidden">
        {/* Abstract shapes for background interest */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-lavender/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-brand-gold/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-brand-lavenderDark text-sm font-semibold tracking-wide border border-brand-lavender/20">
                Sustainable Bridal Rentals
              </span>
              <h1 className="font-serif text-5xl md:text-6xl text-brand-darkGrey leading-tight">
                Luxury for the weekend, <br/>
                <span className="text-brand-lavender italic">memories for a lifetime.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Rent high-quality veils, dresses, and accessories from your local Hi Honey studio. Look stunning without the commitment.
              </p>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-brand-cream max-w-md mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Find a studio near you</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-lavender focus:border-transparent outline-none appearance-none cursor-pointer"
                      onChange={(e) => setSelectedStoreId(e.target.value)}
                    >
                      <option value="">Select Location...</option>
                      {STORES.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                  </div>
                  <Link to="/marketplace" className="bg-brand-lavender hover:bg-brand-lavenderDark text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
                    Go <ArrowRight size={18} className="ml-2"/>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="relative h-[500px] w-full rounded-t-[150px] rounded-b-[20px] overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80"
                  alt="Brides celebrating"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-2 rounded-lg shadow-xl max-w-xs border border-gray-100 flex items-center gap-3">
                 <div className="w-16 h-16 rounded overflow-hidden">
                   <img
                      src="https://images.unsplash.com/photo-1595407753234-0882f1e77954?w=800&q=80"
                      alt="Happy bride"
                      className="w-full h-full object-cover"
                   />
                 </div>
                 <div className="pr-4">
                    <p className="font-bold text-gray-800 text-sm">Loved by 500+ Brides</p>
                    <p className="text-xs text-gray-500">Join the sustainable movement</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-brand-darkGrey mb-4">How it Works</h2>
          <p className="text-gray-500">Simple, sustainable, and stress-free.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <MapPin size={32}/>, title: '1. Choose your Studio', desc: 'Select your nearest Hi Honey location to see what is available locally.' },
            { icon: <Calendar size={32}/>, title: '2. Book your Dates', desc: 'Select your rental period (usually 3-5 days) and reserve online.' },
            { icon: <Heart size={32}/>, title: '3. Wear & Return', desc: 'Pick up your item, shine on your big day, and return it effortlessly.' }
          ].map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group">
              <div className="w-16 h-16 bg-brand-cream text-brand-lavender rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-serif text-3xl font-bold text-brand-darkGrey">Browse Collections</h2>
          <Link to="/marketplace" className="text-brand-lavender hover:text-brand-lavenderDark font-medium flex items-center">
            View All <ArrowRight size={16} className="ml-1"/>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Veils', 'Dresses', 'Accessories', 'Sashes'].map((cat) => (
            <Link to={`/marketplace?category=${cat}`} key={cat} className="group relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer">
              <img 
                src={categoryImages[cat]} 
                alt={cat} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-serif text-2xl font-bold">{cat}</h3>
                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 inline-block mt-2">
                  Explore Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;