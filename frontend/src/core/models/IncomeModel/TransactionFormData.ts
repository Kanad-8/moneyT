export type FormMode = 'expense' | 'income';

export interface TransactionFormData {
  id?:          number;
  /** category (expense) or source (income) */
  tag:          string;
  description:  string | null;
  amount:       number;
  date:         String; 
}