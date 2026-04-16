import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Customer from "./pages/Customer/Customer";
import CustomerDetail from "./pages/Customer/CustomerDetail";
import Settings from "./pages/Settings";
import { CustomerType } from "./types/Customer";

function App() {

  /* ---------------------------
     Central customer state
     Starts empty — Customer.tsx fetches data from the backend on mount
  --------------------------- */
  const [customers, setCustomers] = useState<CustomerType[]>([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>

          {/* Dashboard — overview and stats */}
          <Route index element={<Dashboard />} />

          {/* Calendar — event management */}
          <Route path="calendar" element={<Calendar />} />

          {/* Customer list — pass state and setter as props */}
          <Route
            path="customers"
            element={<Customer customers={customers} setCustomers={setCustomers} />}
          />

          {/* Customer detail — pass state and setter as props */}
          <Route
            path="customers/:id"
            element={<CustomerDetail customers={customers} setCustomers={setCustomers} />}
          />

          {/* Settings page */}
          <Route path="settings" element={<Settings />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
