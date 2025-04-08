'use client'
import { useState, useEffect, useContext, createContext } from 'react';
import { 
  Sprout, 
  Cloud, 
  Calendar, 
  BarChart3, 
  BookOpen, 
  DollarSign, 
  Home, 
  Menu, 
  X, 
  Settings,
  Droplets,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "../sass/fonts.scss";

// Create context for sidebar state
export const SidebarContext = createContext({
  isOpen: true,
  toggleSidebar: () => {},
  sidebarWidth: '240px'
});

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/dashboard');
  const [sidebarWidth, setSidebarWidth] = useState('240px'); 

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
        setSidebarWidth('0px');
      } else {
        setIsOpen(true);
        setSidebarWidth('240px');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Set active route based on current path
    setActiveRoute(window.location.pathname);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update sidebar width when open/closed state changes
  useEffect(() => {
    if (isOpen) {
      setSidebarWidth(isMobile ? '240px' : '240px');
    } else {
      setSidebarWidth(isMobile ? '0px' : '72px');
    }
  }, [isOpen, isMobile]);

  const routes = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Crop Monitoring', path: '/crop-monitoring', icon: Sprout },
    { name: 'Irrigation', path: '/irrigation', icon: Droplets },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Crop Library', path: '/library', icon: BookOpen },
    { name: 'Expenses', path: '/expenses', icon: DollarSign },
    { name: 'Weather', path: '/weather', icon: Cloud },
  ];

  const sidebarVariants = {
    open: { 
      width: '240px',
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 30 
      } 
    },
    closed: { 
      width: isMobile ? '0px' : '72px',
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 40 
      } 
    }
  };

  const handleRouteChange = (path) => {
    setActiveRoute(path);
    if (isMobile) setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, sidebarWidth }}>
      <>
        {/* Mobile Overlay */}
        {isMobile && isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Toggle Button for Mobile */}
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 p-2 rounded-md bg-emerald-600 text-white z-30 md:hidden flex items-center justify-center"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar */}
        <motion.div
          variants={sidebarVariants}
          animate={isOpen ? 'open' : 'closed'}
          initial={isMobile ? 'closed' : 'open'}
          className={`fixed top-0 left-0 h-full bg-gradient-to-b from-emerald-700 to-indigo-900 text-white shadow-xl z-30
                     ${isMobile ? 'transition-transform' : ''}
                     ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}`}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(16, 185, 129, 0.9), rgba(79, 70, 229, 0.9)), url('/assets/farm-pattern.jpg')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          {/* Logo and Toggle Section */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-lg p-1">
                <Sprout className="text-emerald-600" size={24} />
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-bold text-lg"
                  >
                    FarmSense
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!isMobile && (
              <button 
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-emerald-600 transition-colors"
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>

          {/* User Profile Section */}
          <div className={`px-3 py-4 border-b border-emerald-600/30 ${!isOpen && 'flex justify-center'}`}>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <div className="font-medium">John Farmer</div>
                    <div className="text-xs text-emerald-100">Premium Plan</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 px-2">
            <ul className="space-y-2">
              {routes.map((route) => {
                const Icon = route.icon;
                const isActive = activeRoute === route.path;
                
                return (
                  <li key={route.path}>
                    <button
                      onClick={() => handleRouteChange(route.path)}
                      className={`flex items-center w-full p-2 rounded-lg transition-all duration-300 relative
                                ${isActive 
                                  ? 'bg-white text-emerald-700 font-medium shadow-md' 
                                  : 'text-white hover:bg-emerald-600/30'}`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-pill"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-l-md"
                        />
                      )}
                      <Icon size={isOpen ? 18 : 20} className={`${!isOpen ? 'mx-auto' : 'mr-3'} ${isActive && 'text-emerald-600'}`} />
                      <AnimatePresence>
                        {isOpen && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {route.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Actions */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-600/30 ${!isOpen && 'flex justify-center'}`}>
            <button className="flex items-center text-sm text-emerald-100 hover:text-white transition-colors">
              <Settings size={isOpen ? 16 : 20} className={`${!isOpen ? 'mx-auto' : 'mr-2'}`} />
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Subtle Decorative Elements */}
          <div className="absolute bottom-20 left-0 right-0 opacity-5 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-full h-24">
              <path d="M7,2C3.5,7,3.5,12,7,17C10.5,12,10.5,7,7,2Z"/>
              <path d="M12,2C8.5,7,8.5,12,12,17C15.5,12,15.5,7,12,2Z"/>
              <path d="M17,2C13.5,7,13.5,12,17,17C20.5,12,20.5,7,17,2Z"/>
            </svg>
          </div>
        </motion.div>
      </>
    </SidebarContext.Provider>
  );
}

export default Sidebar;