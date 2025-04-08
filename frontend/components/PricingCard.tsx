// components/PricingCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  featured: boolean;
  delay: number;
}

export default function PricingCard({ 
  title, 
  price, 
  period = '', 
  features, 
  cta, 
  featured, 
  delay 
}: PricingCardProps) {
  return (
    <motion.div 
      className={`rounded-xl shadow-lg overflow-hidden ${
        featured ? 'border-2 border-emerald-500 relative scale-105' : 'border border-gray-200'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      {featured && (
        <div className="bg-emerald-500 text-white text-center py-1 text-sm font-semibold">
          Most Popular
        </div>
      )}
      
      <div className="p-6 bg-white">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          {period && <span className="text-gray-500 ml-1">{period}</span>}
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
          featured 
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}>
          {cta}
        </button>
      </div>
    </motion.div>
  );
}