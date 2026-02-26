import { useAuth } from "@/features/auth/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase">
          {user?.role?.replace("_", " ")} View
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total Salons</h3>
          <p className="text-2xl font-bold mt-2">124</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Active Bookings</h3>
          <p className="text-2xl font-bold mt-2">56</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Revenue (MTD)</h3>
          <p className="text-2xl font-bold mt-2">$12,450</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
