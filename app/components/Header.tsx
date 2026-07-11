import { useState } from 'react';
import Image from 'next/image';
import { getAuth, signOut } from 'firebase/auth';
import logo from '../../assets/logo.png';

export default function Header({ userEmail }: { userEmail: string }) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  return (
    <div className="bg-white border-b border-[#d7ccc8] px-4 py-3 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Image src={logo} alt="Logo" className="w-6 h-6 object-contain" priority />
        <span className="font-semibold text-sm">EspressoPro</span>
      </div>
      
      <div className="relative">
        <button onClick={() => setShowProfilePopup(!showProfilePopup)} className="w-8 h-8 rounded-full border border-[#d7ccc8] flex items-center justify-center bg-[#faf9f8]">
          <svg className="w-4 h-4 text-[#4e342e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </button>

        {showProfilePopup && (
          <div className="absolute right-0 top-10 bg-white border border-[#d7ccc8] rounded-lg p-4 shadow-lg z-50 w-64">
            <p className="font-semibold text-[#263238] text-sm break-all">{userEmail}</p>
            <div className="mt-2 text-xs text-[#ba1a1a] font-mono bg-[#ffdad6] inline-block px-2 py-1 rounded">
              Status: Plan Expired
            </div>
            <hr className="my-3 border-[#d7ccc8]" />
            <button onClick={() => signOut(getAuth())} className="w-full text-left text-sm text-[#6b6360] font-medium hover:text-[#263238]">Sign Out</button>
          </div>
        )}
      </div>
    </div>
  );
}