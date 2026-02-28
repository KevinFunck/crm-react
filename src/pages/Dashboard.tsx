import { useState, useEffect } from "react";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Format date and time
  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div className="space-y-6">
      {/* Header with date and time */}
      <div className="flex justify-between items-center bg-gray-800 text-white rounded-lg px-6 py-4 shadow">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="text-lg font-medium">
          {formattedDate} – {formattedTime}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Total Customers</h3>
          <p className="text-3xl font-bold mt-2">128</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Open Deals</h3>
          <p className="text-3xl font-bold mt-2">54</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Revenue</h3>
          <p className="text-3xl font-bold mt-2">$12,340</p>
        </div>
      </div>

      {/* Example chart area */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 font-medium mb-4">Monthly Growth</h3>
        <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </div>
    </div>
  );
}