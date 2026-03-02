export type TransactionMode = 'expense' | 'income';

export interface TransactionListItem {
  transaction_id: number;
  title: string;     
  subtitle: string;    
  amount: number;
  date: Date;
}