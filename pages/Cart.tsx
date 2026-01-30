import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createRental, processPayment, STORES, MOCK_USER } from '../services/mockData';
import PaymentModal from '../components/PaymentModal';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckoutConfirm = async (method: 'card' | 'store', cardDetails?: any) => {
    setIsCheckingOut(true);
    
    // Process single payment for total amount if card
    if (method === 'card') {
      const success = await processPayment(cartTotal, { cardNumber: cardDetails.cardNumber });
      if (!success) {
        setIsCheckingOut(false);
        throw new Error("Payment Failed");
      }
    }

    // Create individual rentals for each cart item
    const rentalPromises = cartItems.map(item => {
      const fullStartDate = new Date(`${item.startDate}T${item.pickupTime}`).toISOString();
      const fullEndDate = new Date(`${item.endDate}T${item.returnTime}`).toISOString();

      return createRental({
        userId: MOCK_USER.id,
        productId: item.product.id,
        storeId: item.product.storeId,
        startDate: fullStartDate,
        endDate: fullEndDate,
        status: 'active',
        paymentStatus: method === 'card' ? 'paid' : 'pending',
        totalPrice: item.totalPrice
      });
    });

    await Promise.all(rentalPromises);

    clearCart();
    setIsCheckingOut(false);
    setShowPaymentModal(false);
    navigate('/profile'); // Redirect to profile to see bookings
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-2xl shadow-sm text-center max-w-md border border-gray-100">
          <div className="w-20 h-20 bg-brand-lavender/10 text-brand-lavender rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={40} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-darkGrey mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any rental items yet. Browse our collection to find your perfect match.</p>
          <Link to="/marketplace" className="bg-brand-lavender text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-lavenderDark transition">
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const modalDescription = (
    <div className="space-y-2 text-sm">
      <div className="font-medium text-gray-700 mb-2">Order Summary ({cartItems.length} items)</div>
      {cartItems.map((item, idx) => (
        <div key={idx} className="flex justify-between text-gray-500 text-xs">
          <span>{item.product.title}</span>
          <span>{item.totalPrice}€</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center mb-8">
          <Link to="/marketplace" className="text-gray-500 hover:text-brand-lavender mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-serif text-3xl font-bold text-brand-darkGrey">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
              const store = STORES.find(s => s.id === item.product.storeId);
              return (
                <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 group relative">
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* Image */}
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 pr-8">
                    <div className="mb-3">
                      <span className="text-xs font-bold text-brand-lavender uppercase tracking-wide">{item.product.category}</span>
                      <h3 className="font-serif text-xl font-bold text-brand-darkGrey">{item.product.title}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-brand-lavender" />
                          <span>{item.startDate} — {item.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-brand-lavender" />
                          <span>Pickup: {item.pickupTime} | Return: {item.returnTime}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-brand-lavender mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-800">{store?.name}</p>
                          <p className="text-xs text-gray-400">{store?.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col justify-end items-end sm:items-end mt-4 sm:mt-0">
                    <span className="text-xs text-gray-400 mb-1">Subtotal</span>
                    <span className="font-serif text-xl font-bold text-brand-darkGrey">{item.totalPrice}€</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-brand-darkGrey mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>{cartTotal}€</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>0€</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-xl text-brand-darkGrey">
                  <span>Total</span>
                  <span>{cartTotal}€</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 text-sm mb-6">
                <AlertCircle size={20} className="flex-shrink-0" />
                <p>Items will be reserved upon confirmation. You can pay now or at the store.</p>
              </div>

              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-brand-lavender hover:bg-brand-lavenderDark text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      </div>

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Checkout"
        totalAmount={cartTotal}
        description={modalDescription}
        onConfirm={handleCheckoutConfirm}
      />
    </div>
  );
};

export default Cart;