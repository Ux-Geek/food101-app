export interface OptionChoice {
  id: string;
  name: string;
  priceDelta: number; // in Naira (₦)
}

export interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  minSelections?: number;
  maxSelections?: number;
  choices: OptionChoice[];
}

export interface Dish {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'rice' | 'swallow' | 'grill' | 'dessert' | 'soup' | 'drinks';
  prepTime: string;
  calories?: string;
  isPopular?: boolean;
  isAvailable: boolean;
  optionGroups?: OptionGroup[];
  spiciness?: 'mild' | 'medium' | 'hot';
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  cuisine: string;
  deliveryTime: string;
  deliveryFee: number;
  imageUrl: string;
  isOpen: boolean;
  address: string;
  featuredDishes: Dish[];
  tag?: string;
}

export interface BasketItemCustomization {
  groupName: string;
  choiceName: string;
  priceDelta: number;
}

export interface BasketItem {
  id: string; // unique item id in basket
  dish: Dish;
  quantity: number;
  selectedOptions: BasketItemCustomization[];
  specialInstructions?: string;
  itemTotalPrice: number;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  area: string;
  fullAddress: string;
  landmark?: string;
  instructions?: string;
  isDefault: boolean;
}

export type PaymentMethodType = 'card' | 'bank_transfer' | 'wallet' | 'cash';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  title: string;
  subtitle: string;
  iconName: string;
}

export type TrackingStatus = 
  | 'submitted'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'on_the_way'
  | 'arriving'
  | 'delivered'
  | 'cancelled';

export interface ActiveOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: BasketItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  createdAt: string;
  deliveryAddress: Address;
  paymentMethod: PaymentMethodType;
  status: TrackingStatus;
  etaMinutes: number;
  rider?: {
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
    coordinatesProgress: number; // 0 to 1
  };
  cancellationReason?: string;
  refundStatus?: 'none' | 'requested' | 'under_review' | 'approved' | 'completed';
}

export interface OrderRating {
  orderId: string;
  foodRating: number;
  foodTags: string[];
  riderRating: number;
  riderTags: string[];
  comment?: string;
}
