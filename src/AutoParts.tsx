import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Truck, 
  ShieldCheck, 
  Star, 
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  ChevronRight,
  Filter,
  Grid,
  List as ListIcon,
  Search as SearchIcon,
  Heart
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { cn } from './lib/utils';

// --- Types ---
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  img: string;
  category: string;
  model?: string;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviews?: number;
}

// --- Mock Data ---
export const PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: "BMW G80 G82 G83 M3 M4 Carbon Fiber Front Lip - V1 Style", 
    price: 749.95, 
    originalPrice: 899.95,
    img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600&h=600",
    category: "Exterior",
    model: "G80/G82",
    isNew: true,
    isSale: true,
    rating: 5,
    reviews: 24
  },
  { 
    id: 2, 
    name: "BMW G80 M3 G82 M4 Carbon Fiber Side Skirt Extensions", 
    price: 699.95, 
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600&h=600",
    category: "Exterior",
    model: "G80/G82",
    rating: 4.8,
    reviews: 18
  },
  { 
    id: 3, 
    name: "BMW G80 M3 G82 M4 Carbon Fiber Rear Diffuser - Performance Style", 
    price: 849.95, 
    img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600&h=600",
    category: "Exterior",
    model: "G80/G82",
    rating: 5,
    reviews: 31
  },
  { 
    id: 4, 
    name: "BMW G80 G82 G83 M3 M4 Carbon Fiber Mirror Caps", 
    price: 299.95, 
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600&h=600",
    category: "Exterior",
    model: "G80/G82",
    rating: 4.9,
    reviews: 42
  },
  { 
    id: 5, 
    name: "BMW G80 M3 Carbon Fiber Performance Trunk Spoiler", 
    price: 349.95, 
    originalPrice: 399.95,
    img: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=600&h=600",
    category: "Exterior",
    model: "G80",
    isSale: true,
    rating: 5,
    reviews: 15
  },
  { 
    id: 6, 
    name: "BMW G80 G82 G83 M3 M4 Carbon Fiber Grille Surrounds", 
    price: 499.95, 
    img: "https://images.unsplash.com/photo-1603584173870-7f3ca993466d?auto=format&fit=crop&q=80&w=600&h=600",
    category: "Exterior",
    model: "G80/G82",
    rating: 4.7,
    reviews: 9
  },
  { 
    id: 7, 
    name: "BMW M Performance Steering Wheel - Alcantara & Carbon", 
    price: 1299.95, 
    img: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=600&h=600",
    category: "Interior",
    model: "Universal M",
    isNew: true,
    rating: 5,
    reviews: 56
  },
  { 
    id: 8, 
    name: "BMW Carbon Fiber Paddle Shifters - Extended Style", 
    price: 189.95, 
    img: "https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&q=80&w=600&h=600",
    category: "Interior",
    model: "Universal M",
    rating: 4.8,
    reviews: 88
  }
];

