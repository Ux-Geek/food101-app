import SwiftUI

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

// MARK: - App State
final class Food101AppState: ObservableObject {
    @Published var userName: String = "Yu"
    @Published var userPhone: String = "+234 801 234 5678"
    @Published var isGuest: Bool = false

    @Published var currentTab: Tab = .home
    @Published var selectedDishForCustomization: Dish? = nil
    @Published var isBasketOpen: Bool = false
    @Published var isCheckoutOpen: Bool = false
    @Published var isTrackingOpen: Bool = false
    @Published var isSearchOpen: Bool = false
    @Published var isAccountOpen: Bool = false

    @Published var basketItems: [BasketItem] = []
    @Published var currentAddress: Address = Address(
        id: "addr-1",
        label: "Home",
        area: "Lekki Phase 1, Lagos",
        fullAddress: "14 Admiralty Way, Lekki Phase 1, Lagos"
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
    var basketTotal: Int {
        basketItems.isEmpty ? 0 : basketSubtotal + 700 + 200
    }

    enum Tab {
        case home, store, ai, account
    }

    // Mock Dishes strictly matching screenshot
    @Published var dishes: [Dish] = [
        Dish(
            id: "d1",
            restaurantId: "r1",
            restaurantName: "Iya Wale Swallows",
            name: "Jollof & Grilled Chicken",
            description: "Smoky firewood jollof rice served with seasoned grilled quarter chicken and plantain.",
            price: 2300,
            imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80",
            category: "rice",
            prepTime: "12mins",
            rating: 4.7,
            reviewCount: 324,
            isPopular: true,
            optionGroups: [
                OptionGroup(
                    id: "p",
                    name: "Portion Size",
                    required: true,
                    choices: [
                        OptionChoice(id: "p1", name: "Regular", priceDelta: 0),
                        OptionChoice(id: "p2", name: "Large", priceDelta: 1000)
                    ]
                )
            ]
        ),
        Dish(
            id: "d2",
            restaurantId: "r4",
            restaurantName: "Treat's Right",
            name: "Sticky Toffee Pudding & Ice Cream",
            description: "Warm rich toffee pudding cake drenched in sticky butter caramel and crowned with vanilla ice cream.",
            price: 2300,
            imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
            category: "dessert",
            prepTime: "12mins",
            rating: 4.8,
            reviewCount: 192,
            isPopular: true,
            optionGroups: nil
        ),
        Dish(
            id: "d3",
            restaurantId: "r2",
            restaurantName: "Suya Central",
            name: "Signature Beef Suya Platter",
            description: "Thinly sliced flame-grilled beef rubbed in authentic spicy yaji nut powder.",
            price: 3200,
            imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
            category: "grill",
            prepTime: "15mins",
            rating: 4.9,
            reviewCount: 410,
            isPopular: true,
            optionGroups: nil
        )
    ]

    @Published var popularOrders: [(id: String, name: String, price: Int, img: String)] = [
        ("po-1", "Big Rice &\nChicken", 3500, "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=300&q=80"),
        ("po-2", "Big Rice &\nChicken", 3500, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80"),
        ("po-3", "Big Rice &\nChicken", 3500, "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80"),
        ("po-4", "Big Rice &\nChicken", 3500, "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=300&q=80"),
        ("po-5", "Big Rice &\nChicken", 3500, "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80")
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
            // Street 1
            var road1 = Path()
            road1.move(to: CGPoint(x: -10, y: 40))
            road1.addLine(to: CGPoint(x: size.width + 10, y: 36))
            context.stroke(road1, with: .color(.white), lineWidth: 14)

            // Street 2
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
            // Street text labels matching screenshot
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
                    Text("територія...")
                        .font(.system(size: 8, weight: .semibold))
                    Text("підрозділ ЦНАП")
                        .font(.system(size: 7, weight: .regular))
                    Text("Local government")
                        .font(.system(size: 7, weight: .regular))
                        .foregroundColor(.gray)
                }
                .foregroundColor(Color.gray)
                .position(x: 320, y: 35)

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
            Color.white.ignoresSafeArea()

            // Main Scrollable Area
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 24) {
                    // 1. Top Header
                    HeaderView()

                    // 2. Live Tracking Map Card (Exact corner radius 28px)
                    LiveTrackingCardView()
                        .onTapGesture {
                            appState.isTrackingOpen = true
                        }

                    // 3. Banner Carousel (Exact corner radius 24px)
                    BannerCarouselView()

                    // 4. "Desserts, Entrees, Beverages etc" Section
                    FoodItemsSectionView()

                    // 5. "Popular Orders" Section with Circles & 3500 Badges
                    PopularOrdersSectionView()

                    // Bottom padding for floating nav bar
                    Color.clear.frame(height: 90)
                }
                .padding(.horizontal, 20)
                .padding(.top, 8)
            }

