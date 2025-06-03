import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import useUserStore from "./hooks/useUserStore";
import "./index.css";
import Auth from "./layouts/Auth";
import Countries from "./pages/Countries";
import FundraiseTypes from "./pages/FundraiseTypes";
import Campaigns from "./pages/Campaigns";

function App() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? <AdminLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/users" element={<Users />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/fundraise-types" element={<FundraiseTypes />} />
          <Route path="/settings" element={<h1>Settings Page</h1>} />
        </Route>
      </Routes>
      <Auth />
    </BrowserRouter>
  );
}

export default App;
