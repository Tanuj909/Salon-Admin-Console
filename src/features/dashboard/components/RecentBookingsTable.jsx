import React from 'react';
import { Eye, Edit2 } from 'lucide-react';

const bookings = [
  { id: 1, customer: "Anjali Sharma", service: "Premium Haircut", staff: "Rahul K.", time: "10:30 AM", status: "Completed" },
  { id: 2, customer: "Vikram Singh", service: "Beard Grooming", staff: "Amit S.", time: "11:15 AM", status: "Pending" },
  { id: 3, customer: "Saira Khan", service: "Bridal Makeup", staff: "Priya V.", time: "12:00 PM", status: "Pending" },
  { id: 4, customer: "Rajesh Iyer", service: "Deep Tissue Spa", staff: "Rahul K.", time: "01:30 PM", status: "Cancelled" },
  { id: 5, customer: "Meera Das", service: "O3+ Facial", staff: "Priya V.", time: "02:45 PM", status: "Pending" },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
    case 'Pending': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const RecentBookingsTable = () => {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 font-jost">Recent Bookings</h3>
        <button className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Service</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Staff</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Time</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-700">{booking.customer}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{booking.service}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  {booking.staff}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {booking.time}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                      <Eye size={16} />
                    </button>
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                      <Edit2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookingsTable;
