import SwiftUI
import Combine
#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

// MARK: - View Compatibility Extensions
extension View {
    @ViewBuilder
    func sheetCornerRadius(_ radius: CGFloat) -> some View {
        if #available(iOS 16.4, macOS 13.3, *) {
            self.presentationCornerRadius(radius)
        } else {
            self
        }
    }

    /// Guarantees that bottom sheets are completely opaque, clean, and follow iOS standards
    @ViewBuilder
    func opaqueSheetStyle(detents: Set<PresentationDetent> = [.large]) -> some View {
        #if canImport(UIKit)
        self
            .presentationDetents(detents)
            .presentationDragIndicator(.visible)
            .sheetCornerRadius(28)
            .presentationBackground(Color(uiColor: .systemBackground))
        #else
        if #available(macOS 13.3, *) {
            self
                .sheetCornerRadius(28)
                .presentationBackground(Color(nsColor: .windowBackgroundColor))
        } else {
            self.sheetCornerRadius(28)
        }
        #endif
    }
}

extension Color {
    init(hex: String) {
        let cleanHex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: cleanHex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch cleanHex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }

    static let foodNeonGreen = Color(hex: "00DF00")
    static let foodDark = Color(hex: "171717")
    static let foodGrayBg = Color(hex: "F4F4F6")
    static let foodBannerBg = Color(hex: "F5F5F7")
    static let foodBorder = Color(hex: "EBEBEB")
    static let foodOrange = Color(hex: "F97316")
    static let foodBlue = Color(hex: "1864FF")
    #if canImport(UIKit)
    static let systemBg = Color(uiColor: .systemBackground)
    static let secondarySystemBg = Color(uiColor: .secondarySystemBackground)
    static let tertiarySystemBg = Color(uiColor: .tertiarySystemBackground)
    #else
    static let systemBg = Color(nsColor: .windowBackgroundColor)
    static let secondarySystemBg = Color(nsColor: .controlBackgroundColor)
    static let tertiarySystemBg = Color(nsColor: .underPageBackgroundColor)
    #endif
}

// MARK: - Models
struct OptionChoice: Identifiable, Hashable {
    let id: String
    let name: String
    let priceDelta: Int
}

struct OptionGroup: Identifiable, Hashable {
    let id: String
    let name: String
    let required: Bool
    let choices: [OptionChoice]
}

struct Dish: Identifiable, Hashable {
    let id: String
    let restaurantId: String
    let restaurantName: String
    let name: String
    let description: String
    let price: Int
    let imageUrl: String
    let category: String
    let prepTime: String
    let rating: Double
    let reviewCount: Int
    let isPopular: Bool
    let optionGroups: [OptionGroup]?
}

struct Restaurant: Identifiable, Hashable {
    let id: String
    let name: String
    let rating: Double
    let reviewCount: Int
    let cuisine: String
    let deliveryTime: String
    let deliveryFee: Int
    let imageUrl: String
    let address: String
}

struct Address: Identifiable, Hashable {
    let id: String
    let label: String
    let area: String
    let fullAddress: String
    var isDefault: Bool = false
}

struct BasketItemCustomization: Hashable {
    let groupName: String
    let choiceName: String
    let priceDelta: Int
}

struct BasketItem: Identifiable, Hashable {
    let id: String
    let dish: Dish
    var quantity: Int
    var customizations: [BasketItemCustomization]
    var note: String

    var itemTotalPrice: Int {
        let extra = customizations.reduce(0) { $0 + $1.priceDelta }
        return (dish.price + extra) * quantity
    }
}

struct Rider: Hashable {
    let name: String
    let phone: String
    let rating: Double
    let vehicle: String
}

struct ActiveOrder: Identifiable, Hashable {
    let id: String
    let restaurantName: String
    var items: [BasketItem]
    var subtotal: Int
    var deliveryFee: Int
    var serviceFee: Int
    var total: Int
    var status: String
    var etaMinutes: Int
    let rider: Rider
    let deliveryAddress: Address
}

struct StoreProduct: Identifiable, Hashable {
    let id: String
    let storeName: String
    let name: String
    let unit: String
    let price: Int
    let imageUrl: String
    let category: String
}

struct MarketStore: Identifiable, Hashable {
    let id: String
    let name: String
    let category: String
    let rating: Double
    let deliveryTime: String
    let isFreeDelivery: Bool
    let imageUrl: String
    let tags: [String]
}

struct AiMessage: Identifiable, Hashable {
    let id: String
    let isUser: Bool
    let text: String
    let suggestedDish: Dish?
}

struct PastOrder: Identifiable, Hashable {
    let id: String
    let restaurantName: String
    let dateString: String
    let itemsSummary: String
    let total: Int
    let dish: Dish
}

// MARK: - App State
final class Food101AppState: ObservableObject {
    @Published var userName: String = "Yu"
    @Published var userPhone: String = "+234 801 234 5678"
    @Published var userEmail: String = "yu@food101.app"
    @Published var isGuest: Bool = false

    @Published var currentTab: Tab = .home
    @Published var selectedDishForCustomization: Dish? = nil
    @Published var isBasketOpen: Bool = false
    @Published var isCheckoutOpen: Bool = false
    @Published var isTrackingOpen: Bool = false
    @Published var isSearchOpen: Bool = false
    @Published var isAccountOpen: Bool = false
    @Published var isAddressPickerOpen: Bool = false

    @Published var basketItems: [BasketItem] = []
    @Published var appliedPromoCode: String? = nil
    @Published var appliedDiscount: Int = 0

    @Published var addresses: [Address] = [
        Address(id: "addr-1", label: "Home", area: "Lekki Phase 1, Lagos", fullAddress: "14 Admiralty Way, Lekki Phase 1, Lagos", isDefault: true),
        Address(id: "addr-2", label: "Work", area: "Victoria Island, Lagos", fullAddress: "Plot 1204 Ahmadu Bello Way, Victoria Island", isDefault: false),
        Address(id: "addr-3", label: "Parents", area: "Ikoyi, Lagos", fullAddress: "8 Kingsway Road, Old Ikoyi, Lagos", isDefault: false)
    ]

    @Published var currentAddress: Address = Address(
        id: "addr-1",
        label: "Home",
        area: "Lekki Phase 1, Lagos",
        fullAddress: "14 Admiralty Way, Lekki Phase 1, Lagos",
        isDefault: true
    )

    @Published var activeOrder: ActiveOrder? = ActiveOrder(
        id: "F10124",
        restaurantName: "Iya Wale Swallows",
        items: [],
        subtotal: 4600,
        deliveryFee: 700,
        serviceFee: 200,
        total: 5500,
        status: "on_the_way",
        etaMinutes: 4,
        rider: Rider(
            name: "Babatunde O.",
            phone: "+234 812 345 6789",
            rating: 4.9,
            vehicle: "Honda Ace 125 (Motorbike · KJA-429-XY)"
        ),
        deliveryAddress: Address(
            id: "addr-1",
            label: "Home",
            area: "Lekki Phase 1, Lagos",
            fullAddress: "14 Admiralty Way, Lekki Phase 1, Lagos"
        )
    )

    var basketSubtotal: Int {
        basketItems.reduce(0) { $0 + $1.itemTotalPrice }
    }

    var basketDeliveryFee: Int {
        basketItems.isEmpty ? 0 : 700
    }

    var basketServiceFee: Int {
        basketItems.isEmpty ? 0 : 200
    }

    var basketTotal: Int {
        if basketItems.isEmpty { return 0 }
        let gross = basketSubtotal + basketDeliveryFee + basketServiceFee - appliedDiscount
        return max(0, gross)
    }

    enum Tab: String, CaseIterable {
        case home = "Home"
        case store = "Store"
        case ai = "Ai+"
        case account = "Account"
    }

    // Mock Dishes
    @Published var dishes: [Dish] = [
        Dish(
            id: "d1",
            restaurantId: "r1",
            restaurantName: "Iya Wale Swallows",
            name: "Jollof & Grilled Chicken",
            description: "Smoky firewood jollof rice served with seasoned grilled quarter chicken, sweet fried dodo and peppered glaze.",
            price: 2300,
            imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80",
            category: "rice",
            prepTime: "12mins",
            rating: 4.7,
            reviewCount: 324,
            isPopular: true,
            optionGroups: [
                OptionGroup(
                    id: "og-1",
                    name: "Portion Size",
                    required: true,
                    choices: [
                        OptionChoice(id: "p1", name: "Regular Portion", priceDelta: 0),
                        OptionChoice(id: "p2", name: "Jumbo Party Pack", priceDelta: 1200)
                    ]
                ),
                OptionGroup(
                    id: "og-2",
                    name: "Protein Choice",
                    required: true,
                    choices: [
                        OptionChoice(id: "pr1", name: "Grilled Quarter Chicken", priceDelta: 0),
                        OptionChoice(id: "pr2", name: "Peppered Fried Fish", priceDelta: 400),
                        OptionChoice(id: "pr3", name: "Crispy Assorted Beef", priceDelta: 600)
                    ]
                ),
                OptionGroup(
                    id: "og-3",
                    name: "Add Extras",
                    required: false,
                    choices: [
                        OptionChoice(id: "e1", name: "Extra Fried Dodo (Plantain)", priceDelta: 500),
                        OptionChoice(id: "e2", name: "Coleslaw & Cream", priceDelta: 400),
                        OptionChoice(id: "e3", name: "Extra Firewood Pepper Sauce", priceDelta: 300)
                    ]
                )
            ]
        ),
        Dish(
            id: "d2",
            restaurantId: "r4",
            restaurantName: "Treat's Right",
            name: "Sticky Toffee Pudding & Ice Cream",
            description: "Warm rich toffee pudding cake drenched in sticky butter caramel and crowned with velvety Madagascar vanilla ice cream.",
            price: 2300,
            imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
            category: "dessert",
            prepTime: "12mins",
            rating: 4.8,
            reviewCount: 192,
            isPopular: true,
            optionGroups: [
                OptionGroup(
                    id: "og-top",
                    name: "Ice Cream Scoop",
                    required: true,
                    choices: [
                        OptionChoice(id: "ic1", name: "Vanilla Bean", priceDelta: 0),
                        OptionChoice(id: "ic2", name: "Salted Caramel", priceDelta: 300),
                        OptionChoice(id: "ic3", name: "Double Scoop", priceDelta: 600)
                    ]
                )
            ]
        ),
        Dish(
            id: "d3",
            restaurantId: "r2",
            restaurantName: "Suya Central",
            name: "Signature Beef Suya Platter",
            description: "Thinly sliced flame-grilled beef rubbed in authentic spicy yaji nut powder, served with sliced onions, cabbage and fresh lime.",
            price: 3200,
            imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
            category: "grill",
            prepTime: "15mins",
            rating: 4.9,
            reviewCount: 410,
            isPopular: true,
            optionGroups: [
                OptionGroup(
                    id: "og-spice",
                    name: "Spice Level",
                    required: true,
                    choices: [
                        OptionChoice(id: "sp1", name: "Mild Yaji", priceDelta: 0),
                        OptionChoice(id: "sp2", name: "Hot & Peppered", priceDelta: 0),
                        OptionChoice(id: "sp3", name: "Extreme Suya Heat 🔥", priceDelta: 100)
                    ]
                )
            ]
        ),
        Dish(
            id: "d4",
            restaurantId: "r1",
            restaurantName: "Iya Wale Swallows",
            name: "Pounded Yam & Egusi Elegusi",
            description: "Fluffy pounded yam paired with rich melon seed egusi soup simmered with dried catfish, stockfish and tender goat meat.",
            price: 3500,
            imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
            category: "soup",
            prepTime: "18mins",
            rating: 4.9,
            reviewCount: 520,
            isPopular: true,
            optionGroups: [
                OptionGroup(
                    id: "og-meat",
                    name: "Meat Selection",
                    required: true,
                    choices: [
                        OptionChoice(id: "m1", name: "Tender Goat Meat", priceDelta: 0),
                        OptionChoice(id: "m2", name: "Slow-Cooked Oxtail", priceDelta: 900),
                        OptionChoice(id: "m3", name: "Assorted Shaki & Beef", priceDelta: 400)
                    ]
                )
            ]
        ),
        Dish(
            id: "d5",
            restaurantId: "r5",
            restaurantName: "Lagos Chill Co.",
            name: "Zobo Citrus Infusion (500ml)",
            description: "Cold-pressed hibiscus flower iced tea naturally infused with fresh ginger, pineapple chunks and valencia orange rind.",
            price: 1200,
            imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
            category: "drinks",
            prepTime: "5mins",
            rating: 4.8,
            reviewCount: 148,
            isPopular: false,
            optionGroups: nil
        )
    ]

