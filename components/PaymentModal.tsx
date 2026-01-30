import React, { useState } from 'react';
import { X, CreditCard, Store as StoreIcon, Lock, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalAmount: number;
  description?: React.ReactNode;
  allowPayAtStore?: boolean;
  onConfirm: (paymentMethod: 'card' | 'store', cardDetails?: any) => Promise<void>;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  totalAmount, 
  description, 
  allowPayAtStore = true,
  onConfirm 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'store'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Validation State
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) errors.cardNumber = "Invalid card number";
      if (expiry.length < 5) errors.expiry = "Invalid expiry (MM/YY)";
      if (cvc.length < 3) errors.cvc = "Invalid CVC";
      if (!cardName.trim()) errors.cardName = "Name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirm = async () => {
    setError(null);
    if (!validate()) return;

    setIsProcessing(true);
    try {
      await onConfirm(paymentMethod, paymentMethod === 'card' ? { cardNumber, expiry, cvc, cardName } : undefined);
    } catch (e) {
      console.error(e);
      setError("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <h3 className="font-serif text-lg font-bold text-brand-darkGrey">{title}</h3>
          <button onClick={onClose} disabled={isProcessing} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Description / Order Summary */}
          {description && (
            <div className="bg-brand-cream/50 p-4 rounded-xl mb-6 border border-brand-lavender/10">
              {description}
              <div className="border-t border-brand-lavender/10 mt-3 pt-2 flex justify-between font-bold text-lg text-brand-darkGrey">
                <span>Total</span>
                <span>{totalAmount}€</span>
              </div>
            </div>
          )}

          {/* Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">Payment Method</label>
            <div className={`grid ${allowPayAtStore ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-brand-lavender bg-brand-lavender/5 text-brand-lavender' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >
                <CreditCard size={24} />
                <span className="text-sm font-bold">Pay Now</span>
              </button>
              {allowPayAtStore && (
                <button 
                  onClick={() => setPaymentMethod('store')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'store' ? 'border-brand-lavender bg-brand-lavender/5 text-brand-lavender' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                  <StoreIcon size={24} />
                  <span className="text-sm font-bold">Pay at Store</span>
                </button>
              )}
            </div>
          </div>

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="Jane Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-brand-lavender focus:border-transparent outline-none ${formErrors.cardName ? 'border-red-300' : 'border-gray-200'}`}
                />
                {formErrors.cardName && <p className="text-xs text-red-500 mt-1">{formErrors.cardName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-brand-lavender focus:border-transparent outline-none ${formErrors.cardNumber ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {formErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{formErrors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-brand-lavender focus:border-transparent outline-none ${formErrors.expiry ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {formErrors.expiry && <p className="text-xs text-red-500 mt-1">{formErrors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    maxLength={3}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g,''))}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-brand-lavender focus:border-transparent outline-none ${formErrors.cvc ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {formErrors.cvc && <p className="text-xs text-red-500 mt-1">{formErrors.cvc}</p>}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'store' && (
            <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-lg flex items-start gap-2">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>You can pay via card or cash when you pick up your item at the studio. A valid ID matching your booking is required.</p>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button 
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full bg-brand-darkGrey text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                {paymentMethod === 'card' ? <Lock size={18} /> : <CheckCircle size={18} />}
                {paymentMethod === 'card' ? `Pay ${totalAmount}€` : 'Confirm'}
              </>
            )}
          </button>
          <div className="text-center mt-3">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <Lock size={10} /> Secure 256-bit SSL Encrypted payment
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;