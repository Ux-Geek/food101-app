import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Restaurant,
  Dish,
  BasketItem,
  Address,
  ActiveOrder,
  TrackingStatus,
  PaymentMethodType,
  OrderRating,
} from '../types';
import {
  ALL_RESTAURANTS,
  ALL_DISHES,
  INITIAL_ADDRESSES,
  INITIAL_ACTIVE_ORDER,
} from '../data/mockData';

export interface UserProfile {
  name: string;
  phone: string;
  isGuest: boolean;
  avatarUrl?: string;
}

interface AppContextType {
  // Navigation & Modals
  currentTab: 'home' | 'explore' | 'ai' | 'account';
  setCurrentTab: (tab: 'home' | 'explore' | 'ai' | 'account') => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  customizingDish: Dish | null;
  setCustomizingDish: (dish: Dish | null) => void;
  isBasketOpen: boolean;
  setIsBasketOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAddressSelectorOpen: boolean;
  setIsAddressSelectorOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  viewingReceiptOrder: ActiveOrder | null;
  setViewingReceiptOrder: (order: ActiveOrder | null) => void;
  ratingOrder: ActiveOrder | null;
  setRatingOrder: (order: ActiveOrder | null) => void;

  // User & Address
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  currentAddress: Address;
  setCurrentAddress: (address: Address) => void;
  savedAddresses: Address[];
  addSavedAddress: (addr: Omit<Address, 'id'>) => void;

  // Restaurants & Dishes
  restaurants: Restaurant[];
  dishes: Dish[];

  // Basket State & 1-restaurant rule
  basketItems: BasketItem[];
  basketRestaurant: Restaurant | null;
  basketRestaurantConflict: { newDish: Dish; oldRestaurantName: string } | null;
  resolveBasketConflict: (proceed: boolean) => void;
  addToBasket: (dish: Dish, options?: { customizations?: any[]; quantity?: number; note?: string }) => void;
  updateItemQuantity: (itemId: string, delta: number) => void;
  removeFromBasket: (itemId: string) => void;
  clearBasket: () => void;
  lastRemovedItem: BasketItem | null;
  undoRemoveItem: () => void;
  restaurantNote: string;
  setRestaurantNote: (note: string) => void;

  // Basket Totals
  basketSubtotal: number;
  basketDeliveryFee: number;
  basketServiceFee: number;
  basketTotal: number;

  // Orders & Tracking
  activeOrder: ActiveOrder | null;
  setActiveOrder: React.Dispatch<React.SetStateAction<ActiveOrder | null>>;
  orderHistory: ActiveOrder[];
  placeOrder: (paymentMethod: PaymentMethodType) => Promise<boolean>;
  advanceTrackingStage: () => void;
  setTrackingStatusManual: (status: TrackingStatus) => void;
  cancelActiveOrder: (reason: string) => void;
  reorderPastOrder: (order: ActiveOrder) => boolean;

  // Favourites
  favouriteDishIds: string[];
  favouriteRestaurantIds: string[];
  toggleFavouriteDish: (dishId: string) => void;
  toggleFavouriteRestaurant: (restId: string) => void;