    @Published var popularOrders: [(id: String, name: String, price: Int, img: String)] = [
        ("po-1", "Big Rice &\nChicken", 3500, "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=300&q=80"),
        ("po-2", "Pounded Yam\n& Egusi", 3500, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80"),
        ("po-3", "Suya Platter\nSupreme", 3200, "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80"),
        ("po-4", "Puff Puff Box\n(12pcs)", 1800, "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=300&q=80"),
        ("po-5", "Sticky Toffee\nDessert", 2300, "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=300&q=80")
    ]

    // Market Stores
    @Published var marketStores: [MarketStore] = [
        MarketStore(id: "s1", name: "FreshMart Supermarket", category: "Grocery & Pantry", rating: 4.8, deliveryTime: "15-25 min", isFreeDelivery: true, imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80", tags: ["Organic", "Bakery", "Household"]),
        MarketStore(id: "s2", name: "Artisan Crust Bakery", category: "Breads & Pastries", rating: 4.9, deliveryTime: "10-20 min", isFreeDelivery: false, imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80", tags: ["Sourdough", "Croissants", "Cakes"]),
        MarketStore(id: "s3", name: "Cellar & Chill Liquids", category: "Wine & Beverages", rating: 4.7, deliveryTime: "20-30 min", isFreeDelivery: true, imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80", tags: ["Chilled Beers", "Fine Wine", "Juices"])
    ]

    @Published var storeProducts: [StoreProduct] = [
        StoreProduct(id: "sp1", storeName: "FreshMart", name: "Golden Sella Basmati 5kg", unit: "1 bag", price: 6800, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80", category: "Pantry"),
        StoreProduct(id: "sp2", storeName: "Artisan Crust", name: "Fresh French Butter Croissants", unit: "Pack of 4", price: 2800, imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80", category: "Bakery"),
        StoreProduct(id: "sp3", storeName: "FreshMart", name: "Ripe Organic Plantains", unit: "Bunch (6pcs)", price: 1600, imageUrl: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=300&q=80", category: "Produce"),
        StoreProduct(id: "sp4", storeName: "Cellar & Chill", name: "Sparkling Hibiscus Tonic", unit: "750ml bottle", price: 2200, imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80", category: "Drinks")
    ]

    // AI Messages
    @Published var aiMessages: [AiMessage] = [
        AiMessage(id: "m-1", isUser: false, text: "Hello Yu! 👨‍🍳 I'm your Food101 Culinary Concierge. Tell me your craving, budget, or dietary goal, and I'll tailor the perfect order for you.", suggestedDish: nil),
        AiMessage(id: "m-2", isUser: true, text: "What's the best spicy comfort food ready in under 15 minutes?", suggestedDish: nil),
        AiMessage(id: "m-3", isUser: false, text: "You'll love Suya Central's Signature Beef Suya Platter. Tender flame-grilled beef dusted in fire yaji spice, ready in 15 mins!", suggestedDish: nil)
    ]

    // Past Orders
    @Published var pastOrders: [PastOrder] = [
        PastOrder(id: "PO-902", restaurantName: "Iya Wale Swallows", dateString: "Yesterday, 7:15 PM", itemsSummary: "1x Jollof & Grilled Chicken, 1x Zobo Infusion", total: 3500, dish: Dish(id: "d1", restaurantId: "r1", restaurantName: "Iya Wale Swallows", name: "Jollof & Grilled Chicken", description: "", price: 2300, imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80", category: "rice", prepTime: "12m", rating: 4.7, reviewCount: 324, isPopular: true, optionGroups: nil)),
        PastOrder(id: "PO-841", restaurantName: "Treat's Right", dateString: "Nov 3, 2:40 PM", itemsSummary: "2x Sticky Toffee Pudding & Ice Cream", total: 4600, dish: Dish(id: "d2", restaurantId: "r4", restaurantName: "Treat's Right", name: "Sticky Toffee Pudding", description: "", price: 2300, imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80", category: "dessert", prepTime: "12m", rating: 4.8, reviewCount: 192, isPopular: true, optionGroups: nil))
    ]

    func addToBasket(dish: Dish, quantity: Int = 1, customizations: [BasketItemCustomization] = [], note: String = "") {
        let item = BasketItem(
            id: UUID().uuidString,
            dish: dish,
            quantity: quantity,
            customizations: customizations,
            note: note
        )
        basketItems.append(item)
        #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        #endif
    }

    func addStoreProductToBasket(product: StoreProduct) {
        let dummyDish = Dish(
            id: product.id,
            restaurantId: "market",
            restaurantName: product.storeName,
            name: product.name,
            description: product.unit,
            price: product.price,
            imageUrl: product.imageUrl,
            category: "grocery",
            prepTime: "10mins",
            rating: 4.9,
            reviewCount: 50,
            isPopular: false,
            optionGroups: nil
        )
        addToBasket(dish: dummyDish, quantity: 1)
    }

    func updateBasketQuantity(itemId: String, delta: Int) {
        if let idx = basketItems.firstIndex(where: { $0.id == itemId }) {
            let newQty = basketItems[idx].quantity + delta
            if newQty <= 0 {
                basketItems.remove(at: idx)
            } else {
                basketItems[idx].quantity = newQty
            }
            #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
        }
    }

    func removeBasketItem(itemId: String) {
        basketItems.removeAll(where: { $0.id == itemId })
        #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        #endif
    }

    func applyPromo(code: String) -> (success: Bool, message: String) {
        let clean = code.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        if clean == "FOOD101" {
            appliedPromoCode = "FOOD101"
            appliedDiscount = 500
            #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
            return (true, "Promo FOOD101 applied! ₦500 off your order.")
        } else if clean.isEmpty {
            appliedPromoCode = nil
            appliedDiscount = 0
            return (false, "Please enter a valid promo code.")
        } else {
            return (false, "Invalid code. Try using 'FOOD101'.")
        }
    }

    func placeOrder(paymentMethod: String, note: String) {
        let newOrder = ActiveOrder(
            id: "F\(Int.random(in: 10000...99999))",
            restaurantName: basketItems.first?.dish.restaurantName ?? "Food101 Kitchen",
            items: basketItems,
            subtotal: basketSubtotal,
            deliveryFee: basketDeliveryFee,
            serviceFee: basketServiceFee,
            total: basketTotal,
            status: "on_the_way",
            etaMinutes: 4,
            rider: Rider(
                name: "Babatunde O.",
                phone: "+234 812 345 6789",
                rating: 4.9,
                vehicle: "Honda Ace 125 (Motorbike · KJA-429-XY)"
            ),
            deliveryAddress: currentAddress
        )
        activeOrder = newOrder
        basketItems.removeAll()
        appliedPromoCode = nil
        appliedDiscount = 0
        #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        #endif
    }

    func sendAiUserPrompt(_ text: String) {
        guard !text.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        aiMessages.append(AiMessage(id: UUID().uuidString, isUser: true, text: text, suggestedDish: nil))

        let lower = text.lowercased()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            let reply: (text: String, dish: Dish?)
            if lower.contains("spicy") || lower.contains("suya") {
                reply = ("Nothing beats Suya Central's flame-grilled Beef Suya with authentic yaji spice! I've linked it below for you.", self.dishes.first(where: { $0.id == "d3" }))
            } else if lower.contains("dessert") || lower.contains("sweet") {
                reply = ("Satisfy that sweet tooth with Treat's Right Sticky Toffee Pudding drenched in hot caramel & ice cream!", self.dishes.first(where: { $0.id == "d2" }))
            } else if lower.contains("swallow") || lower.contains("soup") || lower.contains("yam") {
                reply = ("I recommend the hot Pounded Yam with rich melon seed Egusi soup from Iya Wale Swallows.", self.dishes.first(where: { $0.id == "d4" }))
            } else {
                reply = ("Here is our top chef pick today: the smoky firewood Jollof & Grilled Quarter Chicken with sweet dodo!", self.dishes.first(where: { $0.id == "d1" }))
            }
            self.aiMessages.append(AiMessage(id: UUID().uuidString, isUser: false, text: reply.text, suggestedDish: reply.dish))
            #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
        }
    }
}

// MARK: - Map Canvas
struct LiveVectorMap: View {
    var body: some View {
        Canvas { context, size in
            // Land Background
            context.fill(Path(CGRect(origin: .zero, size: size)), with: .color(Color(hex: "E8EEF5")))

            // Land parcels
            var p1 = Path()
            p1.move(to: CGPoint(x: 0, y: 35))
            p1.addLine(to: CGPoint(x: size.width * 0.45, y: 35))
            p1.addLine(to: CGPoint(x: size.width * 0.52, y: 65))
            p1.addLine(to: CGPoint(x: 0, y: 65))
            p1.closeSubpath()
            context.fill(p1, with: .color(Color(hex: "DEE5EE").opacity(0.6)))

            var p2 = Path()
            p2.move(to: CGPoint(x: size.width * 0.55, y: 10))
            p2.addLine(to: CGPoint(x: size.width, y: 10))
            p2.addLine(to: CGPoint(x: size.width, y: 80))
            p2.addLine(to: CGPoint(x: size.width * 0.6, y: 80))
            p2.closeSubpath()
            context.fill(p2, with: .color(Color(hex: "E2E9F1").opacity(0.7)))

            // Main Streets (White with slight stroke)
            var road1 = Path()
            road1.move(to: CGPoint(x: -10, y: 40))
            road1.addLine(to: CGPoint(x: size.width + 10, y: 36))
            context.stroke(road1, with: .color(.white), lineWidth: 14)

            var road2 = Path()
            road2.move(to: CGPoint(x: -10, y: 92))
            road2.addLine(to: CGPoint(x: size.width * 0.55, y: 88))
            road2.addLine(to: CGPoint(x: size.width + 10, y: 105))
            context.stroke(road2, with: .color(.white), lineWidth: 16)

            // Cross streets
            var cross1 = Path()
            cross1.move(to: CGPoint(x: size.width * 0.28, y: -10))
            cross1.addLine(to: CGPoint(x: size.width * 0.26, y: size.height + 10))
            context.stroke(cross1, with: .color(.white), lineWidth: 9)

            var cross2 = Path()
            cross2.move(to: CGPoint(x: size.width * 0.58, y: -10))
            cross2.addLine(to: CGPoint(x: size.width * 0.52, y: size.height + 10))
            context.stroke(cross2, with: .color(.white), lineWidth: 11)

            // Store Pin
            let storePt = CGPoint(x: size.width * 0.28, y: 92)
            context.fill(Path(ellipseIn: CGRect(x: storePt.x - 7, y: storePt.y - 7, width: 14, height: 14)), with: .color(Color.red.opacity(0.2)))
            context.fill(Path(ellipseIn: CGRect(x: storePt.x - 4.5, y: storePt.y - 4.5, width: 9, height: 9)), with: .color(Color.red))
            context.fill(Path(ellipseIn: CGRect(x: storePt.x - 2, y: storePt.y - 2, width: 4, height: 4)), with: .color(.white))

            // Dashed route
            var route = Path()
            route.move(to: CGPoint(x: size.width * 0.65, y: 94))
            route.addLine(to: CGPoint(x: size.width * 0.74, y: 94))
            route.addLine(to: CGPoint(x: size.width * 0.82, y: 120))
            route.addLine(to: CGPoint(x: size.width * 0.87, y: 135))
            route.addLine(to: CGPoint(x: size.width * 0.90, y: 125))
            context.stroke(route, with: .color(Color.black.opacity(0.85)), style: StrokeStyle(lineWidth: 3.5, lineCap: .round, dash: [4, 4]))

            // Destination Dot
            let destPt = CGPoint(x: size.width * 0.90, y: 125)
            context.fill(Path(ellipseIn: CGRect(x: destPt.x - 5, y: destPt.y - 5, width: 10, height: 10)), with: .color(Color.blue))
            context.stroke(Path(ellipseIn: CGRect(x: destPt.x - 9, y: destPt.y - 9, width: 18, height: 18)), with: .color(Color.blue.opacity(0.35)), lineWidth: 2)
        }
        .overlay(
            ZStack(alignment: .topLeading) {
                Text("Sriblysta St")
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(Color.gray)
                    .position(x: 75, y: 84)

                Text("Yanisa Rainisa St")
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(Color.gray)
                    .position(x: 70, y: 124)

                Text("Umanska St")
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(Color.gray)
                    .position(x: 145, y: 146)

                VStack(alignment: .leading, spacing: 1) {
                    Text("Lekki Central")
                        .font(.system(size: 8, weight: .semibold))
                    Text("Zone 4 Dispatch")
                        .font(.system(size: 7, weight: .regular))
                    Text("Express Hub")
                        .font(.system(size: 7, weight: .regular))
                        .foregroundColor(.gray)
                }
                .foregroundColor(Color.gray)
                .position(x: 310, y: 35)

                // Courier Pin with Avatar + Blue Badge
                VStack(spacing: 3) {
                    ZStack {
                        Circle()
                            .fill(Color.white)
                            .frame(width: 32, height: 32)
                        AsyncImage(url: URL(string: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80")) { img in
                            img.resizable().scaledToFill()
                        } placeholder: {
                            Color.gray
                        }
                        .frame(width: 28, height: 28)
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color.foodBlue, lineWidth: 2))
                    }

                    HStack(spacing: 3) {
                        Image(systemName: "person.fill")
                            .font(.system(size: 8))
                        Text("1km 304m")
                            .font(.system(size: 9, weight: .bold))
                    }
                    .foregroundColor(.white)
                    .padding(.horizontal, 7)
                    .padding(.vertical, 3)
                    .background(Color.foodBlue)
                    .clipShape(Capsule())
                    .shadow(color: .black.opacity(0.1), radius: 2, y: 1)
                }
                .position(x: 245, y: 48)
            }
        )
    }
}

// MARK: - Main ContentView
struct ContentView: View {
    @StateObject private var appState = Food101AppState()

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.systemBg.ignoresSafeArea()

            // Active Screen Content
            Group {
                switch appState.currentTab {
                case .home:
                    HomeFeedView()
                case .store:
                    StoreView()
                case .ai:
                    AiConciergeView()
                case .account:
                    AccountView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            // Bottom Stack: Floating Cart Banner + Bottom Nav Bar
            VStack(spacing: 8) {
                // Floating Quick Basket Pill (if basket has items and not in account)
                if !appState.basketItems.isEmpty && appState.currentTab != .account {
                    Button {
                        appState.isBasketOpen = true
                    } label: {
                        HStack(spacing: 12) {
                            HStack(spacing: 6) {
                                Image(systemName: "bag.fill")
                                    .font(.subheadline)
                                    .foregroundColor(Color.foodNeonGreen)
                                Text("\(appState.basketItems.reduce(0, { $0 + $1.quantity })) items")
                                    .font(.subheadline.bold())
                                    .foregroundColor(.white)
                            }

                            Spacer()

                            Text("View Basket · ₦\(appState.basketTotal)")
                                .font(.subheadline.bold())
                                .foregroundColor(.white)

                            Image(systemName: "chevron.right")
                                .font(.caption.bold())
                                .foregroundColor(.white.opacity(0.7))
                        }
                        .padding(.horizontal, 18)
                        .padding(.vertical, 12)
                        .background(Color.foodDark)
                        .clipShape(Capsule())
                        .shadow(color: .black.opacity(0.2), radius: 10, y: 4)
                    }
                    .padding(.horizontal, 20)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }

                // Floating 4-Tab Bottom Navigation Bar
                FloatingBottomNav()
                    .padding(.horizontal, 20)
                    .padding(.bottom, 8)
            }
        }
        .environmentObject(appState)
        // Sheets — Guaranteed Opaque iOS Native Presentation
        .sheet(item: $appState.selectedDishForCustomization) { dish in
            DishCustomizerSheet(dish: dish)
                .opaqueSheetStyle(detents: [.fraction(0.88), .large])
        }
        .sheet(isPresented: $appState.isBasketOpen) {
            BasketSheet()
                .opaqueSheetStyle(detents: [.fraction(0.85), .large])
        }
        .sheet(isPresented: $appState.isCheckoutOpen) {
            CheckoutSheet()
                .opaqueSheetStyle(detents: [.fraction(0.92), .large])
        }
        .sheet(isPresented: $appState.isTrackingOpen) {
            LiveTrackingSheet()
                .opaqueSheetStyle(detents: [.fraction(0.92), .large])
        }
        .sheet(isPresented: $appState.isSearchOpen) {
            SearchSheet()
                .opaqueSheetStyle(detents: [.large])
        }
        .sheet(isPresented: $appState.isAddressPickerOpen) {
            AddressPickerSheet()
                .opaqueSheetStyle(detents: [.fraction(0.55), .medium])
        }
    }
}

// MARK: - Home Feed Screen
struct HomeFeedView: View {
    @EnvironmentObject var state: Food101AppState
    @State private var selectedCategory = "All"

    let categories = ["All", "Swallows", "Desserts", "Grill", "Rice", "Drinks"]

    var filteredDishes: [Dish] {
        if selectedCategory == "All" {
            return state.dishes
        } else if selectedCategory == "Swallows" {
            return state.dishes.filter { $0.category == "soup" }
        } else if selectedCategory == "Desserts" {
            return state.dishes.filter { $0.category == "dessert" }
        } else if selectedCategory == "Grill" {
            return state.dishes.filter { $0.category == "grill" }
        } else if selectedCategory == "Rice" {
            return state.dishes.filter { $0.category == "rice" }
        } else {
            return state.dishes.filter { $0.category == "drinks" }
        }
    }

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(spacing: 20) {
                // 1. Top Header with User, Address & Quick Search
                HeaderView()

                // 2. Live Tracking Map Card
                LiveTrackingCardView()
                    .onTapGesture {
                        state.isTrackingOpen = true
                    }

                // 3. Banner Carousel
                BannerCarouselView()

                // 4. Quick Category Filter Pills
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(categories, id: \.self) { cat in
                            Button {
                                selectedCategory = cat
                                #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
                            } label: {
                                Text(cat)
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(selectedCategory == cat ? .white : Color.foodDark)
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 8)
                                    .background(selectedCategory == cat ? Color.foodDark : Color.foodGrayBg)
                                    .clipShape(Capsule())
                            }
                        }
                    }
                }

                // 5. "Desserts, Entrees, Beverages etc" Section
                FoodItemsSectionView(dishes: filteredDishes)

                // 6. "Popular Orders" Section with Circles & 3500 Badges
                PopularOrdersSectionView()

                // Bottom spacer for floating bottom bar & cart
                Color.clear.frame(height: 120)
            }
            .padding(.horizontal, 20)
            .padding(.top, 10)
        }
    }
}

// MARK: - Header View
struct HeaderView: View {
    @EnvironmentObject var state: Food101AppState

    var body: some View {
        VStack(spacing: 12) {
            // Top Row: Avatar & Greeting, Address, and Basket
            HStack(spacing: 12) {
                // Profile Avatar Button
                Button {
                    state.currentTab = .account
                } label: {
                    HStack(spacing: 8) {
                        AsyncImage(url: URL(string: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80")) { img in
                            img.resizable().scaledToFill()
                        } placeholder: {
                            Circle().fill(Color.gray.opacity(0.3))
                        }
                        .frame(width: 40, height: 40)
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color.foodBorder, lineWidth: 1))

                        VStack(alignment: .leading, spacing: 1) {
                            Text("Hi, \(state.userName)")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(Color.foodDark)
                            Button {
                                state.isAddressPickerOpen = true
                            } label: {
                                HStack(spacing: 2) {
                                    Text(state.currentAddress.area)
                                        .font(.system(size: 11, weight: .medium))
                                        .foregroundColor(.secondary)
                                        .lineLimit(1)
                                    Image(systemName: "chevron.down")
                                        .font(.system(size: 8, weight: .bold))
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                    }
                }

                Spacer()

                // Search Icon Button
                Button {
                    state.isSearchOpen = true
                } label: {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color.foodDark)
                        .frame(width: 38, height: 38)
                        .background(Color.foodGrayBg)
                        .clipShape(Circle())
                }

                // Basket Button with Live Badge
                Button {
                    state.isBasketOpen = true
                } label: {
                    ZStack(alignment: .topTrailing) {
                        Image(systemName: "bag.fill")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color.foodDark)
                            .frame(width: 38, height: 38)
                            .background(Color.foodGrayBg)
                            .clipShape(Circle())

                        if !state.basketItems.isEmpty {
                            Text("\(state.basketItems.reduce(0, { $0 + $1.quantity }))")
                                .font(.system(size: 10, weight: .black))
                                .foregroundColor(.black)
                                .padding(5)
                                .background(Color.foodNeonGreen)
                                .clipShape(Circle())
                                .offset(x: 4, y: -4)
                        }
                    }
                }
            }

            // Search Trigger Bar Pill
            Button {
                state.isSearchOpen = true
            } label: {
                HStack(spacing: 10) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 15))
                        .foregroundColor(.gray)
                    Text("Search dishes, restaurants, groceries...")
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                    Spacer()
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Color.foodGrayBg)
                .clipShape(Capsule())
            }
        }
    }
}

// MARK: - Live Tracking Map Card View
struct LiveTrackingCardView: View {
    var body: some View {
        VStack(spacing: 0) {
            // Vector Map Area
            LiveVectorMap()
                .frame(height: 165)

            // Bottom Green Status Bar
            HStack {
                Text("-4min")
                    .font(.system(size: 20, weight: .black))
                    .foregroundColor(.black)

                Spacer()

                HStack(spacing: 4) {
                    Circle()
                        .fill(Color.black)
                        .frame(width: 6, height: 6)
                    Text("Currently at Challenge..")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.black.opacity(0.9))
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.caption.bold())
                    .foregroundColor(.black)
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 14)
            .background(Color.foodNeonGreen)
        }
        .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .stroke(Color.black.opacity(0.04), lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.04), radius: 10, y: 3)
    }
}

