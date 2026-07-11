import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MenuItem } from '../types';

interface Props {
  menu: MenuItem[];
  uid: string;
}

export default function MenuTab({ menu, uid }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    
    await addDoc(collection(db, 'coffee_menu'), {
      name,
      price: parseFloat(price),
      type: 'Hot / Iced',
      uid // Store item specifically for this user
    });
    
    setName('');
    setPrice('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Menu Management</h1>
        <p className="text-sm text-[#a1887f]">Update your offerings and prices.</p>
      </div>

      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className="bg-[#4e342e] text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium shadow-sm">
          <span>+</span> Add New Item
        </button>
      ) : (
        <form onSubmit={handleAddMenu} className="bg-white border border-[#d7ccc8] rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold mb-4">New Item</h2>
          <div className="mb-4">
            <label className="block font-mono text-xs mb-1">Item Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-[#d7ccc8] rounded outline-none focus:border-[#a1887f]"/>
          </div>
          <div className="mb-6">
            <label className="block font-mono text-xs mb-1">Price (៛)</label>
            <input type="number" step="100" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border border-[#d7ccc8] rounded outline-none font-mono"/>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-[#ece0dc] text-[#4e342e] py-2 rounded text-sm font-medium">Save Item</button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded text-sm text-[#6b6360]">Cancel</button>
          </div>
        </form>
      )}

      <div>
        <h3 className="font-mono text-xs text-[#6b6360] mb-2 uppercase">Menu Items</h3>
        <div className="bg-white border border-[#d7ccc8] rounded-lg overflow-hidden shadow-sm divide-y divide-[#d7ccc8]">
          {menu.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4">
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-[#a1887f]">{item.type}</p>
              </div>
              <span className="font-mono text-sm">{item.price.toLocaleString()} ៛</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}