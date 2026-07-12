// app/tabs/TransactionTab.tsx
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';

interface Props {
  orders: Order[];
}

const getLocalDateString = (dateObj: Date) => {
  const offset = dateObj.getTimezoneOffset() * 60000;
  return (new Date(dateObj.getTime() - offset)).toISOString().split('T')[0];
};

export default function TransactionTab({ orders }: Props) {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [visibleTransactions, setVisibleTransactions] = useState(8);
  const [brandName, setBrandName] = useState("EspressoPro");

  useEffect(() => {
    const fetchBrand = async () => {
      if (orders.length > 0 && orders[0].uid) {
        try {
          const q = query(collection(db, 'coffee_brands'), where("uid", "==", orders[0].uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setBrandName(querySnapshot.docs[0].data().Name || "EspressoPro");
          }
        } catch (error) {
          console.error("Error fetching brand:", error);
        }
      }
    };
    fetchBrand();
  }, [orders]);

  const filteredOrders = orders.filter(order => {
    const date = order.timestamp?.toDate ? order.timestamp.toDate() : new Date(order.timestamp);
    return getLocalDateString(date) === selectedDate;
  });
  
  const selectedMonth = selectedDate.substring(0, 7); 
  const monthlyOrders = orders.filter(order => {
    const date = order.timestamp?.toDate ? order.timestamp.toDate() : new Date(order.timestamp);
    return getLocalDateString(date).startsWith(selectedMonth);
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

  const downloadCSV = (data: Order[], filename: string) => {
    const headers = ["Date,Time,Items,Total Amount (KHR)"];
    const rows = data.map(order => {
      const date = order.timestamp?.toDate ? order.timestamp.toDate() : new Date(order.timestamp);
      const dateString = date.toLocaleDateString();
      const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const items = order.items?.map(i => `${i.quantity}x ${i.name}`).join(' | ') || '';
      return `${dateString},${timeString},"${items}",${order.total}`;
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Update here: Removed async/await to make the function synchronous for iOS Safari
  const handlePrintReceipt = (order: Order) => {
    const date = order.timestamp?.toDate ? order.timestamp.toDate() : new Date(order.timestamp);
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const orderId = order.id.slice(0, 6).toUpperCase();

    const itemsHtml = order.items?.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
        <span>${item.quantity}x ${item.name}</span>
        <span>${(item.price * item.quantity).toLocaleString()} ៛</span>
      </div>
    `).join('') || '';

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt #${orderId}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Courier New', Courier, monospace; 
              width: 100%; 
              max-width: 300px;
              margin: 0 auto; 
              padding: 20px 10px; 
              color: #000; 
            }
            .text-center { text-align: center; }
            .border-bottom { border-bottom: 1px dashed #000; margin: 15px 0; padding-bottom: 15px; }
            .flex-between { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
            .bold { font-weight: bold; }
            h2 { margin: 0 0 5px 0; font-size: 22px; }
            p { margin: 0; font-size: 12px; }
            .footer-dev { margin-top: 15px; font-size: 10px; color: #555; }
          </style>
        </head>
        <body>
          <div class="text-center border-bottom">
            <h2>${brandName}</h2>
            <p>Phnom Penh, Cambodia</p>
          </div>
          
          <div class="border-bottom">
            <div class="flex-between"><span>Date:</span> <span>${dateString}</span></div>
            <div class="flex-between"><span>Time:</span> <span>${timeString}</span></div>
            <div class="flex-between"><span>Order No:</span> <span>#${orderId}</span></div>
          </div>
          
          <div class="border-bottom">
            <p style="margin-bottom: 10px; font-weight: bold;">ITEMS:</p>
            ${itemsHtml}
          </div>
          
          <div class="flex-between bold" style="font-size: 18px;">
            <span>TOTAL:</span>
            <span>${order.total.toLocaleString()} ៛</span>
          </div>
          
          <div class="text-center" style="margin-top: 30px;">
            <p>Thank you for your visit!</p>
            <p>Please come again.</p>
            <p class="footer-dev">Develop by EspressoPro</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    // Update here: Used window.open as it is the most reliable method for iOS Safari printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
    }
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

        <div className="flex gap-2 pt-4 border-t border-[#d7ccc8]">
          <button 
            onClick={() => downloadCSV(filteredOrders, `Daily_Report_${selectedDate}`)}
            className="flex-1 bg-[#ece0dc] hover:bg-[#e6d8d3] text-[#4e342e] py-2 rounded text-xs font-mono font-medium transition-colors"
          >
            ↓ Daily CSV
          </button>
          <button 
            onClick={() => downloadCSV(monthlyOrders, `Monthly_Report_${selectedMonth}`)}
            className="flex-1 bg-[#4e342e] hover:bg-[#361f1a] text-white py-2 rounded text-xs font-mono font-medium transition-colors"
          >
            ↓ Monthly CSV
          </button>
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
                
                <div className="flex items-center justify-end gap-3">
                  <div className="font-mono font-medium text-[#263238] text-right">
                    {order.total.toLocaleString()} ៛
                  </div>
                  <button 
                    onClick={() => handlePrintReceipt(order)}
                    className="bg-[#f4faff] hover:bg-[#e3f0f8] text-[#4e342e] p-2 rounded-md border border-[#cfdce4] transition-colors"
                    title="Print Receipt"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  </button>
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