// MARK: - Banner Carousel View
struct BannerCarouselView: View {
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                // Banner 1: Promo Code FOOD101
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .fill(LinearGradient(colors: [Color(hex: "FEE2E2"), Color.foodBannerBg], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .frame(width: 300, height: 135)

                    VStack(alignment: .leading, spacing: 6) {
                        HStack(spacing: 6) {
                            Text("FOOD101 SPECIAL")
                                .font(.system(size: 9, weight: .heavy))
                                .foregroundColor(.white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(Color.red)
                                .clipShape(Capsule())
                        }

                        Text("Get ₦500 OFF")
                            .font(.system(size: 24, weight: .black))
                            .foregroundColor(Color.foodDark)

                        Text("Use code FOOD101 at checkout")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.secondary)
                    }
                    .padding(20)
                }

                // Banner 2: Free Delivery
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .fill(LinearGradient(colors: [Color(hex: "E0F2FE"), Color.foodBannerBg], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .frame(width: 300, height: 135)

                    VStack(alignment: .leading, spacing: 6) {
                        Text("FAST DELIVERY")
                            .font(.system(size: 9, weight: .heavy))
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color.foodBlue)
                            .clipShape(Capsule())

                        Text("Free Delivery Today")
                            .font(.system(size: 24, weight: .black))
                            .foregroundColor(Color.foodDark)

                        Text("On orders above ₦5,000 in Lekki")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.secondary)
                    }
                    .padding(20)
                }
            }
        }
    }
}

