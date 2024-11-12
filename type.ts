export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date; // Thống nhất dùng Date thay vì string
  note?: string;
  category: TransactionCategory;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
} 

export type TransactionCategory = 
  | "food" 
  | "transport" 
  | "shopping" 
  | "entertainment" 
  | "health" 
  | "education" 
  | "bills" 
  | "housing" 
  | "gifts" 
  | "investment" 
  | "personal" 
  | "others";
