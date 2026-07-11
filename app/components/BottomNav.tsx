interface Props {
  activeTab: 'dashboard' | 'menu' | 'transaction';
  setActiveTab: (tab: 'dashboard' | 'menu' | 'transaction') => void;
}

// Update here: Created BottomNav component
export default function BottomNav({ activeTab, setActiveTab }: Props) {
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-[#d7ccc8] flex justify-around p-3 pb-6 max-w-md left-1/2 -translate-x-1/2 z-0">
      <button 
        onClick={() => setActiveTab('dashboard')} 
        className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-[#ece0dc] text-[#4e342e]' : 'text-[#a1887f]'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        <span className="text-[10px] font-mono font-medium">Dashboard</span>
      </button>
      <button 
        onClick={() => setActiveTab('menu')} 
        className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg ${activeTab === 'menu' ? 'bg-[#ece0dc] text-[#4e342e]' : 'text-[#a1887f]'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        <span className="text-[10px] font-mono font-medium">Menu</span>
      </button>
      <button 
        onClick={() => setActiveTab('transaction')} 
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${activeTab === 'transaction' ? 'bg-[#ece0dc] text-[#4e342e]' : 'text-[#a1887f]'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <span className="text-[10px] font-mono font-medium">Transaction</span>
      </button>
    </div>
  );
}