// MARK: - Desserts & Entrees Section
struct FoodItemsSectionView: View {
    @EnvironmentObject var state: Food101AppState
    let dishes: [Dish]

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("Desserts, Entrees, Beverages etc")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))
                Spacer()
                Button("See All") {
                    state.isSearchOpen = true
                }
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color(hex: "8E8E93"))
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 14) {
                    ForEach(dishes) { dish in
                        FoodCardItem(dish: dish)
                            .onTapGesture {
                                state.selectedDishForCustomization = dish
                            }
                    }
                }
            }
        }
    }
}

struct FoodCardItem: View {
    let dish: Dish

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Food Image with 22px Corner Radius & Rating Badge
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: dish.imageUrl)) { img in
                    img.resizable().scaledToFill()
                } placeholder: {
                    Color.foodGrayBg
                }
                .frame(width: 220, height: 145)
                .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))

                // Rating Pill Badge
                HStack(spacing: 3) {
                    Text(String(format: "%.1f", dish.rating))
                        .font(.system(size: 11, weight: .bold))
                    Image(systemName: "star.fill")
                        .font(.system(size: 9))
                        .foregroundColor(Color(hex: "F59E0B"))
                    Text("(\(dish.reviewCount))")
                        .font(.system(size: 10, weight: .regular))
                        .foregroundColor(.gray)
                }
                .foregroundColor(.black)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color.white.opacity(0.95))
                .clipShape(Capsule())
                .shadow(color: .black.opacity(0.08), radius: 3, y: 1)
                .padding(10)
            }

            VStack(alignment: .leading, spacing: 3) {
                Text(dish.restaurantName)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.secondary)
                    .lineLimit(1)

                Text(dish.name)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color.foodDark)
                    .lineLimit(1)
            }

            // Info Row: Orange clock + 12mins, and @ price
            HStack {
                HStack(spacing: 4) {
                    Image(systemName: "clock")
                        .font(.system(size: 11))
                        .foregroundColor(Color.foodOrange)
                    Text(dish.prepTime)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color.foodOrange)
                }

                Spacer()

                Text("@ \(dish.price)")
                    .font(.system(size: 14, weight: .black))
                    .foregroundColor(Color.foodDark)
            }
            .frame(width: 220)
        }
    }
}

// MARK: - Popular Orders Section
struct PopularOrdersSectionView: View {
    @EnvironmentObject var state: Food101AppState

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("Popular Orders")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))
                Spacer()
                Button("See All") {
                    state.isSearchOpen = true
                }
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color(hex: "8E8E93"))
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(state.popularOrders, id: \.id) { item in
                        VStack(spacing: 8) {
                            ZStack(alignment: .topTrailing) {
                                AsyncImage(url: URL(string: item.img)) { img in
                                    img.resizable().scaledToFill()
                                } placeholder: {
                                    Color(hex: "B92A11")
                                }
                                .frame(width: 74, height: 74)
                                .clipShape(Circle())
                                .shadow(color: .black.opacity(0.06), radius: 4, y: 2)

                                Text("\(item.price)")
                                    .font(.system(size: 10, weight: .black))
                                    .foregroundColor(.black)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color.white)
                                    .clipShape(Capsule())
                                    .shadow(color: .black.opacity(0.12), radius: 2, y: 1)
                                    .offset(x: 4, y: -2)
                            }

                            Text(item.name)
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(Color(hex: "2D2D2D"))
                                .multilineTextAlignment(.center)
                                .lineLimit(2)
                                .frame(width: 80)
                        }
                        .onTapGesture {
                            if let match = state.dishes.first(where: { item.name.contains($0.category) }) ?? state.dishes.first {
                                state.selectedDishForCustomization = match
                            }
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Store / Market Screen
struct StoreView: View {
    @EnvironmentObject var state: Food101AppState
    @State private var selectedMarketCategory = "All"
    @State private var marketSearch = ""

    let categories = ["All", "Pantry", "Bakery", "Produce", "Drinks"]

    var filteredProducts: [StoreProduct] {
        var list = state.storeProducts
        if selectedMarketCategory != "All" {
            list = list.filter { $0.category == selectedMarketCategory }
        }
        if !marketSearch.isEmpty {
            list = list.filter { $0.name.localizedCaseInsensitiveContains(marketSearch) }
        }
        return list
    }

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {
                // Header
                VStack(alignment: .leading, spacing: 6) {
                    Text("Food101 Market")
                        .font(.system(size: 26, weight: .black))
                        .foregroundColor(Color.foodDark)
                    Text("Groceries, bakeries & essentials delivered in 20 mins")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }

                // Search Bar
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    TextField("Search groceries, bakery, fresh produce...", text: $marketSearch)
                }
                .padding(12)
                .background(Color.foodGrayBg)
                .clipShape(Capsule())

                // Category Chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(categories, id: \.self) { cat in
                            Button {
                                selectedMarketCategory = cat
                                #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
                            } label: {
                                Text(cat)
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(selectedMarketCategory == cat ? .white : Color.foodDark)
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 8)
                                    .background(selectedMarketCategory == cat ? Color.foodDark : Color.foodGrayBg)
                                    .clipShape(Capsule())
                            }
                        }
                    }
                }

                // Featured Stores
                VStack(alignment: .leading, spacing: 12) {
                    Text("Featured Stores")
                        .font(.system(size: 16, weight: .bold))

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 14) {
                            ForEach(state.marketStores) { store in
                                VStack(alignment: .leading, spacing: 6) {
                                    ZStack(alignment: .topTrailing) {
                                        AsyncImage(url: URL(string: store.imageUrl)) { img in
                                            img.resizable().scaledToFill()
                                        } placeholder: {
                                            Color.foodGrayBg
                                        }
                                        .frame(width: 240, height: 130)
                                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                                        if store.isFreeDelivery {
                                            Text("FREE DELIVERY")
                                                .font(.system(size: 9, weight: .bold))
                                                .foregroundColor(.black)
                                                .padding(.horizontal, 8)
                                                .padding(.vertical, 4)
                                                .background(Color.foodNeonGreen)
                                                .clipShape(Capsule())
                                                .padding(10)
                                        }
                                    }

                                    Text(store.name)
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(Color.foodDark)

                                    HStack {
                                        Text("★ \(String(format: "%.1f", store.rating))")
                                            .font(.caption.bold())
                                            .foregroundColor(Color.foodOrange)
                                        Text("·")
                                        Text(store.category)
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                        Spacer()
                                        Text(store.deliveryTime)
                                            .font(.caption.bold())
                                            .foregroundColor(Color.foodDark)
                                    }
                                }
                                .frame(width: 240)
                            }
                        }
                    }
                }

                // Quick Add Products Shelf
                VStack(alignment: .leading, spacing: 14) {
                    Text("Essential Items & Fresh Picks")
                        .font(.system(size: 16, weight: .bold))

                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                        ForEach(filteredProducts) { prod in
                            VStack(alignment: .leading, spacing: 8) {
                                AsyncImage(url: URL(string: prod.imageUrl)) { img in
                                    img.resizable().scaledToFill()
                                } placeholder: {
                                    Color.foodGrayBg
                                }
                                .frame(height: 110)
                                .frame(maxWidth: .infinity)
                                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                                VStack(alignment: .leading, spacing: 2) {
                                    Text(prod.storeName)
                                        .font(.system(size: 10, weight: .bold))
                                        .foregroundColor(.secondary)
                                    Text(prod.name)
                                        .font(.system(size: 13, weight: .bold))
                                        .lineLimit(1)
                                    Text(prod.unit)
                                        .font(.system(size: 11))
                                        .foregroundColor(.gray)
                                }

                                HStack {
                                    Text("₦\(prod.price)")
                                        .font(.system(size: 14, weight: .black))
                                        .foregroundColor(Color.foodDark)
                                    Spacer()
                                    Button {
                                        state.addStoreProductToBasket(product: prod)
                                    } label: {
                                        Image(systemName: "plus")
                                            .font(.system(size: 12, weight: .bold))
                                            .foregroundColor(.white)
                                            .padding(8)
                                            .background(Color.foodDark)
                                            .clipShape(Circle())
                                    }
                                }
                            }
                            .padding(12)
                            .background(Color.foodGrayBg)
                            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
                        }
                    }
                }

                Color.clear.frame(height: 120)
            }
            .padding(.horizontal, 20)
            .padding(.top, 10)
        }
    }
}

