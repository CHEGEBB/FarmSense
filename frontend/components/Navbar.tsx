// components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <motion.span 
            className={`text-2xl font-bold ${scrolled ? 'text-emerald-600' : 'text-white'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Farm<span className="text-emerald-400">Sense</span>
          </motion.span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <motion.a 
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('features');
            }}
            className={`font-medium ${scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white hover:text-emerald-300'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Features
          </motion.a>
          <motion.a 
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('pricing');
            }}
            className={`font-medium ${scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white hover:text-emerald-300'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Pricing
          </motion.a>
          <motion.a 
            href="#"
            className={`font-medium ${scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white hover:text-emerald-300'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            About
          </motion.a>
          <motion.a 
            href="#"
            className={`font-medium ${scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white hover:text-emerald-300'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Contact
          </motion.a>
        </div>
        
        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/auth?mode=login">
            <motion.button 
              className={`font-semibold px-4 py-2 rounded-lg transition duration-300 ${
                scrolled 
                  ? 'text-emerald-600 hover:bg-emerald-50' 
                  : 'text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Log In
            </motion.button>
          </Link>
          <Link href="/auth?mode=signup">
            <motion.button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className={`p-1 ${scrolled ? 'text-gray-800' : 'text-white'}`}
          >
            {isOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden bg-white shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a 
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('features');
                }}
                className="block py-2 text-gray-800 hover:text-emerald-600 font-medium"
              >
                Features
              </a>
              <a 
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('pricing');
                }}
                className="block py-2 text-gray-800 hover:text-emerald-600 font-medium"
              >
                Pricing
              </a>
              <a href="#" className="block py-2 text-gray-800 hover:text-emerald-600 font-medium">
                About
              </a>
              <a href="#" className="block py-2 text-gray-800 hover:text-emerald-600 font-medium">
                Contact
              </a>
              <div className="pt-4 flex flex-col space-y-3">
                <Link href="/auth?mode=login">
                  <button className="w-full text-center py-2 text-emerald-600 font-semibold border border-emerald-600 rounded-lg">
                    Log In
                  </button>
                </Link>
                <Link href="/auth?mode=signup">
                  <button className="w-full text-center py-2 bg-emerald-600 text-white font-semibold rounded-lg">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}