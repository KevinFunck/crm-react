import { useState, useEffect } from "react";
import axios from "axios";

/* ---------------------------
   API base URL from environment variable
   Falls back to localhost for local development
--------------------------- */
const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function Dashboard() {

  /* ---------------------------
     Live clock state — updates every second
  --------------------------- */
  const [currentTime, setCurrentTime] = useState(new Date());

  /* ---------------------------
     Real customer count fetched from the backend
     Starts as null while loading
  --------------------------- */
  const [customerCount, setCustomerCount] = useState<number | null>(null);

  /* ---------------------------
     Start the clock interval and clean it up on unmount
  --------------------------- */
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------------------
     Fetch total number of customers from the backend on mount
  --------------------------- */
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(`${API}/customers`);
        setCustomerCount(res.data.length);
      } catch {
        /* Backend unavailable — leave count as null */
      }
    };
    fetchCount();
  }, []);

  /* ---------------------------
     Format date and time for display
  --------------------------- */
  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div className="space-y-6">

      {/* Header with live date and time */}
      <div className="flex justify-between items-center bg-gray-800 text-white rounded-lg px-6 py-4 shadow">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="text-lg font-medium">
          {formattedDate} – {formattedTime}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total customers — loaded from the backend */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Total Customers</h3>
          <p className="text-3xl font-bold mt-2">
            {customerCount !== null ? customerCount : "—"}
          </p>
        </div>

        {/* Open deals — placeholder until deals feature is implemented */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Open Deals</h3>
          <p className="text-3xl font-bold mt-2 text-gray-300">—</p>
        </div>

        {/* Revenue — placeholder until revenue tracking is implemented */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Revenue</h3>
          <p className="text-3xl font-bold mt-2 text-gray-300">—</p>
        </div>

      </div>

      {/* Chart placeholder — to be replaced with a real chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 font-medium mb-4">Monthly Growth</h3>
        <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          Chart coming soon
        </div>
      </div>

    </div>
  );
}
