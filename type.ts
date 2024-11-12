export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date; // Thống nhất dùng Date thay vì string
  note: string;
  category: 'food' | 'transport' | 'shopping' | 'entertainment' | 'health' | 'education' | 'bills' | 'others';
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
} 