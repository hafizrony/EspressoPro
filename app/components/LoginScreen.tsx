'use client'
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../lib/firebase';
import Image from 'next/image';
import logo from '../../assets/logo.png';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const auth = getAuth(db.app);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setLoginError('Invalid email or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4faff] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-sm rounded-xl border border-[#d7ccc8] p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#ece0dc] rounded-xl flex items-center justify-center mb-4">
            {/* Update here: Used actual logo image instead of SVG, sized smaller */}
            <Image src={logo} alt="EspressoPro Logo" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-[#361f1a] mb-2">EspressoPro</h1>
          {/* Update here: Updated subtitle text */}
          <p className="text-[#655d5a] text-center text-sm">Welcome back. Please log in.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {loginError && <p className="text-[#ba1a1a] text-xs text-center font-medium bg-[#ffdad6] p-2 rounded">{loginError}</p>}
          
          <div>
            <label className="block font-mono text-xs font-semibold text-[#111d23] mb-1.5 tracking-wide">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="demo@gmail.com"
              className="w-full p-3 border border-[#d7ccc8] rounded bg-white text-[#263238] text-sm outline-none focus:border-[#a1887f] placeholder-[#d7ccc8]" 
              required 
            />
          </div>
          
          <div>
            <label className="block font-mono text-xs font-semibold text-[#111d23] mb-1.5 tracking-wide">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••"
                className="w-full p-3 border border-[#d7ccc8] rounded bg-white text-[#263238] text-sm outline-none focus:border-[#a1887f] placeholder-[#d7ccc8] tracking-widest" 
                required 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#655d5a]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Remove here: Removed "Keep me logged in" checkbox */}
          
          {/* Update here: Removed arrow icon, added mt-4 to space out from inputs */}
          <button type="submit" disabled={isLoggingIn} className="w-full bg-[#4e342e] text-white py-3.5 rounded font-medium disabled:opacity-70 mt-4">
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Remove here: Removed bottom management system text */}
      </div>
    </div>
  );
}