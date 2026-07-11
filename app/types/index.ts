export interface MenuItem {
  id: string;
  name: string;
  price: number;
  type: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  total: number;
  timestamp: any; 
  items?: OrderItem[];
  uid: string;
}

export interface OrderQuantities {
  [key: string]: number;
}