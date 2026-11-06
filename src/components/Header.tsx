import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, ChevronDown, ShoppingBag, User } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    currentAddress,
    setIsAddressSelectorOpen,
    basketItems,
    setIsBasketOpen,
    setIsAuthModalOpen,
  } = useApp();

  const totalItems = basketItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E8E8E8] px-5 py-3.5 flex items-center justify-between">
      {/* Left Zone: User greeting and address trigger */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#858585] font-medium">
            {user.isGuest ? 'Welcome Guest' : `Hi, ${user.name}`}
          </span>
          {user.isGuest && (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-[11px] text-[#FF641B] font-medium underline underline-offset-2 ml-1"
            >
              Sign in
            </button>
          )}
        </div>
        <button
          onClick={() => setIsAddressSelectorOpen(true)}
          className="flex items-center gap-1 text-left group mt-0.5"
          aria-label="Change delivery location"
        >
          <MapPin className="w-3.5 h-3.5 text-[#FF641B] shrink-0" />
          <span className="text-sm font-semibold text-[#171717] truncate max-w-[190px]">
            {currentAddress.label} · {currentAddress.area.split(',')[0]}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#858585] transition-transform group-hover:translate-y-0.5 shrink-0" />
        </button>
      </div>

      {/* Right Zone: Profile / Basket shortcut */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-10 h-10 rounded-[99px] bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center text-[#171717] hover:bg-[#E8E8E8] transition-colors"
          aria-label="User account profile"
        >
          <User className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsBasketOpen(true)}
          className="relative w-10 h-10 rounded-[99px] bg-[#171717] text-white flex items-center justify-center hover:bg-[#333333] transition-colors"
          aria-label={`Basket with ${totalItems} items`}
        >
          <ShoppingBag className="w-4 h-4" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF641B] text-white text-[11px] font-bold rounded-[99px] flex items-center justify-center tabular-nums">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
