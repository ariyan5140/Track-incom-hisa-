
export interface Trip {
  id: string;
  date: string;
  truckNumber: string;
  income: number;
  driverAllowance: number;
  fuelCost: number;
  otherExpenses: number;
  description: string;
  totalExpense: number;
  netProfit: number;
  photo?: string; // Base64 image data
}

export interface BusinessStats {
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  tripCount: number;
}

export type ViewType = 'DASHBOARD' | 'TRIP_LIST' | 'ADD_TRIP' | 'ANALYTICS';
