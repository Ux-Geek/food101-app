import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Utensils } from 'lucide-react';

export const BasketDrawer: React.FC = () => {
  const {
    isBasketOpen,
    setIsBasketOpen,
    basketItems,
    basketRestaurant,
    basketSubtotal,
    basketDeliveryFee,
    basketServiceFee,
    basketTotal,
    updateItemQuantity,
    removeFromBasket,
    restaurantNote,
    setRestaurantNote,
    setIsCheckoutOpen,
    setCurrentTab,
    lastRemovedItem,
    undoRemoveItem,
  } = useApp();

  if (!isBasketOpen) return null;

  const minOrderAmount = 2500;
  const isMinOrderMet = basketSubtotal >= minOrderAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-[440px] bg-white rounded-t-[28px] border-t border-[#E8E8E8] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
      >
        {/* Header */}
        <div className="pt-3 pb-2 px-6 flex items-center justify-between border-b border-[#E8E8E8]">
          <div>
            <h2 className="text-lg font-bold text-[#171717]">Your basket</h2>
            {basketRestaurant && (
              <p className="text-xs text-[#858585]">{basketRestaurant.name}</p>
            )}
          </div>
          <button
            onClick={() => setIsBasketOpen(false)}
            className="w-9 h-9 rounded-full bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center text-[#171717] hover:bg-[#E8E8E8]"
            aria-label="Close basket"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Undo notification banner if an item was recently removed */}
        {lastRemovedItem && (
          <div className="bg-[#171717] text-white px-4 py-2 mx-4 mt-2 rounded-full flex items-center justify-between text-xs animate-in fade-in">
            <span className="truncate">Removed {lastRemovedItem.dish.name}</span>
            <button
              onClick={undoRemoveItem}
              className="text-[#05DF00] font-bold underline ml-2 shrink-0"
            >
              Undo
            </button>
          </div>
        )}

        {/* Content */}
        {basketItems.length === 0 ? (
          <div className="flex-1 py-14 px-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center text-[#858585] mb-3">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#171717]">Nothing in your basket yet</h3>
            <p className="text-xs text-[#626262] mt-1 max-w-[220px]">
              Explore top dishes from our authentic Nigerian kitchen selection.
            </p>
            <button
              onClick={() => {
                setIsBasketOpen(false);
                setCurrentTab('explore');
              }}
              className="mt-5 px-5 py-2.5 bg-[#171717] text-white rounded-full text-xs font-semibold hover:bg-[#05DF00] hover:text-black transition-colors"
            >
              Explore food
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-3 space-y-4 no-scrollbar">
            {/* Basket Items List */}
            <div className="space-y-3">
              {basketItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[20px] p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-[14px] bg-white border border-[#E8E8E8] overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={item.dish.imageUrl}
                        alt={item.dish.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#171717] truncate">
                        {item.dish.name}
                      </h4>
                      {item.selectedOptions.length > 0 && (
                        <p className="text-[11px] text-[#626262] truncate mt-0.5">
                          {item.selectedOptions.map((o) => o.choiceName).join(' · ')}
                        </p>
                      )}
                      <div className="text-xs font-semibold text-[#171717] tabular-nums mt-0.5">
                        ₦{item.itemTotalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Delete Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center bg-white border border-[#E8E8E8] rounded-full p-1">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeFromBasket(item.id);
                          } else {
                            updateItemQuantity(item.id, -1);
                          }
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[#171717] hover:bg-[#F6F6F6]"
                        aria-label="Decrease quantity"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3 h-3 text-[#D92D20]" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </button>

                      <span className="w-6 text-center text-xs font-bold text-[#171717] tabular-nums">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateItemQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[#171717] hover:bg-[#F6F6F6]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Restaurant Note */}
            <div>
              <label
                htmlFor="basket_note"
                className="text-xs font-bold text-[#171717] block mb-1.5"
              >
                Add a note for the restaurant
              </label>
              <input
                id="basket_note"
                type="text"
                value={restaurantNote}
                onChange={(e) => setRestaurantNote(e.target.value)}
                placeholder="e.g. Please include cutlery and extra serviettes"
                className="w-full bg-[#F6F6F6] border border-[#E8E8E8] rounded-full px-4 py-2.5 text-xs text-[#171717] placeholder-[#858585] focus:outline-hidden focus:border-[#171717]"
              />
            </div>

            {/* Price Breakdown */}
            <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[20px] p-4 px-5 space-y-2 text-xs">
              <div className="flex justify-between text-[#626262]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#171717] tabular-nums">
                  ₦{basketSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#626262]">
                <span>Delivery fee</span>
                <span className="font-semibold text-[#171717] tabular-nums">
                  ₦{basketDeliveryFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#626262]">
                <span>Service fee</span>
                <span className="font-semibold text-[#171717] tabular-nums">
                  ₦{basketServiceFee.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E8E8E8] flex justify-between text-sm font-bold text-[#171717]">
                <span>Total</span>
                <span className="tabular-nums">₦{basketTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Minimum order notice if applicable */}
            {!isMinOrderMet && (
              <p className="text-[11px] text-[#D92D20] text-center font-medium">
                Minimum order amount is ₦{minOrderAmount.toLocaleString()} (add ₦
                {(minOrderAmount - basketSubtotal).toLocaleString()} more)
              </p>
            )}
          </div>
        )}

        {/* Footer Checkout CTA */}
        {basketItems.length > 0 && (
          <div className="p-4 border-t border-[#E8E8E8] bg-white">
            <button
              onClick={() => {
                setIsBasketOpen(false);
                setIsCheckoutOpen(true);
              }}
              disabled={!isMinOrderMet}
              className="w-full h-12 rounded-full bg-[#171717] text-white font-semibold text-sm flex items-center justify-between px-6 hover:bg-[#05DF00] hover:text-black disabled:bg-[#858585] disabled:cursor-not-allowed transition-colors"
            >
              <span>Continue to checkout</span>
              <div className="flex items-center gap-2">
                <span className="font-bold tabular-nums">₦{basketTotal.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