// MARK: - Ai+ Concierge Screen
struct AiConciergeView: View {
    @EnvironmentObject var state: Food101AppState
    @State private var inputPrompt = ""

    let promptPills = [
        "🌶️ Spicy dinner under ₦4,000",
        "⚡ Fastest 15-min delivery",
        "🍰 Sweet dessert crave",
        "🍲 Traditional swallows"
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 4) {
                        Text("Food101")
                            .font(.title2.bold())
                        Text("Ai⁺")
                            .font(.title2.bold())
                            .foregroundColor(Color.foodBlue)
                    }
                    Text("Culinary concierge & instant meal planner")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                Spacer()
                Image(systemName: "sparkles")
                    .font(.title2)
                    .foregroundColor(Color.foodOrange)
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
            .background(Color.systemBg)

            Divider()

            // Chat ScrollView
            ScrollViewReader { proxy in
                ScrollView {
                    VStack(spacing: 16) {
                        // Quick Prompt Chips
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(promptPills, id: \.self) { pill in
                                    Button {
                                        state.sendAiUserPrompt(pill)
                                    } label: {
                                        Text(pill)
                                            .font(.caption.bold())
                                            .foregroundColor(Color.foodDark)
                                            .padding(.horizontal, 14)
                                            .padding(.vertical, 8)
                                            .background(Color.foodGrayBg)
                                            .clipShape(Capsule())
                                    }
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                        .padding(.top, 12)

                        // Message bubbles
                        ForEach(state.aiMessages) { msg in
                            HStack(alignment: .bottom, spacing: 10) {
                                if msg.isUser {
                                    Spacer()
                                    Text(msg.text)
                                        .font(.subheadline)
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 10)
                                        .background(Color.foodDark)
                                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                                } else {
                                    Circle()
                                        .fill(Color.foodNeonGreen)
                                        .frame(width: 32, height: 32)
                                        .overlay(
                                            Image(systemName: "sparkle")
                                                .font(.system(size: 14, weight: .bold))
                                                .foregroundColor(.black)
                                        )

                                    VStack(alignment: .leading, spacing: 10) {
                                        Text(msg.text)
                                            .font(.subheadline)
                                            .foregroundColor(Color.foodDark)
                                            .padding(.horizontal, 16)
                                            .padding(.vertical, 10)
                                            .background(Color.foodGrayBg)
                                            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                                        // Suggested Dish Card
                                        if let dish = msg.suggestedDish {
                                            HStack(spacing: 12) {
                                                AsyncImage(url: URL(string: dish.imageUrl)) { img in
                                                    img.resizable().scaledToFill()
                                                } placeholder: {
                                                    Color.gray
                                                }
                                                .frame(width: 60, height: 60)
                                                .clipShape(RoundedRectangle(cornerRadius: 12))

                                                VStack(alignment: .leading, spacing: 2) {
                                                    Text(dish.name)
                                                        .font(.subheadline.bold())
                                                        .lineLimit(1)
                                                    Text("₦\(dish.price) · \(dish.prepTime)")
                                                        .font(.caption)
                                                        .foregroundColor(.secondary)
                                                }

                                                Spacer()

                                                Button {
                                                    state.selectedDishForCustomization = dish
                                                } label: {
                                                    Text("Add")
                                                        .font(.caption.bold())
                                                        .foregroundColor(.white)
                                                        .padding(.horizontal, 12)
                                                        .padding(.vertical, 6)
                                                        .background(Color.foodDark)
                                                        .clipShape(Capsule())
                                                }
                                            }
                                            .padding(10)
                                            .background(Color.systemBg)
                                            .clipShape(RoundedRectangle(cornerRadius: 16))
                                            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.foodBorder, lineWidth: 1))
                                        }
                                    }
                                    Spacer()
                                }
                            }
                            .id(msg.id)
                            .padding(.horizontal, 20)
                        }

                        Color.clear.frame(height: 120)
                    }
                }
                #if canImport(UIKit)
                .onChange(of: state.aiMessages.count) { _, _ in
                    if let last = state.aiMessages.last {
                        withAnimation {
                            proxy.scrollTo(last.id, anchor: .bottom)
                        }
                    }
                }
                #else
                .onChange(of: state.aiMessages.count) { _ in
                    if let last = state.aiMessages.last {
                        withAnimation {
                            proxy.scrollTo(last.id, anchor: .bottom)
                        }
                    }
                }
                #endif
            }

            // Input Bar
            HStack(spacing: 10) {
                TextField("Ask Chef Ai anything...", text: $inputPrompt)
                    .padding(12)
                    .background(Color.foodGrayBg)
                    .clipShape(Capsule())

                Button {
                    let prompt = inputPrompt
                    inputPrompt = ""
                    state.sendAiUserPrompt(prompt)
                } label: {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 36))
                        .foregroundColor(inputPrompt.isEmpty ? .gray : Color.foodDark)
                }
                .disabled(inputPrompt.isEmpty)
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 8)
            .padding(.bottom, 65)
            .background(Color.systemBg)
        }
    }
}

