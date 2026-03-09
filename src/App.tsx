import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layout, 
  Code2, 
  Cpu, 
  Globe, 
  Zap, 
  MessageSquare, 
  ArrowRight, 
  Github, 
  Twitter, 
  Linkedin,
  Instagram,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Terminal,
  ArrowLeft,
  X,
  ShoppingCart,
  Search,
  Calendar,
  Droplets,
  Palette,
  Box,
  Clock,
  MapPin,
  Menu,
  User,
  Users,
  Phone,
  Truck,
  ShieldCheck,
  Star,
  ChevronDown,
  Filter,
  Grid,
  Trash2,
  List as ListIcon,
  Home,
  Briefcase,
  FolderOpen,
  Settings
} from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from './lib/utils';
import { getProjectPlan, saveChatSession, getChatSessions } from './services/geminiService';
import { loginUser, registerUser, syncUsersToBackend, fetchAllUsers, deleteUser, permanentDeleteUser, restoreUser, deleteAllUsers } from './services/authService';
import { AutoPartsHomePage, ProductDetailPage, ShopLayout } from './AutoParts';

const LOGO_URL = "https://i.imgur.com/tG0PJnI.png"; // Navbar/Footer Logo
const MASCOT_URL = "https://i.imgur.com/TuAQsfR.png"; // Hero/Planner Mascot
const SNOWY_URL = "https://i.imgur.com/dAXUXz3.png"; // AI Assistant Mascot
const SNOWY_SUIT_URL = "https://i.imgur.com/Sv1CGWR.png"; // Consultation Mascot

