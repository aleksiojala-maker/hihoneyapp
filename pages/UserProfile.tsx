import React, { useState } from 'react';
import { getRentals, PRODUCTS, MOCK_USER, processPayment, updateRental } from '../services/mockData';
import { CreditCard, Clock, ArrowRight } from 'lucide-react';
import { Rental } from '../types';
import PaymentModal from '../components/PaymentModal';

const UserProfile: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>(getRentals().filter(r => r.userId === MOCK_USER.id));
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Helper to refresh data
  const refreshRentals = () => {
    setRentals(getRentals().filter(r => r.userId === MOCK_USER.id));
  };

  const handlePayClick = (rental: Rental) => {
    setSelectedRental(rental);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async (method: 'card' | 'store', cardDetails?: any) => {
    if (!selectedRental) return;

    if (method === 'card') {
      const success = await processPayment(selectedRental.totalPrice, { cardNumber: cardDetails.cardNumber });
      if (!success) throw new Error("Payment Declined");
    }

    await updateRental(selectedRental.id, { paymentStatus: 'paid' });
    
    refreshRentals();
    setShowPaymentModal(false);
    setSelectedRental(null);
  };

  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-brand-lavender text-white rounded-full flex items-center justify-center text-3xl font-serif">
            {MOCK_USER.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-darkGrey">{MOCK_USER.name}</h1>
            <p className="text-gray-500">{MOCK_USER.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-brand-cream text-brand-lavenderDark text-xs font-bold rounded-full border border-brand-lavender/20">
              Sustainable Bride
            </span>
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold text-brand-darkGrey mb-6">My Rentals</h2>

        {rentals.length > 0 ? (
          <div className="space-y-4">
            {rentals.map(rental => {
               const product = PRODUCTS.find(p => p.id === rental.productId);
               return (
                 <div key={rental.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                   <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                     <img src={product?.imageUrl} alt={product?.title} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-start mb-2">
                       <h3 className="font-serif text-xl font-bold">{product?.title}</h3>
                       <div className="flex flex-col items-end gap-1">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                           ${rental.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-brand-lavender/10 text-brand-lavenderDark'}`}>
                           {rental.status}
                         </span>
                         
                         {/* Payment Status Badge */}
                         {rental.paymentStatus === 'paid' ? (
                           <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                             <CreditCard size={12} /> Paid
                           </span>
                         ) : (
                           <span className="flex items-center gap-1 text-xs font-medium text-orange-600">
                             <Clock size={12} /> Pay at Pickup
                           </span>
                         )}
                       </div>
                     </div>
                     <p className="text-gray-500 text-sm mb-4">Booking Reference: #{rental.id.toUpperCase()}</p>
                     
                     <div className="grid grid-cols-2 gap-4 text-sm">
                       <div className="bg-gray-50 p-3 rounded">
                         <span className="block text-gray-400 text-xs uppercase">Pick Up</span>
                         <span className="font-semibold text-gray-800">{new Date(rental.startDate).toLocaleDateString()}</span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded">
                         <span className="block text-gray-400 text-xs uppercase">Return</span>
                         <span className="font-semibold text-gray-800">{new Date(rental.endDate).toLocaleDateString()}</span>
                       </div>
                     </div>

                     {/* Pay Now Action for Pending Rentals */}
                     {rental.paymentStatus === 'pending' && rental.status !== 'completed' && (
                       <div className="mt-4 border-t border-dashed border-gray-200 pt-3">
                         <button 
                           onClick={() => handlePayClick(rental)}
                           className="text-sm font-bold text-brand-lavender hover:text-brand-lavenderDark flex items-center gap-1 transition-colors"
                         >
                           Pay Online Now <ArrowRight size={14} />
                         </button>
                       </div>
                     )}
                   </div>
                   <div className="flex flex-col justify-end items-end">
                     <span className="block text-gray-400 text-xs mb-1">Total Cost</span>
                     <span className="font-serif text-xl font-bold text-brand-darkGrey">{rental.totalPrice}€</span>
                   </div>
                 </div>
               );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
            <p className="text-gray-400 mb-4">You haven't rented anything yet.</p>
            <a href="/#/marketplace" className="text-brand-lavender font-bold hover:underline">Start browsing</a>
          </div>
        )}
      </div>

      {/* Payment Modal for Pending Rentals */}
      {selectedRental && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Complete Payment"
          totalAmount={selectedRental.totalPrice}
          allowPayAtStore={false} // User already chose pay at store, this modal is for upgrading to paid
          description={
            <div className="text-sm text-gray-600">
              Payment for rental #{selectedRental.id.toUpperCase()}
            </div>
          }
          onConfirm={handlePaymentConfirm}
        />
      )}
    </div>
  );
};

export default UserProfile;