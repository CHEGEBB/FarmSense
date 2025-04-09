'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  User, 
  CheckCircle, 
  AlertCircle,
  Tractor,
  Droplets,
  Wheat,
  Sprout,
  ChevronRight,
  Loader2
} from 'lucide-react';
import "../../sass/fonts.scss";
import * as authService from '../../services/authService';

// Farm-themed carousel content with images
const carouselContent = [
  {
    title: "Monitor Your Crops",
    description: "Track growth, health, and harvest times with ease",
    icon: <Tractor size={48} className="mb-4 text-emerald-500" />,
    image: "/assets/farm1.jpg"
  },
  {
    title: "Smart Irrigation",
    description: "Optimize water usage with intelligent scheduling",
    icon: <Droplets size={48} className="mb-4 text-blue-500" />,
    image: "/assets/farm5.jpg"
  },
  {
    title: "Yield Insights",
    description: "Get detailed analytics on your farm's performance",
    icon: <Wheat size={48} className="mb-4 text-amber-500" />,
    image: "/assets/farm4.jpg"
  },
  {
    title: "Plan Your Harvests",
    description: "Interactive calendars for perfect timing",
    icon: <Sprout size={48} className="mb-4 text-green-600" />,
    image: "/assets/farm2.jpg"
  }
];

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [activeInput, setActiveInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (await authService.isAuthenticated()) {
        router.push('/dashboard');
      }
    };
    
    checkAuth();
  }, [router]);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselContent.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Password validation
  useEffect(() => {
    if (!password) {
      setIsPasswordValid(false);
      return;
    }
    
    // Less strict password validation
    // Require at least 2 of the following: uppercase, lowercase, number, special char
    // And minimum length of 6
    let score = 0;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    const hasLength = password.length >= 6;
    
    setIsPasswordValid(score >= 2 && hasLength);
  }, [password]);

  interface LoginCredentials {
    email: string;
    password: string;
  }

  interface RegisterData {
    username: string;
    email: string;
    password: string;
  }

  interface AuthResponse {
    token: string;
    user: Record<string, unknown>;
  }

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Clear any previous messages
    setShowSuccess(false);
    setShowError(false);
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login logic
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
        
        const credentials: LoginCredentials = { email, password };
        const response: AuthResponse = await authService.login(credentials);
        
        // Store auth data
        if (response && response.token) {
          authService.setAuthData(response.token, response.user as { id: string; username: string; email: string });
          
          setShowSuccess(true);
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          throw new Error('Invalid login response');
        }
      } else {
        // Signup validation
        if (!email || !username || !password || !confirmPassword) {
          throw new Error('All fields are required');
        }
        
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (!isPasswordValid) {
          throw new Error('Password must be at least 6 characters and include 2 of the following: uppercase, lowercase, number, or special character');
        }
        
        // Register new user
        const userData: RegisterData = { username, email, password };
        console.log('Sending registration data:', userData);
        
        const response: AuthResponse = await authService.register(userData);
        console.log('Registration response:', response);
        
        if (response && response.token) {
          setShowSuccess(true);
          setTimeout(() => {
            // Store auth data and redirect, or switch to login
            interface User {
              id: string;
              username: string;
              email: string;
              [key: string]: unknown; // Add index signature
            }

            const user: User = {
              id: response.user.id as string,
              username: response.user.username as string,
              email: response.user.email as string,
            };
            authService.setAuthData(response.token, user);
            router.push('/dashboard');
          }, 1000);
        } else {
          throw new Error('Registration failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Authentication failed');
      }
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password) return 0;
    
    let score = 0;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (password.length >= 6) score += 1;
    
    return (score / 5) * 100;
  };
  
  // Get password strength color
  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 40) return 'bg-red-500';
    if (strength <= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden text-black">
      {/* Left Panel - Image with content */}
      <div className="h-1/3 md:h-auto md:w-1/2 relative hidden md:block">
        {/* Background Image */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={carouselIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image 
              src={carouselContent[carouselIndex].image}
              alt="Farm landscape"
              layout="fill"
              objectFit="cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${isLogin ? 'from-emerald-600/50 to-emerald-700/70' : 'from-indigo-600/50 to-indigo-700/70'}`}></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white w-full h-full">
          <div className="flex items-center mb-12">
            <Sprout size={32} className="mr-3" />
            <h1 className="text-4xl font-bold">FarmSense</h1>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex flex-col items-center mb-8">
                {carouselContent[carouselIndex].icon}
                <h2 className="text-3xl font-bold mb-3 text-center">{carouselContent[carouselIndex].title}</h2>
                <p className="text-xl text-emerald-100 text-center max-w-md">{carouselContent[carouselIndex].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-center mb-12 space-x-2">
            {carouselContent.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`w-3 h-3 rounded-full ${i === carouselIndex ? 'bg-white' : 'bg-white bg-opacity-30'} transition-all duration-300`}
              />
            ))}
          </div>
          
          <div className="mt-auto">
            <h3 className="text-xl font-semibold mb-4">Why FarmSense?</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <CheckCircle className="mr-3 text-emerald-300 h-6 w-6" /> 
                <span className="text-lg">Smart crop monitoring and analytics</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 text-emerald-300 h-6 w-6" /> 
                <span className="text-lg">Intelligent irrigation management</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 text-emerald-300 h-6 w-6" /> 
                <span className="text-lg">Harvest planning & optimal scheduling</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 text-emerald-300 h-6 w-6" /> 
                <span className="text-lg">Comprehensive reporting dashboard</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 md:w-1/2 flex items-center justify-center bg-white p-4 md:p-0">
        <div className="w-full max-w-md p-4 md:p-8">
          {/* Logo for mobile */}
          <div className="flex items-center justify-center md:hidden mb-6">
            <Sprout size={28} className="mr-2 text-emerald-600" />
            <h1 className="text-2xl font-bold text-emerald-600">FarmSense</h1>
          </div>
          
          {/* Mobile carousel indicators */}
          <div className="md:hidden flex justify-center space-x-2 mb-4">
            {carouselContent.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`w-2 h-2 rounded-full ${i === carouselIndex ? 'bg-emerald-500' : 'bg-gray-300'} transition-all duration-300`}
              />
            ))}
          </div>
          
          {/* Mobile carousel display */}
          <div className="md:hidden mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                {carouselContent[carouselIndex].icon}
                <h3 className="text-lg font-semibold text-center text-gray-800">{carouselContent[carouselIndex].title}</h3>
                <p className="text-sm text-center text-gray-600">{carouselContent[carouselIndex].description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Improved toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-gray-100 rounded-xl shadow-sm">
              <button 
                onClick={() => {
                  setIsLogin(true);
                  setShowError(false);
                  setShowSuccess(false);
                }}
                className={`px-8 py-2 rounded-lg text-sm font-medium transition-all ${
                  isLogin 
                    ? 'bg-emerald-500 text-white shadow-md transform scale-105' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => {
                  setIsLogin(false);
                  setShowError(false);
                  setShowSuccess(false);
                }}
                className={`px-8 py-2 rounded-lg text-sm font-medium transition-all ${
                  !isLogin 
                    ? 'bg-indigo-500 text-white shadow-md transform scale-105' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-form" : "signup-form"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 text-center">
                {isLogin ? "Welcome Back!" : "Create Your Account"}
              </h2>

              <p className="text-gray-600 mb-6 text-center text-sm">
                {isLogin 
                  ? "Access your farm management dashboard"
                  : "Join thousands of farmers using FarmSense"
                }
              </p>

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <label className={`absolute left-10 transition-all duration-200 ${
                      activeInput === 'username' || username 
                        ? 'text-xs text-emerald-600 -top-2 bg-white px-1' 
                        : 'text-gray-500 top-1/2 -translate-y-1/2'
                    }`}>
                      Username
                    </label>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setActiveInput('username')}
                      onBlur={() => setActiveInput('')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg transition ${
                        activeInput === 'username' 
                          ? 'border-emerald-500' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                )}

                <div className="relative">
                  <label className={`absolute left-10 transition-all duration-200 ${
                    activeInput === 'email' || email
                      ? 'text-xs text-emerald-600 -top-2 bg-white px-1' 
                      : 'text-gray-500 top-1/2 -translate-y-1/2'
                  }`}>
                    Email Address
                  </label>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setActiveInput('email')}
                    onBlur={() => setActiveInput('')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg transition ${
                      activeInput === 'email' 
                        ? 'border-emerald-500' 
                        : 'border-gray-300'
                    }`}
                    required
                  />
                </div>

                <div className="relative">
                  <label className={`absolute left-10 transition-all duration-200 ${
                    activeInput === 'password' || password
                      ? 'text-xs text-emerald-600 -top-2 bg-white px-1' 
                      : 'text-gray-500 top-1/2 -translate-y-1/2'
                  }`}>
                    Password
                  </label>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setActiveInput('password')}
                    onBlur={() => setActiveInput('')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg transition ${
                      activeInput === 'password' 
                        ? 'border-emerald-500' 
                        : 'border-gray-300'
                    }`}
                    required
                  />
                </div>

                {!isLogin && (
                  <>
                    <div className="relative">
                      <label className={`absolute left-10 transition-all duration-200 ${
                        activeInput === 'confirmPassword' || confirmPassword
                          ? 'text-xs text-emerald-600 -top-2 bg-white px-1' 
                          : 'text-gray-500 top-1/2 -translate-y-1/2'
                      }`}>
                        Confirm Password
                      </label>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setActiveInput('confirmPassword')}
                        onBlur={() => setActiveInput('')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg transition ${
                          activeInput === 'confirmPassword' 
                            ? 'border-emerald-500' 
                            : 'border-gray-300'
                        }`}
                        required
                      />
                    </div>

                    {/* Password strength indicator - only shows when password field has content */}
                    {password && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Password strength</span>
                          <span className="text-xs font-medium">
                            {getPasswordStrength() <= 40 && "Weak"}
                            {getPasswordStrength() > 40 && getPasswordStrength() <= 70 && "Medium"}
                            {getPasswordStrength() > 70 && "Strong"}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStrengthColor()} transition-all duration-300`}
                            style={{ width: `${getPasswordStrength()}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {!isLogin && password && !isPasswordValid && 
                            "Use at least 6 characters with 2 of: uppercase, lowercase, numbers, or special characters."}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {isLogin && (
                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-emerald-600 hover:text-emerald-800 transition">Forgot password?</a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg text-white font-medium transition transform hover:scale-105 hover:shadow-md flex items-center justify-center ${
                    isLogin ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? "Sign In" : "Create Account"}</span>
                      <ChevronRight size={16} className="ml-1" />
                    </>
                  )}
                </button>
                
                {/* Success/Error Messages */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center"
                    >
                      <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm">{isLogin ? "Login successful!" : "Account created successfully!"}</span>
                    </motion.div>
                  )}
                  
                  {showError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center"
                    >
                      <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm">{errorMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <div className="mt-6 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setShowError(false);
                    setShowSuccess(false);
                  }}
                  className={`text-sm font-medium ${isLogin ? 'text-indigo-600 hover:text-indigo-500' : 'text-emerald-600 hover:text-emerald-500'}`}
                >
                  {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Social signin buttons only for mobile */}
          <div className="md:hidden mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick access</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <svg className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}