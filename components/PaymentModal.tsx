import React, { useState } from 'react';
import { X, CreditCard, Store as StoreIcon, Lock, CheckCircle, AlertCircle, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

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
  // Step State: 'terms' or 'payment'
  const [step, setStep] = useState<'terms' | 'payment'>('terms');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

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

  const handleProceedToPayment = () => {
    if (!termsAccepted) {
      setTermsError(true);
      return;
    }
    setTermsError(false);
    setStep('payment');
  };

  const handleBackToTerms = () => {
    setStep('terms');
  };

  const handleClose = () => {
    // Reset state when closing
    setStep('terms');
    setTermsAccepted(false);
    setTermsError(false);
    setError(null);
    setFormErrors({});
    onClose();
  };

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
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button onClick={handleBackToTerms} className="text-gray-400 hover:text-gray-600">
                <ArrowLeft size={20} />
              </button>
            )}
            <h3 className="font-serif text-lg font-bold text-brand-darkGrey">
              {step === 'terms' ? 'Rental Terms & Conditions' : title}
            </h3>
          </div>
          <button onClick={handleClose} disabled={isProcessing} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-4 flex items-center gap-2">
          <div className={`flex items-center gap-2 ${step === 'terms' ? 'text-brand-lavender' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'terms' ? 'bg-brand-lavender text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <span className="text-sm font-medium">Terms</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-2"></div>
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-brand-lavender' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'payment' ? 'bg-brand-lavender text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* STEP 1: Terms & Conditions */}
          {step === 'terms' && (
            <div className="animate-fade-in">
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

              <div className="bg-gray-50 rounded-xl p-4 mb-6 max-h-64 overflow-y-auto border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={18} className="text-brand-lavender" />
                  <h4 className="font-bold text-gray-800">Hi Honey Rental Agreement</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-3">
                  <p><strong>1. Rental Period</strong><br />
                  The rental period begins at the specified pickup time and ends at the return time on the dates selected. Late returns may incur additional daily charges at the standard rental rate.</p>

                  <p><strong>2. Condition of Items</strong><br />
                  All items must be returned in the same condition as received. Minor wear consistent with normal use is acceptable. Any damage, stains, or alterations beyond normal wear will result in repair or replacement charges.</p>

                  <p><strong>3. Care Instructions</strong><br />
                  Rented items should be handled with care. Do not attempt to wash, iron, or alter any items. Keep items away from food, drinks, and makeup where possible. Store items in the provided garment bag when not in use.</p>

                  <p><strong>4. Cancellation Policy</strong><br />
                  Cancellations made 7+ days before pickup: Full refund. Cancellations 3-7 days before pickup: 50% refund. Cancellations less than 3 days before pickup: No refund. Rescheduling is subject to availability.</p>

                  <p><strong>5. Pickup & Return</strong><br />
                  Items must be picked up and returned at the designated Hi Honey studio location during business hours. A valid ID matching the booking name is required for pickup. Failure to return items will result in full replacement charges.</p>

                  <p><strong>6. Liability</strong><br />
                  Hi Honey is not liable for any allergic reactions, injuries, or damages arising from the use of rented items. By accepting these terms, you acknowledge that you have inspected the items and accept them in their current condition.</p>

                  <p><strong>7. Payment</strong><br />
                  Payment is due at the time of booking (online) or at pickup (pay at store). Unpaid bookings may be cancelled without notice. We accept credit/debit cards and cash payments at store.</p>

                  <p><strong>8. Privacy</strong><br />
                  Your personal information will be used solely for booking purposes and will not be shared with third parties without your consent, except as required by law.</p>
                </div>
              </div>

              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${termsAccepted ? 'border-brand-lavender bg-brand-lavender/5' : termsError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (e.target.checked) setTermsError(false);
                  }}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-lavender focus:ring-brand-lavender"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the <strong>Hi Honey Rental Terms & Conditions</strong>. I understand the cancellation policy, care instructions, and liability terms.
                </span>
              </label>

              {termsError && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  You must accept the terms and conditions to continue.
                </p>
              )}
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 'payment' && (
            <div className="animate-fade-in">
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
          )}
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          {step === 'terms' ? (
            <button
              onClick={handleProceedToPayment}
              className="w-full bg-brand-lavender text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-lavenderDark transition flex items-center justify-center gap-2"
            >
              Continue to Payment <ArrowRight size={18} />
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;