import React, { createContext, useEffect, useState } from "react";
import { authApi } from "../api/auth";
const myContext = createContext();
function ContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const myData = "Hello from Context!";
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authApi.checkAuth();

        console.log("Auth Check Data:", data);
        setUserData(data?.data);
      } catch (error) {
        if (error.response) {
          console.error("Data:", error.response.data);
        } else {
          console.error("Axios error:", error.message);
        }
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  if (loading) {
    return null;
  }
  return (
    <myContext.Provider value={{ userData, setUserData }}>
      {children}
    </myContext.Provider>
  );
}
export { myContext };

export default ContextProvider;