            // Floating 4-Tab Bottom Navigation Bar (Pill shaped Capsule)
            FloatingBottomNav()
                .padding(.horizontal, 20)
                .padding(.bottom, 12)
        }
        .environmentObject(appState)
        // Sheets
        .sheet(item: $appState.selectedDishForCustomization) { dish in
            DishCustomizerSheet(dish: dish)
        }
        .sheet(isPresented: $appState.isBasketOpen) {
            BasketSheet()
        }
        .sheet(isPresented: $appState.isCheckoutOpen) {
            CheckoutSheet()
        }
        .sheet(isPresented: $appState.isTrackingOpen) {
            LiveTrackingSheet()
        }
        .sheet(isPresented: $appState.isSearchOpen) {
            SearchSheet()
        }
    }
}

// MARK: - Header View
struct HeaderView: View {
    @EnvironmentObject var state: Food101AppState

    var body: some View {
        HStack(spacing: 12) {
            // Left: Avatar + Greeting
            HStack(spacing: 8) {
                AsyncImage(url: URL(string: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80")) { img in
                    img.resizable().scaledToFill()
                } placeholder: {
                    Circle().fill(Color.gray.opacity(0.3))
                }
                .frame(width: 40, height: 40)
                .clipShape(Circle())

                Text("Hi, \(state.userName)")
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundColor(Color.foodDark)
            }

            // Middle: Search Pill Bar
            Button {
                state.isSearchOpen = true
            } label: {
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 15, weight: .regular))
                        .foregroundColor(Color.gray)
                    Text("Search")
                        .font(.system(size: 15, weight: .regular))
                        .foregroundColor(Color.gray)
                    Spacer()
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 9)
                .background(Color.foodGrayBg)
                .clipShape(Capsule())
            }

            // Right: Basket Button with Badge
            Button {
                state.isBasketOpen = true
            } label: {
                ZStack(alignment: .topTrailing) {
                    Circle()
                        .fill(Color.foodGrayBg)
                        .frame(width: 40, height: 40)
                    Image(systemName: "bag")
                        .font(.system(size: 17, weight: .medium))
                        .foregroundColor(Color.foodDark)

                    if !state.basketItems.isEmpty {
                        Text("\(state.basketItems.reduce(0, { $0 + $1.quantity }))")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.black)
                            .padding(4)
                            .background(Color.foodNeonGreen)
                            .clipShape(Circle())
                            .offset(x: 4, y: -4)
                    }
                }
            }
        }
    }
}

// MARK: - Live Tracking Map Card View
struct LiveTrackingCardView: View {
    var body: some View {
        VStack(spacing: 0) {
            // Top Map Area
            LiveVectorMap()
                .frame(height: 165)

            // Bottom Green Status Bar
            HStack {
                Text("-4min")
                    .font(.system(size: 20, weight: .black))
                    .foregroundColor(.black)

                Spacer()

                Text("Currently at Challenge..")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.black.opacity(0.85))
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
        .shadow(color: .black.opacity(0.03), radius: 8, y: 3)
    }
}

// MARK: - Banner Carousel View
struct BannerCarouselView: View {
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ZStack {
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .fill(Color.foodBannerBg)
                        .frame(width: 295, height: 135)

                    Text("Banner")
                        .font(.system(size: 32, weight: .regular))
                        .foregroundColor(Color.foodDark)
                }

