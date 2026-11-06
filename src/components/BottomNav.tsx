import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, Sparkles, User, ShoppingBag, ArrowRight } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    basketItems,
    basketSubtotal,
    setIsBasketOpen,
    isBasketOpen,
    isCheckoutOpen,
    isTrackingOpen,
  } = useApp();

  const totalItems = basketItems.reduce((acc, item) => acc + item.quantity, 0);

  // If viewing full-screen modal or tracking, hide bottom nav
  if (isBasketOpen || isCheckoutOpen || isTrackingOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[440px] mx-auto px-4 pb-4 pointer-events-none">
      {/* Floating Contextual Basket Bar */}
      {totalItems > 0 && (
        <div className="pointer-events-auto mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => setIsBasketOpen(true)}
            className="w-full bg-[#171717] text-white p-3 px-4 rounded-[99px] shadow-lg flex items-center justify-between hover:bg-[#262626] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[99px] bg-[#FF641B] text-white flex items-center justify-center text-xs font-bold tabular-nums">
                {totalItems}
              </div>
              <div className="text-left">
                <div className="text-xs text-[#858585] leading-tight">Your basket</div>
                <div className="text-sm font-bold text-white tabular-nums">
                  ₦{basketSubtotal.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 px-3 py-1.5 rounded-[99px]">
              <span>View basket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Floating 4-Tab Bottom Navigation Bar */}
      <nav className="pointer-events-auto bg-white border border-[#E8E8E8] shadow-md rounded-[99px] px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            currentTab === 'home' ? 'text-[#FF641B]' : 'text-[#858585] hover:text-[#171717]'
          }`}
          aria-label="Home tab"
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('explore')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            currentTab === 'explore' ? 'text-[#FF641B]' : 'text-[#858585] hover:text-[#171717]'
          }`}
          aria-label="Explore tab"
        >
          <Compass className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Explore</span>
        </button>

        <button
          onClick={() => setCurrentTab('ai')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            currentTab === 'ai' ? 'text-[#FF641B]' : 'text-[#858585] hover:text-[#171717]'
          }`}
          aria-label="Food101 AI tab"
        >
          <Sparkles className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">AI</span>
        </button>

        <button
          onClick={() => setCurrentTab('account')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            currentTab === 'account' ? 'text-[#FF641B]' : 'text-[#858585] hover:text-[#171717]'
          }`}
          aria-label="Account tab"
        >
          <User className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Account</span>
        </button>
      </nav>
    </div>
  );
};
