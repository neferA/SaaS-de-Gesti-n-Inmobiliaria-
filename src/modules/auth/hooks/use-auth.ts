export const useAuth = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  
  const roleName = user?.role?.name || user?.role || ""; 
  const isAdmin = roleName.toLowerCase().includes("admin");

  return { user, isAdmin };
};