// --- Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [user, setUser] = useState<any>(null);
  const [confirmDeleteSelf, setConfirmDeleteSelf] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('revline_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user', e);
        localStorage.removeItem('revline_user');
      }
    }

    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem('revline_user');
      if (updatedUser) {
        try {
          setUser(JSON.parse(updatedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('revline_user');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  const scrollToSection = (id: string) => {
    if (isHome) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#' + id);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
        scrolled 
          ? "h-16 md:h-20 bg-[#050505]/80 backdrop-blur-xl border-white/10" 
          : "h-20 md:h-28 bg-transparent border-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="flex-1">
            <Link to="/" className="flex items-center gap-3 md:gap-4 group">
              <span className="font-display font-bold text-xl md:text-2xl tracking-tighter text-white">REVLINE<span className="text-[#00FF88]">HUB</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center justify-center gap-10 text-[11px] font-black uppercase tracking-[0.25em] text-white/40 font-sans">
            <button onClick={() => scrollToSection('services')} className="hover:text-[#00FF88] transition-colors">SERVICES</button>
            <Link to="/work" className="hover:text-[#00FF88] transition-colors">PORTFOLIO</Link>
            <button onClick={() => scrollToSection('ai-planner')} className="hover:text-[#00FF88] transition-colors">AI PLANNER</button>
            {user && (
              <Link to="/dashboard" className="hover:text-[#00FF88] transition-colors">DASHBOARD</Link>
            )}
          </div>
          
          <div className="flex-1 hidden md:flex items-center justify-end gap-6 text-[11px] font-black uppercase tracking-[0.25em] text-white/40 font-sans">
            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin" className="hover:text-[#00FF88] transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Users className="w-3.5 h-3.5" />
                    ADMIN HUB
                  </Link>
                )}
                <Link 
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 hover:border-[#00FF88]/40 transition-all group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                  <span className="text-white text-[10px] group-hover:text-[#00FF88] transition-colors">{user.firstName}</span>
                </Link>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-6 py-2.5 bg-white text-black rounded-xl font-black hover:bg-[#00FF88] hover:scale-105 transition-all duration-300 text-[10px]"
              >
                CLIENT PORTAL
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 pb-safe pt-3">
        <div className="flex items-center justify-around px-2 pb-2">
          <button onClick={() => scrollToSection('services')} className="flex flex-col items-center gap-1 text-white/40 hover:text-[#00FF88] transition-colors p-2">
            <Briefcase className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Services</span>
          </button>
          <Link to="/work" className="flex flex-col items-center gap-1 text-white/40 hover:text-[#00FF88] transition-colors p-2">
            <FolderOpen className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Portfolio</span>
          </Link>
          <button onClick={() => scrollToSection('ai-planner')} className="flex flex-col items-center gap-1 text-white/40 hover:text-[#00FF88] transition-colors p-2">
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Planner</span>
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="flex flex-col items-center gap-1 text-white/40 hover:text-[#00FF88] transition-colors p-2">
                <Layout className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
              </Link>
              <Link to="/profile" className="flex flex-col items-center gap-1 text-[#00FF88] transition-colors p-2">
                <User className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
              </Link>
            </>
          ) : (
            <Link to="/login" className="flex flex-col items-center gap-1 text-white/40 hover:text-[#00FF88] transition-colors p-2">
              <User className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

const ClientDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('revline_user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      localStorage.removeItem('revline_user');
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#00FF88]/10 flex items-center justify-center border border-[#00FF88]/20">
              <Layout className="w-5 h-5 md:w-6 md:h-6 text-[#00FF88]" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">Client <span className="text-gradient">Dashboard</span></h1>
          </div>
          <p className="text-white/40 text-base md:text-lg">Welcome back, {user.firstName}. Here is the current performance of your digital assets.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Stats Overview */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-2 md:mb-8">
            <div className="glass p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-2 mb-2 md:mb-4">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-[#00FF88]" />
                <div className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Visitors</div>
              </div>
              <div className="text-2xl md:text-4xl font-display font-bold text-white mb-1 md:mb-2">12,450</div>
              <div className="text-[#00FF88] text-[10px] md:text-xs font-bold flex items-center gap-1">+14%</div>
            </div>
            <div className="glass p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-2 mb-2 md:mb-4">
                <Globe className="w-4 h-4 md:w-5 md:h-5 text-[#00FF88]" />
                <div className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Views</div>
              </div>
              <div className="text-2xl md:text-4xl font-display font-bold text-white mb-1 md:mb-2">45,200</div>
              <div className="text-[#00FF88] text-[10px] md:text-xs font-bold flex items-center gap-1">+8%</div>
            </div>
            <div className="glass p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-2 mb-2 md:mb-4">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#00FF88]" />
                <div className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Session</div>
              </div>
              <div className="text-2xl md:text-4xl font-display font-bold text-white mb-1 md:mb-2">2m 45s</div>
              <div className="text-white/40 text-[10px] md:text-xs font-bold flex items-center gap-1">Stable</div>
            </div>
            <div className="glass p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-2 mb-2 md:mb-4">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-[#00FF88]" />
                <div className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Bounce</div>
              </div>
              <div className="text-2xl md:text-4xl font-display font-bold text-white mb-1 md:mb-2">32%</div>
              <div className="text-[#00FF88] text-[10px] md:text-xs font-bold flex items-center gap-1">-2%</div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10">
              <h2 className="text-lg md:text-xl font-bold text-white mb-5 md:mb-6 flex items-center gap-3">
                <Globe className="w-4 h-4 md:w-5 md:h-5 text-[#00FF88]" /> Website Health
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-white/60 uppercase tracking-widest">Performance Score</span>
                    <span className="text-[#00FF88]">98/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '98%' }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#00FF88] to-[#00D1FF]"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-white/60 uppercase tracking-widest">SEO Score</span>
                    <span className="text-[#00FF88]">100/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-[#00FF88] to-[#00D1FF]"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-white/60 uppercase tracking-widest">Accessibility</span>
                    <span className="text-[#00FF88]">95/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                      className="h-full bg-gradient-to-r from-[#00FF88] to-[#00D1FF]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10">
              <h2 className="text-lg md:text-xl font-bold text-white mb-5 md:mb-6 flex items-center gap-3">
                <Palette className="w-4 h-4 md:w-5 md:h-5 text-[#00FF88]" /> Ad Creatives & Marketing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Ad Spend', value: '$4,250', change: '+12%' },
                  { label: 'ROAS', value: '4.8x', change: '+0.5x' },
                  { label: 'Conversions', value: '842', change: '+18%' }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-xl font-display font-bold text-white">{stat.value}</div>
                    <div className="text-[#00FF88] text-[10px] font-bold">{stat.change}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-[#00FF88]/5 border border-[#00FF88]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00FF88]/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#00FF88]" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold">New Creative Ready</div>
                    <div className="text-white/40 text-[10px]">Your latest video ad is ready for review.</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#00FF88] text-black text-[10px] font-black rounded-lg uppercase tracking-widest hover:scale-105 transition-all">
                  Review
                </button>
              </div>
            </div>

            <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10">
              <h2 className="text-lg md:text-xl font-bold text-white mb-5 md:mb-6 flex items-center gap-3">
                <Terminal className="w-4 h-4 md:w-5 md:h-5 text-[#00FF88]" /> Recent Updates
              </h2>
              <div className="space-y-3 md:space-y-4">
                {[
                  { date: 'Today, 10:00 AM', event: 'Automated security scan completed. No issues found.' },
                  { date: 'Yesterday, 3:45 PM', event: 'Content update published to the blog.' },
                  { date: 'Mar 1, 2026', event: 'Monthly performance report generated.' }
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00FF88] mt-1.5 md:mt-2 shrink-0" />
                    <div>
                      <div className="text-white/40 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-0.5 md:mb-1">{log.date}</div>
                      <div className="text-white/80 text-xs md:text-sm">{log.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6 md:space-y-8">
            <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10">
              <h3 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6">Support</h3>
              <div className="space-y-3 md:space-y-4">
                <button className="w-full py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white text-xs md:text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 md:gap-3">
                  <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#00FF88]" /> Contact Support
                </button>
                <button className="w-full py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white text-xs md:text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 md:gap-3">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#00FF88]" /> Schedule Review
                </button>
              </div>
            </div>

            <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 overflow-hidden relative group">
              <div className="absolute -right-4 -bottom-4 md:-right-8 md:-bottom-8 w-24 h-24 md:w-32 md:h-32 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none">
                <img src={MASCOT_URL} alt="" className="w-full h-full object-contain grayscale" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">System Status</h3>
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">All Systems Operational</span>
              </div>
              <p className="text-white/40 text-xs md:text-sm leading-relaxed">Your website is currently online and performing optimally. Uptime over the last 30 days is 99.99%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const ServiceCard = ({ icon: Icon, title, description, delay, slug }: { icon: any, title: string, description: string, delay: number, slug: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="p-10 glass rounded-[2.5rem] group hover:border-[#00FF88]/40 transition-all duration-500 relative overflow-hidden flex flex-col h-full glow-hover"
  >
    <Link to={`/services/${slug}`} className="absolute inset-0 z-20" />
    <div className="absolute -right-8 -bottom-8 w-32 h-32 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none rotate-12 group-hover:rotate-0">
      <img src={MASCOT_URL} alt="" className="w-full h-full object-contain grayscale" referrerPolicy="no-referrer" />
    </div>
    <div className="w-16 h-16 rounded-2xl bg-[#00FF88]/5 border border-[#00FF88]/10 flex items-center justify-center mb-10 group-hover:bg-[#00FF88]/10 group-hover:scale-110 transition-all duration-500">
      <Icon className="w-8 h-8 text-[#00FF88]" />
    </div>
    <h3 className="font-display text-2xl font-bold mb-4 text-white group-hover:text-[#00FF88] transition-colors tracking-tight">{title}</h3>
    <p className="text-white/40 leading-relaxed relative z-10 text-base group-hover:text-white/60 transition-colors">{description}</p>
    <div className="mt-auto pt-10 flex items-center gap-3 text-[#00FF88] text-xs font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
      Explore Service <ArrowRight className="w-4 h-4" />
    </div>
  </motion.div>
);

const ServiceDetailPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const services: Record<string, any> = {
    'web-architecture': {
      title: 'Web Architecture',
      icon: Globe,
      description: 'High-performance, SEO-optimized web applications built with modern frameworks and cutting-edge performance patterns.',
      content: `
Our web architecture service focuses on building robust, scalable, and lightning-fast digital foundations. We don't just build websites; we engineer high-performance engines that drive your business forward.

### Key Features
*   **Modern Tech Stack**: We utilize React, Next.js, and TypeScript for type-safe, performant applications.
*   **Performance First**: Core Web Vitals are at the heart of our development process.
*   **SEO Optimization**: Built-in best practices for search engine visibility from day one.
*   **Scalable Infrastructure**: Architected to handle growth without compromising speed.

### Our Approach
We begin by understanding your technical requirements and business goals. Our engineering team then designs a custom architecture that balances flexibility with performance, ensuring your digital presence is future-proof.
      `,
      image: "https://picsum.photos/seed/web-arch/1200/800"
    },
    'software-engineering': {
      title: 'Software Engineering',
      icon: Code2,
      description: 'Custom enterprise solutions, API development, and scalable cloud infrastructure designed for reliability and speed.',
      content: `
Revline Hub provides top-tier software engineering services for complex business challenges. From custom API integrations to full-scale enterprise platforms, we deliver code that is clean, efficient, and maintainable.

### Key Features
*   **Custom API Development**: Robust endpoints designed for seamless integration.
*   **Cloud Solutions**: Expertise in AWS, Google Cloud, and Azure for scalable deployments.
*   **Database Design**: Optimized data structures for high-concurrency environments.
*   **Security Focused**: Industry-standard security protocols implemented at every layer.

### Our Approach
We follow rigorous engineering standards, including comprehensive testing and continuous integration/deployment (CI/CD) pipelines. Our goal is to provide software that works flawlessly under pressure.
      `,
      image: "https://picsum.photos/seed/software-eng/1200/800"
    },
    'ui-ux-design': {
      title: 'UI/UX Design',
      icon: Layout,
      description: 'User-centric interfaces that blend aesthetic elegance with intuitive functionality to create memorable digital journeys.',
      content: `
Design at Revline Hub is where aesthetic beauty meets functional precision. We create interfaces that don't just look stunning—they feel natural and intuitive to use.

### Key Features
*   **User-Centric Research**: Deep dives into user behavior and psychology.
*   **Prototyping**: Interactive high-fidelity prototypes to visualize the final product.
*   **Design Systems**: Scalable UI kits that ensure consistency across your entire brand.
*   **Accessibility**: Inclusive design patterns that work for everyone.

### Our Approach
Our design process is iterative and collaborative. We start with wireframes and move to high-fidelity designs, constantly testing and refining based on feedback to ensure the best possible user experience.
      `,
      image: "https://picsum.photos/seed/uiux-design/1200/800"
    },
    'marketing-creatives': {
      title: 'Marketing & Ad Creatives',
      icon: Palette,
      description: 'High-converting ad creatives and strategic marketing campaigns designed to scale your brand across all digital platforms.',
      content: `
Our Marketing & Ad Creatives service is designed to turn attention into revenue. We combine data-driven strategy with world-class design to create campaigns that resonate and convert.

### Key Features
*   **High-Conversion Ad Design**: Creatives optimized for Meta, Google, and TikTok.
*   **Strategic Campaign Planning**: Full-funnel marketing strategies tailored to your business goals.
*   **Brand Storytelling**: Compelling narratives that build trust and long-term brand equity.
*   **A/B Testing & Optimization**: Continuous refinement of creatives to maximize ROI.

### Our Approach
We don't just make things look pretty; we make them perform. Our process starts with deep audience research, followed by rapid creative iteration and data-backed scaling. We focus on the metrics that matter: CAC, ROAS, and LTV.
      `,
      image: "https://i.imgur.com/RCPp3pQ.png"
    }
  };

  const service = serviceId ? services[serviceId] : null;

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <button onClick={() => navigate('/')} className="text-[#00FF88] hover:underline">Back to Home</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 lg:pt-48 pb-24 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <Link to="/#services" className="inline-flex items-center gap-2 text-white/40 hover:text-[#00FF88] transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Services
        </Link>
 
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center mb-8 mx-auto lg:mx-0">
              <service.icon className="w-8 h-8 text-[#00FF88]" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight text-center lg:text-left">
              {service.title.split(' ')[0]} <span className="text-gradient">{service.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 text-center lg:text-left">
              {service.description}
            </p>
            
            <div className="prose prose-invert max-w-none prose-p:text-white/60 prose-headings:text-white prose-strong:text-[#00FF88] prose-li:text-white/60 prose-h3:text-2xl prose-h3:mt-8">
              <Markdown>{service.content}</Markdown>
            </div>

            <div className="mt-12">
              <Link to="/consultation" className="inline-flex items-center gap-3 px-8 py-4 bg-[#00FF88] text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl shadow-[#00FF88]/20 w-full sm:w-auto justify-center">
                Start Your Project <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:sticky lg:top-32"
          >
            <div className="relative group">
              <div className="aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent hidden lg:block" />
              </div>
              
              <div className="mt-8 lg:mt-0 lg:absolute lg:bottom-12 lg:left-12 lg:right-12">
                <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#00FF88]/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#00FF88]" />
                    </div>
                    <div className="text-white font-bold uppercase tracking-widest text-xs">Expert Insight</div>
                  </div>
                  <p className="text-white/60 text-sm italic leading-relaxed">
                    "We focus on the intersection of technical excellence and business value, ensuring every project delivers measurable results."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const AIPlanner = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [currentSayingIndex, setCurrentSayingIndex] = useState(0);

  const sayings = [
    "Hi there! Tell me what kind of website you are looking for.",
    "I can help you figure out what kind of website you need today.",
    "Let's architect your digital presence together.",
    "Ready to build something extraordinary?",
    "What features are you looking for in your new website?"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSayingIndex((prev) => (prev + 1) % sayings.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const result = await getProjectPlan(userMessage, sessionId);
      const newHistory = [...chatHistory, { role: 'user', text: userMessage }, { role: 'ai', text: result || "I couldn't generate a response at this time." }];
      setChatHistory(newHistory as any);
      
      const storedUser = localStorage.getItem('revline_user');
      let user = null;
      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
        } catch (e) {
          console.error('Failed to parse user', e);
        }
      }
      const userEmail = user ? user.email : null;
      const userName = user ? `${user.firstName} ${user.lastName}` : null;
      saveChatSession(sessionId, newHistory, userEmail, userName);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'ai', text: "Error generating response. Please check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory, loading]);

  const wordCount = chatHistory.length > 0 ? chatHistory.map(msg => msg.text).join(' ').split(/\s+/).length : 0;
  const intelligenceLevel = Math.min(Math.floor(wordCount / 20), 5); // Max level 5
  const intelligenceLabels = [
    "Greeting Mode",
    "Listening Mode",
    "Helpful Mode",
    "Guiding Mode",
    "Connecting Mode",
    "Booking Mode"
  ];

  return (
    <section id="ai-planner" className="py-24 md:py-32 px-6 relative overflow-hidden border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-30">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00FF88]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00D1FF]/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00FF88]/5 border border-[#00FF88]/10 text-[#00FF88] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Virtual Front Desk
          </div>
          <h2 className="font-display text-4xl md:text-7xl font-bold mb-6 text-white tracking-tight leading-[0.9]">Design <span className="text-gradient">Assistant</span></h2>
          <p className="text-white/40 text-lg max-w-3xl mx-auto leading-relaxed">Looking to build something extraordinary? Chat with our friendly assistant to architect your digital presence and book a call with us.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Snowy Mascot */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:w-1/3 flex flex-col items-center text-center"
          >
            <div className="relative group mb-10">
              <div className="absolute inset-0 bg-[#00FF88]/10 blur-3xl rounded-full group-hover:bg-[#00FF88]/20 transition-all duration-700" />
              <img 
                src={SNOWY_URL} 
                alt="Snowy" 
                className={cn(
                  "w-48 h-48 md:w-80 md:h-80 object-contain relative z-10 transition-all duration-700",
                  intelligenceLevel >= 3 ? "drop-shadow-[0_0_40px_rgba(0,255,136,0.4)] scale-105" : "drop-shadow-[0_0_20px_rgba(0,255,136,0.2)]"
                )}
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Intelligence Level Indicator */}
            <div className="mb-8 w-full max-w-[280px]">
              <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3 font-bold">
                <span>Assistant Status</span>
                <span className="text-[#00FF88]">{intelligenceLabels[intelligenceLevel]}</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#00FF88] to-[#00D1FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(intelligenceLevel / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 max-w-[300px] relative backdrop-blur-xl min-h-[120px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={currentSayingIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-white/70 italic leading-relaxed text-center"
                >
                  "{sayings[currentSayingIndex]}"
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Chat/Form Area */}
          <div className="flex-1 w-full glass rounded-[2.5rem] p-6 md:p-12 border border-white/10 relative overflow-hidden flex flex-col h-[600px] md:h-[750px] shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF88]/5 blur-[100px] -z-10" />
            
            {/* Chat History */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-8 space-y-8 pr-4 custom-scrollbar">
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-white/20 text-center p-8">
                  <p>Start by telling me what kind of website you're looking for. <br/>E.g., "I need a portfolio website for my photography business."</p>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-6 rounded-2xl max-w-[90%]",
                      msg.role === 'user' 
                        ? "bg-white/5 ml-auto border border-white/10" 
                        : "bg-[#00FF88]/5 mr-auto border border-[#00FF88]/10"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {msg.role === 'ai' ? (
                        <div className="w-8 h-8 rounded-lg bg-[#00FF88]/20 flex items-center justify-center">
                          <Terminal className="w-4 h-4 text-[#00FF88]" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-white/60" />
                        </div>
                      )}
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        msg.role === 'ai' ? "text-[#00FF88]" : "text-white/40"
                      )}>
                        {msg.role === 'ai' ? 'Snowy' : 'You'}
                      </span>
                    </div>
                    <div className={cn(
                      "prose prose-invert max-w-none prose-p:leading-relaxed prose-xs",
                      msg.role === 'ai' ? "prose-p:text-white/80 prose-strong:text-[#00FF88]" : "prose-p:text-white/60"
                    )}>
                      {msg.role === 'ai' ? (
                        <Markdown
                          components={{
                            a: ({ node, ...props }) => {
                              if (props.href?.startsWith('/')) {
                                const { href, ...rest } = props;
                                return <Link to={href} {...rest} />;
                              }
                              return <a target="_blank" rel="noopener noreferrer" {...props} />;
                            }
                          }}
                        >
                          {msg.text}
                        </Markdown>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 rounded-2xl max-w-[90%] bg-[#00FF88]/5 mr-auto border border-[#00FF88]/10 flex items-center gap-3"
                >
                  <div className="w-4 h-4 border-2 border-[#00FF88]/30 border-t-[#00FF88] rounded-full animate-spin" />
                  <span className="text-white/40 text-sm">Snowy is thinking...</span>
                </motion.div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="relative mt-auto">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message here..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF88]/40 transition-all duration-300 resize-none h-[60px] overflow-y-auto custom-scrollbar"
                rows={1}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 bottom-2 p-3 bg-[#00FF88] text-black rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all duration-300"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const MarketingShowcase = () => {
  const creatives = [
    { title: "Performance Scaling", category: "Meta Ads", img: "https://picsum.photos/seed/ad1/600/800" },
    { title: "Brand Identity", category: "TikTok Creative", img: "https://picsum.photos/seed/ad2/600/800" },
    { title: "Direct Response", category: "Google Display", img: "https://picsum.photos/seed/ad3/600/800" },
    { title: "UGC Style", category: "Social Content", img: "https://i.imgur.com/RCPp3pQ.png" },
  ];

  return (
    <section className="py-24 md:py-32 px-6 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="text-[#00FF88] text-xs font-bold uppercase tracking-[0.3em] mb-6">Marketing Spot</div>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight leading-[0.9] mb-6">
              High-Impact <span className="text-gradient">Ad Creatives</span>
            </h2>
            <p className="text-white/40 text-lg">
              We design visuals that stop the scroll and drive action. Our creatives are engineered for performance across every major platform.
            </p>
          </div>
          <Link to="/services/marketing-creatives" className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-center">
            Get Custom Creatives
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
          {creatives.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 glow-hover"
            >
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <div className="text-[#00FF88] text-[10px] font-black uppercase tracking-[0.3em] mb-2">{item.category}</div>
                <div className="text-xl font-display font-bold text-white tracking-tight">{item.title}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('revline_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user', e);
        localStorage.removeItem('revline_user');
      }
    }

    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem('revline_user');
      if (updatedUser) {
        try {
          setUser(JSON.parse(updatedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen selection:bg-[#00FF88]/30 bg-[#050505] text-white">
      {/* Hero Section */}
      <header className="relative lg:pt-20 pt-20 lg:pb-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-1/4 w-[800px] h-[800px] bg-[#00FF88]/10 rounded-full blur-[180px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-1/4 w-[700px] h-[700px] bg-[#00D1FF]/10 rounded-full blur-[180px] animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center lg:mb-6 mb-10 md:mb-16"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-[#00FF88]/20 blur-[100px] rounded-full group-hover:bg-[#00FF88]/40 transition-all duration-1000" />
              <img 
                src={MASCOT_URL} 
                alt="Revline Mascot" 
                className="w-32 h-32 lg:w-56 lg:h-56 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-[0_0_60px_rgba(0,255,136,0.4)] group-hover:scale-110 transition-transform duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter mb-8 lg:mb-10 md:mb-12 text-white leading-[0.85] uppercase">
              {user ? (
                <>Elevate <span className="text-gradient">{user.businessName}</span> <br /> to the Next Level.</>
              ) : (
                <>Engineering <br /><span className="text-gradient">Digital</span> Excellence.</>
              )}
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-white/40 text-sm md:text-lg lg:text-lg max-w-3xl mx-auto mb-10 lg:mb-12 leading-relaxed font-medium"
          >
            {user 
              ? `Welcome back, ${user.firstName}! We're ready to accelerate ${user.businessName}'s growth with high-performance digital products and custom AI solutions.`
              : 'Revline Hub is a rapid-deployment design and software studio. We craft and launch high-performance websites in just 1-2 days, getting your business online faster than anyone else.'}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-md mx-auto sm:max-w-none"
          >
            <Link to="/consultation" className="w-full sm:w-auto px-8 lg:px-10 py-4 lg:py-4.5 bg-[#00FF88] text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs md:text-sm lg:text-sm hover:scale-105 active:scale-95 transition-all duration-500 flex items-center justify-center gap-3 md:gap-4 group shadow-[0_20px_50px_rgba(0,255,136,0.3)]">
              Schedule a Consultation <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
            <Link to="/work" className="w-full sm:w-auto px-8 lg:px-10 py-4 lg:py-4.5 glass rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs md:text-sm lg:text-sm hover:bg-white/10 transition-all duration-500 text-white border border-white/20 flex items-center justify-center">
              View Our Work
            </Link>
          </motion.div>
        </div>

      {/* Floating Stats - Technical Grid Style */}
      <div className="max-w-7xl mx-auto mt-16 lg:mt-24 md:mt-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl bg-white/[0.02] shadow-2xl">
        {[
          { label: 'Turnaround Time', value: '1-2 Days' },
          { label: 'Client Satisfaction', value: '99%' },
          { label: 'Projects Delivered', value: '150+' },
          { label: 'Awards Won', value: '12' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 lg:p-12 md:p-10 text-center border-b sm:border-b-0 sm:border-r last:border-r-0 border-white/10 group hover:bg-white/[0.05] transition-all duration-500 glow-hover flex flex-col items-center justify-center"
          >
            <div className="text-4xl lg:text-5xl md:text-5xl font-display font-bold text-white mb-2 md:mb-4 group-hover:text-[#00FF88] transition-all duration-500 group-hover:scale-110">{stat.value}</div>
            <div className="text-white/30 text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </header>

    <section id="services" className="py-24 lg:py-32 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-12">
          <div className="max-w-4xl">
            <div className="text-[#00FF88] text-xs font-bold uppercase tracking-[0.4em] mb-6">Our Expertise</div>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white tracking-tight leading-[0.85]">Full-Spectrum <br /><span className="text-gradient">Design & Engineering</span></h2>
            <p className="text-white/40 text-lg lg:text-xl leading-relaxed max-w-2xl">We don't just build websites; we architect digital ecosystems that drive growth and redefine industries.</p>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('services');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-6 text-[#00FF88] font-black uppercase tracking-[0.2em] text-xs hover:gap-8 transition-all group"
          >
            <span>Explore all services</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard 
            icon={Globe}
            title="Web Architecture"
            description="High-performance, SEO-optimized web applications built with modern frameworks and cutting-edge performance patterns."
            delay={0.1}
            slug="web-architecture"
          />
          <ServiceCard 
            icon={Code2}
            title="Software Engineering"
            description="Custom enterprise solutions, API development, and scalable cloud infrastructure designed for reliability and speed."
            delay={0.2}
            slug="software-engineering"
          />
          <ServiceCard 
            icon={Layout}
            title="UI/UX Design"
            description="User-centric interfaces that blend aesthetic elegance with intuitive functionality to create memorable digital journeys."
            delay={0.3}
            slug="ui-ux-design"
          />
          <ServiceCard 
            icon={Palette}
            title="Marketing & Ads"
            description="High-converting ad creatives and strategic marketing campaigns designed to scale your brand across all platforms."
            delay={0.4}
            slug="marketing-creatives"
          />
        </div>
      </div>
    </section>

    {/* Process Section */}
    <section className="py-24 md:py-32 px-6 border-t border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#00FF88] text-xs font-bold uppercase tracking-[0.3em] mb-6">Our Workflow</div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight leading-[0.9] mb-6">Architected for <br /><span className="text-gradient">Speed & Precision</span></h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">From concept to live deployment in just 24-48 hours. We don't compromise on quality, we just move faster.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10 hidden md:block" />
          {[
            { step: '01', title: 'Discovery', desc: 'Deep dive into your business goals and user needs.' },
            { step: '02', title: 'Architecture', desc: 'Engineering the technical foundation for scalability.' },
            { step: '03', title: 'Execution', desc: 'Rapid development cycles with continuous feedback.' },
            { step: '04', title: 'Deployment', desc: 'Flawless launch and post-launch optimization.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center mb-8 font-display font-bold text-2xl text-[#00FF88] shadow-xl">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-white/40 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Marketing Showcase */}
    <MarketingShowcase />

    {/* AI Section */}
    <AIPlanner />

    {/* Trust Section */}
    <section className="py-24 md:py-32 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.015] pointer-events-none">
        <img src={MASCOT_URL} alt="" className="w-full h-full object-contain grayscale" referrerPolicy="no-referrer" />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#00FF88]/5 p-3 border border-[#00FF88]/10 group hover:bg-[#00FF88]/10 transition-colors">
                <img src={MASCOT_URL} alt="Mascot" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight leading-[0.9]">Why Industry Leaders <br />Choose <span className="text-[#00FF88]">Revline</span></h2>
            </div>
            <div className="grid gap-8">
              {[
                { title: 'Performance-First', desc: 'Every line of code is optimized for speed and scalability.' },
                { title: 'AI-Integrated', desc: 'Leveraging next-gen AI to accelerate development cycles.' },
                { title: 'Transparent', desc: 'Real-time project tracking and clear communication.' },
                { title: 'Post-Launch', desc: 'Continuous support and strategic scaling for your product.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-xl bg-[#00FF88]/5 border border-[#00FF88]/10 flex items-center justify-center shrink-0 group-hover:bg-[#00FF88]/10 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-[#00FF88]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] glass rounded-[3rem] overflow-hidden relative group border border-white/10">
              <img 
                src="https://picsum.photos/seed/tech-studio-v2/1200/900" 
                alt="Our Studio" 
                className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-12">
                <div>
                  <div className="text-[#00FF88] text-xs font-bold uppercase tracking-[0.3em] mb-4">Our Studio</div>
                  <div className="text-3xl font-display font-bold text-white leading-tight">Where innovation meets <br />flawless execution.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-24 md:py-32 px-6 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#00FF88] to-[#00D1FF]" />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <img src={LOGO_URL} alt="Logo" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="font-display font-bold text-3xl tracking-tighter text-white">REVLINE<span className="text-[#00FF88]">HUB</span></span>
            </div>
            <p className="text-white/30 max-w-sm text-lg leading-relaxed">
              Crafting high-performance digital products for the next generation of industry leaders. We blend aesthetic elegance with technical excellence.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://www.instagram.com/revline.hub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00FF88] hover:border-[#00FF88]/40 transition-all duration-300"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00FF88] hover:border-[#00FF88]/40 transition-all duration-300"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00FF88] hover:border-[#00FF88]/40 transition-all duration-300"><Github className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00FF88] hover:border-[#00FF88]/40 transition-all duration-300"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Studio</h4>
            <ul className="space-y-4 text-white/40 font-medium">
              <li><Link to="/work" className="hover:text-white transition-colors">Portfolio</Link></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">Services</button></li>
              <li><Link to="/consultation" className="hover:text-white transition-colors">Consultation</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Client Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Contact</h4>
            <ul className="space-y-4 text-white/40 font-medium">
              <li><a href="mailto:hello@revlinehub.com" className="hover:text-white transition-colors">hello@revlinehub.com</a></li>
              <li><span className="block">Los Angeles, CA</span></li>
              <li><span className="block">Mon — Fri: 9am — 6pm</span></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          <p>© 2024 Revline Hub. All rights reserved.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

const ConsultationPage = () => (
  <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0A0A0A]">
    <div className="max-w-5xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-brand-primary transition-colors mb-8 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Schedule a <span className="text-gradient">Consultation</span></h1>
          <p className="text-white/60 text-lg">Select a time that works best for you to discuss your project vision.</p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 md:w-32 md:h-32"
        >
          <img src={MASCOT_URL} alt="Mascot" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]" referrerPolicy="no-referrer" />
        </motion.div>
      </div>
      
      <div className="glass rounded-3xl overflow-hidden min-h-[700px] border border-white/10 relative">
        {/* Snowy in a Suit - Positioned to appear in the Calendly sidebar blank space */}
        <div className="absolute bottom-64 left-44 w-64 h-64 z-20 pointer-events-none hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <img 
              src={SNOWY_SUIT_URL} 
              alt="Snowy in Suit" 
              className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(0,255,136,0.5)]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
        </div>
        <iframe 
          src="https://calendly.com/zachwascavage/new-meeting-2?month=2026-03" 
          width="100%" 
          height="700" 
          frameBorder="0"
          className="relative z-10"
        />
      </div>
    </div>
  </div>
);

// --- Showcase Demos ---

const AutoPartsDemo = () => {
  const [cart, setCart] = useState<{ id: number, name: string, price: number, img: string }[]>([]);
  const [showCart, setShowCart] = useState(false);

  const parts = [
    { id: 1, name: "BMW G80 G82 G83 M3 M4 Carbon Fiber Front Lip", price: 749.95, img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600&h=600" },
    { id: 2, name: "BMW G80 M3 G82 M4 Carbon Fiber Side Skirt Extensions", price: 699.95, img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600&h=600" },
    { id: 3, name: "BMW G80 M3 G82 M4 Carbon Fiber Rear Diffuser", price: 849.95, img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600&h=600" },
    { id: 4, name: "BMW G80 G82 G83 M3 M4 Carbon Fiber Mirror Caps", price: 299.95, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600&h=600" },
    { id: 5, name: "BMW G80 M3 Carbon Fiber Performance Trunk Spoiler", price: 349.95, img: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=600&h=600" },
    { id: 6, name: "BMW G80 G82 G83 M3 M4 Carbon Fiber Grille Surrounds", price: 499.95, img: "https://images.unsplash.com/photo-1603584173870-7f3ca993466d?auto=format&fit=crop&q=80&w=600&h=600" },
  ];

  const addToCart = (part: typeof parts[0]) => {
    setCart([...cart, part]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="w-full h-full bg-white text-[#333] flex flex-col overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="bg-[#1a1a1a] text-white text-[10px] py-2 px-4 flex justify-between items-center uppercase tracking-widest font-bold">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-[#e31e24]" /> Free Shipping on Orders $500+</span>
          <span className="hidden md:flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#e31e24]" /> Fitment Guarantee</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => alert('Account feature coming soon!')} className="hover:text-[#e31e24]">My Account</button>
          <button onClick={() => alert('Contact feature coming soon!')} className="hover:text-[#e31e24]">Contact Us</button>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 py-6 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Menu className="w-6 h-6 md:hidden" />
          <div className="font-black text-2xl italic tracking-tighter flex items-center">
            <span className="text-[#333]">RW</span>
            <span className="text-[#e31e24]">CARBON</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-tight">
            <button onClick={() => alert('BMW Category')} className="hover:text-[#e31e24] flex items-center gap-1">BMW <ChevronDown className="w-3 h-3" /></button>
            <button onClick={() => alert('Mercedes Category')} className="hover:text-[#e31e24] flex items-center gap-1">Mercedes <ChevronDown className="w-3 h-3" /></button>
            <button onClick={() => alert('Audi Category')} className="hover:text-[#e31e24] flex items-center gap-1">Audi <ChevronDown className="w-3 h-3" /></button>
            <button onClick={() => alert('Tesla Category')} className="hover:text-[#e31e24] flex items-center gap-1">Tesla <ChevronDown className="w-3 h-3" /></button>
            <button onClick={() => alert('New Products')} className="hover:text-[#e31e24]">New Products</button>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <input type="text" placeholder="Search..." className="border border-gray-300 rounded-sm py-2 px-4 pr-10 text-xs w-48 focus:outline-none focus:border-[#e31e24]" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button onClick={() => setShowCart(true)} className="relative flex items-center gap-2 group">
            <ShoppingCart className="w-6 h-6 text-[#333] group-hover:text-[#e31e24]" />
            <div className="hidden md:block text-left">
              <div className="text-[10px] font-bold text-gray-400 uppercase leading-none">Your Cart</div>
              <div className="text-xs font-black">${total.toFixed(2)}</div>
            </div>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#e31e24] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#f9f9f9]">
        {/* Breadcrumbs */}
        <div className="px-6 py-4 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
          Home / BMW / Carbon Fiber Parts for BMW
        </div>

        {/* Category Header */}
        <div className="px-6 pb-8">
          <h1 className="text-3xl font-black italic text-[#333] mb-4 uppercase">Carbon Fiber Parts for BMW</h1>
          <div className="bg-white p-6 border border-gray-200 text-sm text-gray-600 leading-relaxed">
            RW Carbon is your premier source for high quality carbon fiber BMW parts and accessories. We carry a wide variety of parts including front lips, diffusers, spoilers, mirror caps, and side skirt extensions for almost every modern BMW model. All of our parts are crafted from genuine carbon fiber and finished with a high quality clear coat for a long lasting shine.
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 bg-white border-y border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
            <button className="flex items-center gap-1 hover:text-[#e31e24]"><Filter className="w-4 h-4" /> Filter By</button>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#e31e24]" />
              <ListIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            Sort By: <span className="text-[#333] flex items-center gap-1">Newest First <ChevronDown className="w-3 h-3" /></span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {parts.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 group hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="aspect-square relative overflow-hidden p-4">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute top-4 left-4 bg-[#e31e24] text-white text-[10px] font-bold px-2 py-1 uppercase italic">In Stock</div>
              </div>
              <div className="p-6 pt-0 flex-1 flex flex-col text-center">
                <h3 className="text-sm font-bold text-[#333] mb-4 min-h-[40px] hover:text-[#e31e24] cursor-pointer transition-colors leading-snug">
                  {item.name}
                </h3>
                <div className="mt-auto">
                  <div className="text-lg font-black text-[#e31e24] mb-4">${item.price.toFixed(2)}</div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-3 bg-[#333] text-white text-xs font-black uppercase tracking-widest hover:bg-[#e31e24] transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="bg-[#1a1a1a] text-white p-12 mt-12">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <Truck className="w-10 h-10 text-[#e31e24] mx-auto mb-4" />
              <h4 className="font-bold uppercase mb-2">Fast Shipping</h4>
              <p className="text-xs text-gray-400">Most orders ship within 24 hours from our California warehouse.</p>
            </div>
            <div>
              <ShieldCheck className="w-10 h-10 text-[#e31e24] mx-auto mb-4" />
              <h4 className="font-bold uppercase mb-2">Fitment Guarantee</h4>
              <p className="text-xs text-gray-400">We guarantee the fitment of every carbon fiber part we sell.</p>
            </div>
            <div>
              <Star className="w-10 h-10 text-[#e31e24] mx-auto mb-4" />
              <h4 className="font-bold uppercase mb-2">Quality Control</h4>
              <p className="text-xs text-gray-400">Every part is hand inspected before it leaves our facility.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-black italic uppercase text-[#333]">Shopping Cart ({cart.length})</h3>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300">
                    <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, i) => (
                    <div key={i} className="flex gap-4 pb-6 border-b border-gray-100">
                      <img src={item.img} alt={item.name} className="w-20 h-20 object-contain border border-gray-100" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-[#333] mb-1 leading-tight">{item.name}</div>
                        <div className="text-sm font-black text-[#e31e24]">${item.price.toFixed(2)}</div>
                        <button 
                          onClick={() => setCart(cart.filter((_, idx) => idx !== i))}
                          className="text-[10px] font-bold text-gray-400 uppercase hover:text-[#e31e24] mt-2 underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Subtotal</span>
                    <span className="text-xl font-black text-[#333]">${total.toFixed(2)}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-6 italic">Shipping & taxes calculated at checkout</div>
                  <button 
                    onClick={() => alert('Checkout feature coming soon!')}
                    className="w-full py-4 bg-[#e31e24] text-white text-sm font-black uppercase tracking-[0.2em] hover:bg-[#333] transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailerDemo = () => {
  const [step, setStep] = useState<'home' | 'services' | 'schedule' | 'confirm'>('home');
  const [selectedService, setSelectedService] = useState<any>(null);

  const services = [
    { id: 1, name: "Ceramic Coating", price: "From $899", time: "2 Days", icon: Star, desc: "Ultimate protection with a 5-year hydrophobic shield." },
    { id: 2, name: "Full Interior Detail", price: "$250", time: "4 Hours", icon: Droplets, desc: "Deep steam cleaning and leather conditioning for a factory finish." },
    { id: 3, name: "Paint Correction", price: "From $500", time: "1 Day", icon: Zap, desc: "Multi-stage machine polish to remove swirls and scratches." },
    { id: 4, name: "Maintenance Wash", price: "$85", time: "1 Hour", icon: Clock, desc: "Premium hand wash with wax sealant for regular upkeep." },
  ];

  const renderStep = () => {
    switch (step) {
      case 'home':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center py-12 px-6"
          >
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-200">
              <Droplets className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Showroom Quality,<br />At Your Doorstep.</h2>
            <p className="text-slate-500 text-lg max-w-md mb-10 leading-relaxed">
              Precision Detailer Pro provides elite mobile automotive care using the industry's finest products and techniques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <button 
                onClick={() => setStep('services')}
                className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Book Service
              </button>
              <button 
                onClick={() => alert('Gallery coming soon!')}
                className="flex-1 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                View Gallery
              </button>
            </div>
            
            <div className="mt-16 grid grid-cols-3 gap-8 w-full max-w-2xl">
              {[
                { label: "5-Star Rated", val: "500+" },
                { label: "Cars Detailed", val: "2.5k" },
                { label: "Expert Techs", val: "12" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-slate-900">{stat.val}</div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'services':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setStep('home')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-lg">Select a Service</h3>
              <div className="w-9" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => { setSelectedService(service); setStep('schedule'); }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-1">{service.name}</h4>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">{service.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="text-blue-600 font-black">{service.price}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {service.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'schedule':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setStep('services')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-lg">Choose Date & Time</h3>
              <div className="w-9" />
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 p-6 mb-6">
              <div className="grid grid-cols-7 gap-2 mb-8 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-[10px] font-bold text-slate-400 uppercase">{d}</div>
                ))}
                {Array.from({ length: 31 }).map((_, i) => (
                  <button 
                    key={i} 
                    className={cn(
                      "aspect-square rounded-xl text-sm font-bold flex items-center justify-center transition-all",
                      i === 14 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:bg-slate-50 text-slate-600"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['9:00 AM', '11:00 AM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'].map((t, i) => (
                  <button 
                    key={i}
                    onClick={() => setStep('confirm')}
                    className={cn(
                      "py-3 rounded-xl text-xs font-bold border transition-all",
                      i === 2 ? "bg-blue-50 border-blue-200 text-blue-600" : "border-slate-100 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-blue-900">Mobile Service Area</div>
                <div className="text-blue-600/70">We come to your home or office.</div>
              </div>
            </div>
          </motion.div>
        );
      case 'confirm':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-green-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h2>
            <p className="text-slate-500 mb-10">We've sent a confirmation email with all the details.</p>
            
            <div className="bg-slate-50 p-6 rounded-3xl text-left mb-10 border border-slate-100">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Service</div>
                <div className="font-bold text-slate-900">{selectedService?.name}</div>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</div>
                <div className="font-bold text-slate-900">March 15, 2024</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time</div>
                <div className="font-bold text-slate-900">1:30 PM</div>
              </div>
            </div>
            
            <button 
              onClick={() => setStep('home')}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
            >
              Back to Home
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-white text-slate-900 flex flex-col overflow-hidden font-sans">
      <nav className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="font-display font-bold text-xl tracking-tighter text-slate-900">PRECISION<span className="text-blue-600">DETAIL</span></div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
            <button onClick={() => setStep('services')} className="hover:text-blue-600 transition-colors">Services</button>
            <button onClick={() => alert('Gallery coming soon!')} className="hover:text-blue-600 transition-colors">Gallery</button>
            <button onClick={() => alert('Reviews coming soon!')} className="hover:text-blue-600 transition-colors">Reviews</button>
          </div>
          <button 
            onClick={() => setStep('services')}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Book Now
          </button>
        </div>
      </nav>
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const WrapVisualizerDemo = () => {
  const [color, setColor] = useState('#6C7174');
  const [finish, setFinish] = useState('Satin');
  const [model, setModel] = useState('Supercar');

  const colors = [
    { name: 'Nardo Grey', hex: '#6C7174' },
    { name: 'Acid Green', hex: '#B0FF00' },
    { name: 'Deep Purple', hex: '#4B0082' },
    { name: 'Frozen Blue', hex: '#00BFFF' },
    { name: 'Satin Gold', hex: '#D4AF37' },
    { name: 'Matte Black', hex: '#1A1A1A' },
    { name: 'Rosso Corsa', hex: '#D40000' },
    { name: 'Chalk White', hex: '#E5E5E5' },
    { name: 'British Racing Green', hex: '#004225' },
  ];

  const models = [
    { name: 'Supercar', icon: Zap, img: "https://www.pngplay.com/wp-content/uploads/13/Lamborghini-Aventador-Transparent-Background.png" },
    { name: 'Sedan', icon: Layout, img: "https://www.pngplay.com/wp-content/uploads/13/BMW-M4-Transparent-Images.png" },
    { name: 'SUV', icon: Box, img: "https://www.pngplay.com/wp-content/uploads/12/Range-Rover-Transparent-Free-PNG.png" },
    { name: 'Coupe', icon: Cpu, img: "https://www.pngplay.com/wp-content/uploads/12/Porsche-911-PNG-Free-File-Download.png" },
  ];

  const getFinishStyles = () => {
    switch (finish) {
      case 'Gloss':
        return {
          filter: 'contrast(1.2) brightness(1.1) saturate(1.1) drop-shadow(0 20px 30px rgba(0,0,0,0.5))',
        };
      case 'Matte':
        return {
          filter: 'brightness(0.8) contrast(0.9) saturate(0.8) drop-shadow(0 15px 25px rgba(0,0,0,0.4))',
        };
      case 'Satin':
        return {
          filter: 'brightness(0.95) contrast(1.05) saturate(0.9) drop-shadow(0 18px 28px rgba(0,0,0,0.45))',
        };
      case 'Chrome':
        return {
          filter: 'brightness(1.3) contrast(1.4) saturate(1.6) drop-shadow(0 25px 40px rgba(0,0,0,0.6))',
        };
      default:
        return { filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' };
    }
  };

  return (
    <div className="w-full h-full bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Visualizer Area */}
      <div className="flex-1 relative bg-[#0A0A0A] p-12 flex items-center justify-center overflow-hidden">
        {/* Studio Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#050505_100%)]" />
          <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          {/* Floor Reflection Area */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white/5 to-transparent" />
          
          {/* Overhead Studio Lights */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-[#00FF88]/30 blur-xl" />
          <div className="absolute top-12 left-1/4 w-1/2 h-px bg-white/10" />
        </div>

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={model + color + finish}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.1, x: -50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="relative w-full aspect-[21/9] flex items-center justify-center"
            >
              {/* The Car Container - This is where the color is applied only to the car shape */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* 1. The Color Base - Masked to the car's silhouette */}
                <div 
                  className="absolute inset-0 w-full h-full transition-colors duration-700"
                  style={{ 
                    backgroundColor: color,
                    maskImage: `url(${models.find(m => m.name === model)?.img})`,
                    WebkitMaskImage: `url(${models.find(m => m.name === model)?.img})`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                  }}
                />
                
                {/* 2. The Car Details Layer (Highlights, Shadows, Windows) */}
                <img 
                  src={models.find(m => m.name === model)?.img} 
                  alt={model}
                  className="relative w-full h-full object-contain mix-blend-multiply transition-all duration-700 pointer-events-none brightness-110 contrast-110"
                  style={getFinishStyles()}
                  referrerPolicy="no-referrer"
                />

                {/* 3. Extra Reflection Overlay for Realism */}
                <div 
                  className="absolute inset-0 w-full h-full opacity-20 mix-blend-screen pointer-events-none"
                  style={{ 
                    maskImage: `url(${models.find(m => m.name === model)?.img})`,
                    WebkitMaskImage: `url(${models.find(m => m.name === model)?.img})`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)'
                  }}
                />
              </div>

              {/* Status Indicators */}
              <div className="absolute top-0 left-0 flex items-center gap-4 z-20">
                <div className="px-4 py-1.5 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#00FF88] shadow-2xl">
                  {finish} Finish
                </div>
                <div className="px-4 py-1.5 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80 shadow-2xl">
                  {model}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dynamic Ground Shadow - Now independent of the car color */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-3/4 h-10 bg-black blur-3xl rounded-full -mt-4" 
          />
        </div>
        
        <div className="absolute top-8 left-8">
          <div className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00FF88] rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-black" />
            </div>
            WRAP<span className="text-zinc-500">STUDIO</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">
          <span>Real-time Rendering</span>
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <span>8K Textures</span>
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <span>PBR Materials</span>
        </div>
      </div>
      
      {/* Controls Area */}
      <div className="w-full lg:w-96 bg-zinc-900/50 backdrop-blur-xl border-l border-white/5 p-8 flex flex-col gap-10 overflow-y-auto">
        {/* Model Selection */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
            <div className="w-1 h-1 bg-[#00FF88] rounded-full" /> Select Vehicle Model
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {models.map((m) => (
              <button 
                key={m.name}
                onClick={() => setModel(m.name)}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300",
                  model === m.name 
                    ? "bg-[#00FF88]/10 border-[#00FF88] text-[#00FF88]" 
                    : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                )}
              >
                <m.icon className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Finish Selection */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
            <div className="w-1 h-1 bg-[#00FF88] rounded-full" /> Material Finish
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {['Gloss', 'Matte', 'Satin', 'Chrome'].map((f) => (
              <button 
                key={f}
                onClick={() => setFinish(f)}
                className={cn(
                  "py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                  finish === f 
                    ? "bg-white text-black border-white" 
                    : "bg-transparent border-white/10 text-white/60 hover:border-white/30"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
            <div className="w-1 h-1 bg-[#00FF88] rounded-full" /> Color Palette
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {colors.map((c) => (
              <button 
                key={c.name}
                onClick={() => setColor(c.hex)}
                className={cn(
                  "group relative aspect-square rounded-2xl border-2 transition-all p-1",
                  color === c.hex ? "border-[#00FF88]" : "border-transparent hover:border-white/20"
                )}
              >
                <div className="w-full h-full rounded-xl shadow-inner overflow-hidden" style={{ backgroundColor: c.hex }}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all text-[8px] font-bold uppercase tracking-tighter whitespace-nowrap text-zinc-500">
                  {c.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quote Summary */}
        <div className="mt-auto pt-10 border-t border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Estimated Price</div>
              <div className="text-2xl font-display font-bold text-white">$3,499.00</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-[#00FF88] uppercase tracking-widest mb-1">Ready to Wrap</div>
              <div className="text-xs text-zinc-500">3-5 Day Install</div>
            </div>
          </div>
          <button 
            onClick={() => alert(`Quote request sent for ${model} in ${color} ${finish}!`)}
            className="w-full py-5 bg-[#00FF88] text-black rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_-10px_rgba(0,255,136,0.3)]"
          >
            Request Custom Quote
          </button>
        </div>
      </div>
    </div>
  );
};

const WorkPage = () => {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: "Revline Auto Parts",
      description: "A high-performance e-commerce platform for premium automotive components with real-time inventory sync and advanced filtering.",
      url: "https://demo.vercel.store/",
      category: "E-Commerce / Retail"
    },
    {
      id: 2,
      title: "Precision Detailer Pro",
      description: "A comprehensive service management and booking system for mobile automotive detailing professionals with automated scheduling.",
      url: "https://calendly.com/zachwascavage/new-meeting-2",
      category: "Service / Booking"
    },
    {
      id: 3,
      title: "3D Wrap Visualizer",
      description: "An interactive 3D environment for vinyl wrap shops to showcase custom finishes and textures on high-fidelity vehicle models.",
      url: "https://threejs.org/examples/webgl_materials_car.html",
      category: "Interactive 3D"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#00FF88] transition-colors mb-12 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-500" /> Back to Home
          </Link>
          <h1 className="font-display text-6xl md:text-9xl font-bold mb-8 text-white tracking-tighter leading-[0.85]">
            Interactive <br /><span className="text-gradient">Showcase</span>
          </h1>
          <p className="text-white/40 text-xl md:text-2xl max-w-3xl leading-relaxed">
            Explore our latest experiments and production-ready digital products. These are live, interactive environments built to push the boundaries of the web.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: project.id * 0.1 }}
              className={cn(
                "p-8 glass rounded-3xl border transition-all duration-500 cursor-pointer group",
                activeProject === project.id ? "border-[#00FF88] bg-[#00FF88]/5" : "border-white/10 hover:border-white/20"
              )}
              onClick={() => setActiveProject(project.id)}
            >
              <div className="text-[#00FF88] text-xs font-bold uppercase tracking-widest mb-4">{project.category}</div>
              <h3 className="font-display text-2xl font-bold mb-4 text-white group-hover:text-[#00FF88] transition-colors">{project.title}</h3>
              <p className="text-white/60 mb-8 leading-relaxed">{project.description}</p>
              <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
                Launch Experience <ArrowRight className="w-5 h-5 text-[#00FF88]" />
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.div
              key={activeProject}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full aspect-video rounded-3xl overflow-hidden glass border border-white/10 relative"
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setActiveProject(null)}
                  className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="w-full h-full">
                {activeProject === 1 && <AutoPartsDemo />}
                {activeProject === 2 && <DetailerDemo />}
                {activeProject === 3 && <WrapVisualizerDemo />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!activeProject && (
          <div className="w-full aspect-video rounded-3xl border-2 border-dashed border-white/5 flex items-center justify-center text-white/20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <p className="text-lg">Select a project above to launch the interactive preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('revline_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (e) {
        localStorage.removeItem('revline_user');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const cleanEmail = email.toLowerCase().trim();
    
    // Manual validation
    if (!cleanEmail || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (!isLogin && (!firstName || !lastName || !businessName)) {
      setError('Please fill in all required fields to create your account.');
      return;
    }

    setLoading(true);
    
    try {
      // Sync local users to backend just in case
      await syncUsersToBackend();

      // Admin Check - Allow regardless of isLogin status if credentials match
      if (cleanEmail === 'admin@revline.hub' && password === 'revline_master_2026') {
        const adminData = {
          email: 'admin@revline.hub',
          firstName: 'Admin',
          lastName: 'User',
          businessName: 'Revline Hub Admin',
          isAdmin: true,
        };
        localStorage.setItem('revline_user', JSON.stringify(adminData));
        window.dispatchEvent(new Event('auth-change'));
        setLoading(false);
        setSuccess(true);
        setTimeout(() => navigate('/admin'), 1500);
        return;
      }

      if (isLogin) {
        const user = await loginUser(cleanEmail, password);
        if (user) {
          localStorage.setItem('revline_user', JSON.stringify(user));
          window.dispatchEvent(new Event('auth-change'));
          setSuccess(true);
          setTimeout(() => navigate(user.isAdmin ? '/admin' : '/dashboard'), 1500);
        } else {
          setError("Invalid email or password.");
        }
      } else {
        const userData = {
          email: cleanEmail,
          password,
          firstName,
          lastName,
          businessName,
          phoneNumber,
          isAdmin: false
        };
        const res = await registerUser(userData);
        if (res.success && res.user) {
          localStorage.setItem('revline_user', JSON.stringify(res.user));
          window.dispatchEvent(new Event('auth-change'));
          setSuccess(true);
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          setError(res.error || "Failed to create account.");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      alert(`${provider} login coming soon!`);
      setLoading(false);
    }, 1000);
  };

  if (success) {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('revline_user') || '{}');
    } catch (e) {
      user = {};
    }
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-[#050505] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF88]/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00FF88]/5 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass p-10 rounded-3xl border border-white/10 relative z-10 text-center"
        >
          <div className="w-20 h-20 bg-[#00FF88]/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-[#00FF88]" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-4">
            {isLogin ? `Welcome Back, ${user.firstName}!` : 'Account Created!'}
          </h1>
          <p className="text-white/60 mb-8">
            {isLogin 
              ? `Successfully logged in. Redirecting you to the hub...` 
              : `Your account for ${user.businessName} has been successfully created. Welcome to Revline Hub!`}
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-[#00FF88] text-black rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#050505] flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF88]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00FF88]/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 rounded-3xl border border-white/10 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#00FF88]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-[#00FF88]" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join Revline Hub'}
          </h1>
          <p className="text-white/60">
            {isLogin ? 'Enter your credentials to access your account' : 'Start your journey with us today'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">First Name</label>
                <input 
                  type="text" 
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF88]/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Last Name</label>
                <input 
                  type="text" 
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF88]/50 transition-colors"
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Business Name</label>
              <div className="relative">
                <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="text" 
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Revline Corp"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF88]/50 transition-colors"
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF88]/50 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF88]/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF88]/50 transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#00FF88] text-black rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_-10px_rgba(0,255,136,0.3)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#050505] px-4 text-white/40 font-bold tracking-widest">Or continue with</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleSocialLogin('Google')}
            disabled={loading}
            className="flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button 
            onClick={() => handleSocialLogin('Apple')}
            disabled={loading}
            className="flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05 1.61-3.19 1.61-1.11 0-1.55-.68-2.88-.68-1.32 0-1.85.66-2.83.68-1.05.02-2.2-.78-3.23-1.75-2.1-1.98-3.23-5.23-3.23-7.98 0-4.36 2.83-6.66 5.51-6.66 1.41 0 2.41.83 3.23.83.82 0 2.03-.98 3.64-.81 1.68.17 2.98.78 3.73 1.88-3.11 1.81-2.61 5.73.55 7.03-.75 1.88-1.75 3.65-3.33 4.85zM12.03 5.07c-.05-1.61.63-3.23 1.63-4.23.95-.95 2.53-1.61 4.03-1.61.15 1.71-.58 3.33-1.58 4.33-1 1-2.58 1.61-4.08 1.51z" />
            </svg>
            Apple
          </button>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {isLogin ? (
              <>Don't have an account? <span className="text-[#00FF88] font-bold">Sign Up</span></>
            ) : (
              <>Already have an account? <span className="text-[#00FF88] font-bold">Log In</span></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<any[]>([]);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'active' | 'deleted' | 'chats'>('active');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteArchived, setConfirmDeleteArchived] = useState<number | null>(null);
  const [expandedChat, setExpandedChat] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      const allUsers = await fetchAllUsers();
      setUsers(allUsers.filter((u: any) => !u.deletedAt));
      setDeletedUsers(allUsers.filter((u: any) => u.deletedAt));
      
      const sessions = await getChatSessions();
      setChatSessions(sessions);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('revline_user');
    let isAdmin = false;
    if (storedUser) {
      try {
        isAdmin = JSON.parse(storedUser).isAdmin;
      } catch (e) {
        localStorage.removeItem('revline_user');
      }
    }
    
    if (!storedUser || !isAdmin) {
      navigate('/');
      return;
    }
    loadData();
    window.addEventListener('auth-change', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('auth-change', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, [navigate, loadData]);

  const handleDeleteUser = async (email: string) => {
    if (!email) return;
    try {
      await deleteUser(email);
      
      // Notify other components
      window.dispatchEvent(new Event('auth-change'));
      
      // If the deleted user is the one currently logged in
      const storedUser = localStorage.getItem('revline_user');
      if (storedUser) {
        try {
          const currentUser = JSON.parse(storedUser);
          if (currentUser.email.toLowerCase().trim() === email.toLowerCase().trim()) {
            localStorage.removeItem('revline_user');
            window.dispatchEvent(new Event('auth-change'));
            navigate('/');
          }
        } catch (e) {
          localStorage.removeItem('revline_user');
        }
      }
      
      setConfirmDelete(null);
      loadData();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleDeleteArchivedUser = async (index: number) => {
    try {
      const userToDelete = deletedUsers[index];
      if (!userToDelete) return;
      
      await permanentDeleteUser(userToDelete.email);
      
      setConfirmDeleteArchived(null);
      // Notify other components
      window.dispatchEvent(new Event('auth-change'));
      loadData();
    } catch (err) {
      console.error('Error removing archived user:', err);
      alert('Failed to remove archived user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen lg:pt-24 lg:pb-16 pt-32 pb-20 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between lg:gap-4 gap-6 lg:mb-8 mb-12">
          <div>
            <h1 className="lg:text-2xl text-3xl md:text-4xl font-display font-bold text-white mb-2">Admin <span className="text-[#00FF88]">Hub</span></h1>
            <p className="text-white/40 text-sm">Manage users and monitor interactions.</p>
          </div>
          <div className="flex flex-wrap items-center lg:gap-3 gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="h-10 px-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white text-xs font-bold transition-all flex items-center gap-2 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </button>
            
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setViewMode('active')}
                className={`h-8 px-4 rounded-lg text-[10px] lg:text-xs font-bold transition-all flex items-center gap-2 ${
                  viewMode === 'active' 
                    ? 'bg-[#00FF88] text-black shadow-lg shadow-[#00FF88]/20' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Active
              </button>
              <button 
                onClick={() => setViewMode('deleted')}
                className={`h-8 px-4 rounded-lg text-[10px] lg:text-xs font-bold transition-all flex items-center gap-2 ${
                  viewMode === 'deleted' 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Archived
              </button>
              <button 
                onClick={() => setViewMode('chats')}
                className={`h-8 px-4 rounded-lg text-[10px] lg:text-xs font-bold transition-all flex items-center gap-2 ${
                  viewMode === 'chats' 
                    ? 'bg-[#00FF88] text-black shadow-lg shadow-[#00FF88]/20' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chats
              </button>
            </div>
            
            {viewMode !== 'chats' && (
              <button 
                onClick={async () => {
                  const isDeletedMode = viewMode === 'deleted';
                  const msg = isDeletedMode 
                    ? 'This will clear ALL archived deleted accounts. Are you sure?' 
                    : 'DANGER: This will clear ALL user data and sessions. Are you sure?';
                  
                  if (window.confirm(msg)) {
                    await deleteAllUsers(isDeletedMode ? 'deleted' : 'active');
                    if (!isDeletedMode) {
                      localStorage.removeItem('revline_user');
                      window.dispatchEvent(new Event('auth-change'));
                      navigate('/');
                    }
                    window.dispatchEvent(new Event('auth-change'));
                    loadData();
                  }
                }}
                className="h-10 px-4 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 text-red-500 text-[10px] lg:text-xs font-bold transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                {viewMode === 'deleted' ? 'Clear Archive' : 'Clear All Data'}
              </button>
            )}
            
            <div className={`h-10 px-4 rounded-xl border flex items-center gap-2 transition-all ${
              viewMode === 'deleted' ? 'bg-red-500/5 border-red-500/10' : 'bg-[#00FF88]/5 border-[#00FF88]/10'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${viewMode === 'deleted' ? 'bg-red-500' : 'bg-[#00FF88]'}`} />
              <span className="text-white/90 text-[10px] lg:text-xs font-bold">
                {viewMode === 'deleted' ? deletedUsers.length : viewMode === 'chats' ? chatSessions.length : users.length} 
                <span className="text-white/40 ml-1 font-medium">
                  {viewMode === 'deleted' ? 'Deleted' : viewMode === 'chats' ? 'Sessions' : 'Total'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

        <div className="grid gap-6">
          {viewMode === 'chats' ? (
            chatSessions.length === 0 ? (
              <div className="glass lg:p-12 p-20 rounded-3xl border border-white/10 text-center">
                <div className="lg:w-16 lg:h-16 w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="lg:w-8 lg:h-8 w-10 h-10 text-white/20" />
                </div>
                <h3 className="lg:text-lg text-xl font-bold text-white mb-2">No chat sessions yet</h3>
                <p className="text-white/40 text-sm">When users interact with the AI assistant, their conversations will appear here.</p>
              </div>
            ) : (
              chatSessions.map((session) => (
                <div key={session.sessionId} className="glass lg:p-4 p-6 rounded-2xl border border-white/10">
                  Chat Session: {session.sessionId}
                </div>
              ))
            )
          ) : (
            viewMode === 'active' ? (
              users.length === 0 ? (
                <div className="glass lg:p-12 p-20 rounded-3xl border border-white/10 text-center">
                  <div className="lg:w-16 lg:h-16 w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="lg:w-8 lg:h-8 w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="lg:text-lg text-xl font-bold text-white mb-2">No users registered yet</h3>
                  <p className="text-white/40 text-sm">When users sign up, they will appear here in the admin hub.</p>
                </div>
              ) : (
                users.map((user) => (
                  <motion.div 
                    key={user.email}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass lg:p-4 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between lg:gap-4 gap-6 hover:border-[#00FF88]/30 transition-all group"
                  >
                    <div className="flex items-center lg:gap-4 gap-6">
                      <div className="lg:w-12 lg:h-12 w-14 h-14 bg-[#00FF88]/10 rounded-xl flex items-center justify-center group-hover:bg-[#00FF88]/20 transition-colors">
                        <User className="lg:w-6 lg:h-6 w-7 h-7 text-[#00FF88]" />
                      </div>
                      <div>
                        <h3 className="lg:text-lg text-xl font-bold text-white">{user.firstName} {user.lastName}</h3>
                        <p className="text-white/40 text-[10px] lg:text-[9px] uppercase tracking-widest font-bold">{user.businessName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-4 gap-6 md:gap-8">
                      <div className="flex items-center gap-3">
                        <div className="lg:w-8 lg:h-8 w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                          <Globe className="lg:w-4 lg:h-4 w-5 h-5 text-white/40" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-0.5">Email Address</div>
                          <div className="text-white font-medium text-xs lg:text-[13px]">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="lg:w-8 lg:h-8 w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                          <Phone className="lg:w-4 lg:h-4 w-5 h-5 text-white/40" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-0.5">Phone Number</div>
                          <div className="text-white font-medium text-xs lg:text-[13px]">{user.phoneNumber}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="lg:w-8 lg:h-8 w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                          <Calendar className="lg:w-4 lg:h-4 w-5 h-5 text-white/40" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-0.5">Joined</div>
                          <div className="text-white font-medium text-xs lg:text-[13px]">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center relative z-20">
                      <AnimatePresence mode="wait">
                        {confirmDelete === user.email ? (
                          <motion.div 
                            key="confirm"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-2"
                          >
                            <button 
                              onClick={() => handleDeleteUser(user.email)}
                              className="px-3 py-1.5 lg:px-2.5 lg:py-1 bg-red-500 text-white rounded-lg text-[10px] font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => setConfirmDelete(null)}
                              className="px-3 py-1.5 lg:px-2.5 lg:py-1 bg-white/10 text-white rounded-lg text-[10px] font-bold hover:bg-white/20 transition-colors"
                            >
                              Cancel
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button 
                            key="delete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setConfirmDelete(user.email);
                            }}
                            className="lg:w-10 lg:h-10 w-12 h-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center transition-all border border-red-500/20 cursor-pointer group/btn"
                            title="Delete User"
                          >
                            <Trash2 className="lg:w-4 lg:h-4 w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              deletedUsers.length === 0 ? (
                <div className="glass lg:p-12 p-20 rounded-3xl border border-white/10 text-center">
                  <div className="lg:w-16 lg:h-16 w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trash2 className="lg:w-8 lg:h-8 w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="lg:text-lg text-xl font-bold text-white mb-2">No deleted accounts yet</h3>
                  <p className="text-white/40 text-sm">When users or admins delete accounts, they will appear here for reference.</p>
                </div>
              ) : (
                deletedUsers.map((user, idx) => (
                  <motion.div 
                    key={`${user.email}-${user.deletedAt}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass lg:p-3 p-4 rounded-2xl border border-red-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-red-500/30 transition-all group"
                  >

                    <div className="flex items-center gap-4 flex-1">
                      <div className="lg:w-8 lg:h-8 w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                        <User className="lg:w-4 lg:h-4 w-5 h-5 text-red-500" />
                      </div>
                      
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-12 flex-1">
                        <div className="min-w-[160px]">
                          <h3 className="lg:text-base text-lg font-bold text-white leading-tight">{user.firstName} {user.lastName}</h3>
                          <p className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-bold">{user.businessName}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center lg:gap-x-6 gap-x-8 gap-y-2">
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold mb-0.5">Email</span>
                            <span className="text-white/70 text-xs font-medium">{user.email}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold mb-0.5">Phone</span>
                            <span className="text-white/70 text-xs font-medium">{user.phoneNumber || 'N/A'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold mb-0.5">Joined</span>
                            <span className="text-white/70 text-xs font-medium">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold mb-0.5">Deleted</span>
                            <span className="text-white/70 text-xs font-medium">{new Date(user.deletedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold mb-0.5">Deleted By</span>
                            <span className="text-white/70 text-xs font-medium capitalize">{user.deletedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                        Archived
                      </div>
                      
                      <AnimatePresence mode="wait">
                        {confirmDeleteArchived === idx ? (
                          <motion.div 
                            key="confirm-archived"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-2"
                          >
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteArchivedUser(idx);
                              }}
                              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setConfirmDeleteArchived(null);
                              }}
                              className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-[10px] font-bold hover:bg-white/20 transition-colors"
                            >
                              Cancel
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button 
                            key="delete-archived"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setConfirmDeleteArchived(idx);
                            }}
                            className="w-10 h-10 bg-white/5 hover:bg-red-500/10 text-white/20 hover:text-red-500 rounded-xl flex items-center justify-center transition-all border border-white/10 hover:border-red-500/20 group/del"
                            title="Remove from Archive"
                          >
                            <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))
              )
            )
          )}
        </div>
      </div>
    );
  };

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('revline_user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        businessName: parsedUser.businessName || ''
      });
    } catch (e) {
      localStorage.removeItem('revline_user');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('revline_user');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = { ...user, ...formData };
      
      // In a real app, we'd call an API here. 
      // For now, we update localStorage and state.
      localStorage.setItem('revline_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      
      // Trigger auth change to update header
      window.dispatchEvent(new Event('auth-change'));
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#050505]">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/10 flex items-center justify-center border border-[#00FF88]/20">
              <User className="w-6 h-6 text-[#00FF88]" />
            </div>
            <h1 className="font-display text-4xl font-bold text-white tracking-tight">My <span className="text-gradient">Profile</span></h1>
          </div>
          
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all flex items-center gap-2 text-sm"
            >
              <Settings className="w-4 h-4 text-[#00FF88]" />
              Edit Info
            </button>
          )}
        </header>

        <div className="glass p-8 rounded-[2rem] border border-white/5">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 block">First Name</label>
                  <input 
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF88]/40 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 block">Last Name</label>
                  <input 
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF88]/40 transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 block">Business Name</label>
                <input 
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF88]/40 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 block">Email (Read Only)</label>
                <input 
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/40 cursor-not-allowed"
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-[#00FF88] text-black rounded-xl font-bold hover:scale-[1.02] transition-all"
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: user.firstName,
                      lastName: user.lastName,
                      businessName: user.businessName
                    });
                  }}
                  className="flex-1 py-4 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 block">Name</label>
                <div className="text-white text-lg">{user.firstName} {user.lastName}</div>
              </div>
              <div>
                <label className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 block">Email</label>
                <div className="text-white text-lg">{user.email}</div>
              </div>
              <div>
                <label className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 block">Business Name</label>
                <div className="text-white text-lg">{user.businessName}</div>
              </div>
              
              <div className="pt-6 border-t border-white/10">
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('revline_user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (requireAdmin && !user.isAdmin) {
        navigate('/');
        return;
      }

      setIsAuthorized(true);
      setChecking(false);
    } catch (e) {
      localStorage.removeItem('revline_user');
      navigate('/login');
    }
  }, [navigate, requireAdmin]);

  if (checking) return null;
  return isAuthorized ? <>{children}</> : null;
};

export default function App() {
  useEffect(() => {
    syncUsersToBackend().catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <div className="noise-overlay" />
      <ScrollToTop />
      <Navbar />
      <div className="pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={
            <ShopLayout>
              {({ onAddToCart }) => <AutoPartsHomePage onAddToCart={onAddToCart} />}
            </ShopLayout>
          } />
          <Route path="/shop/products/:productId" element={
            <ShopLayout>
              {({ onAddToCart }) => <ProductDetailPage onAddToCart={onAddToCart} />}
            </ShopLayout>
          } />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