                ZStack {
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .fill(Color.foodBannerBg)
                        .frame(width: 295, height: 135)

                    Text("Banner")
                        .font(.system(size: 32, weight: .regular))
                        .foregroundColor(Color.foodDark.opacity(0.35))
                }
            }
        }
    }
}

// MARK: - Desserts & Entrees Section
struct FoodItemsSectionView: View {
    @EnvironmentObject var state: Food101AppState

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Section Title
            HStack {
                Text("Desserts, Entrees, Beverages etc")
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(hex: "1F2937"))
                Spacer()
                Button("See All") {}
                    .font(.system(size: 13, weight: .regular))
                    .foregroundColor(Color(hex: "8E8E93"))
            }

            // Horizontal Carousel
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 14) {
                    ForEach(state.dishes) { dish in
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
        VStack(alignment: .leading, spacing: 6) {
            // Food Image with 22px Corner Radius & Rating Badge
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: dish.imageUrl)) { img in
                    img.resizable().scaledToFill()
                } placeholder: {
                    Color.foodGrayBg
                }
                .frame(width: 220, height: 145)
                .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))

                // Rating Pill Badge (4.7 ★ (324))
                HStack(spacing: 2) {
                    Text(String(format: "%.1f", dish.rating))
                        .font(.system(size: 11, weight: .bold))
                    Image(systemName: "star.fill")
                        .font(.system(size: 9))
                        .foregroundColor(Color(hex: "F59E0B"))
                    Text("(\(dish.reviewCount))")
                        .font(.system(size: 11, weight: .regular))
                        .foregroundColor(Color.gray)
                }
                .foregroundColor(.black)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color.white.opacity(0.95))
                .clipShape(Capsule())
                .shadow(color: .black.opacity(0.08), radius: 3, y: 1)
                .padding(10)
            }

            // Title
            Text(dish.restaurantName)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "171717"))
                .lineLimit(1)

            // Info Row: Orange clock + 12mins, and @ 2300
            HStack {
                HStack(spacing: 3) {
                    Image(systemName: "clock")
                        .font(.system(size: 11))
                        .foregroundColor(Color.foodOrange)
                    Text(dish.prepTime)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color.foodOrange)
                }

                Spacer()

                Text("@ \(dish.price)")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(Color(hex: "171717"))
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
            // Header
            HStack {
                Text("Popular Orders")
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(hex: "1F2937"))
                Spacer()
                Button("See All") {}
                    .font(.system(size: 13, weight: .regular))
                    .foregroundColor(Color(hex: "8E8E93"))
            }

            // Circular Dishes with 3500 Pill Badges
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(state.popularOrders, id: \.id) { item in
                        VStack(spacing: 6) {
                            ZStack(alignment: .topTrailing) {
                                AsyncImage(url: URL(string: item.img)) { img in
                                    img.resizable().scaledToFill()
                                } placeholder: {
                                    Color(hex: "B92A11")
                                }
                                .frame(width: 74, height: 74)
                                .clipShape(Circle())
                                .shadow(color: .black.opacity(0.05), radius: 3, y: 2)

                                // Overlapping White Pill Badge: 3500
                                Text("\(item.price)")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.black)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color.white)
                                    .clipShape(Capsule())
                                    .shadow(color: .black.opacity(0.12), radius: 2, y: 1)
                                    .offset(x: 4, y: -2)
                            }

                            Text(item.name)
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(Color(hex: "2D2D2D"))
                                .multilineTextAlignment(.center)
                                .lineLimit(2)
                                .frame(width: 78)
                        }
                        .onTapGesture {
                            if let first = state.dishes.first {
                                state.selectedDishForCustomization = first
                            }
                        }
                    }
                }
                .padding(.vertical, 4)
            }
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
                state.isAccountOpen = true
            } label: {
                ZStack {
                    if state.currentTab == .account {
                        Capsule()
                            .fill(Color(hex: "EFEFEF"))
                            .frame(width: 64, height: 42)
                    }
                    Image(systemName: "person")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(state.currentTab == .account ? Color.foodDark : Color.gray)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(
            Capsule()
                .fill(Color.white.opacity(0.98))
                .shadow(color: .black.opacity(0.08), radius: 16, y: 4)
        )
        .overlay(
            Capsule()
                .stroke(Color.foodBorder, lineWidth: 1)
        )
    }
}

