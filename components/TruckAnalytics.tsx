
import React, { useMemo } from 'react';
import { Truck, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { Trip } from '../types';

interface TruckAnalyticsProps {
  trips: Trip[];
}

const TruckAnalytics: React.FC<TruckAnalyticsProps> = ({ trips }) => {
  const truckStats = useMemo(() => {
    const stats: Record<string, { income: number, profit: number, count: number }> = {};
    
    trips.forEach(trip => {
      if (!stats[trip.truckNumber]) {
        stats[trip.truckNumber] = { income: 0, profit: 0, count: 0 };
      }
      stats[trip.truckNumber].income += trip.income;
      stats[trip.truckNumber].profit += trip.netProfit;
      stats[trip.truckNumber].count += 1;
    });

    return Object.entries(stats).sort((a, b) => b[1].profit - a[1].profit);
  }, [trips]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="text-indigo-600" size={24} />
        <h2 className="text-xl font-bold text-slate-800">গাড়ি ভিত্তিক পারফরম্যান্স</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {truckStats.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-slate-400">
            বিশ্লেষণের জন্য যথেষ্ট তথ্য নেই
          </div>
        ) : (
          truckStats.map(([number, data]) => (
            <div key={number} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:border-indigo-200 transition-colors">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800">{number}</h3>
                    <p className="text-xs text-slate-500 font-medium">মোট {data.count} টি ট্রিপ</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">মোট আয়</span>
                  <span className="font-bold text-slate-800">৳{data.income.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">গড় লাভ (প্রতি ট্রিপ)</span>
                  <span className="font-bold text-indigo-600">৳{Math.round(data.profit / data.count).toLocaleString('bn-BD')}</span>
                </div>
                <div className="pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-slate-400 font-bold uppercase">মোট নিট লাভ</span>
                    <span className="text-2xl font-black text-green-600">৳{data.profit.toLocaleString('bn-BD')}</span>
                  </div>
                  {/* Simple progress bar showing profit vs income ratio */}
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-green-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (data.profit / data.income) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">মার্জিন: {((data.profit / data.income) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TruckAnalytics;
