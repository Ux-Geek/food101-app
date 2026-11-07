import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShoppingBag } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    setIsSearchOpen,
    basketItems,
    setIsBasketOpen,
    setIsAuthModalOpen,
  } = useApp();

  const totalItems = basketItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-white px-5 pt-3 pb-2 flex items-center justify-between gap-3">
      {/* Left: Avatar & Greeting */}
      <button
        onClick={() => setIsAuthModalOpen(true)}
        className="flex items-center gap-2 text-left group shrink-0"
        aria-label="User profile"
      >
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
          alt={user.name || 'User'}
          className="w-10 h-10 rounded-full object-cover shadow-xs border border-gray-100"
        />
        <span className="text-[17px] font-semibold text-[#171717] tracking-tight">
          Hi, {user.isGuest ? 'Yu' : user.name || 'Yu'}
        </span>
      </button>

      {/* Middle: Pill Search Input */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex-1 bg-[#F4F4F6] rounded-full px-4 py-2 flex items-center gap-2 text-[#71717A] hover:bg-[#EAEAEA] transition-colors"
        aria-label="Search"
      >
        <Search className="w-4 h-4 text-[#71717A] shrink-0" />
        <span className="text-sm font-normal text-[#71717A]">Search</span>
      </button>

      {/* Right: Basket Shopping Bag */}
      <button
        onClick={() => setIsBasketOpen(true)}
        className="relative w-10 h-10 rounded-full bg-[#F4F4F6] flex items-center justify-center text-[#171717] hover:bg-[#EAEAEA] transition-colors shrink-0"
        aria-label={`Basket with ${totalItems} items`}
      >
        <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#05DF00] text-black text-[10px] font-extrabold rounded-full flex items-center justify-center tabular-nums shadow-xs">
            {totalItems}
          </span>
        )}
      </button>
    </header>
  );
};
