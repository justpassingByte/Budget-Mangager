import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from './useSetting';
import { convertCurrency } from '../utils/currency';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  note?: string;
  currency: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'currency'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getBalance: () => { amount: number; currency: string };
  getCurrentCurrency: () => string;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions);
        const formattedTransactions = parsedTransactions.map((t: any) => ({
          ...t,
          date: new Date(t.date),
          currency: t.currency || settings.currency
        }));
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Lỗi khi tải giao dịch:', error);
    }
  };

  const addTransaction = async (data: Omit<Transaction, 'id' | 'currency'>) => {
    try {
      const newId = Date.now().toString();
      const newTransactionWithId = {
        ...data,
        id: newId,
        note: data.note?.trim() || '',
        date: new Date(data.date),
        currency: settings.currency,
        amount: data.amount
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
      console.error('Error deleting transaction:', error);
    }
  };

  const getBalance = () => {
    const totalBalance = transactions.reduce((total, transaction) => {
      const amount = transaction.currency === settings.currency 
        ? transaction.amount 
        : convertCurrency(transaction.amount, transaction.currency || 'VND', settings.currency);
      
      return transaction.type === 'income' ? total + amount : total - amount;
    }, 0);

    return {
      amount: totalBalance,
      currency: settings.currency
    };
  };

  useEffect(() => {
    const updateTransactionsCurrency = async () => {
      if (transactions.length === 0) return;

      const updatedTransactions = transactions.map(transaction => {
        if (transaction.currency === settings.currency) {
          return transaction;
        }
        return {
          ...transaction,
          amount: convertCurrency(
            transaction.amount, 
            transaction.currency || 'VND', 
            settings.currency
          ),
          currency: settings.currency
        };
      });

      setTransactions(updatedTransactions);
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    };

    updateTransactionsCurrency();
  }, [settings.currency]);

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction,
      deleteTransaction,
      getBalance,
      getCurrentCurrency: () => settings.currency
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

export { TransactionProvider };