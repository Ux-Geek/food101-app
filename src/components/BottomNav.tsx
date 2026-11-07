import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Store, User, ArrowRight } from 'lucide-react';

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
    <div className="fixed bottom-3 left-0 right-0 z-40 max-w-[440px] mx-auto px-5 pointer-events-none">
      {/* Floating Contextual Basket Bar */}
      {totalItems > 0 && (
        <div className="pointer-events-auto mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => setIsBasketOpen(true)}
            className="w-full bg-[#171717] text-white p-3 px-4 rounded-full shadow-lg flex items-center justify-between hover:bg-[#262626] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#05DF00] text-black flex items-center justify-center text-xs font-bold tabular-nums">
                {totalItems}
              </div>
              <div className="text-left">
                <div className="text-xs text-[#A1A1AA] leading-tight">Your basket</div>
                <div className="text-sm font-bold text-white tabular-nums">
                  ₦{basketSubtotal.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 px-3 py-1.5 rounded-full">
              <span>View basket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Floating 4-Tab Bottom Navigation Bar - Strict Image Match */}
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#EBEBEB] shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-full px-4 py-2 flex items-center justify-between">
        {/* Tab 1: Home */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`transition-all duration-200 flex items-center justify-center ${
            currentTab === 'home'
              ? 'bg-[#EFEFEF] rounded-full px-5 py-2.5 text-[#171717]'
              : 'p-2 text-[#71717A] hover:text-[#171717]'
          }`}
          aria-label="Home"
        >
          <Home className={`w-6 h-6 ${currentTab === 'home' ? 'fill-[#171717] stroke-none' : 'stroke-[1.8]'}`} />
        </button>

        {/* Tab 2: Store / Explore */}
        <button
          onClick={() => setCurrentTab('explore')}
          className={`transition-all duration-200 flex items-center justify-center ${
            currentTab === 'explore'
              ? 'bg-[#EFEFEF] rounded-full px-5 py-2.5 text-[#171717]'
              : 'p-2 text-[#71717A] hover:text-[#171717]'
          }`}
          aria-label="Explore Restaurants"
        >
          <Store className="w-6 h-6 stroke-[1.8]" />
        </button>

        {/* Tab 3: Ai✦ */}
        <button
          onClick={() => setCurrentTab('ai')}
          className={`transition-all duration-200 flex items-center justify-center ${
            currentTab === 'ai'
              ? 'bg-[#EFEFEF] rounded-full px-5 py-2.5 text-[#171717]'
              : 'p-2 text-[#71717A] hover:text-[#171717]'
          }`}
          aria-label="Food101 AI"
        >
          <div className="flex items-center font-bold text-[19px] leading-none tracking-tight">
            <span>Ai</span>
            <span className="text-[14px] font-bold -mt-2 ml-0.5">⁺</span>
          </div>
        </button>

        {/* Tab 4: Account */}
        <button
          onClick={() => setCurrentTab('account')}
          className={`transition-all duration-200 flex items-center justify-center ${
            currentTab === 'account'
              ? 'bg-[#EFEFEF] rounded-full px-5 py-2.5 text-[#171717]'
              : 'p-2 text-[#71717A] hover:text-[#171717]'
          }`}
          aria-label="User Account"
        >
          <User className="w-6 h-6 stroke-[1.8]" />
        </button>
      </nav>
    </div>
  );
};
