import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCard } from './FoodCard';
import { RestaurantCard } from './RestaurantCard';
import { Search, ChevronRight, ArrowRight, Zap, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '✨' },
  { id: 'rice', name: 'Rice', icon: '🍚' },
  { id: 'swallow', name: 'Swallow', icon: '🥣' },
  { id: 'grill', name: 'Grills', icon: '🍗' },
  { id: 'dessert', name: 'Desserts', icon: '🍰' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
];

export const HomeTab: React.FC = () => {
  const {
    activeOrder,
    setIsTrackingOpen,
    dishes,
    restaurants,
    setIsSearchOpen,
    setCurrentTab,
    setSelectedRestaurant,
    orderHistory,
    reorderPastOrder,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPromo, setShowPromo] = useState(true);

  const filteredDishes =
    selectedCategory === 'all'
      ? dishes
      : dishes.filter((d) => d.category === selectedCategory);

  const popularDishes = dishes.filter((d) => d.isPopular);

  return (
    <div className="pb-32 px-5 space-y-6 pt-3">
      {/* 1. Search Field Trigger */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="w-full bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] px-4 py-3 flex items-center justify-between text-[#858585] hover:border-[#171717] transition-colors"
        aria-label="Search dishes and restaurants"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-[#858585]" />
          <span className="text-sm font-medium text-[#858585]">What are you craving?</span>
        </div>
        <div className="text-[11px] font-semibold text-[#171717] bg-white border border-[#E8E8E8] px-2.5 py-1 rounded-[99px]">
          Search
        </div>
      </button>

      {/* 2. Active Order Tracker Card (Conditional per PRD Section 04: "only if an active order exists") */}
      {activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
        <div
          onClick={() => setIsTrackingOpen(true)}
          className="cursor-pointer bg-[#12E600] text-[#171717] rounded-[99px] p-4 px-5 border border-[#12E600] shadow-sm hover:brightness-95 transition-all flex items-center justify-between gap-3 animate-in fade-in duration-200"
          role="region"
          aria-label="Active order tracker"
        >
          <div className="min-w-0">
            <div className="text-xs font-semibold tracking-wide uppercase text-[#171717]/80">
              {activeOrder.status === 'on_the_way'
                ? 'Your order is on its way'
                : activeOrder.status === 'preparing'
                ? 'Kitchen is preparing food'
                : 'Order in progress'}
            </div>
            <div className="text-sm font-bold text-[#171717] truncate mt-0.5">
              {activeOrder.restaurantName}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xl font-extrabold text-[#171717] tabular-nums leading-none">
                {activeOrder.etaMinutes} min
              </div>
              <div className="text-[10px] font-semibold text-[#171717]/70 mt-0.5">ETA</div>
            </div>
            <div className="w-9 h-9 rounded-[99px] bg-[#171717] text-white flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Contextual Promotion (Compact, contextual, dismissible per PRD) */}
      {showPromo && (
        <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Zap className="w-4 h-4 text-[#FF641B] shrink-0" />
            <span className="text-xs font-medium text-[#171717] truncate">
              Order above ₦10,000 and get free delivery in Lekki & VI
            </span>
          </div>
          <button
            onClick={() => setShowPromo(false)}
            className="w-6 h-6 rounded-[99px] flex items-center justify-center text-[#858585] hover:text-[#171717] shrink-0"
            aria-label="Dismiss promotion"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. Food Discovery Carousel ("What are you craving?") */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#171717]">What are you craving?</h2>
          <button
            onClick={() => setCurrentTab('explore')}
            className="text-xs font-semibold text-[#FF641B] flex items-center gap-0.5 hover:underline"
          >
            See all
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-5 px-5 py-1">
          {popularDishes.map((dish) => (
            <FoodCard key={dish.id} dish={dish} variant="carousel" />
          ))}
        </div>
      </section>

      {/* 5. Popular Categories Filter */}
      <section>
        <h2 className="text-lg font-bold text-[#171717] mb-3">Cuisine categories</h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[99px] text-xs font-semibold transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-[#171717] text-white border border-[#171717]'
                    : 'bg-[#F6F6F6] text-[#626262] border border-[#E8E8E8] hover:text-[#171717]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. Filtered Dishes Grid if category is chosen */}
      {selectedCategory !== 'all' && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#171717]">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.name} selection
            </h2>
            <span className="text-xs text-[#858585] tabular-nums">
              {filteredDishes.length} items
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {filteredDishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* 7. Popular Near You (Restaurants) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-[#171717]">Popular near you</h2>
            <p className="text-xs text-[#858585]">Delivering to Lekki Phase 1</p>
          </div>
          <button
            onClick={() => setCurrentTab('explore')}
            className="text-xs font-semibold text-[#FF641B] flex items-center gap-0.5 hover:underline"
          >
            See all
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 8. Reorder Past Meals (if past orders exist) */}
      {orderHistory.length > 0 && (
        <section className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-4 px-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[#858585]">Order again</div>
              <div className="text-sm font-bold text-[#171717]">
                {orderHistory[0].restaurantName}
              </div>
              <div className="text-xs text-[#626262] mt-0.5">
                {orderHistory[0].items[0]?.dish.name}
              </div>
            </div>
            <button
              onClick={() => reorderPastOrder(orderHistory[0])}
              className="px-4 py-2 bg-[#171717] text-white text-xs font-semibold rounded-[99px] hover:bg-[#FF641B] transition-colors"
            >
              Reorder · ₦{orderHistory[0].total.toLocaleString()}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
