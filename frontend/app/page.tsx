// app/page.tsx
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Droplets, 
  Calendar, 
  BarChart2, 
  Sprout, 
  SunDim,
  ChevronDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import TestimonialCard from '@/components/TestimonialCard';
import PricingCard from '@/components/PricingCard';
import "../sass/fonts.scss"

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Features data
  const features = [
    {
      icon: <Droplets className="w-12 h-12 text-emerald-500" />,
      title: "Smart Irrigation",
      description: "Optimize water usage with intelligent irrigation scheduling based on soil moisture data.",
      delay: 0.1
    },
    {
      icon: <Sprout className="w-12 h-12 text-emerald-600" />,
      title: "Crop Monitoring",
      description: "Track crop health, identify diseases, and receive timely alerts to maximize yields.",
      delay: 0.2
    },
    {
      icon: <Calendar className="w-12 h-12 text-teal-500" />,
      title: "Harvest Planning",
      description: "Plan your farming activities with our interactive calendar and automated reminders.",
      delay: 0.3
    },
    {
      icon: <BarChart2 className="w-12 h-12 text-teal-600" />,
      title: "Performance Analytics",
      description: "Gain insights into your farm's performance with detailed reports and visualizations.",
      delay: 0.4
    },
    {
      icon: <SunDim className="w-12 h-12 text-indigo-500" />,
      title: "Weather Integration",
      description: "Access real-time weather data and forecasts to prepare for changing conditions.",
      delay: 0.5
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Emily Johnson",
      role: "Family Farm Owner",
      content: "FarmSense has transformed how we manage our 50-acre farm. The irrigation recommendations alone saved us 30% on water usage last season.",
      imagePath: "/farmer1.jpg"
    },
    {
      name: "Michael Thompson",
      role: "Commercial Grower",
      content: "The crop monitoring system helped us identify disease outbreaks early, preventing what could have been a 40% loss in our tomato crops.",
      imagePath: "/farmer2.jpg"
    },
    {
      name: "Sarah Rodriguez",
      role: "Organic Farmer",
      content: "As an organic farmer, I need to be extremely careful about crop health. FarmSense gives me the insights I need without requiring expensive sensors.",
      imagePath: "/farmer3.jpg"
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      title: "Starter",
      price: "Free",
      features: ["Basic crop monitoring", "Simple irrigation planning", "Weather forecasts", "Single farm support"],
      cta: "Get Started",
      featured: false
    },
    {
      title: "Growth",
      price: "$29",
      period: "/month",
      features: ["Advanced crop monitoring", "Smart irrigation system", "Detailed analytics", "Multiple farm support", "Priority support"],
      cta: "Try 14 Days Free",
      featured: true
    },
    {
      title: "Enterprise",
      price: "Custom",
      features: ["Full platform access", "Unlimited farms", "Advanced reporting", "API access", "Dedicated support", "Custom integrations"],
      cta: "Contact Sales",
      featured: false
    }
  ];

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="overflow-x-hidden font-poppins">
      {/* Navbar Component */}
      <Navbar />
      
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center overflow-hidden" ref={heroRef}>
        <motion.div 
          className="absolute inset-0 w-full h-full bg-cover bg-center -z-10"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
            y: parallaxY 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-emerald-900/70 -z-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Smart Farming Solutions <br/> 
              <span className="text-emerald-400">Without the Hardware</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-200 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              FarmSense helps you maximize yields, optimize irrigation, and monitor crop health without investing in expensive IoT devices.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/auth">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 flex items-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <button 
                onClick={() => scrollToSection('features')}
                className="bg-transparent hover:bg-white/10 text-white border border-white font-semibold py-3 px-8 rounded-lg transition duration-300"
              >
                Explore Features
              </button>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, delay: 1, repeat: Infinity }}
        >
          <ChevronDown 
            className="w-10 h-10 text-white cursor-pointer"
            onClick={() => scrollToSection('features')}
          />
        </motion.div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-gradient-to-r from-teal-900 to-emerald-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-5xl font-bold text-white mb-2">30%</h3>
              <p className="text-emerald-300 text-lg">Average Water Savings</p>
            </motion.div>
            
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-5xl font-bold text-white mb-2">10K+</h3>
              <p className="text-emerald-300 text-lg">Farmers Using FarmSense</p>
            </motion.div>
            
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-5xl font-bold text-white mb-2">25%</h3>
              <p className="text-emerald-300 text-lg">Average Yield Increase</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Smart Farming Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything you need to manage your farm effectively, without expensive hardware or complicated setup.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How FarmSense Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our intelligent system combines your inputs with advanced algorithms to provide actionable insights.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-emerald-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Input Your Data</h3>
              <p className="text-gray-600">
                Enter basic information about your crops, fields, and observations through our simple interface.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-teal-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Analysis</h3>
              <p className="text-gray-600">
                Our algorithms analyze your data alongside weather patterns and agricultural best practices.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Get Recommendations</h3>
              <p className="text-gray-600">
                Receive personalized recommendations for irrigation, pest control, and harvest planning.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with Parallax */}
      <section className="relative py-24">
        <motion.div 
          className="absolute inset-0 w-full h-full bg-cover bg-center -z-10"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
            y: parallaxY 
          }}
        />
        <div className="absolute inset-0 bg-indigo-900/80 -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to Transform Your Farming Operations?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-200 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join thousands of farmers who are increasing yields and reducing costs with FarmSense.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="/auth">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold py-4 px-10 rounded-lg transition duration-300">
                  Start Free Trial
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Trusted by Farmers Worldwide</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from the farmers who have transformed their operations with FarmSense.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                imagePath={testimonial.imagePath}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your farming operation.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard 
                key={index}
                title={plan.title}
                price={plan.price}
                period={plan.period}
                features={plan.features}
                cta={plan.cta}
                featured={plan.featured}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about FarmSense.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-800">Do I need special hardware to use FarmSense?</h3>
                    <span className="text-emerald-500">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    <p>No, FarmSense is designed to work without special hardware. You can input data manually or use your smartphone for photos and observations. Our intelligent algorithms provide recommendations based on your inputs combined with weather data and agricultural best practices.</p>
                  </div>
                </details>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-800">How accurate are the recommendations?</h3>
                    <span className="text-emerald-500">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    <p>FarmSense recommendations are based on agricultural science, weather data, and best practices. Our users report an average of 25% yield increase and 30% water savings. The system becomes more accurate as you input more data about your specific farm conditions.</p>
                  </div>
                </details>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-800">Can I use FarmSense for any type of crop?</h3>
                    <span className="text-emerald-500">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    <p>Yes, FarmSense supports a wide variety of crops including grains, vegetables, fruits, and specialty crops. Our database includes information on over 100 different crop types, with specific care instructions and disease identification guides for each.</p>
                  </div>
                </details>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-800">Is my data secure?</h3>
                    <span className="text-emerald-500">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    <p>Absolutely. We take data security seriously. All your farm data is encrypted both in transit and at rest. We never share your information with third parties without your explicit consent. You maintain full ownership of your data at all times.</p>
                  </div>
                </details>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-emerald-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Start Optimizing Your Farm Today
            </motion.h2>
            
            <motion.p 
              className="text-xl text-white/90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join thousands of farmers who are using FarmSense to increase yields, reduce costs, and farm more sustainably.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/auth">
                <button className="bg-white hover:bg-gray-100 text-indigo-600 text-lg font-semibold py-3 px-8 rounded-lg transition duration-300 w-full sm:w-auto">
                  Sign Up Free
                </button>
              </Link>
              <button 
                onClick={() => scrollToSection('features')}
                className="bg-transparent hover:bg-white/10 text-white border border-white text-lg font-semibold py-3 px-8 rounded-lg transition duration-300 w-full sm:w-auto"
              >
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer Component */}
      <Footer />
    </main>
  );
}