// MARK: - Account Screen
struct AccountView: View {
    @EnvironmentObject var state: Food101AppState

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(spacing: 20) {
                // Profile Card
                HStack(spacing: 16) {
                    AsyncImage(url: URL(string: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80")) { img in
                        img.resizable().scaledToFill()
                    } placeholder: {
                        Circle().fill(Color.gray.opacity(0.3))
                    }
                    .frame(width: 64, height: 64)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Color.foodBorder, lineWidth: 1))

                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 6) {
                            Text(state.userName)
                                .font(.title3.bold())
                            Text("GOLD")
                                .font(.system(size: 9, weight: .heavy))
                                .foregroundColor(.black)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.foodNeonGreen)
                                .clipShape(Capsule())
                        }
                        Text(state.userPhone)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        Text(state.userEmail)
                            .font(.footnote)
                            .foregroundColor(.secondary)
                    }
                    Spacer()
                }
                .padding(20)
                .background(Color.foodGrayBg)
                .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))

                // Active Order Widget (if present)
                if let order = state.activeOrder {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("ACTIVE ORDER")
                                .font(.caption.bold())
                                .foregroundColor(.secondary)
                            Spacer()
                            Text("ETA: \(order.etaMinutes) mins")
                                .font(.caption.bold())
                                .foregroundColor(Color.foodOrange)
                        }

                        HStack(spacing: 12) {
                            Circle()
                                .fill(Color.foodNeonGreen)
                                .frame(width: 40, height: 40)
                                .overlay(
                                    Image(systemName: "moped.fill")
                                        .foregroundColor(.black)
                                )

                            VStack(alignment: .leading, spacing: 2) {
                                Text(order.restaurantName)
                                    .font(.subheadline.bold())
                                Text("Rider \(order.rider.name) is on the way")
                                    .font(.footnote)
                                    .foregroundColor(.secondary)
                            }
                            Spacer()

                            Button("Track") {
                                state.isTrackingOpen = true
                            }
                            .font(.caption.bold())
                            .foregroundColor(.white)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(Color.foodDark)
                            .clipShape(Capsule())
                        }
                    }
                    .padding(16)
                    .background(Color.foodGrayBg)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                }

                // Delivery Addresses Section
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Text("Saved Addresses")
                            .font(.headline)
                        Spacer()
                        Button("Manage") {
                            state.isAddressPickerOpen = true
                        }
                        .font(.footnote.bold())
                        .foregroundColor(Color.foodDark)
                    }

                    ForEach(state.addresses) { addr in
                        HStack(spacing: 12) {
                            Image(systemName: addr.label == "Home" ? "house.fill" : (addr.label == "Work" ? "briefcase.fill" : "mappin.circle.fill"))
                                .foregroundColor(addr.id == state.currentAddress.id ? Color.foodBlue : .gray)

                            VStack(alignment: .leading, spacing: 2) {
                                HStack {
                                    Text(addr.label)
                                        .font(.subheadline.bold())
                                    if addr.id == state.currentAddress.id {
                                        Text("ACTIVE")
                                            .font(.system(size: 8, weight: .bold))
                                            .foregroundColor(.white)
                                            .padding(.horizontal, 6)
                                            .padding(.vertical, 2)
                                            .background(Color.foodBlue)
                                            .clipShape(Capsule())
                                    }
                                }
                                Text(addr.fullAddress)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            Spacer()
                        }
                        .padding(14)
                        .background(Color.foodGrayBg)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                        .onTapGesture {
                            state.currentAddress = addr
                            #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
                        }
                    }
                }

                // Past Orders Section
                VStack(alignment: .leading, spacing: 10) {
                    Text("Past Orders")
                        .font(.headline)

                    ForEach(state.pastOrders) { order in
                        HStack(spacing: 12) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(order.restaurantName)
                                    .font(.subheadline.bold())
                                Text(order.itemsSummary)
                                    .font(.footnote)
                                    .foregroundColor(.secondary)
                                Text(order.dateString)
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 6) {
                                Text("₦\(order.total)")
                                    .font(.subheadline.bold())
                                Button("Reorder") {
                                    state.addToBasket(dish: order.dish, quantity: 1)
                                    state.isBasketOpen = true
                                }
                                .font(.caption.bold())
                                .foregroundColor(Color.foodDark)
                                .padding(.horizontal, 10)
                                .padding(.vertical, 4)
                                .background(Color.white)
                                .clipShape(Capsule())
                            }
                        }
                        .padding(14)
                        .background(Color.foodGrayBg)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                }

                // Support & Logout
                VStack(spacing: 8) {
                    Button {} label: {
                        HStack {
                            Image(systemName: "questionmark.circle")
                            Text("Help Center & Live Chat")
                            Spacer()
                            Image(systemName: "chevron.right")
                        }
                        .font(.subheadline)
                        .foregroundColor(Color.foodDark)
                        .padding(14)
                        .background(Color.foodGrayBg)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    }

                    Button {} label: {
                        HStack {
                            Image(systemName: "rectangle.portrait.and.arrow.right")
                            Text("Sign Out")
                            Spacer()
                        }
                        .font(.subheadline.bold())
                        .foregroundColor(.red)
                        .padding(14)
                        .background(Color.foodGrayBg)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                }

                Color.clear.frame(height: 120)
            }
            .padding(.horizontal, 20)
            .padding(.top, 10)
        }
    }
}

// MARK: - Floating Bottom Navigation Bar
struct FloatingBottomNav: View {
    @EnvironmentObject var state: Food101AppState

    var body: some View {
        HStack {
            // 1. Home
            Button {
                state.currentTab = .home
                #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
            } label: {
                ZStack {
                    if state.currentTab == .home {
                        Capsule()
                            .fill(Color(hex: "EFEFEF"))
                            .frame(width: 64, height: 42)
                    }
                    Image(systemName: "house.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color.foodDark)
                }
            }

            Spacer()

            // 2. Store / Market
            Button {
                state.currentTab = .store
                #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
            } label: {
                ZStack {
                    if state.currentTab == .store {
                        Capsule()
                            .fill(Color(hex: "EFEFEF"))
                            .frame(width: 64, height: 42)
                    }
                    Image(systemName: "storefront")
                        .font(.system(size: 20))
                        .foregroundColor(state.currentTab == .store ? Color.foodDark : Color.gray)
                }
            }

            Spacer()

            // 3. Ai✦
            Button {
                state.currentTab = .ai
                #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
            } label: {
                ZStack {
                    if state.currentTab == .ai {
                        Capsule()
                            .fill(Color(hex: "EFEFEF"))
                            .frame(width: 64, height: 42)
                    }
                    HStack(spacing: 1) {
                        Text("Ai")
                            .font(.system(size: 19, weight: .bold))
                        Text("+")
                            .font(.system(size: 13, weight: .bold))
                            .offset(y: -4)
                    }
                    .foregroundColor(state.currentTab == .ai ? Color.foodDark : Color.gray)
                }
            }

            Spacer()

            // 4. Account
            Button {
                state.currentTab = .account
                #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
            } label: {
                ZStack {
                    if state.currentTab == .account {
                        Capsule()
                            .fill(Color(hex: "EFEFEF"))
                            .frame(width: 64, height: 42)
                    }
                    Image(systemName: "person.fill")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(state.currentTab == .account ? Color.foodDark : Color.gray)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(
            Capsule()
                .fill(Color.systemBg)
                .shadow(color: .black.opacity(0.12), radius: 16, y: 4)
        )
        .overlay(
            Capsule()
                .stroke(Color.foodBorder, lineWidth: 1)
        )
    }
}

// MARK: - Dish Customizer Sheet (Guaranteed 100% Opaque Background)
struct DishCustomizerSheet: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var state: Food101AppState
    let dish: Dish

    @State private var quantity: Int = 1
    @State private var specialNote: String = ""
    @State private var selectedChoices: [String: OptionChoice] = [:]

    var computedUnitPrice: Int {
        let added = selectedChoices.values.reduce(0) { $0 + $1.priceDelta }
        return dish.price + added
    }

    var totalPrice: Int {
        computedUnitPrice * quantity
    }

    var body: some View {
        VStack(spacing: 0) {
            // Header Bar
            HStack {
                Text("Customize Dish")
                    .font(.title3.bold())
                    .foregroundColor(Color.foodDark)
                Spacer()
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title3)
                        .foregroundColor(.gray.opacity(0.7))
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 12)

            Divider()

            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    // Dish Image
                    AsyncImage(url: URL(string: dish.imageUrl)) { img in
                        img.resizable().scaledToFill()
                    } placeholder: {
                        Color.foodGrayBg
                    }
                    .frame(height: 200)
                    .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))

                    // Title & Description
                    VStack(alignment: .leading, spacing: 6) {
                        Text(dish.restaurantName)
                            .font(.subheadline.bold())
                            .foregroundColor(Color.foodOrange)
                        Text(dish.name)
                            .font(.title2.bold())
                            .foregroundColor(Color.foodDark)
                        Text("₦\(dish.price)")
                            .font(.title3.bold())
                            .foregroundColor(Color.foodDark)
                        Text(dish.description)
                            .font(.callout)
                            .foregroundColor(.secondary)
                            .padding(.top, 2)
                    }

                    // Option Groups
                    if let groups = dish.optionGroups {
                        ForEach(groups) { group in
                            VStack(alignment: .leading, spacing: 10) {
                                HStack {
                                    Text(group.name.uppercased())
                                        .font(.caption.bold())
                                        .foregroundColor(.secondary)
                                    if group.required {
                                        Text("REQUIRED")
                                            .font(.system(size: 8, weight: .bold))
                                            .foregroundColor(.red)
                                            .padding(.horizontal, 6)
                                            .padding(.vertical, 2)
                                            .background(Color.red.opacity(0.1))
                                            .clipShape(Capsule())
                                    }
                                }

                                ForEach(group.choices) { choice in
                                    let isSelected = selectedChoices[group.id]?.id == choice.id
                                    HStack {
                                        Text(choice.name)
                                            .font(.subheadline.bold())
                                            .foregroundColor(Color.foodDark)

                                        Spacer()

                                        if choice.priceDelta > 0 {
                                            Text("+₦\(choice.priceDelta)")
                                                .font(.footnote.bold())
                                                .foregroundColor(.secondary)
                                        }

                                        Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                                            .foregroundColor(isSelected ? Color.foodNeonGreen : .gray)
                                            .font(.title3)
                                    }
                                    .padding(14)
                                    .background(isSelected ? Color.foodGrayBg : Color.systemBg)
                                    .clipShape(RoundedRectangle(cornerRadius: 16))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 16)
                                            .stroke(isSelected ? Color.foodNeonGreen : Color.foodBorder, lineWidth: 1)
                                    )
                                    .onTapGesture {
                                        selectedChoices[group.id] = choice
                                        #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
                                    }
                                }
                            }
                        }
                    }

                    // Kitchen Special Instructions
                    VStack(alignment: .leading, spacing: 8) {
                        Text("SPECIAL INSTRUCTIONS")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)
                        TextField("e.g. Extra spicy, pack sauce separately...", text: $specialNote)
                            .padding(14)
                            .background(Color.foodGrayBg)
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                }
                .padding(20)
            }

            // Sticky Bottom Add Bar
            HStack(spacing: 14) {
                // Stepper
                HStack(spacing: 14) {
                    Button {
                        if quantity > 1 {
                            quantity -= 1
                            #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
                        }
                    } label: {
                        Image(systemName: "minus")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color.foodDark)
                            .frame(width: 32, height: 32)
                            .background(Color.white)
                            .clipShape(Circle())
                    }

                    Text("\(quantity)")
                        .font(.headline.bold())
                        .frame(minWidth: 20)

                    Button {
                        quantity += 1
                        #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
                    } label: {
                        Image(systemName: "plus")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color.foodDark)
                            .frame(width: 32, height: 32)
                            .background(Color.white)
                            .clipShape(Circle())
                    }
                }
                .padding(6)
                .background(Color.foodGrayBg)
                .clipShape(Capsule())

                // Add to basket button
                Button {
                    let customizations = selectedChoices.map { (groupId, choice) in
                        let gName = dish.optionGroups?.first(where: { $0.id == groupId })?.name ?? "Option"
                        return BasketItemCustomization(groupName: gName, choiceName: choice.name, priceDelta: choice.priceDelta)
                    }
                    state.addToBasket(dish: dish, quantity: quantity, customizations: customizations, note: specialNote)
                    dismiss()
                } label: {
                    HStack {
                        Text("Add to Basket")
                        Text("·")
                        Text("₦\(totalPrice)")
                    }
                    .font(.headline.bold())
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.foodDark)
                    .clipShape(Capsule())
                }
            }
            .padding(16)
            .background(Color.systemBg)
            .shadow(color: .black.opacity(0.06), radius: 8, y: -2)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.systemBg)
        .onAppear {
            // Default select required options
            if let groups = dish.optionGroups {
                for g in groups where g.required {
                    if let first = g.choices.first {
                        selectedChoices[g.id] = first
                    }
                }
            }
        }
    }
}