// MARK: - Dish Customizer Sheet
struct DishCustomizerSheet: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var state: Food101AppState
    let dish: Dish
    @State private var quantity: Int = 1
    @State private var specialNote: String = ""

    var body: some View {
        VStack(spacing: 0) {
            // Drag Indicator
            Capsule()
                .fill(Color.gray.opacity(0.3))
                .frame(width: 36, height: 5)
                .padding(.top, 10)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // Hero Image
                    AsyncImage(url: URL(string: dish.imageUrl)) { img in
                        img.resizable().scaledToFill()
                    } placeholder: {
                        Color.foodGrayBg
                    }
                    .frame(height: 190)
                    .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))

                    // Title & Price
                    VStack(alignment: .leading, spacing: 4) {
                        Text(dish.restaurantName)
                            .font(.subheadline)
                            .foregroundColor(.gray)
                        Text(dish.name)
                            .font(.title3.bold())
                        Text("₦\(dish.price)")
                            .font(.title2.bold())
                            .foregroundColor(Color.foodDark)
                        Text(dish.description)
                            .font(.callout)
                            .foregroundColor(.secondary)
                            .padding(.top, 2)
                    }

                    // Special Instructions
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Kitchen instructions")
                            .font(.footnote.bold())
                        TextField("e.g. Extra spicy, pack stew separately", text: $specialNote)
                            .padding(12)
                            .background(Color.foodGrayBg)
                            .clipShape(Capsule())
                    }
                    .padding(.top, 6)
                }
                .padding(20)
            }

            // Bottom Add to Basket Bar
            HStack(spacing: 14) {
                // Stepper
                HStack(spacing: 12) {
                    Button {
                        if quantity > 1 { quantity -= 1 }
                    } label: {
                        Image(systemName: "minus")
                            .frame(width: 32, height: 32)
                            .background(Color.white)
                            .clipShape(Circle())
                    }

                    Text("\(quantity)")
                        .font(.headline)
                        .frame(minWidth: 20)

                    Button {
                        quantity += 1
                    } label: {
                        Image(systemName: "plus")
                            .frame(width: 32, height: 32)
                            .background(Color.white)
                            .clipShape(Circle())
                    }
                }
                .padding(4)
                .background(Color.foodGrayBg)
                .clipShape(Capsule())

                // Add Button
                Button {
                    state.addToBasket(dish: dish, quantity: quantity, note: specialNote)
                    dismiss()
                } label: {
                    HStack {
                        Text("Add to basket")
                        Text("·")
                        Text("₦\(dish.price * quantity)")
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.foodDark)
                    .clipShape(Capsule())
                }
            }
            .padding(16)
            .background(Color.white)
            .shadow(color: .black.opacity(0.05), radius: 6, y: -2)
        }
        .presentationDetents([.fraction(0.85)])
        .sheetCornerRadius(28)
    }
}

