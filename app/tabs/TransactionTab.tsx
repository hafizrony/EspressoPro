import { useState } from 'react';
import { Order } from '../types';

interface Props {
  orders: Order[];
}

const getLocalDateString = (dateObj: Date) => {
  const offset = dateObj.getTimezoneOffset() * 60000;
  return (new Date(dateObj.getTime() - offset)).toISOString().split('T')[0];
};

// Update here: Created TransactionTab component
export default function TransactionTab({ orders }: Props) {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [visibleTransactions, setVisibleTransactions] = useState(8);

  const filteredOrders = orders.filter(order => {
    const date = order.timestamp?.toDate ? order.timestamp.toDate() : new Date(order.timestamp);
    return getLocalDateString(date) === selectedDate;
  });
  
  const filteredGrossSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const avgOrder = filteredOrders.length > 0 ? filteredGrossSales / filteredOrders.length : 0;
  
  const getTopItem = () => {
    const counts: Record<string, number> = {};
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#d7ccc8] rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-mono text-sm text-[#6b6360]">Stats for {selectedDate.split('-').reverse().join('/')}</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#504442]">Total Sales</span>
            <span className="font-mono font-medium">{filteredGrossSales.toLocaleString()} ៛</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#504442]">Transactions</span>
            <span className="font-mono font-medium">{filteredOrders.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#504442]">Avg. Order</span>
            <span className="font-mono font-medium">{avgOrder.toLocaleString(undefined, { maximumFractionDigits: 0 })} ៛</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#504442]">Top Item</span>
            <span className="font-mono font-medium">{getTopItem()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#d7ccc8] rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#d7ccc8] flex justify-between items-center bg-[#faf9f8]">
          <h2 className="font-semibold text-[#263238]">History</h2>
          <div className="relative inline-flex items-center bg-[#ece0dc] border border-[#d7ccc8] rounded px-3 py-1.5 shadow-sm overflow-hidden hover:bg-[#e6d8d3] transition-colors">
            <span className="text-[#4e342e] text-xs font-mono font-medium mr-2">
              {selectedDate.split('-').reverse().join('/')}
            </span>
            <svg className="w-4 h-4 text-[#4e342e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => {
                if(e.target.value) {
                  setSelectedDate(e.target.value);
                  setVisibleTransactions(8);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-[60px_1fr_auto] gap-3 px-4 py-2 bg-[#e6f3fb] border-b border-[#d7ccc8] font-mono text-xs text-[#504442]">
          <div>Time</div>
          <div>Item</div>
          <div className="text-right">Amount</div>
        </div>

        <div className="divide-y divide-[#d7ccc8]">
          {filteredOrders.slice(0, visibleTransactions).map((order) => {
            const date = order.timestamp?.toDate ? order.timestamp.toDate() : new Date(order.timestamp);
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            return (
              <div key={order.id} className="grid grid-cols-[60px_1fr_auto] gap-3 px-4 py-4 text-sm items-center">
                <div className="font-mono text-[#504442] text-xs">{timeString}</div>
                <div>
                  {order.items?.map((item, i) => (
                    <div key={i}>
                      <p className="font-medium text-[#263238]">
                        {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="font-mono font-medium text-[#263238] text-right">
                  {order.total.toLocaleString()} ៛
                </div>
              </div>
            );
          })}
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-[#a1887f] text-sm">No transactions on this date.</div>
          )}
        </div>

        {visibleTransactions < filteredOrders.length && (
          <button 
            onClick={() => setVisibleTransactions(filteredOrders.length)} 
            className="w-full py-4 bg-[#faf9f8] border-t border-[#d7ccc8] text-xs font-mono font-medium text-[#4e342e] hover:bg-[#ece0dc] transition-colors"
          >
            Load More Transactions
          </button>
        )}
      </div>
    </div>
  );
}