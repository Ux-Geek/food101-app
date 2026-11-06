import React, { useState } from 'react';
import { Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Clock, Heart, Store } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { setSelectedRestaurant, favouriteRestaurantIds, toggleFavouriteRestaurant } = useApp();
  const [imageError, setImageError] = useState(false);
  const isFav = favouriteRestaurantIds.includes(restaurant.id);

  return (
    <div
      onClick={() => setSelectedRestaurant(restaurant)}
      className="cursor-pointer bg-white border border-[#E8E8E8] rounded-[99px] p-3 transition-all hover:border-[#171717] flex flex-col gap-2.5"
    >
      {/* Visual Image Banner with 99px radius */}
      <div className="relative w-full h-[150px] rounded-[99px] bg-[#F6F6F6] border border-[#E8E8E8] overflow-hidden flex items-center justify-center">
        {imageError ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Store className="w-8 h-8 text-[#858585] mb-1" />
            <span className="text-xs font-semibold text-[#171717]">{restaurant.name}</span>
          </div>
        ) : (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavouriteRestaurant(restaurant.id);
          }}
          className={`absolute top-2.5 right-3 w-8 h-8 rounded-[99px] flex items-center justify-center transition-colors ${
            isFav ? 'bg-[#FF641B] text-white' : 'bg-white/90 text-[#171717] hover:bg-white'
          }`}
          aria-label="Save restaurant"
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Tag indicator if exists */}
        {restaurant.tag && (
          <div className="absolute bottom-2.5 left-4 bg-[#171717] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-[99px]">
            {restaurant.tag}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="px-3 pb-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#171717] truncate">{restaurant.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs font-semibold text-[#171717] shrink-0">
            <Star className="w-3.5 h-3.5 fill-[#FF641B] text-[#FF641B]" />
            <span>{restaurant.rating}</span>
            <span className="text-[#858585] font-normal">({restaurant.reviewCount})</span>
          </div>
        </div>

        {/* Unboxed Metadata with · separator */}
        <div className="flex items-center gap-1.5 text-xs text-[#626262] mt-1 truncate">
          <span>{restaurant.cuisine}</span>
          <span aria-hidden="true">·</span>
          <span>{restaurant.address.split(',')[1] || restaurant.address}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#858585] mt-2 pt-2 border-t border-[#E8E8E8]">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#858585]" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <span className="font-medium text-[#171717] tabular-nums">
            ₦{restaurant.deliveryFee.toLocaleString()} delivery
          </span>
        </div>
      </div>
    </div>
  );
};
