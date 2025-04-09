'use client'

import { useState, useEffect, createContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sprout, 
  Cloud, 
  Calendar, 
  BarChart3, 
  BookOpen, 
  Home, 
  Menu, 
  X, 
  Settings,
  Droplets,
  User,
  Leaf,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getStoredUser, logout, isAuthenticated } from '../services/authService';

// Context for sidebar state management
export const SidebarContext = createContext({
  sidebarWidth: '280px' // Slightly wider for modern look
});

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  interface User {
    username: string;
    plan: string;
  }
  
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const SIDEBAR_WIDTH = '280px';

  // Fetch user data on mount
  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
    
    // Redirect to login if not authenticated
    if (!isAuthenticated() && pathname !== '/login' && pathname !== '/register') {
      router.push('/');
    }
  }, [pathname, router]);

  // Auto-close sidebar when route changes on mobile
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle logout - properly destroy the token then navigate
  const handleLogout = async () => {
    try {
      // This will properly remove tokens from localStorage AND notify the server
      await logout();
      
      // Only navigate after the token is destroyed
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if server notification fails, ensure client-side logout occurs
      router.push('/');
    }
  };

  // Routes configuration
  const routes = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Crop Monitoring', path: '/crop', icon: Sprout },
    { name: 'Irrigation', path: '/irrigation', icon: Droplets },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Crop Library', path: '/library', icon: BookOpen },
    { name: 'Weather', path: '/weather', icon: Cloud },
  ];

  // Group routes by category
  const mainRoutes = routes.slice(0, 4);
  const secondaryRoutes = routes.slice(4);

  // Animation for background elements
  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <SidebarContext.Provider value={{ sidebarWidth: SIDEBAR_WIDTH }}>
      {/* Mobile menu button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-5 left-5 p-3 rounded-full bg-emerald-600 text-white shadow-lg z-50 md:hidden hover:bg-emerald-700 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-70 z-40 md:z-10
          shadow-lg transition-transform duration-300 ease-in-out
          flex flex-col
          md:translate-x-0 overflow-hidden
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ width: SIDEBAR_WIDTH }}
      >
        {/* Background Image with Overlay Gradient */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {/* Farm background image */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: 'url("/assets/farm6.jpg")' }}
          />
          
          {/* Overlay gradient that fades to solid color toward bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/70 via-emerald-700/90 to-emerald-800" />

          {/* Animated floating particles */}
          <motion.div 
            className="absolute top-40 right-10 w-16 h-16 rounded-full bg-emerald-300 opacity-10"
            variants={floatingAnimation}
            animate="animate"
          />
          <motion.div 
            className="absolute top-80 left-8 w-20 h-20 rounded-full bg-emerald-200 opacity-10"
            variants={floatingAnimation}
            animate="animate"
            transition={{ delay: 1.5 }}
          />
          <motion.div 
            className="absolute bottom-40 right-12 w-12 h-12 rounded-full bg-yellow-200 opacity-10"
            variants={floatingAnimation}
            animate="animate"
            transition={{ delay: 2.8 }}
          />
        </div>

        {/* Logo Header with Decorative Element */}
        <div className="relative h-24 flex items-center px-6 z-10">
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 rounded-full bg-yellow-300 opacity-20 transform translate-x-8 -translate-y-8"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.25, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="flex items-center space-x-3">
            <motion.div 
              className="bg-white rounded-lg p-2 shadow-md"
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Leaf className="text-emerald-600" size={22} />
            </motion.div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight">FarmSense</h1>
              <p className="text-xs text-emerald-50 font-medium">Smart Agriculture</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-6 py-4 border-b border-emerald-700/30 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-sm">
              <User size={22} className="text-white" />
            </div>
            <div>
              <div className="font-medium text-white">{user?.username || 'Guest User'}</div>
              <div className="text-xs flex items-center text-emerald-100">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
                {user?.plan || 'Basic'} Plan
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-3 relative z-10">
          {/* Main Navigation */}
          <div className="mb-6">
            <h2 className="text-xs uppercase font-semibold text-emerald-100 ml-2 mb-2">
              Main
            </h2>
            <ul className="space-y-1">
              {mainRoutes.map((route) => {
                const Icon = route.icon;
                const isActive = pathname === route.path;
                
                return (
                  <li key={route.path}>
                    <Link 
                      href={route.path}
                      className={`
                        flex items-center w-full p-2.5 rounded-lg transition-all duration-200 relative
                        ${isActive 
                          ? 'bg-emerald-400/20 text-white font-medium backdrop-blur-sm' 
                          : 'text-emerald-50 hover:bg-emerald-700/30 hover:text-white'}
                      `}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-nav-pill"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {/* Animated highlight when active */}
                      {isActive && (
                        <motion.div 
                          className="absolute inset-0 rounded-lg bg-emerald-300/10"
                          animate={{ 
                            boxShadow: ["0 0 0px rgba(16, 185, 129, 0)", "0 0 8px rgba(16, 185, 129, 0.3)", "0 0 0px rgba(16, 185, 129, 0)"] 
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      
                      <div className={`
                        mr-3 p-1.5 rounded-md
                        ${isActive 
                          ? 'bg-emerald-400/30 text-white' 
                          : 'bg-emerald-800/40 text-emerald-100'}
                      `}>
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <span>{route.name}</span>
                      
                      {/* Active indicator pulse for mobile */}
                      {isActive && (
                        <motion.div 
                          className="ml-auto w-2 h-2 rounded-full bg-emerald-300"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Secondary Navigation */}
          <div>
            <h2 className="text-xs uppercase font-semibold text-emerald-100 ml-2 mb-2">
              Resources
            </h2>
            <ul className="space-y-1">
              {secondaryRoutes.map((route) => {
                const Icon = route.icon;
                const isActive = pathname === route.path;
                
                return (
                  <li key={route.path}>
                    <Link 
                      href={route.path}
                      className={`
                        flex items-center w-full p-2.5 rounded-lg transition-all duration-200 relative
                        ${isActive 
                          ? 'bg-emerald-400/20 text-white font-medium backdrop-blur-sm' 
                          : 'text-emerald-50 hover:bg-emerald-700/30 hover:text-white'}
                      `}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-resources-pill"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {/* Animated highlight when active */}
                      {isActive && (
                        <motion.div 
                          className="absolute inset-0 rounded-lg bg-emerald-300/10"
                          animate={{ 
                            boxShadow: ["0 0 0px rgba(16, 185, 129, 0)", "0 0 8px rgba(16, 185, 129, 0.3)", "0 0 0px rgba(16, 185, 129, 0)"] 
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      
                      <div className={`
                        mr-3 p-1.5 rounded-md
                        ${isActive 
                          ? 'bg-emerald-400/30 text-white' 
                          : 'bg-emerald-800/40 text-emerald-100'}
                      `}>
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <span>{route.name}</span>
                      
                      {/* Active indicator for mobile */}
                      {isActive && (
                        <motion.div 
                          className="ml-auto w-2 h-2 rounded-full bg-emerald-300"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-emerald-700/30 p-4 space-y-2 relative z-10">
          <button className="flex items-center w-full p-2 rounded-lg text-emerald-100 hover:bg-emerald-700/30 hover:text-white transition-colors">
            <div className="mr-3 p-1.5 rounded-md bg-emerald-800/40 text-emerald-100">
              <Settings size={18} strokeWidth={2} />
            </div>
            <span>Settings</span>
          </button>
          
          <button className="flex items-center w-full p-2 rounded-lg text-emerald-100 hover:bg-emerald-700/30 hover:text-white transition-colors">
            <div className="mr-3 p-1.5 rounded-md bg-emerald-800/40 text-emerald-100">
              <HelpCircle size={18} strokeWidth={2} />
            </div>
            <span>Help & Support</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-lg text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-colors"
          >
            <div className="mr-3 p-1.5 rounded-md bg-red-900/30 text-red-300">
              <LogOut size={18} strokeWidth={2} />
            </div>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </SidebarContext.Provider>
  );
};

export default Sidebar;