// MARK: - Basket Sheet
struct BasketSheet: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var state: Food101AppState

    var body: some View {
        VStack(spacing: 0) {
            Capsule()
                .fill(Color.gray.opacity(0.3))
                .frame(width: 36, height: 5)
                .padding(.top, 10)
                .padding(.bottom, 12)

            HStack {
                Text("Your Basket")
                    .font(.title3.bold())
                Spacer()
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 14, weight: .bold))
                        .padding(8)
                        .background(Color.foodGrayBg)
                        .clipShape(Circle())
                        .foregroundColor(.black)
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 10)

            if state.basketItems.isEmpty {
                VStack(spacing: 12) {
                    Spacer()
                    Image(systemName: "bag")
                        .font(.system(size: 44))
                        .foregroundColor(.gray)
                    Text("Your basket is empty")
                        .font(.headline)
                    Text("Explore dishes to add delicious items")
                        .font(.footnote)
                        .foregroundColor(.secondary)
                    Spacer()
                }
            } else {
                ScrollView {
                    VStack(spacing: 12) {
                        ForEach(state.basketItems) { item in
                            HStack(spacing: 12) {
                                AsyncImage(url: URL(string: item.dish.imageUrl)) { img in
                                    img.resizable().scaledToFill()
                                } placeholder: {
                                    Color.foodGrayBg
                                }
                                .frame(width: 54, height: 54)
                                .clipShape(RoundedRectangle(cornerRadius: 14))

                                VStack(alignment: .leading, spacing: 2) {
                                    Text(item.dish.name)
                                        .font(.subheadline.bold())
                                    Text("₦\(item.itemTotalPrice)")
                                        .font(.footnote.bold())
                                        .foregroundColor(Color.foodDark)
                                }

                                Spacer()

                                Text("\(item.quantity)x")
                                    .font(.subheadline.bold())
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 4)
                                    .background(Color.foodGrayBg)
                                    .clipShape(Capsule())
                            }
                            .padding(12)
                            .background(Color.foodGrayBg.opacity(0.6))
                            .clipShape(RoundedRectangle(cornerRadius: 20))
                        }

                        // Breakdown
                        VStack(spacing: 8) {
                            HStack {
                                Text("Subtotal").foregroundColor(.secondary)
                                Spacer()
                                Text("₦\(state.basketSubtotal)").bold()
                            }
                            HStack {
                                Text("Delivery fee").foregroundColor(.secondary)
                                Spacer()
                                Text("₦700").bold()
                            }
                            HStack {
                                Text("Service fee").foregroundColor(.secondary)
                                Spacer()
                                Text("₦200").bold()
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

                Button {
                    dismiss()
                    state.isCheckoutOpen = true
                } label: {
                    HStack {
                        Text("Continue to checkout")
                        Spacer()
                        Text("₦\(state.basketTotal)")
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 14)
                    .background(Color.foodDark)
                    .clipShape(Capsule())
                    .padding(16)
                }
            }
        }
        .presentationDetents([.fraction(0.8)])
        .sheetCornerRadius(28)
    }
}

// MARK: - Checkout Sheet
struct CheckoutSheet: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var state: Food101AppState
    @State private var selectedPayment = "card"

    var body: some View {
        VStack(spacing: 0) {
            Capsule()
                .fill(Color.gray.opacity(0.3))
                .frame(width: 36, height: 5)
                .padding(.top, 10)
                .padding(.bottom, 12)

            HStack {
                Text("Checkout")
                    .font(.title3.bold())
                Spacer()
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 14, weight: .bold))
                        .padding(8)
                        .background(Color.foodGrayBg)
                        .clipShape(Circle())
                        .foregroundColor(.black)
                }
            }
            .padding(.horizontal, 20)

            ScrollView {
                VStack(spacing: 16) {
                    // Deliver to card
                    VStack(alignment: .leading, spacing: 6) {
                        Text("DELIVER TO")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)
                        Text(state.currentAddress.label + " · " + state.currentAddress.area)
                            .font(.subheadline.bold())
                        Text(state.currentAddress.fullAddress)
                            .font(.footnote)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(16)
                    .background(Color.foodGrayBg)
                    .clipShape(RoundedRectangle(cornerRadius: 20))

                    // Payment Method
                    VStack(alignment: .leading, spacing: 10) {
                        Text("PAYMENT METHOD")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)

                        ForEach(["Debit Card", "Bank Transfer", "Wallet", "Cash on Delivery"], id: \.self) { method in
                            HStack {
                                Text(method)
                                    .font(.subheadline.bold())
                                Spacer()
                                if selectedPayment == method {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(Color.foodNeonGreen)
                                }
                            }
                            .padding(14)
                            .background(Color.foodGrayBg)
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                            .onTapGesture {
                                selectedPayment = method
                            }
                        }
                    }
                }
                .padding(20)
            }

            Button {
                state.basketItems.removeAll()
                dismiss()
                state.isTrackingOpen = true
            } label: {
                Text("Place Order · ₦\(state.basketTotal)")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.foodDark)
                    .clipShape(Capsule())
                    .padding(16)
            }
        }
        .presentationDetents([.fraction(0.85)])
        .sheetCornerRadius(28)
    }
}