// MARK: - Basket Sheet (Guaranteed 100% Opaque Background)
struct BasketSheet: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var state: Food101AppState
    @State private var promoInput = ""
    @State private var promoFeedback: String? = nil

    var body: some View {
        VStack(spacing: 0) {
            // Header Bar
            HStack {
                Text("Your Basket")
                    .font(.title3.bold())
                    .foregroundColor(Color.foodDark)
                Spacer()
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title3)
                        .foregroundColor(.gray.opacity(0.7))
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 12)

            Divider()

            if state.basketItems.isEmpty {
                VStack(spacing: 16) {
                    Spacer()
                    Image(systemName: "bag")
                        .font(.system(size: 54))
                        .foregroundColor(.gray.opacity(0.6))
                    Text("Your basket is empty")
                        .font(.title3.bold())
                        .foregroundColor(Color.foodDark)
                    Text("Explore delicious entrees, grills and drinks to get started!")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                    Spacer()
                }
            } else {
                ScrollView {
                    VStack(spacing: 16) {
                        // Delivery Address Pill
                        HStack(spacing: 10) {
                            Image(systemName: "mappin.circle.fill")
                                .foregroundColor(Color.foodBlue)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Delivering to \(state.currentAddress.label)")
                                    .font(.caption.bold())
                                Text(state.currentAddress.area)
                                    .font(.footnote)
                                    .foregroundColor(.secondary)
                            }
                            Spacer()
                            Button("Change") {
                                state.isAddressPickerOpen = true
                            }
                            .font(.caption.bold())
                            .foregroundColor(Color.foodDark)
                        }
                        .padding(14)
                        .background(Color.foodGrayBg)
                        .clipShape(RoundedRectangle(cornerRadius: 16))

                        // Items List
                        VStack(spacing: 12) {
                            ForEach(state.basketItems) { item in
                                HStack(spacing: 12) {
                                    AsyncImage(url: URL(string: item.dish.imageUrl)) { img in
                                        img.resizable().scaledToFill()
                                    } placeholder: {
                                        Color.foodGrayBg
                                    }
                                    .frame(width: 58, height: 58)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))

                                    VStack(alignment: .leading, spacing: 3) {
                                        Text(item.dish.name)
                                            .font(.subheadline.bold())
                                            .lineLimit(1)
                                        if !item.customizations.isEmpty {
                                            Text(item.customizations.map(\.choiceName).joined(separator: ", "))
                                                .font(.caption2)
                                                .foregroundColor(.secondary)
                                                .lineLimit(1)
                                        }
                                        Text("₦\(item.itemTotalPrice)")
                                            .font(.footnote.bold())
                                            .foregroundColor(Color.foodDark)
                                    }

                                    Spacer()

                                    // Stepper
                                    HStack(spacing: 10) {
                                        Button {
                                            state.updateBasketQuantity(itemId: item.id, delta: -1)
                                        } label: {
                                            Image(systemName: item.quantity == 1 ? "trash" : "minus")
                                                .font(.system(size: 11, weight: .bold))
                                                .foregroundColor(.black)
                                                .frame(width: 26, height: 26)
                                                .background(Color.white)
                                                .clipShape(Circle())
                                        }

                                        Text("\(item.quantity)")
                                            .font(.subheadline.bold())

                                        Button {
                                            state.updateBasketQuantity(itemId: item.id, delta: 1)
                                        } label: {
                                            Image(systemName: "plus")
                                                .font(.system(size: 11, weight: .bold))
                                                .foregroundColor(.black)
                                                .frame(width: 26, height: 26)
                                                .background(Color.white)
                                                .clipShape(Circle())
                                        }
                                    }
                                    .padding(4)
                                    .background(Color.foodGrayBg)
                                    .clipShape(Capsule())
                                }
                                .padding(12)
                                .background(Color.foodGrayBg.opacity(0.6))
                                .clipShape(RoundedRectangle(cornerRadius: 18))
                            }
                        }

                        // Promo Code Box
                        VStack(alignment: .leading, spacing: 6) {
                            HStack {
                                TextField("Enter promo code (e.g. FOOD101)", text: $promoInput)
                                    #if canImport(UIKit)
                                    .textInputAutocapitalization(.characters)
                                    #endif
                                    .font(.subheadline)
                                    .padding(10)
                                    .background(Color.foodGrayBg)
                                    .clipShape(Capsule())

                                Button("Apply") {
                                    let result = state.applyPromo(code: promoInput)
                                    promoFeedback = result.message
                                }
                                .font(.subheadline.bold())
                                .foregroundColor(.white)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 10)
                                .background(Color.foodDark)
                                .clipShape(Capsule())
                            }

                            if let feedback = promoFeedback {
                                Text(feedback)
                                    .font(.caption)
                                    .foregroundColor(state.appliedDiscount > 0 ? Color.green : Color.red)
                                    .padding(.horizontal, 6)
                            }
                        }

                        // Order Breakdown Card
                        VStack(spacing: 8) {
                            HStack {
                                Text("Subtotal").foregroundColor(.secondary)
                                Spacer()
                                Text("₦\(state.basketSubtotal)").bold()
                            }
                            HStack {
                                Text("Delivery fee").foregroundColor(.secondary)
                                Spacer()
                                Text("₦\(state.basketDeliveryFee)").bold()
                            }
                            HStack {
                                Text("Service fee").foregroundColor(.secondary)
                                Spacer()
                                Text("₦\(state.basketServiceFee)").bold()
                            }
                            if state.appliedDiscount > 0 {
                                HStack {
                                    Text("Promo Discount (FOOD101)").foregroundColor(.green)
                                    Spacer()
                                    Text("-₦\(state.appliedDiscount)").bold().foregroundColor(.green)
                                }
                            }
                            Divider()
                            HStack {
                                Text("Total").font(.headline)
                                Spacer()
                                Text("₦\(state.basketTotal)").font(.headline)
                            }
                        }
                        .font(.footnote)
                        .padding(16)
                        .background(Color.foodGrayBg)
                        .clipShape(RoundedRectangle(cornerRadius: 20))
                    }
                    .padding(20)
                }

                // Proceed Button
                Button {
                    dismiss()
                    state.isCheckoutOpen = true
                } label: {
                    HStack {
                        Text("Proceed to Checkout")
                        Spacer()
                        Text("₦\(state.basketTotal)")
                    }
                    .font(.headline.bold())
                    .foregroundColor(.white)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 15)
                    .background(Color.foodDark)
                    .clipShape(Capsule())
                    .padding(.horizontal, 20)
                    .padding(.vertical, 12)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.systemBg)
    }
}

// MARK: - Checkout Sheet (Guaranteed 100% Opaque Background)
struct CheckoutSheet: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var state: Food101AppState
    @State private var selectedPayment = "Apple Pay"
    @State private var deliveryNote = "Call me when downstairs"
    @State private var includeCutlery = false

    let paymentOptions = [
        ("Apple Pay", "applelogo"),
        ("Debit Card (•••• 4242)", "creditcard.fill"),
        ("Bank Transfer", "building.columns.fill"),
        ("Cash on Delivery", "banknote.fill")
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Header Bar
            HStack {
                Text("Checkout")
                    .font(.title3.bold())
                    .foregroundColor(Color.foodDark)
                Spacer()
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title3)
                        .foregroundColor(.gray.opacity(0.7))
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 12)

            Divider()

            ScrollView {
                VStack(spacing: 18) {
                    // Delivery Address Card
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text("DELIVER TO")
                                .font(.caption.bold())
                                .foregroundColor(.secondary)
                            Spacer()
                            Button("Change") {
                                state.isAddressPickerOpen = true
                            }
                            .font(.caption.bold())
                            .foregroundColor(Color.foodDark)
                        }

                        HStack(spacing: 12) {
                            Image(systemName: "mappin.circle.fill")
                                .font(.title2)
                                .foregroundColor(Color.foodBlue)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("\(state.currentAddress.label) · \(state.currentAddress.area)")
                                    .font(.subheadline.bold())
                                Text(state.currentAddress.fullAddress)
                                    .font(.footnote)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(16)
                    .background(Color.foodGrayBg)
                    .clipShape(RoundedRectangle(cornerRadius: 20))

                    // Rider Delivery Note
                    VStack(alignment: .leading, spacing: 6) {
                        Text("RIDER INSTRUCTIONS")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)
                        TextField("e.g. Leave with building security...", text: $deliveryNote)
                            .padding(12)
                            .background(Color.foodGrayBg)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                    }

                    // Cutlery Toggle
                    Toggle(isOn: $includeCutlery) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Include Cutlery & Napkins")
                                .font(.subheadline.bold())
                            Text("Help reduce waste if you have dining utensils")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(14)
                    .background(Color.foodGrayBg)
                    .clipShape(RoundedRectangle(cornerRadius: 16))

                    // Payment Method Options
                    VStack(alignment: .leading, spacing: 10) {
                        Text("PAYMENT METHOD")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)

                        ForEach(paymentOptions, id: \.0) { option in
                            let isSelected = selectedPayment == option.0
                            HStack(spacing: 12) {
                                Image(systemName: option.1)
                                    .foregroundColor(isSelected ? Color.foodDark : .gray)
                                    .frame(width: 24)

                                Text(option.0)
                                    .font(.subheadline.bold())

                                Spacer()

                                if isSelected {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(Color.foodNeonGreen)
                                } else {
                                    Image(systemName: "circle")
                                        .foregroundColor(.gray.opacity(0.5))
                                }
                            }
                            .padding(14)
                            .background(Color.foodGrayBg)
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                            .onTapGesture {
                                selectedPayment = option.0
                                #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
                            }
                        }
                    }

                    // Order Summary
                    VStack(spacing: 8) {
                        HStack {
                            Text("Final Total")
                                .font(.headline)
                            Spacer()
                            Text("₦\(state.basketTotal)")
                                .font(.title3.bold())
                                .foregroundColor(Color.foodDark)
                        }
                    }
                    .padding(16)
                    .background(Color.foodGrayBg)
                    .clipShape(RoundedRectangle(cornerRadius: 18))
                }
                .padding(20)
            }

            // Pay & Place Order Button
            Button {
                state.placeOrder(paymentMethod: selectedPayment, note: deliveryNote)
                dismiss()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    state.isTrackingOpen = true
                }
            } label: {
                Text("Pay & Place Order · ₦\(state.basketTotal)")
                    .font(.headline.bold())
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 15)
                    .background(Color.foodDark)
                    .clipShape(Capsule())
                    .padding(.horizontal, 20)
                    .padding(.vertical, 12)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.systemBg)
    }
}