  // QA / Simulation Tools
  qaPaymentDecline: boolean;
  setQaPaymentDecline: (v: boolean) => void;
  simulateOutOfStockDishId: string | null;
  setSimulateOutOfStockDishId: (dishId: string | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<'home' | 'explore' | 'ai' | 'account'>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [customizingDish, setCustomizingDish] = useState<Dish | null>(null);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<ActiveOrder | null>(null);
  const [ratingOrder, setRatingOrder] = useState<ActiveOrder | null>(null);

  // User session
  const [user, setUser] = useState<UserProfile>({
    name: 'Yu',
    phone: '+234 801 234 5678',
    isGuest: false,
  });

  // Addresses
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [currentAddress, setCurrentAddress] = useState<Address>(INITIAL_ADDRESSES[0]);

  // Restaurants & Dishes
  const [restaurants] = useState<Restaurant[]>(ALL_RESTAURANTS);
  const [dishes] = useState<Dish[]>(ALL_DISHES);

  // Basket
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [basketRestaurantConflict, setBasketRestaurantConflict] = useState<{
    newDish: Dish;
    oldRestaurantName: string;
  } | null>(null);
  const [lastRemovedItem, setLastRemovedItem] = useState<BasketItem | null>(null);
  const [restaurantNote, setRestaurantNote] = useState('');

  // Active Order & History
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(INITIAL_ACTIVE_ORDER);
  const [orderHistory, setOrderHistory] = useState<ActiveOrder[]>([
    {
      id: 'F10098',
      restaurantId: 'r2',
      restaurantName: 'Suya Central & Grills',
      items: [
        {
          id: 'past-1',
          dish: ALL_DISHES[3],
          quantity: 1,
          selectedOptions: [{ groupName: 'Heat', choiceName: 'Standard Lagos Heat', priceDelta: 0 }],
          itemTotalPrice: 3200,
        },
      ],
      subtotal: 3200,
      deliveryFee: 650,
      serviceFee: 200,
      total: 4050,
      createdAt: 'Yesterday, 8:15 PM',
      deliveryAddress: INITIAL_ADDRESSES[0],
      paymentMethod: 'card',
      status: 'delivered',
      etaMinutes: 0,
    },
  ]);

  // Favourites
  const [favouriteDishIds, setFavouriteDishIds] = useState<string[]>(['d1', 'd4']);
  const [favouriteRestaurantIds, setFavouriteRestaurantIds] = useState<string[]>(['r1']);

  // QA flags
  const [qaPaymentDecline, setQaPaymentDecline] = useState(false);
  const [simulateOutOfStockDishId, setSimulateOutOfStockDishId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Derive basket restaurant
  const basketRestaurantId = basketItems.length > 0 ? basketItems[0].dish.restaurantId : null;
  const basketRestaurant = basketRestaurantId
    ? restaurants.find((r) => r.id === basketRestaurantId) || null
    : null;

  // Calculate totals
  const basketSubtotal = basketItems.reduce((acc, item) => acc + item.itemTotalPrice, 0);
  const basketDeliveryFee = basketRestaurant ? basketRestaurant.deliveryFee : 700;
  const basketServiceFee = basketItems.length > 0 ? 200 : 0;
  const basketTotal = basketSubtotal > 0 ? basketSubtotal + basketDeliveryFee + basketServiceFee : 0;

  // Add to basket with 1-restaurant rule check
  const addToBasket = (
    dish: Dish,
    options?: { customizations?: any[]; quantity?: number; note?: string }
  ) => {
    if (simulateOutOfStockDishId === dish.id || !dish.isAvailable) {
      showToast(`${dish.name} is currently out of stock`);
      return;
    }

    if (basketItems.length > 0 && basketItems[0].dish.restaurantId !== dish.restaurantId) {
      const currentRest = restaurants.find((r) => r.id === basketItems[0].dish.restaurantId);
      setBasketRestaurantConflict({
        newDish: dish,
        oldRestaurantName: currentRest?.name || 'another restaurant',
      });
      return;
    }

    const customizations = options?.customizations || [];
    const quantity = options?.quantity || 1;
    const extraPrice = customizations.reduce((acc, c) => acc + (c.priceDelta || 0), 0);
    const itemTotalPrice = (dish.price + extraPrice) * quantity;

    const newItem: BasketItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      dish,
      quantity,
      selectedOptions: customizations,
      specialInstructions: options?.note || '',
      itemTotalPrice,
    };

    setBasketItems((prev) => [...prev, newItem]);
    showToast(`Added ${dish.name} to basket`);
  };

  const resolveBasketConflict = (proceed: boolean) => {
    if (proceed && basketRestaurantConflict) {
      const dish = basketRestaurantConflict.newDish;
      const newItem: BasketItem = {
        id: `item-${Date.now()}`,
        dish,
        quantity: 1,
        selectedOptions: [],
        itemTotalPrice: dish.price,
      };
      setBasketItems([newItem]);
      showToast(`Started new basket with ${dish.name}`);
    }
    setBasketRestaurantConflict(null);
  };

  const updateItemQuantity = (itemId: string, delta: number) => {
    setBasketItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const unitPrice = item.itemTotalPrice / item.quantity;
            return {
              ...item,
              quantity: newQty,
              itemTotalPrice: unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as BasketItem[]
    );
  };

  const removeFromBasket = (itemId: string) => {
    const itemToRemove = basketItems.find((i) => i.id === itemId);
    if (itemToRemove) {
      setLastRemovedItem(itemToRemove);
      setBasketItems((prev) => prev.filter((i) => i.id !== itemId));
      showToast(`Removed ${itemToRemove.dish.name}`);
    }
  };

  const undoRemoveItem = () => {
    if (lastRemovedItem) {
      setBasketItems((prev) => [...prev, lastRemovedItem]);
      showToast(`Restored ${lastRemovedItem.dish.name}`);
      setLastRemovedItem(null);
    }
  };

  const clearBasket = () => {
    setBasketItems([]);
    setRestaurantNote('');
  };

  const addSavedAddress = (addr: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setSavedAddresses((prev) => [newAddress, ...prev]);
    setCurrentAddress(newAddress);
    showToast(`Delivery address saved`);
  };

  const toggleFavouriteDish = (dishId: string) => {
    setFavouriteDishIds((prev) => {
      const isFav = prev.includes(dishId);
      const updated = isFav ? prev.filter((id) => id !== dishId) : [...prev, dishId];
      showToast(isFav ? 'Removed from favourites' : 'Saved to favourites');
      return updated;
    });
  };

  const toggleFavouriteRestaurant = (restId: string) => {
    setFavouriteRestaurantIds((prev) => {
      const isFav = prev.includes(restId);
      const updated = isFav ? prev.filter((id) => id !== restId) : [...prev, restId];
      showToast(isFav ? 'Removed from favourites' : 'Saved to favourites');
      return updated;
    });
  };

  const placeOrder = async (paymentMethod: PaymentMethodType): Promise<boolean> => {
    if (basketItems.length === 0 || !basketRestaurant) return false;

    // Check if any item became out of stock during checkout
    const outOfStockItem = basketItems.find(
      (item) => item.dish.id === simulateOutOfStockDishId || !item.dish.isAvailable
    );
    if (outOfStockItem) {
      showToast(`${outOfStockItem.dish.name} is no longer available. Please update your basket.`);
      return false;
    }

    if (qaPaymentDecline) {
      showToast('Payment declined by issuing bank. Please select another payment method.');
      return false;
    }

    const orderNumber = `F10${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: ActiveOrder = {
      id: orderNumber,
      restaurantId: basketRestaurant.id,
      restaurantName: basketRestaurant.name,
      items: [...basketItems],
      subtotal: basketSubtotal,
      deliveryFee: basketDeliveryFee,
      serviceFee: basketServiceFee,
      total: basketTotal,
      createdAt: 'Just now',
      deliveryAddress: currentAddress,
      paymentMethod,
      status: 'submitted',
      etaMinutes: 25,
      rider: {
        name: 'Babatunde O.',
        phone: '+234 812 345 6789',
        rating: 4.9,
        vehicle: 'Honda Ace 125 (Motorbike · KJA-429-XY)',
        coordinatesProgress: 0.1,
      },
    };

    setActiveOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);
    clearBasket();
    setIsCheckoutOpen(false);
    setIsBasketOpen(false);
    setIsTrackingOpen(true);
    showToast(`Order #${orderNumber} placed!`);
    return true;
  };

  const advanceTrackingStage = () => {
    if (!activeOrder) return;
    const stages: TrackingStatus[] = [
      'submitted',
      'accepted',
      'preparing',
      'ready_for_pickup',
      'picked_up',
      'on_the_way',
      'arriving',
      'delivered',
    ];
    const currentIndex = stages.indexOf(activeOrder.status);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      const nextStatus = stages[currentIndex + 1];
      const newEta = Math.max(0, activeOrder.etaMinutes - 4);
      const progressMap: Record<TrackingStatus, number> = {
        submitted: 0.05,
        accepted: 0.15,
        preparing: 0.3,
        ready_for_pickup: 0.45,
        picked_up: 0.55,
        on_the_way: 0.75,
        arriving: 0.92,
        delivered: 1.0,
        cancelled: 0,
      };

      const updated: ActiveOrder = {
        ...activeOrder,
        status: nextStatus,
        etaMinutes: nextStatus === 'delivered' ? 0 : newEta,
        rider: activeOrder.rider
          ? {
              ...activeOrder.rider,
              coordinatesProgress: progressMap[nextStatus] || 0.5,
            }
          : undefined,
      };

      setActiveOrder(updated);
      setOrderHistory((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));

      if (nextStatus === 'delivered') {
        showToast('Order delivered! Enjoy your meal!');
        setRatingOrder(updated);
      } else {
        showToast(`Order status: ${nextStatus.replace(/_/g, ' ')}`);
      }
    }
  };

