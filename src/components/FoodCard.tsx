import React, { useState } from 'react';
import { Dish } from '../types';
import { useApp } from '../context/AppContext';
import { Plus, Clock, Utensils, Star, Heart } from 'lucide-react';

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
        className="cursor-pointer bg-white border border-[#EBEBEB] rounded-[20px] p-2.5 pl-3 flex items-center justify-between gap-3 hover:border-[#171717] transition-all shadow-2xs"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-14 h-14 rounded-[16px] bg-[#F4F4F6] border border-[#EBEBEB] overflow-hidden shrink-0 flex items-center justify-center">
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
          className="w-8 h-8 rounded-full bg-[#171717] text-white flex items-center justify-center shrink-0 hover:bg-[#05DF00] hover:text-black transition-colors"
          aria-label={`Add ${dish.name}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Variant: carousel or grid strictly following reference design
  return (
    <div
      onClick={() => setCustomizingDish(dish)}
      className={`group cursor-pointer transition-all ${
        variant === 'carousel' ? 'w-[220px] shrink-0' : 'w-full'
      }`}
    >
      {/* Visual Image container with 22px corner radius */}
      <div className="relative w-full aspect-[4/3] rounded-[22px] bg-[#F4F4F6] overflow-hidden flex items-center justify-center shadow-2xs">
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

        {/* Floating Rating Badge in top right matching design: 4.7 ★ (324) */}
        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 text-[11px] font-semibold text-[#171717]">
          <span>4.7</span>
          <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
          <span className="text-[#71717A] font-normal">(324)</span>
        </div>

        {/* Subtle favorite heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavouriteDish(dish.id);
          }}
          className={`absolute top-2.5 left-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            isFav
              ? 'bg-[#FF641B] text-white'
              : 'bg-black/30 text-white hover:bg-black/50'
          }`}
          aria-label="Save dish to favourites"
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Dish Information matching screenshot */}
      <div className="mt-2 px-1">
        <h4 className="text-[14px] font-medium text-[#171717] truncate leading-snug">
          {dish.restaurantName || dish.name}
        </h4>

        {/* Info Row: Orange clock + 12mins, and @ 2300 */}
        <div className="flex items-center justify-between text-xs mt-1">
          <div className="flex items-center gap-1 text-[#F97316] font-medium">
            <Clock className="w-3.5 h-3.5 text-[#F97316]" />
            <span>12mins</span>
          </div>

          <span className="font-semibold text-[#171717] tabular-nums">
            @ {dish.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
