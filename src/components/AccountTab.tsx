import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  Heart,
  HelpCircle,
  Bell,
  RefreshCw,
  LogOut,
  ChevronRight,
  RotateCcw,
  Receipt,
  CheckCircle2,
} from 'lucide-react';

export const AccountTab: React.FC = () => {
  const {
    user,
    setUser,
    orderHistory,
    activeOrder,
    setIsTrackingOpen,
    savedAddresses,
    setIsAddressSelectorOpen,
    reorderPastOrder,
    setViewingReceiptOrder,
    favouriteDishIds,
    favouriteRestaurantIds,
    dishes,
    restaurants,
    setCustomizingDish,
    setSelectedRestaurant,
    showToast,
  } = useApp();

  const [activeSubView, setActiveSubView] = useState<
    'hub' | 'orders' | 'addresses' | 'payments' | 'favourites' | 'support' | 'refunds'
  >('hub');

  const [orderTab, setOrderTab] = useState<'active' | 'past'>('active');

  const favDishes = dishes.filter((d) => favouriteDishIds.includes(d.id));
  const favRestaurants = restaurants.filter((r) => favouriteRestaurantIds.includes(r.id));

  // Render Subviews
  if (activeSubView === 'orders') {
    return (
      <div className="pb-32 px-5 space-y-4 pt-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubView('hub')}
            className="w-9 h-9 rounded-[99px] bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center text-[#171717]"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-[#171717]">My Orders</h1>
        </div>

        {/* Segmented Orders Tabs */}
        <div className="flex bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-1">
          <button
            onClick={() => setOrderTab('active')}
            className={`flex-1 py-1.5 rounded-[99px] text-xs font-semibold transition-colors ${
              orderTab === 'active'
                ? 'bg-[#171717] text-white'
                : 'text-[#626262] hover:text-[#171717]'
            }`}
          >
            Active ({activeOrder ? 1 : 0})
          </button>
          <button
            onClick={() => setOrderTab('past')}
            className={`flex-1 py-1.5 rounded-[99px] text-xs font-semibold transition-colors ${
              orderTab === 'past'
                ? 'bg-[#171717] text-white'
                : 'text-[#626262] hover:text-[#171717]'
            }`}
          >
            Past orders ({orderHistory.length})
          </button>
        </div>

        {orderTab === 'active' ? (
          activeOrder ? (
            <div className="bg-[#12E600] text-[#171717] rounded-[99px] p-5 border border-[#12E600] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#171717]/80">
                    Live delivery in progress
                  </div>
                  <h3 className="text-base font-extrabold text-[#171717] mt-0.5">
                    {activeOrder.restaurantName}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#171717] tabular-nums">
                    {activeOrder.etaMinutes} min
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#171717] font-medium border-t border-[#171717]/10 pt-2 flex justify-between items-center">
                <span>
                  {activeOrder.items.length} items · ₦{activeOrder.total.toLocaleString()}
                </span>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="px-3.5 py-1.5 bg-[#171717] text-white text-xs font-bold rounded-[99px]"
                >
                  Track order
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#858585]">
              No active orders at the moment.
            </div>
          )
        ) : (
          <div className="space-y-3">
            {orderHistory.map((order) => (
              <div
                key={order.id}
                className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-4 px-5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#171717]">{order.restaurantName}</h4>
                    <span className="text-[11px] text-[#858585]">
                      #{order.id} · {order.createdAt}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#171717] tabular-nums">
                    ₦{order.total.toLocaleString()}
                  </span>
                </div>

                <div className="text-xs text-[#626262] line-clamp-1">
                  {order.items.map((i) => `${i.quantity}x ${i.dish.name}`).join(', ')}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8E8E8]">
                  <button
                    onClick={() => setViewingReceiptOrder(order)}
                    className="text-xs font-semibold text-[#858585] hover:text-[#171717]"
                  >
                    View receipt
                  </button>

                  <button
                    onClick={() => reorderPastOrder(order)}
                    className="px-3.5 py-1.5 bg-[#171717] text-white text-xs font-bold rounded-[99px] hover:bg-[#FF641B] transition-colors"
                  >
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeSubView === 'favourites') {
    return (
      <div className="pb-32 px-5 space-y-4 pt-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubView('hub')}
            className="w-9 h-9 rounded-[99px] bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center text-[#171717]"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-[#171717]">Saved Favourites</h1>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-[#858585] uppercase tracking-wide mb-2.5">
              Favourite Dishes ({favDishes.length})
            </h3>
            {favDishes.length === 0 ? (
              <p className="text-xs text-[#858585]">No saved dishes yet.</p>
            ) : (
              <div className="space-y-2">
                {favDishes.map((dish) => (
                  <div
                    key={dish.id}
                    onClick={() => setCustomizingDish(dish)}
                    className="cursor-pointer bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-3 px-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#171717]">{dish.name}</div>
                      <div className="text-xs text-[#858585]">{dish.restaurantName}</div>
                    </div>
                    <span className="text-xs font-bold text-[#171717] tabular-nums">
                      ₦{dish.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#858585] uppercase tracking-wide mb-2.5">
              Saved Restaurants ({favRestaurants.length})
            </h3>
            {favRestaurants.length === 0 ? (
              <p className="text-xs text-[#858585]">No saved restaurants yet.</p>
            ) : (
              <div className="space-y-2">
                {favRestaurants.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRestaurant(r)}
                    className="cursor-pointer bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-3 px-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#171717]">{r.name}</div>
                      <div className="text-xs text-[#858585]">{r.cuisine}</div>
                    </div>
                    <span className="text-xs font-semibold text-[#171717]">★ {r.rating}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeSubView === 'refunds') {
    return (
      <div className="pb-32 px-5 space-y-4 pt-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubView('hub')}
            className="w-9 h-9 rounded-[99px] bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center text-[#171717]"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-[#171717]">Refund Tracker</h1>
        </div>

        <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#12E600] bg-[#171717] px-2 py-0.5 rounded-[99px]">
                Approved
              </span>
              <h3 className="text-base font-bold text-[#171717] mt-1.5">
                Refund for Order #F10118
              </h3>
              <p className="text-xs text-[#858585]">Iya Wale Swallows · Cancelled before prep</p>
            </div>
            <div className="text-base font-black text-[#171717] tabular-nums">₦4,900</div>
          </div>

          <div className="pt-3 border-t border-[#E8E8E8] space-y-2 text-xs">
            <div className="flex justify-between text-[#626262]">
              <span>Payment destination</span>
              <span className="font-semibold text-[#171717]">Original card (•••• 4821)</span>
            </div>
            <div className="flex justify-between text-[#626262]">
              <span>Estimated settlement</span>
              <span className="font-semibold text-[#171717]">1–3 business days</span>
            </div>
            <div className="flex justify-between text-[#626262]">
              <span>Reference code</span>
              <span className="font-mono text-[#858585]">REF-82914-NG</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Hub View (Screen 19)
  return (
    <div className="pb-32 px-5 space-y-5 pt-3">
      {/* Profile Card with 99px radius */}
      <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-[99px] bg-[#171717] text-white flex items-center justify-center font-bold text-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-bold text-[#171717]">{user.name}</h2>
            <p className="text-xs text-[#858585]">{user.phone}</p>
            <span className="text-[10px] font-semibold text-[#FF641B] mt-0.5 inline-block">
              Food101 Member · Lagos
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            if (user.isGuest) {
              setUser({ name: 'Yu', phone: '+234 801 234 5678', isGuest: false });
              showToast('Switched to Yu (Returning customer)');
            } else {
              setUser({ name: 'Guest', phone: 'Not signed in', isGuest: true });
              showToast('Switched to Guest mode');
            }
          }}
          className="text-xs font-semibold text-[#171717] bg-white border border-[#E8E8E8] px-3 py-1.5 rounded-[99px] hover:border-[#171717]"
        >
          {user.isGuest ? 'Sign in' : 'Switch Mode'}
        </button>
      </div>

      {/* Account Navigation List */}
      <div className="space-y-2">
        <button
          onClick={() => setActiveSubView('orders')}
          className="w-full bg-white border border-[#E8E8E8] hover:border-[#171717] rounded-[99px] p-3.5 px-5 flex items-center justify-between transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-4 h-4 text-[#FF641B]" />
            <span className="text-sm font-semibold text-[#171717]">My orders</span>
          </div>
          <div className="flex items-center gap-2">
            {activeOrder && (
              <span className="text-[10px] font-bold text-[#171717] bg-[#12E600] px-2 py-0.5 rounded-[99px]">
                1 Active
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-[#858585]" />
          </div>
        </button>

        <button
          onClick={() => setIsAddressSelectorOpen(true)}
          className="w-full bg-white border border-[#E8E8E8] hover:border-[#171717] rounded-[99px] p-3.5 px-5 flex items-center justify-between transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#FF641B]" />
            <span className="text-sm font-semibold text-[#171717]">Saved addresses</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#858585]">
            <span>{savedAddresses.length} saved</span>
            <ChevronRight className="w-4 h-4 text-[#858585]" />
          </div>
        </button>

        <button
          onClick={() => setActiveSubView('favourites')}
          className="w-full bg-white border border-[#E8E8E8] hover:border-[#171717] rounded-[99px] p-3.5 px-5 flex items-center justify-between transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-4 h-4 text-[#FF641B]" />
            <span className="text-sm font-semibold text-[#171717]">Favourites</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#858585]">
            <span>{favDishes.length + favRestaurants.length} items</span>
            <ChevronRight className="w-4 h-4 text-[#858585]" />
          </div>
        </button>

        <button
          onClick={() => setActiveSubView('refunds')}
          className="w-full bg-white border border-[#E8E8E8] hover:border-[#171717] rounded-[99px] p-3.5 px-5 flex items-center justify-between transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <RotateCcw className="w-4 h-4 text-[#12E600]" />
            <span className="text-sm font-semibold text-[#171717]">Refund tracking</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#858585]" />
        </button>

        <button
          onClick={() => {
            showToast('Help & Support: 24/7 WhatsApp concierge available');
          }}
          className="w-full bg-white border border-[#E8E8E8] hover:border-[#171717] rounded-[99px] p-3.5 px-5 flex items-center justify-between transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-[#858585]" />
            <span className="text-sm font-semibold text-[#171717]">Help & support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#858585]" />
        </button>
      </div>

      {/* Version Note */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-[#858585]">Food101 · Lagos, Nigeria</p>
      </div>
    </div>
  );
};