// MARK: - Live Tracking Sheet
struct LiveTrackingSheet: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var state: Food101AppState

    var body: some View {
        VStack(spacing: 0) {
            Capsule()
                .fill(Color.gray.opacity(0.3))
                .frame(width: 36, height: 5)
                .padding(.top, 10)
                .padding(.bottom, 12)

            HStack {
                Text("Live Tracking")
                    .font(.title3.bold())
                Spacer()
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 14, weight: .bold))
                        .padding(8)
                        .background(Color.foodGrayBg)
                        .clipShape(Circle())
                        .foregroundColor(.black)
                }
            }
            .padding(.horizontal, 20)

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

                    // Rider Info
                    if let rider = state.activeOrder?.rider {
                        HStack(spacing: 12) {
                            Circle()
                                .fill(Color.foodDark)
                                .frame(width: 44, height: 44)
                                .overlay(
                                    Text(String(rider.name.prefix(1)))
                                        .font(.headline)
                                        .foregroundColor(.white)
                                )

                            VStack(alignment: .leading, spacing: 2) {
                                Text(rider.name)
                                    .font(.subheadline.bold())
                                Text(rider.vehicle)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            Spacer()
                            HStack(spacing: 8) {
                                Button {} label: {
                                    Image(systemName: "phone.fill")
                                        .padding(10)
                                        .background(Color.foodGrayBg)
                                        .clipShape(Circle())
                                }
                                Button {} label: {
                                    Image(systemName: "message.fill")
                                        .padding(10)
                                        .background(Color.foodGrayBg)
                                        .clipShape(Circle())
                                }
                            }
                        }
                        .padding(16)
                        .background(Color.foodGrayBg)
                        .clipShape(RoundedRectangle(cornerRadius: 20))
                    }
                }
                .padding(20)
            }
        }
        .presentationDetents([.fraction(0.92)])
        .sheetCornerRadius(28)
    }
}

// MARK: - Search Sheet
struct SearchSheet: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var state: Food101AppState
    @State private var query = ""

    var body: some View {
        VStack(spacing: 16) {
            HStack(spacing: 12) {
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    TextField("Search dishes, restaurants...", text: $query)
                }
                .padding(12)
                .background(Color.foodGrayBg)
                .clipShape(Capsule())

                Button("Cancel") {
                    dismiss()
                }
                .foregroundColor(.black)
            }
            .padding(.horizontal, 20)
            .padding(.top, 20)

            VStack(alignment: .leading, spacing: 12) {
                Text("POPULAR SEARCHES")
                    .font(.caption.bold())
                    .foregroundColor(.secondary)

                ForEach(["Jollof & Chicken", "Amala & Ewedu", "Suya Platter", "Puff Puff Box"], id: \.self) { term in
                    Button {
                        query = term
                    } label: {
                        Text(term)
                            .font(.subheadline)
                            .foregroundColor(Color.foodDark)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(Color.foodGrayBg)
                            .clipShape(Capsule())
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 20)

            Spacer()
        }
        .sheetCornerRadius(28)
    }
}

// MARK: - App Entry Point
@main
struct Food101App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

