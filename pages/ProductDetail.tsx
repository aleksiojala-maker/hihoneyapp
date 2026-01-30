import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, MapPin, ShoppingBag, ShoppingCart } from 'lucide-react';
import { getProductById, checkAvailability, createRental, processPayment, STORES, MOCK_USER } from '../services/mockData';
import { Product } from '../types';
import PaymentModal from '../components/PaymentModal';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  // Rental State
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('12:00');
  const [returnTime, setReturnTime] = useState<string>('12:00');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  // Booking Process State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [lastPaymentMethod, setLastPaymentMethod] = useState<'card' | 'store' | null>(null);

  useEffect(() => {
    if (id) {
      const p = getProductById(id);
      setProduct(p);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Reset availability when dates change
    if (startDate && endDate) {
      const start = new Date(`${startDate}T${pickupTime}`);
      const end = new Date(`${endDate}T${returnTime}`);
      
      if (start <= end) {
        const available = checkAvailability(product?.id || '', start, end);
        setIsAvailable(available);
      } else {
        setIsAvailable(null);
      }
    } else {
      setIsAvailable(null);
    }
  }, [startDate, endDate, pickupTime, returnTime, product]);

  const getPreviewPrice = () => {
    if(!startDate || !endDate || !product) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if(start > end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    return diffDays * product.pricePerDay;
  }
  
  const totalPrice = getPreviewPrice();

  const handleAddToCart = () => {
    if (!product || !startDate || !endDate || !isAvailable) return;
    
    addToCart({
      id: Date.now().toString(),
      product,
      startDate,
      endDate,
      pickupTime,
      returnTime,
      totalPrice
    });

    // Optional: Flash success or redirect
    navigate('/cart');
  };

  const initiateBooking = () => {
    if (!product || !startDate || !endDate || !isAvailable) return;
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async (method: 'card' | 'store', cardDetails?: any) => {
    if (!product || !startDate || !endDate) return;
    
    setBookingStatus('processing');
    
    const fullStartDate = new Date(`${startDate}T${pickupTime}`).toISOString();
    const fullEndDate = new Date(`${endDate}T${returnTime}`).toISOString();

    // Process Payment if Card selected
    if (method === 'card') {
      const success = await processPayment(totalPrice, { cardNumber: cardDetails.cardNumber });
      if (!success) {
        throw new Error("Payment Failed");
      }
    }

    await createRental({
      userId: MOCK_USER.id,
      productId: product.id,
      storeId: product.storeId,
      startDate: fullStartDate,
      endDate: fullEndDate,
      status: 'active', 
      paymentStatus: method === 'card' ? 'paid' : 'pending',
      totalPrice: totalPrice
    });

    setLastPaymentMethod(method);
    setBookingStatus('success');
    setShowPaymentModal(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const store = STORES.find(s => s.id === product.storeId);

  const modalDescription = (
    <div className="space-y-1 text-sm">
      <div className="flex justify-between font-medium text-gray-700">
        <span>{product.title}</span>
        <span>{product.pricePerDay}€/day</span>
      </div>
      <div className="flex justify-between text-gray-500">
        <span>Dates</span>
        <span>{startDate} {pickupTime} to {endDate} {returnTime}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-brand-cream min-h-screen py-8 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link to="/marketplace" className="inline-flex items-center text-gray-500 hover:text-brand-lavender mb-6">
          <ArrowLeft size={16} className="mr-1" /> Back to Marketplace
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Images */}
            <div className="bg-gray-50 h-[500px] lg:h-auto relative">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
              {product.collection && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-serif font-bold text-brand-lavenderDark tracking-wider border border-brand-lavender/20">
                  {product.collection}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="p-8 lg:p-12 space-y-8">
              <div>
                <span className="text-brand-lavender font-bold text-sm tracking-wider uppercase mb-2 block">{product.category}</span>
                <h1 className="font-serif text-4xl font-bold text-brand-darkGrey mb-4">{product.title}</h1>
                <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
              </div>

              {/* Features & Store */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                   <h3 className="font-semibold mb-2">Details</h3>
                   <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                     {product.features.map((f, i) => <li key={i}>{f}</li>)}
                   </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin size={16} className="mt-0.5 text-brand-lavender" />
                    <div>
                      <p className="font-medium text-gray-800">{store?.name}</p>
                      <p>{store?.address}</p>
                      <p>{store?.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Booking Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold flex items-center gap-2 mb-4">
                    Select Dates
                  </h3>
                  
                  {bookingStatus === 'success' ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fade-in">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                        <CheckCircle size={24} />
                      </div>
                      <h4 className="font-bold text-green-800 text-lg">Booking Confirmed!</h4>
                      <p className="text-green-700 mb-4">
                        {lastPaymentMethod === 'card' ? 'Payment successful.' : 'Payment due at pickup.'} <br/>
                        Please pick up your item at {store?.name} on {startDate} at {pickupTime}.
                      </p>
                      <Link to="/profile" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">View My Rentals</Link>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <AvailabilityCalendar 
                          productId={product.id}
                          onRangeSelect={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Pickup Time</label>
                          <select 
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-sm focus:ring-2 focus:ring-brand-lavender outline-none"
                          >
                            <option value="10:00">10:00</option>
                            <option value="11:00">11:00</option>
                            <option value="12:00">12:00</option>
                            <option value="13:00">13:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                            <option value="16:00">16:00</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Return Time</label>
                          <select 
                            value={returnTime}
                            onChange={(e) => setReturnTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-sm focus:ring-2 focus:ring-brand-lavender outline-none"
                          >
                            <option value="10:00">10:00</option>
                            <option value="11:00">11:00</option>
                            <option value="12:00">12:00</option>
                            <option value="13:00">13:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                            <option value="16:00">16:00</option>
                          </select>
                        </div>
                      </div>

                      {/* Status Message */}
                      {startDate && endDate && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${isAvailable ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                           {isAvailable ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                           <div>
                             <p className="font-bold">{isAvailable ? 'Available for these dates!' : 'Sorry, dates overlap with another booking.'}</p>
                             {isAvailable && (
                               <p className="text-sm opacity-80">Total estimate: {totalPrice}€ ({product.pricePerDay}€/day)</p>
                             )}
                           </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-4 gap-4">
                        <div>
                           <p className="text-2xl font-serif font-bold text-brand-darkGrey">{product.pricePerDay}€ <span className="text-sm font-sans font-normal text-gray-500">/ day</span></p>
                           {product.buyPrice ? (
                             <p className="text-sm text-brand-lavender font-bold mt-1 flex items-center gap-1">
                               <ShoppingBag size={14}/> Also available to buy: {product.buyPrice}€
                             </p>
                           ) : (
                             <p className="text-xs text-gray-400">Rental only</p>
                           )}
                        </div>
                        
                        <div className="flex gap-3">
                          <button 
                            onClick={handleAddToCart}
                            disabled={!isAvailable}
                            className={`px-6 py-4 rounded-xl font-bold text-lg shadow-sm border-2 transition-all transform active:scale-95 flex items-center gap-2
                              ${isAvailable 
                                ? 'border-brand-lavender text-brand-lavender hover:bg-brand-lavender/5' 
                                : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                          >
                             <ShoppingCart size={20} /> Add to Cart
                          </button>
                          
                          <button 
                            onClick={initiateBooking}
                            disabled={!isAvailable}
                            className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center gap-2
                              ${isAvailable 
                                ? 'bg-brand-lavender hover:bg-brand-lavenderDark text-white' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                          >
                             Book Now
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Complete Reservation"
        totalAmount={totalPrice}
        description={modalDescription}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
};

export default ProductDetail;