'use client'
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db } from './lib/firebase';
import { MenuItem, Order } from './types';

// Components
import LoginScreen from './components/LoginScreen';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import OrderModal from './components/OrderModal';

// Tabs
import DashboardTab from './tabs/DashboardTab';
import MenuTab from './tabs/MenuTab';
import TransactionTab from './tabs/TransactionTab';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'transaction'>('dashboard');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const auth = getAuth(db.app);
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const timer = setInterval(() => {
      setLoadingProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return p + 5;
      });
    }, 30);

    const qMenu = query(collection(db, 'coffee_menu'), where("uid", "==", user.uid));
    const unsubMenu = onSnapshot(qMenu, (snapshot) => {
      setMenu(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
    });

    // Remove here: Removed orderBy to fix Firebase Index error
    const qOrders = query(collection(db, 'coffee_orders'), where("uid", "==", user.uid));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      
      // Update here: Sort orders on Client Side instead of Firebase Index
      fetchedOrders.sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });
      
      setOrders(fetchedOrders);
    });

    return () => {
      clearInterval(timer);
      unsubMenu();
      unsubOrders();
    };
  }, [user]);

  if (authLoading) return <div className="min-h-screen bg-[#f4faff]"></div>;
  if (!user) return <LoginScreen />;
  if (isLoading) return <LoadingScreen progress={loadingProgress} />;

  return (
    <div className="min-h-screen bg-[#faf9f8] text-[#263238] font-sans pb-24 relative animate-in fade-in duration-500">
      <Header userEmail={user.email || ''} />

      <div className="p-4 max-w-md mx-auto">
        {activeTab === 'dashboard' && <DashboardTab orders={orders} onOpenModal={() => setIsOrderModalOpen(true)} />}
        {activeTab === 'menu' && <MenuTab menu={menu} uid={user.uid} />}
        {activeTab === 'transaction' && <TransactionTab orders={orders} />}
      </div>

      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        menu={menu} 
        uid={user.uid} 
      />

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}