import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PAYMENT_METHODS } from '../data/mockData';
import { PaymentMethodType } from '../types';
import { X, MapPin, Clock, CreditCard, Building2, Wallet, Banknote, ShieldCheck, Check, ArrowRight } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    currentAddress,
    setIsAddressSelectorOpen,
    basketItems,
    basketRestaurant,
    basketSubtotal,
    basketDeliveryFee,
    basketServiceFee,
    basketTotal,
    placeOrder,
    qaPaymentDecline,
  } = useApp();

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankTransferSimStep, setBankTransferSimStep] = useState<'details' | 'verifying'>('details');

  if (!isCheckoutOpen || basketItems.length === 0) return null;

  const handlePlaceOrder = async () => {
    if (isSubmitting) return; // Idempotency protection
    setIsSubmitting(true);

    try {
      if (selectedPayment === 'bank_transfer') {
        // Bank transfer simulation
        setBankTransferSimStep('verifying');
        await new Promise((res) => setTimeout(res, 1800));
      } else {
        await new Promise((res) => setTimeout(res, 900));
      }

      const success = await placeOrder(selectedPayment);
      if (!success) {
        setIsSubmitting(false);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const getPaymentIcon = (type: PaymentMethodType) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-4 h-4 text-[#FF641B]" />;
      case 'bank_transfer':
        return <Building2 className="w-4 h-4 text-[#FF641B]" />;
      case 'wallet':
        return <Wallet className="w-4 h-4 text-[#FF641B]" />;
      case 'cash':
        return <Banknote className="w-4 h-4 text-[#FF641B]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-[440px] bg-white rounded-t-[99px] border-t border-[#E8E8E8] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
      >
        {/* Header */}
        <div className="pt-3 pb-2 px-6 flex items-center justify-between border-b border-[#E8E8E8]">
          <h2 className="text-lg font-bold text-[#171717]">Checkout</h2>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            disabled={isSubmitting}
            className="w-9 h-9 rounded-[99px] bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center text-[#171717] hover:bg-[#E8E8E8] disabled:opacity-50"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Single Page Checkout */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
          {/* 1. Deliver to Section */}
          <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-4 px-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#858585] uppercase tracking-wide">
                Deliver to
              </span>
              <button
                onClick={() => setIsAddressSelectorOpen(true)}
                className="text-xs font-semibold text-[#FF641B] hover:underline"
              >
                Change
              </button>
            </div>

            <div className="flex items-start gap-2.5 mt-2">
              <MapPin className="w-4 h-4 text-[#FF641B] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-[#171717]">
                  {currentAddress.label} · {currentAddress.area}
                </div>
                <div className="text-xs text-[#626262] mt-0.5 line-clamp-1">
                  {currentAddress.fullAddress}
                </div>
                {currentAddress.instructions && (
                  <div className="text-[11px] text-[#858585] mt-1 italic">
                    Note: {currentAddress.instructions}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Delivery Time Slot */}
          <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-4 px-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#858585] shrink-0" />
              <div>
                <div className="text-xs text-[#858585]">Delivery time</div>
                <div className="text-sm font-bold text-[#171717]">
                  As soon as possible · 25–35 min
                </div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#12E600] bg-[#171717] px-2.5 py-1 rounded-[99px]">
              Fastest
            </span>
          </div>

          {/* 3. Payment Method Selection */}
          <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-4 px-5">
            <div className="text-xs font-bold text-[#858585] uppercase tracking-wide mb-2.5">
              Choose payment method
            </div>

            <div className="space-y-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPayment === method.type;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.type)}
                    className={`w-full p-3 px-4 rounded-[99px] border flex items-center justify-between transition-colors text-left ${
                      isSelected
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'bg-white text-[#171717] border-[#E8E8E8] hover:border-[#171717]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-[99px] border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#FF641B] bg-[#FF641B] text-white'
                            : 'border-[#858585]'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(method.type)}
                        <span className="text-xs font-bold">{method.title}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] truncate max-w-[130px] ${
                        isSelected ? 'text-[#858585]' : 'text-[#626262]'
                      }`}
                    >
                      {method.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Virtual Account Info if Bank Transfer Selected */}
            {selectedPayment === 'bank_transfer' && (
              <div className="mt-3 p-3 bg-white border border-[#E8E8E8] rounded-[99px] text-xs space-y-1">
                <div className="text-[11px] text-[#858585]">Instant Virtual Account:</div>
                <div className="font-bold text-[#171717] flex justify-between">
                  <span>Wema Bank · 0248194021</span>
                  <span className="text-[#FF641B]">Food101 Lagos</span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Order Summary Accordion */}
          <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-4 px-5">
            <div className="text-xs font-bold text-[#858585] uppercase tracking-wide mb-2">
              Order summary · {basketRestaurant?.name}
            </div>

            <div className="space-y-1.5 text-xs text-[#626262]">
              {basketItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate pr-2">
                    {item.quantity}x {item.dish.name}
                  </span>
                  <span className="tabular-nums font-medium text-[#171717] shrink-0">
                    ₦{item.itemTotalPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#E8E8E8] space-y-1 text-xs">
              <div className="flex justify-between text-[#858585]">
                <span>Subtotal</span>
                <span className="tabular-nums">₦{basketSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#858585]">
                <span>Delivery fee</span>
                <span className="tabular-nums">₦{basketDeliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#858585]">
                <span>Service fee</span>
                <span className="tabular-nums">₦{basketServiceFee.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E8E8] flex justify-between text-base font-bold text-[#171717]">
                <span>Total to pay</span>
                <span className="tabular-nums">₦{basketTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Trust notice */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#858585]">
            <ShieldCheck className="w-4 h-4 text-[#12E600]" />
            <span>Secure payment encrypted with NIBSS standards</span>
          </div>

          {/* QA simulation notice if decline is active */}
          {qaPaymentDecline && (
            <div className="bg-[#D92D20]/10 border border-[#D92D20] text-[#D92D20] text-xs p-3 rounded-[99px] text-center font-medium">
              ⚠️ QA Simulation: "Payment Decline" toggle is ON in test tools
            </div>
          )}
        </div>

        {/* Place Order CTA Button */}
        <div className="p-4 border-t border-[#E8E8E8] bg-white">
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full h-12 rounded-[99px] bg-[#171717] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#FF641B] disabled:bg-[#858585] transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying payment & placing order...</span>
              </span>
            ) : (
              <>
                <span>Place order</span>
                <span aria-hidden="true">·</span>
                <span className="font-bold tabular-nums">₦{basketTotal.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
