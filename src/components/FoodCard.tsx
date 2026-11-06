import React, { useState } from 'react';
import { Dish } from '../types';
import { useApp } from '../context/AppContext';
import { Plus, Clock, Utensils } from 'lucide-react';

interface FoodCardProps {
  dish: Dish;
  variant?: 'carousel' | 'grid' | 'compact';
}

export const FoodCard: React.FC<FoodCardProps> = ({ dish, variant = 'carousel' }) => {
  const { setCustomizingDish, toggleFavouriteDish, favouriteDishIds } = useApp();
  const [imageError, setImageError] = useState(false);
  const isFav = favouriteDishIds.includes(dish.id);

  if (variant === 'compact') {
    return (
      <div
        onClick={() => setCustomizingDish(dish)}
        className="cursor-pointer bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-2 pl-3 flex items-center justify-between gap-3 hover:border-[#171717] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-[99px] bg-white border border-[#E8E8E8] overflow-hidden shrink-0 flex items-center justify-center">
            {imageError ? (
              <Utensils className="w-5 h-5 text-[#858585]" />
            ) : (
              <img
                src={dish.imageUrl}
                alt={dish.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-[#171717] truncate">{dish.name}</h4>
            <div className="text-xs text-[#858585] flex items-center gap-1.5 mt-0.5">
              <span>{dish.prepTime}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-[#171717] tabular-nums">
                ₦{dish.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setCustomizingDish(dish);
          }}
          className="w-9 h-9 rounded-[99px] bg-[#171717] text-white flex items-center justify-center shrink-0 hover:bg-[#FF641B] transition-colors"
          aria-label={`Add ${dish.name}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Variant: carousel or grid
  return (
    <div
      onClick={() => setCustomizingDish(dish)}
      className={`group cursor-pointer bg-white border border-[#E8E8E8] rounded-[99px] p-3 transition-all hover:border-[#171717] ${
        variant === 'carousel' ? 'w-[230px] shrink-0' : 'w-full'
      }`}
    >
      {/* Visual Image container with 99px corner radius */}
      <div className="relative w-full h-[140px] rounded-[99px] bg-[#F6F6F6] border border-[#E8E8E8] overflow-hidden flex items-center justify-center">
        {imageError ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Utensils className="w-7 h-7 text-[#858585] mb-1" />
            <span className="text-[11px] text-[#626262] font-medium truncate max-w-[120px]">
              {dish.name}
            </span>
          </div>
        ) : (
          <img
            src={dish.imageUrl}
            alt={dish.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Favorite heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavouriteDish(dish.id);
          }}
          className={`absolute top-2.5 right-3 w-8 h-8 rounded-[99px] flex items-center justify-center transition-colors ${
            isFav
              ? 'bg-[#FF641B] text-white'
              : 'bg-white/90 text-[#171717] hover:bg-white'
          }`}
          aria-label="Save dish to favourites"
        >
          <svg
            className="w-3.5 h-3.5 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      {/* Dish Information */}
      <div className="mt-3 px-3 pb-1">
        <h4 className="text-sm font-semibold text-[#171717] line-clamp-1">{dish.name}</h4>
        
        {/* Unboxed Metadata with · separator */}
        <div className="flex items-center gap-1.5 text-xs text-[#858585] mt-1">
          <Clock className="w-3 h-3 text-[#858585]" />
          <span>{dish.prepTime}</span>
          {dish.spiciness && (
            <>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{dish.spiciness}</span>
            </>
          )}
        </div>

        {/* Price and Add button */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#E8E8E8]">
          <span className="text-base font-bold text-[#171717] tabular-nums">
            ₦{dish.price.toLocaleString()}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCustomizingDish(dish);
            }}
            className="w-8 h-8 rounded-[99px] bg-[#171717] text-white flex items-center justify-center hover:bg-[#FF641B] transition-colors"
            aria-label={`Configure and add ${dish.name}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
