
import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Clock, ChevronRight, Truck, ImageIcon } from 'lucide-react';
import { BusinessStats, Trip, ViewType } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  stats: BusinessStats;
  trips: Trip[];
  setView: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, trips, setView }) => {
  const chartData = [...trips].reverse().map(t => ({
    name: new Date(t.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' }),
    income: t.income,
    profit: t.netProfit
  }));

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <Wallet size={24} />
            </div>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-tighter">Income</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">মোট আয়</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">৳{stats.totalIncome.toLocaleString('bn-BD')}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-xl text-red-600">
              <TrendingDown size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">মোট ব্যয়</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">৳{stats.totalExpense.toLocaleString('bn-BD')}</h3>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-indigo-900">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-600 rounded-xl text-white">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">মোট নিট লাভ</p>
          <h3 className="text-3xl font-black text-white mt-1">৳{stats.totalProfit.toLocaleString('bn-BD')}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="text-indigo-600" size={20} />
          আয় ও লাভের হিস্ট্রি
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
              />
              <Area type="monotone" dataKey="income" stroke="#6366f1" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={0} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <h4 className="font-bold text-slate-800">সাম্প্রতিক ট্রিপ</h4>
          <button 
            onClick={() => setView('TRIP_LIST')}
            className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all"
          >
            সব দেখুন <ChevronRight size={16} />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {trips.length === 0 ? (
            <div className="p-10 text-center text-slate-400">কোন ট্রিপ নেই</div>
          ) : (
            trips.map((trip) => (
              <div key={trip.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                    {trip.photo ? (
                      <img src={trip.photo} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <Truck size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 leading-none">{trip.truckNumber}</p>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase">{new Date(trip.date).toLocaleDateString('bn-BD')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-indigo-600">৳{trip.income.toLocaleString('bn-BD')}</p>
                  <p className="text-[10px] text-green-600 font-black uppercase tracking-tighter">Profit: ৳{trip.netProfit.toLocaleString('bn-BD')}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
