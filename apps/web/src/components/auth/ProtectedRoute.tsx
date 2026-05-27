import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from 'antd';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth0();

  // Show a loading spinner while Auth0 checks the session
  if (isLoading) {
    return <Spin/>
  }

  // If authenticated, render the child routes; otherwise, redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}