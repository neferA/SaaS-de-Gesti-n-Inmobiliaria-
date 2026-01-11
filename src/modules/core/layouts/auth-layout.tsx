import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Outlet /> {/* 👈 Aquí se pintará el Login */}
    </div>
  );
};