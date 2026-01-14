
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  BarChart3, 
  Truck, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Menu,
  X,
  FileText,
  Download
} from 'lucide-react';
import { Trip, ViewType, BusinessStats } from './types';
import Dashboard from './components/Dashboard';
import TripForm from './components/TripForm';
import TripList from './components/TripList';
import TruckAnalytics from './components/TruckAnalytics';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('DASHBOARD');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedTrips = localStorage.getItem('truck_trips');
    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('truck_trips', JSON.stringify(trips));
  }, [trips]);

  const stats: BusinessStats = useMemo(() => {
    return trips.reduce((acc, trip) => {
      acc.totalIncome += trip.income;
      acc.totalExpense += trip.totalExpense;
      acc.totalProfit += trip.netProfit;
      acc.tripCount += 1;
      return acc;
    }, { totalIncome: 0, totalExpense: 0, totalProfit: 0, tripCount: 0 });
  }, [trips]);

  const addTrip = (newTrip: Omit<Trip, 'id' | 'totalExpense' | 'netProfit'>) => {
    const totalExpense = newTrip.driverAllowance + newTrip.fuelCost + newTrip.otherExpenses;
    const netProfit = newTrip.income - totalExpense;
    
    const tripWithId: Trip = {
      ...newTrip,
      id: Date.now().toString(),
      totalExpense,
      netProfit
    };

    setTrips([tripWithId, ...trips]);
    setView('DASHBOARD');
  };

  const deleteTrip = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই ট্রিপটি ডিলিট করতে চান?')) {
      setTrips(trips.filter(t => t.id !== id));
    }
  };

  const exportData = () => {
    const headers = ['তারিখ,গাড়ি নং,আয়,খোরাকি,তেল খরচ,অন্যান্য,মোট ব্যয়,নিট লাভ'];
    const rows = trips.map(t => 
      `${t.date},${t.truckNumber},${t.income},${t.driverAllowance},${t.fuelCost},${t.otherExpenses},${t.totalExpense},${t.netProfit}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `truck_report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Navigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 md:hidden z-50">
      <button onClick={() => setView('DASHBOARD')} className={`flex flex-col items-center ${view === 'DASHBOARD' ? 'text-indigo-600' : 'text-slate-400'}`}>
        <LayoutDashboard size={24} />
        <span className="text-xs mt-1 font-medium">হোম</span>
      </button>
      <button onClick={() => setView('TRIP_LIST')} className={`flex flex-col items-center ${view === 'TRIP_LIST' ? 'text-indigo-600' : 'text-slate-400'}`}>
        <History size={24} />
        <span className="text-xs mt-1 font-medium">হিস্ট্রি</span>
      </button>
      <button onClick={() => setView('ADD_TRIP')} className={`flex flex-col items-center ${view === 'ADD_TRIP' ? 'text-indigo-600' : 'text-slate-400'}`}>
        <PlusCircle size={24} />
        <span className="text-xs mt-1 font-medium">নতুন ট্রিপ</span>
      </button>
      <button onClick={() => setView('ANALYTICS')} className={`flex flex-col items-center ${view === 'ANALYTICS' ? 'text-indigo-600' : 'text-slate-400'}`}>
        <BarChart3 size={24} />
        <span className="text-xs mt-1 font-medium">রিপোর্ট</span>
      </button>
    </nav>
  );

  const Sidebar = () => (
    <aside className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-50`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Truck className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">হৃদয় ট্রাক সার্ভিস</h1>
        </div>
        <nav className="space-y-2">
          {[
            { id: 'DASHBOARD', icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
            { id: 'TRIP_LIST', icon: History, label: 'ট্রিপের তালিকা' },
            { id: 'ADD_TRIP', icon: PlusCircle, label: 'নতুন ট্রিপ এন্ট্রি' },
            { id: 'ANALYTICS', icon: BarChart3, label: 'বিস্তারিত রিপোর্ট' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id as ViewType); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${view === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
        <button 
          onClick={exportData}
          className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full"
        >
          <Download size={20} />
          <span>এক্সপোর্ট (CSV)</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-600 mr-2">
                <Menu size={24} />
              </button>
              <h2 className="text-lg font-bold text-slate-800">
                {view === 'DASHBOARD' && 'ড্যাশবোর্ড'}
                {view === 'TRIP_LIST' && 'ট্রিপ হিস্ট্রি'}
                {view === 'ADD_TRIP' && 'নতুন ট্রিপ এন্ট্রি'}
                {view === 'ANALYTICS' && 'গাড়ি ভিত্তিক রিপোর্ট'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-tighter">
                Hriday Truck Service
              </span>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {view === 'DASHBOARD' && <Dashboard stats={stats} trips={trips.slice(0, 5)} setView={setView} />}
          {view === 'TRIP_LIST' && <TripList trips={trips} onDelete={deleteTrip} />}
          {view === 'ADD_TRIP' && <TripForm onAdd={addTrip} onCancel={() => setView('DASHBOARD')} />}
          {view === 'ANALYTICS' && <TruckAnalytics trips={trips} />}
        </div>
      </main>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
      <Navigation />
    </div>
  );
};

export default App;
