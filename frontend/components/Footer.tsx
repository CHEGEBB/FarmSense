// components/Footer.tsx
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Farm<span className="text-emerald-400">Sense</span></h3>
            <p className="text-gray-300 mb-6">
              Transforming agriculture with smart technology solutions that help farmers maximize yields and minimize costs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-gray-300 hover:text-emerald-400 transition duration-300">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-emerald-400 mr-3 mt-1" />
                <p className="text-gray-300">
                  Nairobi, Agritech<br />
                  Nairobi,Kenya
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-emerald-400 mr-3" />
                <p className="text-gray-300">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-emerald-400 mr-3" />
                <p className="text-gray-300">info@farmsense.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FarmSense. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}