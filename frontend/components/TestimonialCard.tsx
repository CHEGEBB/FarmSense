// components/TestimonialCard.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  imagePath: string;
  delay: number;
}

export default function TestimonialCard({ name, role, content, imagePath, delay }: TestimonialCardProps) {
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-lg relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="mb-6">
        <div className="text-emerald-500 text-6xl absolute -top-5 -left-3 opacity-20">"</div>
        <p className="text-gray-600 relative z-10">{content}</p>
      </div>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
          {/* This would use actual images in production */}
          <div className="w-full h-full bg-emerald-600/20 flex items-center justify-center text-emerald-700 font-bold">
            {name.charAt(0)}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}