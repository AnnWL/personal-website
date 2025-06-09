import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.payload?.role;
      setUserRole(role);
    } catch (err) {
      console.error("Invalid token:", err);
      setUserRole(null);
    }
  }, [location.pathname]);

  return userRole;
};

export default useUserRole;
