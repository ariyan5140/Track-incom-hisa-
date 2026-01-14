
import React, { useState } from 'react';
import { Search, Trash2, Calendar, MapPin, ChevronRight, Fuel, Banknote, ImageIcon } from 'lucide-react';
import { Trip } from '../types';

interface TripListProps {
  trips: Trip[];
  onDelete: (id: string) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter(trip => 
    trip.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="গাড়ি নং বা বিবরণ দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="text-slate-400 text-sm font-medium whitespace-nowrap">
          মোট: <span className="text-indigo-600 font-bold">{filteredTrips.length} টি</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTrips.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400">কোন ট্রিপ পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Photo Display */}
              <div className="w-full md:w-32 h-32 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                {trip.photo ? (
                  <img src={trip.photo} alt="Trip" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    ID: {trip.id.slice(-4)}
                  </span>
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(trip.date).toLocaleDateString('bn-BD')}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1">{trip.truckNumber}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
                  <MapPin size={16} className="text-red-400" />
                  {trip.description || 'বিবরণ নেই'}
                </p>

                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs">
                    <span className="text-slate-400">ভাড়া: </span>
                    <span className="font-bold text-slate-700">৳{trip.income.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs">
                    <span className="text-slate-400">তেল: </span>
                    <span className="font-bold text-slate-700">৳{trip.fuelCost.toLocaleString('bn-BD')}</span>
                  </div>
                </div>
              </div>

              <div className="md:w-40 flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                <div className="text-left md:text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">নিট লাভ</p>
                  <p className="text-xl font-black text-green-600">৳{trip.netProfit.toLocaleString('bn-BD')}</p>
                </div>
                
                <button 
                  onClick={() => onDelete(trip.id)}
                  className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  aria-label="Delete Trip"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TripList;
