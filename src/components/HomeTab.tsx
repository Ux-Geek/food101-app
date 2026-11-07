import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCard } from './FoodCard';
import { RestaurantCard } from './RestaurantCard';
import { ChevronRight, User as UserIcon } from 'lucide-react';

export const HomeTab: React.FC = () => {
  const {
    setIsTrackingOpen,
    dishes,
    restaurants,
    setCurrentTab,
    setCustomizingDish,
    orderHistory,
    reorderPastOrder,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');

  const popularDishes = dishes.filter((d) => d.isPopular);

  // Popular orders circular items from screenshot ("Big Rice & Chicken" @ 3500)
  const popularOrdersList = [
    { id: 'po-1', name: 'Big Rice &\nChicken', price: 3500, img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=300&q=80', dish: dishes[0] },
    { id: 'po-2', name: 'Big Rice &\nChicken', price: 3500, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80', dish: dishes[1] || dishes[0] },
    { id: 'po-3', name: 'Big Rice &\nChicken', price: 3500, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80', dish: dishes[3] || dishes[0] },
    { id: 'po-4', name: 'Big Rice &\nChicken', price: 3500, img: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=300&q=80', dish: dishes[4] || dishes[0] },
    { id: 'po-5', name: 'Big Rice &\nChicken', price: 3500, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80', dish: dishes[5] || dishes[0] },
  ];

  return (
    <div className="pb-32 px-5 space-y-6 pt-1">
      {/* 1. Active Order / Live Courier Tracking Map Card - Strict Screenshot Match */}
      <div
        onClick={() => setIsTrackingOpen(true)}
        className="cursor-pointer rounded-[28px] overflow-hidden border border-[#EAEAEA] bg-white shadow-xs hover:shadow-md transition-all group"
        role="region"
        aria-label="Active order tracking preview"
      >
        {/* Realistic SVG Vector Map with Exact Labels from Screenshot */}
        <div className="relative h-[168px] w-full bg-[#E7EEF5] overflow-hidden select-none">
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 168" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background grid / land zones */}
            <rect width="400" height="168" fill="#E8EEF5" />
            
            {/* Soft blocks & boundaries */}
            <path d="M-10 40 L160 40 L190 70 L-10 70 Z" fill="#DEE5EE" opacity="0.6" />
            <path d="M210 10 L390 10 L410 80 L230 80 Z" fill="#E2E9F1" opacity="0.7" />
            <path d="M-10 100 L120 100 L140 160 L-10 160 Z" fill="#DFE6EF" opacity="0.5" />

            {/* Road Network */}
            {/* Horizontal streets */}
            <path d="M-10 45 L410 38" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
            <path d="M-10 45 L410 38" stroke="#D3DDE8" strokeWidth="1" strokeLinecap="round" />

            <path d="M-10 95 L220 90 L410 105" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
            <path d="M-10 95 L220 90 L410 105" stroke="#D3DDE8" strokeWidth="1" strokeLinecap="round" />

            {/* Vertical / diagonal streets */}
            <path d="M120 -10 L110 180" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <path d="M220 -10 L195 180" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
            <path d="M300 20 L320 180" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />

            {/* Street Names & Labels matching screenshot */}
            <text x="52" y="90" fill="#6B7280" fontSize="10" fontFamily="sans-serif" fontWeight="500">Sriblysta St</text>
            <text x="44" y="130" fill="#6B7280" fontSize="10" fontFamily="sans-serif" fontWeight="500">Yanisa Rainisa St</text>
            <text x="128" y="152" fill="#6B7280" fontSize="10" fontFamily="sans-serif" fontWeight="500">Umanska St</text>
            <text x="238" y="42" fill="#6B7280" fontSize="9" fontFamily="sans-serif" fontWeight="500" transform="rotate(78 238 42)">alna St</text>
            <text x="312" y="26" fill="#4B5563" fontSize="9" fontFamily="sans-serif" fontWeight="600">територія...</text>
            <text x="312" y="36" fill="#4B5563" fontSize="8" fontFamily="sans-serif">підрозділ ЦНАП</text>
            <text x="318" y="47" fill="#6B7280" fontSize="8" fontFamily="sans-serif">Local government</text>

            {/* Store pin on Sriblysta St */}
            <circle cx="120" cy="98" r="9" fill="#EF4444" opacity="0.15" />
            <circle cx="120" cy="98" r="6" fill="#EF4444" />
            <circle cx="120" cy="98" r="2.5" fill="#FFFFFF" />

            {/* Dashed Route line to destination */}
            <path
              d="M270 96 L295 96 L335 125 L345 140 L356 128"
              stroke="#262626"
              strokeWidth="3.5"
              strokeDasharray="4 4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Destination Blue Dot */}
            <circle cx="356" cy="128" r="5" fill="#2563EB" />
            <circle cx="356" cy="128" r="9" stroke="#2563EB" strokeWidth="2" fill="none" opacity="0.4" />
          </svg>

          {/* Courier Pin with Avatar + Blue Badge */}
          <div className="absolute left-[240px] top-[40px] -translate-x-1/2 flex flex-col items-center pointer-events-none">
            {/* Courier Avatar with Blue Border */}
            <div className="w-8 h-8 rounded-full border-2 border-[#1864FF] overflow-hidden shadow-md bg-white">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                alt="Courier"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Pill Tag: 👤 1km 304m */}
            <div className="mt-1 bg-[#1864FF] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <UserIcon className="w-2.5 h-2.5 fill-white stroke-none" />
              <span>1km 304m</span>
            </div>
          </div>
        </div>

        {/* Bottom Green Status Bar strictly matching screenshot */}
        <div className="bg-[#00DF00] px-5 py-3.5 flex items-center justify-between text-black rounded-b-[28px]">
          <span className="text-xl font-extrabold tracking-tight text-black">-4min</span>
          <span className="text-xs font-semibold text-black/85">Currently at Challenge..</span>
        </div>
      </div>

      {/* 2. Banner Section strictly matching screenshot */}
      <section className="-mx-5 px-5 flex gap-3.5 overflow-x-auto no-scrollbar">
        <div className="w-[84%] shrink-0 h-[132px] rounded-[24px] bg-[#F5F5F7] flex items-center justify-center border border-black/[0.03]">
          <span className="text-[32px] font-normal text-[#171717] tracking-tight">Banner</span>
        </div>
        <div className="w-[84%] shrink-0 h-[132px] rounded-[24px] bg-[#F5F5F7] flex items-center justify-center border border-black/[0.03]">
          <span className="text-[32px] font-normal text-[#171717]/40 tracking-tight">Banner</span>
        </div>
      </section>

      {/* 3. Section: "Desserts, Entrees, Beverages etc" with "See All" */}
      <section>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h2 className="text-[15px] font-medium text-[#1F2937]">Desserts, Entrees, Beverages etc</h2>
          <button
            onClick={() => setCurrentTab('explore')}
            className="text-[13px] text-[#8E8E93] hover:text-[#171717] transition-colors"
          >
            See All
          </button>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 py-1">
          {popularDishes.map((dish) => (
            <FoodCard key={dish.id} dish={dish} variant="carousel" />
          ))}
        </div>
      </section>

      {/* 4. Section: "Popular Orders" with "See All" & Circular Items */}
      <section>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h2 className="text-[15px] font-medium text-[#1F2937]">Popular Orders</h2>
          <button
            onClick={() => setCurrentTab('explore')}
            className="text-[13px] text-[#8E8E93] hover:text-[#171717] transition-colors"
          >
            See All
          </button>
        </div>

        {/* Circular Dishes Horizontal Row */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 py-2">
          {popularOrdersList.map((item) => (
            <div
              key={item.id}
              onClick={() => setCustomizingDish(item.dish)}
              className="relative w-[76px] shrink-0 flex flex-col items-center cursor-pointer group"
            >
              {/* Circular Food Image */}
              <div className="relative w-[74px] h-[74px] rounded-full overflow-hidden bg-[#B92A11] shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlapping White Pill Badge: 3500 */}
              <div className="absolute top-0 right-0 bg-white rounded-full px-1.5 py-0.5 text-[10px] font-bold text-[#171717] shadow-sm border border-black/5">
                {item.price}
              </div>

              {/* Two-Line Title Centered */}
              <div className="text-[11px] font-medium text-[#262626] text-center leading-[1.2] mt-2 whitespace-pre-line">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Popular Near You (Restaurants) with 22px Rounded Cards */}
      <section className="pt-2">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div>
            <h2 className="text-[15px] font-medium text-[#1F2937]">Popular near you</h2>
            <p className="text-xs text-[#8E8E93]">Delivering to Lekki Phase 1</p>
          </div>
          <button
            onClick={() => setCurrentTab('explore')}
            className="text-[13px] text-[#8E8E93] hover:text-[#171717] flex items-center gap-0.5"
          >
            See All
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 6. Reorder Past Meals (if past orders exist) with clean 22px radius */}
      {orderHistory.length > 0 && (
        <section className="bg-[#F8F9FA] border border-[#EBEBEB] rounded-[22px] p-4 px-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[#8E8E93]">Order again</div>
              <div className="text-sm font-bold text-[#171717]">
                {orderHistory[0].restaurantName}
              </div>
              <div className="text-xs text-[#626262] mt-0.5">
                {orderHistory[0].items[0]?.dish.name}
              </div>
            </div>
            <button
              onClick={() => reorderPastOrder(orderHistory[0])}
              className="px-4 py-2 bg-[#171717] text-white text-xs font-semibold rounded-full hover:bg-[#05DF00] hover:text-black transition-colors"
            >
              Reorder · ₦{orderHistory[0].total.toLocaleString()}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
