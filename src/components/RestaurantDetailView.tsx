import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCard } from './FoodCard';
import { ArrowLeft, Star, Clock, Heart, MapPin, Share2 } from 'lucide-react';

export const RestaurantDetailView: React.FC = () => {
  const {
    selectedRestaurant,
    setSelectedRestaurant,
    favouriteRestaurantIds,
    toggleFavouriteRestaurant,
    showToast,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!selectedRestaurant) return null;

  const isFav = favouriteRestaurantIds.includes(selectedRestaurant.id);
  const categories = ['all', ...Array.from(new Set(selectedRestaurant.featuredDishes.map((d) => d.category)))];

  const displayedDishes =
    activeCategory === 'all'
      ? selectedRestaurant.featuredDishes
      : selectedRestaurant.featuredDishes.filter((d) => d.category === activeCategory);

  return (
    <div className="pb-32 min-h-screen bg-white">
      {/* Top Banner Navigation */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-[#E8E8E8] px-5 py-3 flex items-center justify-between">
        <button
          onClick={() => setSelectedRestaurant(null)}
          className="w-10 h-10 rounded-[99px] bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center text-[#171717] hover:bg-[#E8E8E8] transition-colors"
          aria-label="Back to browse"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-sm font-bold text-[#171717] truncate max-w-[200px]">
          {selectedRestaurant.name}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              showToast('Link copied to clipboard');
            }}
            className="w-10 h-10 rounded-[99px] bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center text-[#171717] hover:bg-[#E8E8E8]"
            aria-label="Share restaurant"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavouriteRestaurant(selectedRestaurant.id)}
            className={`w-10 h-10 rounded-[99px] flex items-center justify-center transition-colors ${
              isFav ? 'bg-[#FF641B] text-white' : 'bg-[#F6F6F6] border border-[#E8E8E8] text-[#171717]'
            }`}
            aria-label="Save favourite"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Restaurant Header Information */}
      <div className="px-5 pt-3">
        {/* Visual Hero Image with 99px radius */}
        <div className="w-full h-44 rounded-[99px] bg-[#F6F6F6] border border-[#E8E8E8] overflow-hidden">
          <img
            src={selectedRestaurant.imageUrl}
            alt={selectedRestaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#171717]">{selectedRestaurant.name}</h1>
            <div className="flex items-center gap-1 text-xs font-bold text-[#171717]">
              <Star className="w-4 h-4 fill-[#FF641B] text-[#FF641B]" />
              <span>{selectedRestaurant.rating}</span>
              <span className="text-[#858585] font-normal">({selectedRestaurant.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#626262] mt-1">
            <span>{selectedRestaurant.cuisine}</span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 text-[#858585]">
              <MapPin className="w-3 h-3 text-[#FF641B]" />
              <span>{selectedRestaurant.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#858585] mt-2.5 pt-2 border-t border-[#E8E8E8]">
            <div className="flex items-center gap-1 text-[#171717] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#858585]" />
              <span>{selectedRestaurant.deliveryTime}</span>
            </div>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#171717] tabular-nums">
              ₦{selectedRestaurant.deliveryFee.toLocaleString()} delivery
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[#12E600] font-bold">Open now</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-[99px] text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                  isSelected
                    ? 'bg-[#171717] text-white border border-[#171717]'
                    : 'bg-[#F6F6F6] text-[#626262] border border-[#E8E8E8] hover:text-[#171717]'
                }`}
              >
                {cat === 'all' ? 'Full Menu' : cat}
              </button>
            );
          })}
        </div>

        {/* Menu Dishes List */}
        <div className="mt-5 space-y-3">
          <div className="text-xs font-bold text-[#858585] uppercase tracking-wide">
            {activeCategory === 'all' ? 'All Dishes' : `${activeCategory} Specials`} (
            {displayedDishes.length})
          </div>

          <div className="space-y-3">
            {displayedDishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
