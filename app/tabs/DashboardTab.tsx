import { Order } from '../types';

interface Props {
  orders: Order[];
  onOpenModal: () => void;
}

const getLocalDateString = (dateObj: Date) => {
  const offset = dateObj.getTimezoneOffset() * 60000;
  return (new Date(dateObj.getTime() - offset)).toISOString().split('T')[0];
};

export default function DashboardTab({ orders, onOpenModal }: Props) {
  const todayString = getLocalDateString(new Date());
  const todayOrders = orders.filter(o => getLocalDateString(o.timestamp?.toDate ? o.timestamp.toDate() : new Date(o.timestamp)) === todayString);
  const todayGrossSales = todayOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Today's Overview</h1>
        <p className="text-sm text-[#a1887f]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="bg-white border border-[#d7ccc8] rounded-lg p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="font-mono text-xs font-medium tracking-wider text-[#6b6360]">TODAY'S SALES</span>
        </div>
        <div className="text-3xl font-semibold">{todayGrossSales.toLocaleString()} ៛</div>
      </div>
      <div className="bg-white border border-[#d7ccc8] rounded-lg p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="font-mono text-xs font-medium tracking-wider text-[#6b6360]">TODAY'S ORDERS</span>
        </div>
        <div className="text-3xl font-semibold">{todayOrders.length}</div>
      </div>
      <div className="mt-8">
        <button onClick={onOpenModal} className="w-full bg-[#4e342e] text-white py-4 rounded-lg shadow-sm font-medium">
          + New Order
        </button>
      </div>
    </div>
  );
}