  const setTrackingStatusManual = (status: TrackingStatus) => {
    if (!activeOrder) return;
    const updated: ActiveOrder = {
      ...activeOrder,
      status,
      etaMinutes: status === 'delivered' ? 0 : 12,
    };
    setActiveOrder(updated);
    setOrderHistory((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    if (status === 'delivered') {
      setRatingOrder(updated);
    }
  };

  const cancelActiveOrder = (reason: string) => {
    if (!activeOrder) return;
    const updated: ActiveOrder = {
      ...activeOrder,
      status: 'cancelled',
      cancellationReason: reason,
      refundStatus: 'approved',
    };
    setActiveOrder(null);
    setOrderHistory((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    showToast('Order cancelled. Refund of ₦' + updated.total.toLocaleString() + ' initiated.');
  };

  const reorderPastOrder = (order: ActiveOrder): boolean => {
    const restaurant = restaurants.find((r) => r.id === order.restaurantId);
    if (!restaurant) {
      showToast('Restaurant is currently unavailable');
      return false;
    }

    if (basketItems.length > 0 && basketItems[0].dish.restaurantId !== order.restaurantId) {
      setBasketRestaurantConflict({
        newDish: order.items[0].dish,
        oldRestaurantName: basketRestaurant?.name || 'another restaurant',
      });
      return false;
    }

    // Revalidate items
    const revalidatedItems = order.items.map((item) => {
      const currentDish = dishes.find((d) => d.id === item.dish.id);
      return {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        dish: currentDish || item.dish,
      };
    });

    setBasketItems(revalidatedItems);
    setIsBasketOpen(true);
    showToast(`Items from #${order.id} added to basket!`);
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedRestaurant,
        setSelectedRestaurant,
        customizingDish,
        setCustomizingDish,
        isBasketOpen,
        setIsBasketOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAddressSelectorOpen,
        setIsAddressSelectorOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        viewingReceiptOrder,
        setViewingReceiptOrder,
        ratingOrder,
        setRatingOrder,

        user,
        setUser,
        currentAddress,
        setCurrentAddress,
        savedAddresses,
        addSavedAddress,

        restaurants,
        dishes,

        basketItems,
        basketRestaurant,
        basketRestaurantConflict,
        resolveBasketConflict,
        addToBasket,
        updateItemQuantity,
        removeFromBasket,
        clearBasket,
        lastRemovedItem,
        undoRemoveItem,
        restaurantNote,
        setRestaurantNote,

        basketSubtotal,
        basketDeliveryFee,
        basketServiceFee,
        basketTotal,

        activeOrder,
        setActiveOrder,
        orderHistory,
        placeOrder,
        advanceTrackingStage,
        setTrackingStatusManual,
        cancelActiveOrder,
        reorderPastOrder,

        favouriteDishIds,
        favouriteRestaurantIds,
        toggleFavouriteDish,
        toggleFavouriteRestaurant,

        qaPaymentDecline,
        setQaPaymentDecline,
        simulateOutOfStockDishId,
        setSimulateOutOfStockDishId,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
