
import React, { useState, useRef } from 'react';
import { Save, X, Truck, Calendar, Banknote, Fuel, Utensils, Info, PlusCircle, Camera, Image as ImageIcon } from 'lucide-react';
import { Trip } from '../types';

interface TripFormProps {
  onAdd: (trip: Omit<Trip, 'id' | 'totalExpense' | 'netProfit'>) => void;
  onCancel: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    truckNumber: '',
    income: 0,
    driverAllowance: 0,
    fuelCost: 0,
    otherExpenses: 0,
    description: '',
    photo: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.truckNumber || formData.income <= 0) {
      alert('দয়া করে গাড়ি নং এবং ভাড়া সঠিকভাবে লিখুন');
      return;
    }
    onAdd(formData);
  };

  const totalExp = formData.driverAllowance + formData.fuelCost + formData.otherExpenses;
  const netProfit = formData.income - totalExp;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-slideUp mb-10">
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-700 to-slate-900 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <PlusCircle size={24} />
          নতুন ট্রিপ এন্ট্রি করুন
        </h3>
        <p className="text-indigo-100 text-xs mt-1">ট্রাকের ভাড়া ও খরচের সঠিক তথ্য দিন</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Photo Upload Section */}
        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
             onClick={() => fileInputRef.current?.click()}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoChange} 
            accept="image/*" 
            className="hidden" 
          />
          {formData.photo ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden">
              <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setFormData({...formData, photo: ''}); }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Camera className="text-indigo-600" size={32} />
              </div>
              <p className="font-bold text-slate-700">ট্রিপের ছবি যোগ করুন</p>
              <p className="text-xs text-slate-400">ক্যামেরা বা গ্যালারি থেকে নির্বাচন করুন</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">তারিখ</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">গাড়ির নাম্বার</label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="ঢাকা মেট্রো-ট ১১-২২৩৩"
                  value={formData.truckNumber}
                  onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">মোট ভাড়া (আয়)</label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.income || ''}
                  onChange={(e) => setFormData({ ...formData, income: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-indigo-700 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">তেল খরচ</label>
              <div className="relative">
                <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.fuelCost || ''}
                  onChange={(e) => setFormData({ ...formData, fuelCost: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">ড্রাইভারের খোরাকি</label>
              <div className="relative">
                <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.driverAllowance || ''}
                  onChange={(e) => setFormData({ ...formData, driverAllowance: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">অন্যান্য খরচ</label>
              <div className="relative">
                <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.otherExpenses || ''}
                  onChange={(e) => setFormData({ ...formData, otherExpenses: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">বিবরণ</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="ঢাকা টু চট্টগ্রাম - মাল লোড"
          />
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-wrap gap-4 justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">মোট খরচ</p>
            <p className="text-xl font-bold text-red-400">৳{totalExp.toLocaleString('bn-BD')}</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-700 hidden sm:block"></div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">নিট লাভ</p>
            <p className="text-2xl font-black text-green-400">৳{netProfit.toLocaleString('bn-BD')}</p>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="flex-[2] px-6 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95"
          >
            <Save size={20} />
            সেভ করুন
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;
