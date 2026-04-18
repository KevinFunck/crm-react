import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Customer from "./pages/Customer/Customer";
import CustomerDetail from "./pages/Customer/CustomerDetail";
import Settings from "./pages/Settings";
import { CustomerType } from "./types/Customer";

function App() {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splashShown")
  );

  function handleSplashDone() {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
  }

  return (
    <LanguageProvider>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}

      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="customers" element={<Customer customers={customers} setCustomers={setCustomers} />} />
              <Route path="customers/:id" element={<CustomerDetail customers={customers} setCustomers={setCustomers} />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
