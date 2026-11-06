import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCard } from './FoodCard';
import { RestaurantCard } from './RestaurantCard';
import { Search, X, History, TrendingUp, Clock, Filter } from 'lucide-react';

const RECENT_SEARCHES = ['Jollof rice', 'Amala', 'Beef suya'];
const TRENDING_TAGS = ['Amala', 'Shawarma', 'Small chops', 'Party jollof', 'Catfish pepper soup', 'Puff puff'];

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, dishes, restaurants } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'dishes' | 'restaurants'>('all');
  const [under5k, setUnder5k] = useState(false);

  if (!isSearchOpen) return null;

  const normalized = searchTerm.trim().toLowerCase();

  const matchingDishes = dishes.filter((d) => {
    if (under5k && d.price > 5000) return false;
    if (!normalized) return false;
    return (
      d.name.toLowerCase().includes(normalized) ||
      d.description.toLowerCase().includes(normalized) ||
      d.category.toLowerCase().includes(normalized)
    );
  });

  const matchingRestaurants = restaurants.filter((r) => {
    if (!normalized) return false;
    return (
      r.name.toLowerCase().includes(normalized) ||
      r.cuisine.toLowerCase().includes(normalized)
    );
  });

  const totalResults = matchingDishes.length + matchingRestaurants.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-[440px] h-full sm:h-[94vh] bg-white sm:rounded-[99px] shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Search food and restaurants"
      >
        {/* Top Search Input Bar */}
        <div className="p-4 px-5 border-b border-[#E8E8E8] bg-white flex items-center gap-3">
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-[#858585] absolute left-3.5" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search food, restaurants, or cravings..."
              className="w-full bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] pl-10 pr-9 py-2.5 text-sm text-[#171717] placeholder-[#858585] focus:outline-hidden focus:border-[#171717]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-[#858585] hover:text-[#171717]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-semibold text-[#171717] hover:text-[#FF641B]"
          >
            Cancel
          </button>
        </div>

        {/* Segmented Results Tabs */}
        {searchTerm && (
          <div className="px-5 py-2.5 bg-[#F6F6F6] border-b border-[#E8E8E8] flex items-center justify-between">
            <div className="flex items-center gap-1 bg-white border border-[#E8E8E8] rounded-[99px] p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-[99px] text-xs font-semibold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#626262] hover:text-[#171717]'
                }`}
              >
                All ({totalResults})
              </button>
              <button
                onClick={() => setActiveTab('dishes')}
                className={`px-3 py-1 rounded-[99px] text-xs font-semibold transition-colors ${
                  activeTab === 'dishes'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#626262] hover:text-[#171717]'
                }`}
              >
                Dishes ({matchingDishes.length})
              </button>
              <button
                onClick={() => setActiveTab('restaurants')}
                className={`px-3 py-1 rounded-[99px] text-xs font-semibold transition-colors ${
                  activeTab === 'restaurants'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#626262] hover:text-[#171717]'
                }`}
              >
                Kitchens ({matchingRestaurants.length})
              </button>
            </div>

            <button
              onClick={() => setUnder5k((v) => !v)}
              className={`px-2.5 py-1 rounded-[99px] text-xs font-semibold border transition-colors ${
                under5k
                  ? 'bg-[#FF641B] text-white border-[#FF641B]'
                  : 'bg-white text-[#858585] border-[#E8E8E8]'
              }`}
            >
              &lt; ₦5k
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
          {!searchTerm ? (
            <>
              {/* Recent Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#858585] uppercase tracking-wide mb-2.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Recent searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RECENT_SEARCHES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSearchTerm(item)}
                      className="px-3.5 py-1.5 bg-[#F6F6F6] border border-[#E8E8E8] text-xs font-medium text-[#171717] rounded-[99px] hover:border-[#171717]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#858585] uppercase tracking-wide mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#FF641B]" />
                  <span>Trending in Lagos</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="px-3.5 py-1.5 bg-[#F6F6F6] border border-[#E8E8E8] text-xs font-medium text-[#171717] rounded-[99px] hover:border-[#171717]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              {totalResults === 0 ? (
                <div className="py-14 text-center">
                  <p className="text-sm font-semibold text-[#171717]">
                    No results for "{searchTerm}"
                  </p>
                  <p className="text-xs text-[#858585] mt-1">
                    Try searching for "Jollof", "Amala", "Suya", or "Egusi".
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Dishes Section */}
                  {(activeTab === 'all' || activeTab === 'dishes') &&
                    matchingDishes.length > 0 && (
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-[#858585] uppercase tracking-wide">
                          Dishes ({matchingDishes.length})
                        </div>
                        <div className="space-y-2.5">
                          {matchingDishes.map((dish) => (
                            <FoodCard key={dish.id} dish={dish} variant="compact" />
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Restaurants Section */}
                  {(activeTab === 'all' || activeTab === 'restaurants') &&
                    matchingRestaurants.length > 0 && (
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-[#858585] uppercase tracking-wide">
                          Restaurants ({matchingRestaurants.length})
                        </div>
                        <div className="space-y-3">
                          {matchingRestaurants.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
