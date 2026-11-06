import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle } from 'lucide-react';

export const ConflictModal: React.FC = () => {
  const { basketRestaurantConflict, resolveBasketConflict } = useApp();

  if (!basketRestaurantConflict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[360px] bg-white rounded-[99px] p-6 shadow-2xl border border-[#E8E8E8] text-center space-y-3"
        role="dialog"
        aria-modal="true"
        aria-label="Different restaurant"
      >
        <div className="w-12 h-12 rounded-[99px] bg-[#FF641B]/15 text-[#FF641B] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-[#171717]">Create a new basket?</h3>

        <p className="text-xs text-[#626262] leading-relaxed">
          Your basket already contains items from{' '}
          <strong className="text-[#171717]">{basketRestaurantConflict.oldRestaurantName}</strong>.
          Would you like to clear your current basket and start fresh with{' '}
          <strong className="text-[#171717]">
            {basketRestaurantConflict.newDish.restaurantName}
          </strong>
          ?
        </p>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => resolveBasketConflict(true)}
            className="w-full h-11 bg-[#171717] text-white rounded-[99px] text-xs font-semibold hover:bg-[#FF641B] transition-colors"
          >
            Start new basket
          </button>
          <button
            onClick={() => resolveBasketConflict(false)}
            className="w-full h-10 bg-[#F6F6F6] text-[#171717] rounded-[99px] text-xs font-semibold hover:bg-[#E8E8E8]"
          >
            Keep existing items
          </button>
        </div>
      </div>
    </div>
  );
};
