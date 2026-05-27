import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { RegisterPage } from "./pages/Login/RegisterPage";
import { LoginPage } from "./pages/Login/LoginPage";
import { BudgetsPage } from "./pages/Budgets/BudgetsPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { SettingsPage } from "./pages/Settings/SettingsPage";
import { TransactionsPage } from "./pages/Transactions/TransactionsPage";
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {

  return (
    <Routes>
      <Route element={<AppShell />}>


      <Route index element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage/>}/>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
}
