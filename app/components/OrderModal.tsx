import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MenuItem, OrderQuantities } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuItem[];
  uid: string;
}

// Update here: Created OrderModal component
export default function OrderModal({ isOpen, onClose, menu, uid }: Props) {
  const [orderQuantities, setOrderQuantities] = useState<OrderQuantities>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const updateOrderQuantity = (id: string, delta: number) => {
    setOrderQuantities(prev => {
      const current = prev[id] || 0;
      const nextValue = Math.max(0, current + delta); 
      return { ...prev, [id]: nextValue };
    });
  };

  const currentOrderTotal = menu.reduce((total, item) => {
    return total + (item.price * (orderQuantities[item.id] || 0));
  }, 0);

  const submitNewOrder = async () => {
    if (currentOrderTotal === 0) return; 
    setIsSubmitting(true);

    const itemsToSave = menu
      .filter(item => (orderQuantities[item.id] || 0) > 0)
      .map(item => ({
        name: item.name,
        price: item.price,
        quantity: orderQuantities[item.id]
      }));

    await addDoc(collection(db, 'coffee_orders'), {
      total: currentOrderTotal,
      items: itemsToSave,
      timestamp: new Date(),
      uid 
    });

    setOrderQuantities({});
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[85vh] shadow-xl overflow-hidden">
        <div className="p-4 border-b border-[#d7ccc8] flex justify-between items-center bg-[#faf9f8]">
          <h2 className="text-lg font-semibold text-[#263238]">Create Order</h2>
          <button onClick={onClose} className="text-[#a1887f] p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-white">
          {menu.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 border border-[#d7ccc8] rounded-lg">
              <div>
                <p className="font-medium text-[#263238]">{item.name}</p>
                <p className="text-sm font-mono text-[#a1887f]">{item.price.toLocaleString()} ៛</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateOrderQuantity(item.id, -1)}
                  disabled={!orderQuantities[item.id]}
                  className="w-8 h-8 rounded-full border border-[#d7ccc8] text-[#4e342e] flex items-center justify-center disabled:opacity-30 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                </button>
                <span className="font-mono font-medium w-4 text-center">
                  {orderQuantities[item.id] || 0}
                </span>
                <button 
                  onClick={() => updateOrderQuantity(item.id, 1)}
                  className="w-8 h-8 rounded-full bg-[#ece0dc] text-[#4e342e] flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#d7ccc8] bg-[#faf9f8]">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-[#6b6360]">Total</span>
            <span className="text-2xl font-semibold text-[#263238]">{currentOrderTotal.toLocaleString()} ៛</span>
          </div>
          <button 
            onClick={submitNewOrder}
            disabled={currentOrderTotal === 0 || isSubmitting}
            className="w-full bg-[#4e342e] text-white py-3.5 rounded-lg font-medium shadow-sm disabled:opacity-50 transition-opacity"
          >
            {isSubmitting ? 'Saving...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}