// MARK: - Live Tracking Sheet (Guaranteed 100% Opaque Background)
struct LiveTrackingSheet: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var state: Food101AppState

    var body: some View {
        VStack(spacing: 0) {
            // Header Bar
            HStack {
                Text("Live Tracking")
                    .font(.title3.bold())
                    .foregroundColor(Color.foodDark)
                Spacer()
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title3)
                        .foregroundColor(.gray.opacity(0.7))
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 12)

            Divider()

            ScrollView {
                VStack(spacing: 16) {
                    // Vector Map
                    LiveVectorMap()
                        .frame(height: 220)
                        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))

                    // Green ETA Card
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("ACTIVE DELIVERY")
                                .font(.caption.bold())
                                .foregroundColor(.black.opacity(0.7))
                            Text("Rider is on the way")
                                .font(.headline.bold())
                                .foregroundColor(.black)
                        }
                        Spacer()
                        Text("4 min")
                            .font(.system(size: 28, weight: .black))
                            .foregroundColor(.black)
                    }
                    .padding(18)
                    .background(Color.foodNeonGreen)
                    .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))

                    // Order Progress Stepper
                    VStack(alignment: .leading, spacing: 12) {
                        Text("ORDER STATUS")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)

                        HStack(spacing: 0) {
                            StatusStepView(title: "Confirmed", isCompleted: true, isCurrent: false)
                            StatusDividerView(isCompleted: true)
                            StatusStepView(title: "Preparing", isCompleted: true, isCurrent: false)
                            StatusDividerView(isCompleted: true)
                            StatusStepView(title: "On the way", isCompleted: true, isCurrent: true)
                            StatusDividerView(isCompleted: false)
                            StatusStepView(title: "Delivered", isCompleted: false, isCurrent: false)
                        }
                    }
                    .padding(16)
                    .background(Color.foodGrayBg)
                    .clipShape(RoundedRectangle(cornerRadius: 20))

                    // Rider Info
                    if let rider = state.activeOrder?.rider {
                        HStack(spacing: 12) {
                            Circle()
                                .fill(Color.foodDark)
                                .frame(width: 48, height: 48)
                                .overlay(
                                    Text(String(rider.name.prefix(1)))
                                        .font(.headline.bold())
                                        .foregroundColor(.white)
                                )

                            VStack(alignment: .leading, spacing: 2) {
                                HStack(spacing: 4) {
                                    Text(rider.name)
                                        .font(.subheadline.bold())
                                    Text("★ \(String(format: "%.1f", rider.rating))")
                                        .font(.caption.bold())
                                        .foregroundColor(Color.foodOrange)
                                }
                                Text(rider.vehicle)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }

                            Spacer()

                            HStack(spacing: 8) {
                                Button {
                                    if let url = URL(string: "tel://\(rider.phone)") {
                                        #if canImport(UIKit)
                                        UIApplication.shared.open(url)
                                        #elseif canImport(AppKit)
                                        NSWorkspace.shared.open(url)
                                        #endif
                                    }
                                } label: {
                                    Image(systemName: "phone.fill")
                                        .foregroundColor(Color.foodDark)
                                        .padding(10)
                                        .background(Color.white)
                                        .clipShape(Circle())
                                }

                                Button {
                                    if let url = URL(string: "sms://\(rider.phone)") {
                                        #if canImport(UIKit)
                                        UIApplication.shared.open(url)
                                        #elseif canImport(AppKit)
                                        NSWorkspace.shared.open(url)
                                        #endif
                                    }
                                } label: {
                                    Image(systemName: "message.fill")
                                        .foregroundColor(Color.foodDark)
                                        .padding(10)
                                        .background(Color.white)
                                        .clipShape(Circle())
                                }
                            }
                        }
                        .padding(16)
                        .background(Color.foodGrayBg)
                        .clipShape(RoundedRectangle(cornerRadius: 20))
                    }

                    // Delivery Details Card
                    if let order = state.activeOrder {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("DELIVERY DESTINATION")
                                .font(.caption.bold())
                                .foregroundColor(.secondary)
                            Text(order.deliveryAddress.fullAddress)
                                .font(.subheadline.bold())
                            Text("Order ID: \(order.id)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(16)
                        .background(Color.foodGrayBg)
                        .clipShape(RoundedRectangle(cornerRadius: 20))
                    }
                }
                .padding(20)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.systemBg)
    }
}

struct StatusStepView: View {
    let title: String
    let isCompleted: Bool
    let isCurrent: Bool

    var body: some View {
        VStack(spacing: 4) {
            Circle()
                .fill(isCurrent ? Color.foodNeonGreen : (isCompleted ? Color.foodDark : Color.gray.opacity(0.3)))
                .frame(width: 14, height: 14)
                .overlay(
                    Group {
                        if isCompleted && !isCurrent {
                            Image(systemName: "checkmark")
                                .font(.system(size: 8, weight: .bold))
                                .foregroundColor(.white)
                        }
                    }
                )

            Text(title)
                .font(.system(size: 9, weight: isCurrent ? .bold : .regular))
                .foregroundColor(isCurrent ? Color.foodDark : .secondary)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity)
    }
}

struct StatusDividerView: View {
    let isCompleted: Bool

    var body: some View {
        Rectangle()
            .fill(isCompleted ? Color.foodDark : Color.gray.opacity(0.3))
            .frame(height: 2)
            .offset(y: -8)
    }
}

// MARK: - Search Sheet (Guaranteed 100% Opaque Background)
struct SearchSheet: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var state: Food101AppState
    @State private var query = ""

    var searchResults: [Dish] {
        if query.trimmingCharacters(in: .whitespaces).isEmpty {
            return []
        }
        return state.dishes.filter {
            $0.name.localizedCaseInsensitiveContains(query) ||
            $0.restaurantName.localizedCaseInsensitiveContains(query) ||
            $0.category.localizedCaseInsensitiveContains(query)
        }
    }

    var body: some View {
        VStack(spacing: 14) {
            // Header Search Input
            HStack(spacing: 12) {
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    TextField("Search dishes, restaurants...", text: $query)
                    if !query.isEmpty {
                        Button {
                            query = ""
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.gray)
                        }
                    }
                }
                .padding(12)
                .background(Color.foodGrayBg)
                .clipShape(Capsule())

                Button("Done") {
                    dismiss()
                }
                .font(.subheadline.bold())
                .foregroundColor(Color.foodDark)
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)

            Divider()

            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    if searchResults.isEmpty && !query.isEmpty {
                        VStack(spacing: 8) {
                            Text("No dishes found matching '\(query)'")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.top, 30)
                    } else if !searchResults.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("SEARCH RESULTS")
                                .font(.caption.bold())
                                .foregroundColor(.secondary)

                            ForEach(searchResults) { dish in
                                HStack(spacing: 12) {
                                    AsyncImage(url: URL(string: dish.imageUrl)) { img in
                                        img.resizable().scaledToFill()
                                    } placeholder: {
                                        Color.foodGrayBg
                                    }
                                    .frame(width: 60, height: 60)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))

                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(dish.name)
                                            .font(.subheadline.bold())
                                        Text(dish.restaurantName)
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                        Text("₦\(dish.price)")
                                            .font(.footnote.bold())
                                            .foregroundColor(Color.foodDark)
                                    }

                                    Spacer()

                                    Button {
                                        dismiss()
                                        state.selectedDishForCustomization = dish
                                    } label: {
                                        Text("Customize")
                                            .font(.caption.bold())
                                            .foregroundColor(.white)
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 6)
                                            .background(Color.foodDark)
                                            .clipShape(Capsule())
                                    }
                                }
                                .padding(12)
                                .background(Color.foodGrayBg)
                                .clipShape(RoundedRectangle(cornerRadius: 18))
                            }
                        }
                    }

                    // Popular Searches
                    VStack(alignment: .leading, spacing: 12) {
                        Text("POPULAR SEARCHES")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)

                        ForEach(["Jollof & Chicken", "Amala & Ewedu", "Suya Platter", "Puff Puff Box", "Sticky Toffee"], id: \.self) { term in
                            Button {
                                query = term
                            } label: {
                                HStack {
                                    Image(systemName: "arrow.up.left")
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                    Text(term)
                                        .font(.subheadline)
                                        .foregroundColor(Color.foodDark)
                                    Spacer()
                                }
                                .padding(.horizontal, 14)
                                .padding(.vertical, 10)
                                .background(Color.foodGrayBg)
                                .clipShape(Capsule())
                            }
                        }
                    }
                }
                .padding(20)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.systemBg)
    }
}

// MARK: - Address Picker Sheet (Guaranteed 100% Opaque Background)
struct AddressPickerSheet: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var state: Food101AppState

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Text("Select Delivery Address")
                    .font(.title3.bold())
                    .foregroundColor(Color.foodDark)
                Spacer()
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title3)
                        .foregroundColor(.gray.opacity(0.7))
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 12)

            Divider()

            VStack(spacing: 12) {
                ForEach(state.addresses) { addr in
                    let isSelected = addr.id == state.currentAddress.id
                    HStack(spacing: 12) {
                        Image(systemName: addr.label == "Home" ? "house.fill" : (addr.label == "Work" ? "briefcase.fill" : "mappin.circle.fill"))
                            .foregroundColor(isSelected ? Color.foodBlue : .gray)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(addr.label)
                                .font(.subheadline.bold())
                            Text(addr.fullAddress)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }

                        Spacer()

                        if isSelected {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(Color.foodNeonGreen)
                        }
                    }
                    .padding(14)
                    .background(Color.foodGrayBg)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .onTapGesture {
                        state.currentAddress = addr
                        #if canImport(UIKit)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
                        dismiss()
                    }
                }

                Button {
                    dismiss()
                } label: {
                    HStack {
                        Image(systemName: "plus")
                        Text("Add New Delivery Address")
                    }
                    .font(.subheadline.bold())
                    .foregroundColor(Color.foodDark)
                    .padding(.vertical, 12)
                }
            }
            .padding(20)

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.systemBg)
    }
}

// MARK: - Preview
#Preview {
    ContentView()
}


@main
struct Food101App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
