import React, { createContext, useState, useContext, useEffect } from "react";

interface UserContextType {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
  logout: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSetUserId = (newUserId: string | null) => {
    setUserId(newUserId);
    if (newUserId) {
      localStorage.setItem("userId", newUserId);
    } else {
      localStorage.removeItem("userId");
    }
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
  };

  return (
    <UserContext.Provider
      value={{ userId, setUserId: handleSetUserId, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
