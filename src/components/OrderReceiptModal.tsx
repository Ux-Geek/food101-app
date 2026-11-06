import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, Receipt, ArrowRight } from 'lucide-react';

export const OrderReceiptModal: React.FC = () => {
  const { viewingReceiptOrder, setViewingReceiptOrder, reorderPastOrder } = useApp();

  if (!viewingReceiptOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[420px] bg-white rounded-[99px] p-6 shadow-2xl border border-[#E8E8E8] max-h-[90vh] overflow-y-auto no-scrollbar space-y-4"
        role="dialog"
        aria-modal="true"
        aria-label="Order Receipt"
      >
        <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#FF641B]" />
            <div>
              <h3 className="text-base font-bold text-[#171717]">Receipt #{viewingReceiptOrder.id}</h3>
              <p className="text-xs text-[#858585]">{viewingReceiptOrder.createdAt}</p>
            </div>
          </div>
          <button
            onClick={() => setViewingReceiptOrder(null)}
            className="w-8 h-8 rounded-[99px] bg-[#F6F6F6] flex items-center justify-center text-[#171717]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Restaurant & Address */}
        <div className="bg-[#F6F6F6] rounded-[99px] p-4 text-xs space-y-1">
          <div className="font-bold text-[#171717]">{viewingReceiptOrder.restaurantName}</div>
          <div className="text-[#626262]">Delivered to {viewingReceiptOrder.deliveryAddress.fullAddress}</div>
          <div className="text-[#858585]">Paid via {viewingReceiptOrder.paymentMethod.replace('_', ' ')}</div>
        </div>

        {/* Itemized list */}
        <div className="space-y-2 text-xs">
          <div className="font-bold text-[#858585] uppercase tracking-wide">Ordered Items</div>
          {viewingReceiptOrder.items.map((item) => (
            <div key={item.id} className="flex justify-between py-1 border-b border-[#E8E8E8]">
              <div>
                <span className="font-semibold text-[#171717]">
                  {item.quantity}x {item.dish.name}
                </span>
                {item.selectedOptions.length > 0 && (
                  <div className="text-[11px] text-[#858585]">
                    {item.selectedOptions.map((o) => o.choiceName).join(' · ')}
                  </div>
                )}
              </div>
              <span className="font-bold text-[#171717] tabular-nums">
                ₦{item.itemTotalPrice.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Breakdown */}
        <div className="bg-[#F6F6F6] rounded-[99px] p-4 space-y-1.5 text-xs">
          <div className="flex justify-between text-[#626262]">
            <span>Subtotal</span>
            <span className="tabular-nums font-semibold">₦{viewingReceiptOrder.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#626262]">
            <span>Delivery fee</span>
            <span className="tabular-nums font-semibold">₦{viewingReceiptOrder.deliveryFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#626262]">
            <span>Service fee</span>
            <span className="tabular-nums font-semibold">₦{viewingReceiptOrder.serviceFee.toLocaleString()}</span>
          </div>
          <div className="pt-2 border-t border-[#E8E8E8] flex justify-between text-sm font-bold text-[#171717]">
            <span>Total Paid</span>
            <span className="tabular-nums">₦{viewingReceiptOrder.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => {
              setViewingReceiptOrder(null);
              reorderPastOrder(viewingReceiptOrder);
            }}
            className="w-full h-11 bg-[#171717] text-white text-xs font-semibold rounded-[99px] hover:bg-[#FF641B] transition-colors"
          >
            Reorder these items
          </button>
          <button
            onClick={() => setViewingReceiptOrder(null)}
            className="w-full h-10 bg-[#F6F6F6] text-[#171717] text-xs font-semibold rounded-[99px]"
          >
            Close receipt
          </button>
        </div>
      </div>
    </div>
  );
};
