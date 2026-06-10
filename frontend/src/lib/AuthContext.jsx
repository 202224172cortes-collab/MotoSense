import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {

    try {

      const savedUser =
        localStorage.getItem("user");

      if (savedUser) {

        const parsedUser =
          JSON.parse(savedUser);

        setUser(parsedUser);
        setIsAuthenticated(true);
      }

    } catch (error) {

      console.error(
        "Error cargando usuario:",
        error
      );

      localStorage.removeItem("user");
    }

    setIsLoadingAuth(false);

  }, []);

  const login = (userData) => {

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
    setIsAuthenticated(true);

    console.log("LOGIN FUNCIONANDO");
  };

  const logout = () => {

    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);