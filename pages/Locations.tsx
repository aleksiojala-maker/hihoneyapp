import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import { STORES } from '../services/mockData';

const Locations: React.FC = () => {
  return (
    <div className="bg-brand-cream min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-darkGrey mb-4">Our Studios</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Visit us in person to try on your favorite pieces. We operate appointment-based rentals and walk-ins depending on the location.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {STORES.map((store) => (
            <div key={store.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">
              {/* Store Image */}
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={store.image} 
                  alt={store.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h2 className="text-white font-serif text-2xl font-bold">{store.city}</h2>
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <h3 className="font-serif text-xl font-bold text-brand-darkGrey mb-3">{store.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{store.description}</p>
                
                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-brand-lavender flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Address</p>
                      <p className="text-gray-500">{store.address}</p>
                      <p className="text-gray-500">{store.city}</p>
                    </div>
                  </div>
                  
                  {store.hours && (
                    <div className="flex items-start gap-3">
                      <Clock className="text-brand-lavender flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-gray-800">Opening Hours</p>
                        <p className="text-gray-500">{store.hours}</p>
                      </div>
                    </div>
                  )}

                  {store.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="text-brand-lavender flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-gray-800">Contact</p>
                        <p className="text-gray-500">{store.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Link 
                  to={`/marketplace?store=${store.id}`} 
                  className="w-full bg-brand-lavender text-white py-3 rounded-xl font-bold text-center hover:bg-brand-lavenderDark transition-colors flex items-center justify-center gap-2"
                >
                  Shop This Collection <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Locations;