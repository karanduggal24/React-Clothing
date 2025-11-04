# React Clothing Store - E-Commerce Platform

A comprehensive e-commerce platform built with React and Redux Toolkit, featuring a complete shopping experience with product management, cart functionality, secure payment processing, and order management.

## 🌟 Key Features

### 🛍️ Customer Features
- **Product Catalog**
  - Browse products with advanced filtering by categories
  - Real-time search functionality with instant results
  - Detailed product pages with high-quality images
  - Stock availability tracking

- **Shopping Cart**
  - Add/remove products with quantity management
  - Real-time price calculations
  - Cart persistence across sessions
  - Empty cart protection for checkout

- **Secure Checkout**
  - Protected payment routes (cart validation)
  - Comprehensive address and payment form validation
  - Order confirmation with detailed receipt
  - Automatic cart clearing after successful payment

- **Order Tracking**
  - Order confirmation page with complete details
  - Order ID generation and tracking
  - Order history and status updates

### 👨‍💼 Admin Features
- **Product Management**
  - Add, edit, and delete products
  - Image upload functionality
  - Stock quantity management
  - Category organization

- **Order Management**
  - View all customer orders
  - Update order status (Confirmed/Shipped)
  - Manage shipping details and tracking
  - Order analytics and reporting

### 🎨 UI/UX Features
- **Animated Components**
  - Smooth fade-in animations with BlurFade
  - Aurora text effects for enhanced typography
  - Marquee animations for announcements
  - Interactive carousel with autoplay

- **Responsive Design**
  - Mobile-first responsive layout
  - Touch-friendly interface
  - Adaptive navigation and search
  - Optimized for all screen sizes

## 🚀 Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **Redux Toolkit** - State management with RTK Query
- **React Router DOM** - Client-side routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### UI Components
- **Custom UI Components** - Carousel, Marquee, Blur Fade, Aurora Text
- **Material-UI** - Select components for enhanced UX
- **React Icons** - Additional icon support

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Installation & Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd product-admin
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

5. **Preview production build:**
```bash
npm run preview
```

6. **Open your browser:**
Navigate to [http://localhost:5173](http://localhost:5173)

## 🏗️ Project Structure

```
product-admin/
├── src/
│   ├── app/
│   │   └── store.js                 # Redux store configuration
│   ├── components/
│   │   ├── Header/                  # Navigation header
│   │   ├── Footer/                  # Site footer
│   │   ├── Home/                    # Homepage components
│   │   ├── HomeHero/                # Hero section
│   │   ├── Login/                   # Authentication
│   │   ├── Main-App/                # App routing
│   │   ├── ui/                      # Reusable UI components
│   │   ├── PaymentProtectedRoute.jsx # Payment route protection
│   │   └── ProtectedRoute.jsx       # Admin route protection
│   ├── features/
│   │   ├── Order/
│   │   │   └── OrderConfirmed.jsx   # Order confirmation page
│   │   ├── Payment/
│   │   │   ├── PaymentPage.jsx      # Payment interface
│   │   │   └── PaymentDetailsForm.jsx # Payment form
│   │   ├── products/
│   │   │   ├── FilterBar/           # Product filtering
│   │   │   ├── ProductCart/         # Shopping cart
│   │   │   ├── ProductDetail/       # Product details
│   │   │   ├── ProductForm/         # Admin product management
│   │   │   ├── ProductList/         # Product catalog
│   │   │   └── SearchBar/           # Product search
│   │   └── Slices/                  # Redux slices
│   │       ├── AddProductSlice.js   # Product management
│   │       ├── authSlice.js         # Authentication
│   │       ├── CartSlice.js         # Shopping cart
│   │       ├── filterSlice.js       # Product filtering
│   │       ├── OrdersSlice.js       # Order management
│   │       ├── PaymentFormSlice.js  # Payment form state
│   │       └── SearchSlice.js       # Search functionality
│   ├── hooks/
│   │   ├── scrollToTop.js           # Scroll management
│   │   └── useCartStockSync.js      # Cart-stock synchronization
│   ├── assets/                      # Static images
│   └── lib/
│       └── utils.js                 # Utility functions
├── public/                          # Static assets
├── tailwind.config.js               # Tailwind configuration
├── vite.config.js                   # Vite configuration
└── package.json                     # Dependencies and scripts
```

## 🔐 Authentication & Authorization

### User Roles
- **Customer**: Browse products, manage cart, place orders
- **Admin**: Full product and order management access

### Protected Routes
- `/ProductForm` - Admin only (product management)
- `/Payment` - Requires non-empty cart
- `/order-confirmed` - Post-purchase confirmation

### Login Credentials
- **Admin**: `admin@example.com` / `admin123`
- **Customer**: `user@example.com` / `user123`

## 🛒 E-Commerce Flow

### Customer Journey
1. **Browse Products** → Filter/Search → View Details
2. **Add to Cart** → Manage Quantities → Review Cart
3. **Checkout** → Enter Details → Process Payment
4. **Order Confirmation** → View Receipt → Track Order

### Admin Workflow
1. **Product Management** → Add/Edit Products → Manage Stock
2. **Order Processing** → View Orders → Update Status → Manage Shipping

## 🎨 UI Components Library

### Custom Components
- **Carousel** - Auto-playing image slider with navigation
- **BlurFade** - Smooth fade-in animation wrapper
- **AuroraText** - Animated gradient text effects
- **Marquee** - Smooth scrolling text announcements
- **Button** - Consistent button styling with variants

### Features
- Responsive design with mobile-first approach
- Smooth animations and transitions
- Consistent color scheme and typography
- Accessible navigation and interactions

## 🔧 Configuration Files

- **`tailwind.config.js`** - Tailwind CSS customization and animations
- **`vite.config.js`** - Vite bundler and development server settings
- **`jsconfig.json`** - JavaScript project configuration
- **`components.json`** - UI components configuration
- **`eslint.config.js`** - Code linting rules

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px` - Stack layout, mobile navigation
- **Tablet**: `768px - 1024px` - Adaptive grid, touch-friendly
- **Desktop**: `> 1024px` - Full layout, hover effects

## 🚀 Performance Features

- **Code Splitting** - Route-based lazy loading
- **Image Optimization** - Responsive images with proper sizing
- **State Management** - Efficient Redux state updates
- **Bundle Optimization** - Tree shaking and minification

## 🧪 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Development Guidelines
- Follow React best practices and hooks patterns
- Use Redux Toolkit for state management
- Implement responsive design with Tailwind CSS
- Maintain component reusability and modularity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **[React](https://reactjs.org/)** - UI library
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management
- **[Tailwind CSS](https://tailwindcss.com/)** - CSS framework
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Embla Carousel](https://www.embla-carousel.com/)** - Carousel component
