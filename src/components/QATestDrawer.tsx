import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_ACTIVE_ORDER } from '../data/mockData';
import { FlaskConical, X, Check, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export const QATestDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    setUser,
    activeOrder,
    setActiveOrder,
    qaPaymentDecline,
    setQaPaymentDecline,
    simulateOutOfStockDishId,
    setSimulateOutOfStockDishId,
    advanceTrackingStage,
    setIsTrackingOpen,
    setIsCheckoutOpen,
    setIsBasketOpen,
    addToBasket,
    dishes,
    showToast,
  } = useApp();

  return (
    <>
      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-3 right-3 z-30 bg-[#171717]/85 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1.5 rounded-[99px] shadow-md hover:bg-[#171717] flex items-center gap-1.5 border border-white/20"
        aria-label="Open QA Test Scenarios"
      >
        <FlaskConical className="w-3 h-3 text-[#12E600]" />
        <span>QA Scenarios</span>
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-[390px] bg-white rounded-[99px] p-6 shadow-2xl border border-[#E8E8E8] max-h-[85vh] overflow-y-auto no-scrollbar space-y-4 text-left"
            role="dialog"
            aria-modal="true"
            aria-label="QA Test Suite"
          >
            <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#12E600]" />
                <h3 className="text-sm font-bold text-[#171717]">QA Test Journeys (PRD §13)</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-[99px] bg-[#F6F6F6] flex items-center justify-center text-[#171717]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {/* Test A: Standard Order Setup */}
              <button
                onClick={() => {
                  setUser({ name: 'Yu', phone: '+234 801 234 5678', isGuest: false });
                  addToBasket(dishes[0]);
                  setIsBasketOpen(true);
                  setIsOpen(false);
                  showToast('Test A: Returning user "Yu" loaded with Jollof in basket');
                }}
                className="w-full p-2.5 px-3.5 bg-[#F6F6F6] hover:bg-[#E8E8E8] rounded-[99px] flex items-center justify-between text-left font-semibold text-[#171717]"
              >
                <span>Test A — Standard returning customer</span>
                <span className="text-[10px] text-[#858585]">Run</span>
              </button>

              {/* Test B: Guest Checkout */}
              <button
                onClick={() => {
                  setUser({ name: 'Guest', phone: '', isGuest: true });
                  setIsOpen(false);
                  showToast('Test B: Switched to Guest mode');
                }}
                className="w-full p-2.5 px-3.5 bg-[#F6F6F6] hover:bg-[#E8E8E8] rounded-[99px] flex items-center justify-between text-left font-semibold text-[#171717]"
              >
                <span>Test B — First-time guest experience</span>
                <span className="text-[10px] text-[#858585]">Run</span>
              </button>

              {/* Test C: Out of Stock Simulation */}
              <button
                onClick={() => {
                  const target = simulateOutOfStockDishId ? null : 'd1';
                  setSimulateOutOfStockDishId(target);
                  showToast(
                    target
                      ? 'Test C: Marked "Jollof & Chicken" as sold out!'
                      : 'Test C: Restocked all dishes'
                  );
                }}
                className={`w-full p-2.5 px-3.5 rounded-[99px] flex items-center justify-between text-left font-semibold border ${
                  simulateOutOfStockDishId
                    ? 'bg-[#D92D20]/10 border-[#D92D20] text-[#D92D20]'
                    : 'bg-[#F6F6F6] border-[#E8E8E8] text-[#171717]'
                }`}
              >
                <span>Test C — Out of stock simulation</span>
                <span className="text-[10px] font-bold">
                  {simulateOutOfStockDishId ? 'ACTIVE (d1 sold out)' : 'OFF'}
                </span>
              </button>

              {/* Test D: Payment Decline Simulation */}
              <button
                onClick={() => {
                  setQaPaymentDecline(!qaPaymentDecline);
                  showToast(
                    !qaPaymentDecline
                      ? 'Test D: Next payment will simulate issuing bank decline'
                      : 'Test D: Payment decline disabled'
                  );
                }}
                className={`w-full p-2.5 px-3.5 rounded-[99px] flex items-center justify-between text-left font-semibold border ${
                  qaPaymentDecline
                    ? 'bg-[#D92D20]/10 border-[#D92D20] text-[#D92D20]'
                    : 'bg-[#F6F6F6] border-[#E8E8E8] text-[#171717]'
                }`}
              >
                <span>Test D — Simulate card payment decline</span>
                <span className="text-[10px] font-bold">
                  {qaPaymentDecline ? 'ACTIVE' : 'OFF'}
                </span>
              </button>

              {/* Test H: Live Tracking Progression */}
              <button
                onClick={() => {
                  if (!activeOrder) {
                    setActiveOrder(INITIAL_ACTIVE_ORDER);
                  }
                  setIsTrackingOpen(true);
                  advanceTrackingStage();
                  setIsOpen(false);
                }}
                className="w-full p-2.5 px-3.5 bg-[#12E600]/15 border border-[#12E600] rounded-[99px] flex items-center justify-between text-left font-semibold text-[#171717]"
              >
                <span>Test H — Advance live tracking status</span>
                <span className="text-[10px] text-[#171717] font-bold">Advance 1 Step</span>
              </button>

              {/* Reset to Initial Active Order */}
              <button
                onClick={() => {
                  setActiveOrder(INITIAL_ACTIVE_ORDER);
                  showToast('Active order restored (Iya Wale Swallows, 8 min ETA)');
                  setIsOpen(false);
                }}
                className="w-full p-2.5 px-3.5 bg-[#F6F6F6] hover:bg-[#E8E8E8] rounded-[99px] flex items-center justify-between text-left font-semibold text-[#171717]"
              >
                <span>Reset demo active order</span>
                <span className="text-[10px] text-[#858585]">Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
