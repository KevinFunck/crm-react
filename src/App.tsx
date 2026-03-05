import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Customer from "./pages/Customer";
import CustomerDetail from "./pages/CustomerDetail";
import { CustomerType } from "./types/Customer";

function App() {
  // ---------------------------
  // Central customer state
  // ---------------------------
  const [customers, setCustomers] = useState<CustomerType[]>([
    {
      id: "1",
      companyName: "Acme Corp",
      companyEmail: "info@acme.com",
      companyPhone: "123-456-7890",
      contacts: [],
      notes: [],
    },
    {
      id: "2",
      companyName: "Beta Ltd",
      companyEmail: "contact@beta.com",
      companyPhone: "555-123-4567",
      contacts: [],
      notes: [],
    },
  ]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />

          {/* ---------------------------
               Pass customers state as props
          --------------------------- */}
          <Route
            path="customers"
            element={<Customer customers={customers} setCustomers={setCustomers} />}
          />

          <Route
            path="customers/:id"
            element={<CustomerDetail customers={customers} setCustomers={setCustomers} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;