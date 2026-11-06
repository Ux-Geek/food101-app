import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RestaurantCard } from './RestaurantCard';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const ExploreTab: React.FC = () => {
  const { restaurants, setIsSearchOpen } = useApp();
  const [activeCuisine, setActiveCuisine] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'fastest' | 'rating' | 'fee'>('recommended');
  const [onlyOpen, setOnlyOpen] = useState(false);

  const cuisines = ['all', 'Nigerian & Swallows', 'Flame Grills', 'Rice & Stews', 'Bakery', 'Drinks'];

  let filtered = restaurants.filter((r) => {
    if (activeCuisine !== 'all' && !r.cuisine.toLowerCase().includes(activeCuisine.toLowerCase())) {
      return false;
    }
    if (onlyOpen && !r.isOpen) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'fastest') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'fee') return a.deliveryFee - b.deliveryFee;
    return 0; // recommended
  });

  return (
    <div className="pb-32 px-5 space-y-5 pt-3">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#171717]">Explore restaurants</h1>
        <p className="text-xs text-[#858585] mt-0.5">Top-rated kitchens delivering to your address</p>
      </div>

      {/* Search Bar Trigger */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="w-full bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] px-4 py-3 flex items-center justify-between text-[#858585] hover:border-[#171717] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-[#858585]" />
          <span className="text-sm text-[#858585]">Search restaurants or cuisines</span>
        </div>
        <span className="text-[11px] font-semibold text-[#171717] bg-white border border-[#E8E8E8] px-2.5 py-1 rounded-[99px]">
          Find
        </span>
      </button>

      {/* Cuisine Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
        {cuisines.map((c) => {
          const isSelected = activeCuisine === c;
          return (
            <button
              key={c}
              onClick={() => setActiveCuisine(c)}
              className={`px-3.5 py-2 rounded-[99px] text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                isSelected
                  ? 'bg-[#171717] text-white border border-[#171717]'
                  : 'bg-[#F6F6F6] text-[#626262] border border-[#E8E8E8] hover:text-[#171717]'
              }`}
            >
              {c === 'all' ? 'All Cuisines' : c}
            </button>
          );
        })}
      </div>

      {/* Sort & Quick Filter Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-xs text-[#858585]">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span className="font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] px-2.5 py-1 text-xs font-semibold text-[#171717] focus:outline-hidden"
          >
            <option value="recommended">Recommended</option>
            <option value="fastest">Fastest delivery</option>
            <option value="rating">Highest rated (★)</option>
            <option value="fee">Lowest delivery fee</option>
          </select>
        </div>

        <button
          onClick={() => setOnlyOpen((v) => !v)}
          className={`px-3 py-1 rounded-[99px] text-xs font-semibold border transition-colors ${
            onlyOpen
              ? 'bg-[#12E600] text-[#171717] border-[#12E600]'
              : 'bg-[#F6F6F6] text-[#858585] border-[#E8E8E8]'
          }`}
        >
          Open now
        </button>
      </div>

      {/* Restaurant List */}
      <div className="space-y-4">
        {filtered.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-[#858585]">
            No restaurants match the selected filters.
            <div className="mt-2">
              <button
                onClick={() => {
                  setActiveCuisine('all');
                  setOnlyOpen(false);
                }}
                className="text-xs font-semibold text-[#FF641B] underline"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
