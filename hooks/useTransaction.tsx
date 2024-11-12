import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateSampleData } from '../utils/sampleData';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  note?: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getBalance: () => number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load dữ liệu khi khởi động
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        // Nếu chưa có dữ liệu, tạo dữ liệu mẫu
        const sampleData = generateSampleData();
        await AsyncStorage.setItem('transactions', JSON.stringify(sampleData));
        setTransactions(sampleData);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu từ AsyncStorage:', error);
    }
  };

  const addTransaction = async (data: Omit<Transaction, 'id'>) => {
    try {
      const newId = Date.now().toString();
      const newTransactionWithId = {
        ...data,
        id: newId,
        note: data.note?.trim() || '',
        date: new Date(data.date)
      };
      const updatedTransactions = [...transactions, newTransactionWithId];
      setTransactions(updatedTransactions);
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error('Lỗi khi thêm giao dịch:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
      setTransactions(updatedTransactions);
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error('Lỗi khi xóa giao dịch:', error);
    }
  };

  const getBalance = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount
    }, 0);
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction,
      deleteTransaction,
      getBalance 
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}