export const CATEGORIES = [
  { name: "Exterior", img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800&h=800" },
  { name: "Interior", img: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=800&h=800" },
  { name: "Lighting", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800&h=800" },
  { name: "Performance", img: "https://images.unsplash.com/photo-1600706432502-77a0e2e327fc?auto=format&fit=crop&q=80&w=800&h=800" }
];

// --- Components ---

const AnnouncementBar = () => (
  <div className="bg-black text-white text-[10px] md:text-xs py-2.5 px-4 text-center font-bold uppercase tracking-[0.15em] border-b border-white/10">
    <div className="flex items-center justify-center gap-6 overflow-hidden whitespace-nowrap">
      <motion.div 
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-2"
      >
        <Truck className="w-3.5 h-3.5 text-[#e31e24]" /> Free Worldwide Shipping on Orders Over $500
      </motion.div>
      <span className="hidden md:inline opacity-20">|</span>
      <div className="hidden md:flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#e31e24]" /> 100% Fitment Guarantee
      </div>
      <span className="hidden md:inline opacity-20">|</span>
      <div className="hidden md:flex items-center gap-2">
        <Star className="w-3.5 h-3.5 text-[#e31e24]" /> Rated 4.9/5 by 10,000+ Enthusiasts
      </div>
    </div>
  </div>
);

const AutoPartsNavbar = ({ cartCount, onOpenCart }: { cartCount: number, onOpenCart: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Shop by Model', hasSub: true },
    { name: 'Exterior', hasSub: true },
    { name: 'Interior', hasSub: true },
    { name: 'Lighting', hasSub: true },
    { name: 'Performance', hasSub: true },
    { name: 'New Arrivals', hasSub: false },
    { name: 'On Sale', hasSub: false, isRed: true },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled ? "bg-white shadow-xl py-3" : "bg-transparent py-6"
    )}>
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className={cn("lg:hidden p-2", isScrolled ? "text-black" : "text-white")}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <div className={cn(
            "font-black text-2xl md:text-3xl italic tracking-tighter flex items-center transition-colors duration-500",
            isScrolled ? "text-black" : "text-white"
          )}>
            REVLINE<span className="text-[#e31e24]">PARTS</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item, i) => (
            <div key={i} className="relative group">
              <button className={cn(
                "text-[11px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors duration-300",
                isScrolled ? "text-black/70 hover:text-[#e31e24]" : "text-white/80 hover:text-white",
                item.isRed && "text-[#e31e24] hover:text-[#e31e24]/80"
              )}>
                {item.name}
                {item.hasSub && <ChevronDown className="w-3 h-3 opacity-50" />}
              </button>
              {/* Simple Mega Menu Placeholder */}
              {item.hasSub && (
                <div className="absolute top-full left-0 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                  <div className="bg-white shadow-2xl border border-gray-100 p-6 min-w-[200px] rounded-sm">
                    <ul className="space-y-3">
                      <li><a href="#" className="text-[10px] font-bold text-gray-500 hover:text-[#e31e24] uppercase tracking-widest">BMW G80 M3</a></li>
                      <li><a href="#" className="text-[10px] font-bold text-gray-500 hover:text-[#e31e24] uppercase tracking-widest">BMW F80 M3</a></li>
                      <li><a href="#" className="text-[10px] font-bold text-gray-500 hover:text-[#e31e24] uppercase tracking-widest">BMW G20 3-Series</a></li>
                      <li><a href="#" className="text-[10px] font-bold text-gray-500 hover:text-[#e31e24] uppercase tracking-widest">View All Models</a></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className={cn("p-2 transition-colors", isScrolled ? "text-black hover:text-[#e31e24]" : "text-white hover:text-[#e31e24]")}>
            <SearchIcon className="w-5 h-5" />
          </button>
          <button className={cn("hidden md:block p-2 transition-colors", isScrolled ? "text-black hover:text-[#e31e24]" : "text-white hover:text-[#e31e24]")}>
            <User className="w-5 h-5" />
          </button>
          <button 
            onClick={onOpenCart}
            className={cn("p-2 relative transition-colors group", isScrolled ? "text-black hover:text-[#e31e24]" : "text-white hover:text-[#e31e24]")}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e31e24] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <div className="font-black text-xl italic text-black">REVLINE<span className="text-[#e31e24]">PARTS</span></div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-black"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {navItems.map((item, i) => (
                <div key={i} className="border-b border-gray-50 pb-4">
                  <button className={cn(
                    "w-full flex items-center justify-between text-sm font-black uppercase tracking-widest",
                    item.isRed ? "text-[#e31e24]" : "text-black"
                  )}>
                    {item.name}
                    {item.hasSub && <ChevronRight className="w-4 h-4 opacity-30" />}
                  </button>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 space-y-4">
              <button className="w-full py-4 bg-black text-white text-xs font-black uppercase tracking-[0.2em]">Login / Register</button>
              <div className="flex justify-center gap-6 text-gray-400">
                <Instagram className="w-5 h-5" />
                <Twitter className="w-5 h-5" />
                <Facebook className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AutoPartsHero = () => (
  <section className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-black">
    {/* Background Video/Image */}
    <div className="absolute inset-0">
      <img 
        src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1920&h=1080" 
        alt="Hero Car" 
        className="w-full h-full object-cover opacity-60 scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
    </div>

    <div className="relative h-full max-w-[1600px] mx-auto px-6 flex flex-col justify-center items-start">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl"
      >
        <div className="text-[#e31e24] text-xs md:text-sm font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
          <div className="w-12 h-[2px] bg-[#e31e24]" />
          New G80 / G82 Collection
        </div>
        <h1 className="text-5xl md:text-8xl font-black italic text-white uppercase leading-[0.9] tracking-tighter mb-8">
          The Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Carbon Fiber</span>
        </h1>
        <p className="text-white/60 text-base md:text-xl max-w-xl mb-10 leading-relaxed font-medium">
          Elevate your driving experience with our premium selection of hand-crafted carbon fiber components. Engineered for perfection, designed for enthusiasts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-10 py-5 bg-[#e31e24] text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 shadow-2xl shadow-[#e31e24]/20">
            Shop Collection
          </button>
          <button className="px-10 py-5 border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-500 backdrop-blur-md">
            View All Models
          </button>
        </div>
      </motion.div>
    </div>

    {/* Scroll Indicator */}
    <motion.div 
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
    >
      <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Scroll</span>
    </motion.div>
  </section>
);

const FeaturedCollections = () => (
  <section className="py-24 md:py-32 px-6 bg-white">
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div className="max-w-2xl">
          <div className="text-[#e31e24] text-xs font-black uppercase tracking-[0.3em] mb-4">Categories</div>
          <h2 className="text-4xl md:text-6xl font-black italic text-black uppercase leading-none tracking-tighter">
            Shop by <span className="text-gray-300">Collection</span>
          </h2>
        </div>
        <button className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-[#e31e24] hover:border-[#e31e24] transition-all">
          View All Categories
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group relative aspect-[4/5] overflow-hidden cursor-pointer bg-gray-100"
          >
            <img 
              src={cat.img} 
              alt={cat.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h3 className="text-2xl font-black italic text-white uppercase mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.name}</h3>
              <div className="w-12 h-1 bg-[#e31e24] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="mt-4 text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Explore Now <ArrowRight className="inline w-3 h-3 ml-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ProductCard = ({ product, onAddToCart }: { product: Product, onAddToCart: (p: Product) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group bg-white flex flex-col relative"
  >
    {/* Badges */}
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      {product.isNew && (
        <div className="bg-black text-white text-[9px] font-black uppercase px-2.5 py-1 tracking-widest">New</div>
      )}
      {product.isSale && (
        <div className="bg-[#e31e24] text-white text-[9px] font-black uppercase px-2.5 py-1 tracking-widest">Sale</div>
      )}
    </div>

    {/* Wishlist Button */}
    <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#e31e24] hover:text-white">
      <Heart className="w-4 h-4" />
    </button>

    {/* Image Container */}
    <div className="aspect-square relative overflow-hidden bg-gray-50 p-6">
      <Link to={`/shop/products/${product.id}`}>
        <img 
          src={product.img} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
      </Link>
      
      {/* Quick Add Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <button 
          onClick={() => onAddToCart(product)}
          className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#e31e24] transition-colors shadow-2xl"
        >
          Add to Cart
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="py-6 flex flex-col flex-1">
      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{product.model}</div>
      <Link to={`/shop/products/${product.id}`}>
        <h3 className="text-sm font-bold text-black mb-3 line-clamp-2 group-hover:text-[#e31e24] transition-colors cursor-pointer leading-snug">
          {product.name}
        </h3>
      </Link>
      
      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={cn("w-3 h-3", i < (product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} />
        ))}
        <span className="text-[10px] text-gray-400 font-bold ml-1">({product.reviews})</span>
      </div>

      <div className="mt-auto flex items-center gap-3">
        <span className="text-lg font-black text-[#e31e24]">${product.price.toFixed(2)}</span>
        {product.originalPrice && (
          <span className="text-sm text-gray-300 line-through font-bold">${product.originalPrice.toFixed(2)}</span>
        )}
      </div>
    </div>
  </motion.div>
);

const ProductGrid = ({ onAddToCart }: { onAddToCart: (p: Product) => void }) => (
  <section className="py-24 md:py-32 px-6 bg-white border-t border-gray-100">
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div className="max-w-2xl">
          <div className="text-[#e31e24] text-xs font-black uppercase tracking-[0.3em] mb-4">Best Sellers</div>
          <h2 className="text-4xl md:text-6xl font-black italic text-black uppercase leading-none tracking-tighter">
            Trending <span className="text-gray-300">Now</span>
          </h2>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#e31e24] transition-colors">BMW</button>
          <button className="px-6 py-3 bg-gray-50 text-black text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Mercedes</button>
          <button className="px-6 py-3 bg-gray-50 text-black text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Audi</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>

      <div className="mt-24 text-center">
        <button className="px-12 py-5 border-2 border-black text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500">
          Shop All Products
        </button>
      </div>
    </div>
  </section>
);

const TrustBadges = () => (
  <section className="py-16 md:py-24 px-6 bg-gray-50 border-y border-gray-100">
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      {[
        { icon: Truck, title: "Worldwide Shipping", desc: "Fast & secure shipping to over 100 countries." },
        { icon: ShieldCheck, title: "Fitment Guarantee", desc: "We guarantee the fitment of every part we sell." },
        { icon: Star, title: "Premium Quality", desc: "Only the highest grade carbon fiber materials used." },
        { icon: User, title: "Expert Support", desc: "Talk to real enthusiasts who know your car." }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center text-center group">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#e31e24] group-hover:text-white transition-all duration-500">
            <item.icon className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest mb-2">{item.title}</h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const Newsletter = () => (
  <section className="py-24 md:py-32 px-6 bg-black relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
      <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1920&h=1080" alt="" className="w-full h-full object-cover grayscale" />
    </div>
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <div className="text-[#e31e24] text-xs font-black uppercase tracking-[0.4em] mb-6">Join the Club</div>
      <h2 className="text-4xl md:text-6xl font-black italic text-white uppercase mb-8 tracking-tighter">Unlock <span className="text-[#e31e24]">Exclusive</span> Access</h2>
      <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
        Subscribe to get early access to new drops, exclusive discounts, and the latest in automotive performance.
      </p>
      <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="email" 
          placeholder="ENTER YOUR EMAIL" 
          className="flex-1 bg-white/10 border border-white/20 px-8 py-5 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-[#e31e24] transition-colors"
        />
        <button className="px-10 py-5 bg-[#e31e24] text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">
          Subscribe
        </button>
      </form>
      <p className="mt-6 text-[10px] text-white/30 uppercase tracking-widest font-bold">By subscribing you agree to our Privacy Policy</p>
    </div>
  </section>
);

const AutoPartsFooter = () => (
  <footer className="bg-white pt-24 pb-12 px-6 border-t border-gray-100">
    <div className="max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
        <div className="lg:col-span-2 space-y-8">
          <div className="font-black text-3xl italic tracking-tighter text-black">
            REVLINE<span className="text-[#e31e24]">PARTS</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-medium">
            Your premier source for high-quality carbon fiber automotive parts and accessories. We specialize in performance upgrades for BMW, Mercedes, Audi, and more.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-[#e31e24] transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-[#e31e24] transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-[#e31e24] transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-[#e31e24] transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8">Shop</h4>
          <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">BMW Collection</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">Mercedes Collection</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">Audi Collection</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">On Sale</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8">Support</h4>
          <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">Fitment Guarantee</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8">Company</h4>
          <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">Our Studio</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">Affiliate Program</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">Wholesale</a></li>
            <li><a href="#" className="hover:text-[#e31e24] transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">© 2024 Revline Auto Parts. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-4 grayscale opacity-30" />
          <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-4 grayscale opacity-30" />
          <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="PayPal" className="h-4 grayscale opacity-30" />
          <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="Amex" className="h-4 grayscale opacity-30" />
        </div>
      </div>
    </div>
  </footer>
);

const CartSidebar = ({ isOpen, onClose, cart, onRemove }: { isOpen: boolean, onClose: () => void, cart: Product[], onRemove: (id: number) => void }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end"
        >
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-black italic uppercase text-black">Shopping Cart ({cart.length})</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-200">
                  <ShoppingCart className="w-20 h-20 mb-6 opacity-20" />
                  <p className="font-black uppercase tracking-[0.2em] text-sm">Your cart is empty</p>
                  <button 
                    onClick={onClose}
                    className="mt-8 px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#e31e24] transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={i} className="flex gap-4 pb-6 border-b border-gray-100 group">
                    <div className="w-24 h-24 bg-gray-50 p-2 border border-gray-100 shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] font-bold text-black mb-1 leading-tight group-hover:text-[#e31e24] transition-colors cursor-pointer">{item.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{item.model}</div>
                      <div className="text-sm font-black text-[#e31e24]">${item.price.toFixed(2)}</div>
                      <button 
                        onClick={() => onRemove(i)}
                        className="text-[10px] font-bold text-gray-300 uppercase hover:text-[#e31e24] mt-3 underline tracking-widest"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-2xl font-black text-black">${total.toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-gray-400 uppercase font-bold mb-8 italic tracking-widest">Shipping & taxes calculated at checkout</div>
                <div className="space-y-3">
                  <button 
                    onClick={() => alert('Checkout feature coming soon!')}
                    className="w-full py-5 bg-[#e31e24] text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-black transition-all duration-500 shadow-xl shadow-[#e31e24]/20"
                  >
                    Proceed to Checkout
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-full py-5 bg-white border border-gray-200 text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-100 transition-all duration-500"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ShopBySeries = () => {
  const series = [
    { name: "1 Series", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400&h=400" },
    { name: "2 Series", img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=400&h=400" },
    { name: "3 Series", img: "https://images.unsplash.com/photo-1556122071-e404be745c9e?auto=format&fit=crop&q=80&w=400&h=400" },
    { name: "4 Series", img: "https://images.unsplash.com/photo-1619362280286-f1f8fd5032ed?auto=format&fit=crop&q=80&w=400&h=400" },
    { name: "5 Series", img: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&q=80&w=400&h=400" },
    { name: "8 Series", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400&h=400" },
    { name: "X Series", img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400&h=400" },
    { name: "M Series", img: "https://images.unsplash.com/photo-1603584173870-7f3ca993466d?auto=format&fit=crop&q=80&w=400&h=400" },
  ];

  return (
    <section className="py-24 md:py-32 px-6 bg-gray-50">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#e31e24] text-xs font-black uppercase tracking-[0.3em] mb-4">The Lineup</div>
          <h2 className="text-4xl md:text-6xl font-black italic text-black uppercase leading-none tracking-tighter">
            Shop by <span className="text-gray-300">Series</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
          {series.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-square rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-[#e31e24] transition-all duration-500 bg-white shadow-sm">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ProductDetailPage = ({ onAddToCart }: { onAddToCart: (p: Product) => void }) => {
  const { productId } = useParams<{ productId: string }>();
  const product = PRODUCTS.find(p => p.id === Number(productId));
  const [selectedImg, setSelectedImg] = useState(product?.img || '');

  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-12">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/" className="hover:text-black">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 border border-gray-100 p-12 overflow-hidden">
              <motion.img 
                key={selectedImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={selectedImg} 
                alt={product.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[product.img, product.img, product.img, product.img].map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImg(img)}
                  className={cn(
                    "aspect-square bg-gray-50 border p-2 transition-all",
                    selectedImg === img ? "border-[#e31e24]" : "border-gray-100 hover:border-gray-300"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="text-[#e31e24] text-xs font-black uppercase tracking-[0.3em] mb-4">In Stock & Ready to Ship</div>
            <h1 className="text-3xl md:text-4xl font-black italic text-black uppercase leading-tight mb-6 tracking-tighter">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < (product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.reviews} Verified Reviews</span>
            </div>

            <div className="flex items-center gap-4 mb-10">
              <span className="text-4xl font-black text-[#e31e24]">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-300 line-through font-bold">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="space-y-6 mb-12">
              <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Key Features</div>
                <ul className="space-y-3 text-xs font-bold text-black uppercase tracking-widest">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#e31e24] rounded-full" /> Genuine 2x2 Carbon Fiber Weave</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#e31e24] rounded-full" /> UV Resistant High Gloss Clear Coat</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#e31e24] rounded-full" /> OEM Fitment Guarantee</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#e31e24] rounded-full" /> Professional Installation Recommended</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-1 py-5 bg-black text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-[#e31e24] transition-all duration-500 shadow-xl"
              >
                Add to Cart
              </button>
              <button className="p-5 border border-gray-200 hover:bg-gray-50 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 py-8 border-t border-gray-100">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <div className="text-[9px] font-black uppercase tracking-widest">Free Shipping</div>
              </div>
              <div className="text-center">
                <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <div className="text-[9px] font-black uppercase tracking-widest">Fitment Guaranteed</div>
              </div>
              <div className="text-center">
                <Star className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <div className="text-[9px] font-black uppercase tracking-widest">Premium Quality</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShopLayout = ({ children }: { children: (props: { onAddToCart: (p: Product) => void }) => React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#e31e24]/10 selection:text-[#e31e24]">
      <AnnouncementBar />
      <AutoPartsNavbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
      <main>
        {children({ onAddToCart: addToCart })}
      </main>
      <AutoPartsFooter />
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onRemove={removeFromCart} 
      />
    </div>
  );
};

export const AutoPartsHomePage = ({ onAddToCart }: { onAddToCart: (p: Product) => void }) => {
  return (
    <>
      <AutoPartsHero />
      <ShopBySeries />
      <FeaturedCollections />
      <ProductGrid onAddToCart={onAddToCart} />
      <TrustBadges />
      <Newsletter />
    </>
  );
};
